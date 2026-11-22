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
  assert.ok(response.body.projects.length >= 3);
  assert.equal(response.body.users, undefined);
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

test('production mode serves the built SPA without shadowing API routes', async () => {
  const { dataFile } = setup();
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  const app = createApp({ dataFile, frontendPath });
  const page = await request(app).get('/admin');
  assert.equal(page.status, 200);
  assert.match(page.text, /Alex Morgan/);
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
