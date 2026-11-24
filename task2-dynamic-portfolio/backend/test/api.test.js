const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const request = require('supertest');
const { createApp } = require('../src/app');

function setup() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-api-'));
  const dataFile = path.join(directory, 'data.json');
  return { app: createApp({ dataFile }), dataFile, directory };
}

async function login(app) {
  const response = await request(app).post('/api/auth/login').send({ email: 'admin@portfolio.dev', password: 'ChangeMe123!' });
  assert.equal(response.status, 200);
  return response.body.token;
}

test('health and public portfolio are available', async () => {
  const { app } = setup();
  assert.equal((await request(app).get('/api/health')).status, 200);
  const response = await request(app).get('/api/portfolio');
  assert.equal(response.status, 200);
  assert.equal(response.body.projects.length, 7);
  assert.ok(response.body.projects.every(({ imageUrl }) => imageUrl.startsWith('/assets/projects/')));
  assert.equal(response.body.users, undefined);
  assert.equal(response.body.contentVersion, undefined);
});

test('authentication rejects bad credentials and protects writes', async () => {
  const { app } = setup();
  assert.equal((await request(app).post('/api/auth/login').send({ email: 'admin@portfolio.dev', password: 'wrong' })).status, 401);
  assert.equal((await request(app).post('/api/skills').send({ name: 'Testing', category: 'Build', level: 80 })).status, 401);
});

test('project CRUD persists to the JSON file', async () => {
  const { app, dataFile } = setup();
  const token = await login(app);
  const created = await request(app).post('/api/projects').set('Authorization', `Bearer ${token}`).send({
    title: 'Test project', summary: 'Created during an API test', description: '', technologies: ['Node.js'], year: 2026, featured: false,
  });
  assert.equal(created.status, 201);
  const updated = await request(app).put(`/api/projects/${created.body.id}`).set('Authorization', `Bearer ${token}`).send({ ...created.body, title: 'Updated project' });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.title, 'Updated project');
  assert.ok(JSON.parse(fs.readFileSync(dataFile, 'utf8')).projects.some((item) => item.title === 'Updated project'));
  const restartedApp = createApp({ dataFile });
  const afterRestart = await request(restartedApp).get('/api/projects');
  assert.ok(afterRestart.body.some((item) => item.title === 'Updated project'));
  assert.equal((await request(app).delete(`/api/projects/${created.body.id}`).set('Authorization', `Bearer ${token}`)).status, 204);
});

test('project screenshots and links persist and can be replaced', async () => {
  const { app, dataFile } = setup();
  const auth = { Authorization: `Bearer ${await login(app)}` };
  const screenshots = path.join(__dirname, '../../frontend/public/assets/projects');
  const original = fs.readFileSync(path.join(screenshots, 'skycast.webp'));
  const replacement = fs.readFileSync(path.join(screenshots, 'lablink.webp'));
  const dataUrl = (bytes) => `data:image/webp;base64,${bytes.toString('base64')}`;
  const project = {
    title: 'Test project', summary: 'Test summary', description: 'Test description',
    technologies: ['Node.js', 'React'], year: 2026,
    repositoryUrl: 'https://github.com/example/project', liveUrl: 'https://example.com/',
    imageData: dataUrl(original), imageAlt: 'Project dashboard',
  };

  const invalid = await request(app).post('/api/projects').set(auth).send({ ...project, imageData: dataUrl(Buffer.from('not an image')) });
  assert.equal(invalid.status, 400);
  assert.equal(invalid.body.details[0].value, undefined);
  assert.equal((await request(app).post('/api/projects').send(project)).status, 401);
  const created = await request(app).post('/api/projects').set(auth).send(project);
  assert.equal(created.status, 201);
  assert.equal(created.body.imageData, undefined);
  assert.equal(created.body.imageAlt, project.imageAlt);
  const firstImage = await request(app).get(created.body.imageUrl);
  assert.equal(firstImage.headers['content-type'], 'image/webp');
  assert.deepEqual(firstImage.body, original);

  const endpoint = `/api/projects/${created.body.id}`;
  const updated = { ...created.body, imageData: dataUrl(replacement), liveUrl: '', description: 'Updated description' };
  assert.equal((await request(app).put(endpoint).set(auth).send(updated)).status, 200);
  const restartedApp = createApp({ dataFile });
  const portfolio = await request(restartedApp).get('/api/portfolio');
  const saved = portfolio.body.projects.find(({ id }) => id === created.body.id);
  assert.equal(saved.description, 'Updated description');
  assert.deepEqual(saved.technologies, project.technologies);
  assert.equal(saved.repositoryUrl, project.repositoryUrl);
  assert.equal(saved.liveUrl, '');
  assert.equal(saved.imageData, undefined);
  assert.deepEqual((await request(restartedApp).get(saved.imageUrl)).body, replacement);

  await request(restartedApp).put(endpoint).set(auth).send({ ...saved, summary: 'Changed summary' }).expect(200);
  assert.deepEqual((await request(restartedApp).get(saved.imageUrl)).body, replacement);
  await request(restartedApp).delete(endpoint).set(auth).expect(204);
  await request(restartedApp).get(saved.imageUrl).expect(404);
});

test('existing portfolio data is refreshed once without replacing the admin or personal records', async () => {
  const { dataFile } = setup();
  const original = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  delete original.contentVersion;
  original.profile.headline = 'Old headline';
  original.profile.availability = 'Open to internships';
  original.profile.location = 'Custom location';
  original.projects = [
    { id: 'old-bankism', title: 'Bankism Firewall', summary: 'Old description' },
    { id: 'old-acadence', title: 'Acadence' },
    { id: 'lablink', title: 'My custom project' },
  ];
  original.achievements.push({ id: 'old-outreach', title: 'Jigyasa Scientific Outreach Programme' });
  fs.writeFileSync(dataFile, JSON.stringify(original));

  const app = createApp({ dataFile });
  const response = await request(app).get('/api/portfolio');
  const { profile, projects, achievements } = response.body;
  assert.equal(profile.headline, 'Building. Learning. Exploring technology.');
  assert.equal(profile.location, 'Custom location');
  assert.equal(profile.availability, undefined);
  assert.equal(projects[0].id, 'old-bankism');
  assert.equal(projects[0].imageUrl, '/assets/projects/bankism-firewall.webp');
  assert.ok(projects.some(({ id, title }) => id === 'lablink' && title === 'My custom project'));
  assert.ok(projects.some(({ id, title }) => id !== 'lablink' && title === 'LabLink'));
  assert.ok(!projects.some(({ title }) => title === 'Acadence'));
  assert.ok(!achievements.some(({ id }) => id === 'old-outreach'));
  assert.deepEqual(JSON.parse(fs.readFileSync(dataFile, 'utf8')).users, original.users);

  const auth = { Authorization: `Bearer ${await login(app)}` };
  await request(app).put('/api/profile').set(auth).send({ ...profile, headline: 'A new headline' }).expect(200);
  await request(app).delete('/api/projects/old-bankism').set(auth).expect(204);
  const restarted = await request(createApp({ dataFile })).get('/api/portfolio');
  assert.equal(restarted.body.profile.headline, 'A new headline');
  assert.ok(!restarted.body.projects.some(({ id }) => id === 'old-bankism'));
});

test('production mode serves the built SPA without shadowing API routes', async () => {
  const { dataFile } = setup();
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  const app = createApp({ dataFile, frontendPath });
  const page = await request(app).get('/admin');
  assert.equal(page.status, 200);
  assert.match(page.text, /Shreya S Gour/);
  assert.equal((await request(app).get('/assets/projects/skycast.webp')).headers['content-type'], 'image/webp');
  assert.equal((await request(app).get('/api/health')).body.status, 'ok');
});

test('skill, achievement, profile and password operations work', async () => {
  const { app } = setup();
  const token = await login(app);
  const auth = { Authorization: `Bearer ${token}` };
  const skill = await request(app).post('/api/skills').set(auth).send({ name: 'Testing', category: 'Build', level: 80 });
  assert.equal(skill.status, 201);
  const achievement = await request(app).post('/api/achievements').set(auth).send({ title: 'A result', issuer: 'Test suite', year: 2026, description: 'Verified' });
  assert.equal(achievement.status, 201);
  const current = (await request(app).get('/api/profile')).body;
  assert.equal((await request(app).put('/api/profile').set(auth).send({ ...current, name: 'Updated Name' })).status, 200);
  assert.equal((await request(app).put('/api/auth/password').set(auth).send({ currentPassword: 'ChangeMe123!', newPassword: 'NewPassword123!' })).status, 200);
});

test('validation returns useful errors', async () => {
  const { app } = setup();
  const token = await login(app);
  const response = await request(app).post('/api/skills').set('Authorization', `Bearer ${token}`).send({ name: '', category: '', level: 200 });
  assert.equal(response.status, 400);
  assert.ok(response.body.details.length >= 3);
});
