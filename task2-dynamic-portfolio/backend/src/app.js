const path = require('node:path');
const crypto = require('node:crypto');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const { JsonStore } = require('./store');
const { authenticate, validate, notFound, errorHandler } = require('./middleware');

const publicFields = ({ users, ...data }) => data;
const collections = ['projects', 'skills', 'achievements'];

function createApp(options = {}) {
  const app = express();
  const dataFile = options.dataFile || process.env.DATA_FILE || path.join(__dirname, '../data/portfolio.json');
  const store = new JsonStore(dataFile);

  app.disable('x-powered-by');
  app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true }));
  app.use(express.json({ limit: '250kb' }));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.get('/api/portfolio', (req, res) => res.json(publicFields(store.read())));
  for (const collection of collections) {
    app.get(`/api/${collection}`, (req, res) => res.json(store.read()[collection]));
  }
  app.get('/api/profile', (req, res) => res.json(store.read().profile));

  app.post('/api/auth/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().notEmpty(),
  ], validate, (req, res) => {
    const user = store.read().users.find((item) => item.email === req.body.email.toLowerCase());
    if (!user || !bcrypt.compareSync(req.body.password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'development-only-secret', { expiresIn: '8h' });
    return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  });

  const validators = {
    projects: [body('title').trim().notEmpty(), body('summary').trim().notEmpty(), body('technologies').isArray(), body('year').isInt({ min: 1990, max: 2100 })],
    skills: [body('name').trim().notEmpty(), body('category').trim().notEmpty(), body('level').isInt({ min: 0, max: 100 })],
    achievements: [body('title').trim().notEmpty(), body('issuer').trim().notEmpty(), body('year').isInt({ min: 1990, max: 2100 })],
  };

  for (const collection of collections) {
    app.post(`/api/${collection}`, authenticate, validators[collection], validate, (req, res) => {
      const item = { ...req.body, id: crypto.randomUUID() };
      store.update((data) => data[collection].push(item));
      res.status(201).json(item);
    });
    app.put(`/api/${collection}/:id`, authenticate, validators[collection], validate, (req, res) => {
      let updated;
      store.update((data) => {
        const index = data[collection].findIndex((item) => item.id === req.params.id);
        if (index < 0) return;
        updated = { ...data[collection][index], ...req.body, id: req.params.id };
        data[collection][index] = updated;
      });
      return updated ? res.json(updated) : res.status(404).json({ error: 'Record not found' });
    });
    app.delete(`/api/${collection}/:id`, authenticate, (req, res) => {
      let removed = false;
      store.update((data) => {
        const next = data[collection].filter((item) => item.id !== req.params.id);
        removed = next.length !== data[collection].length;
        data[collection] = next;
      });
      return removed ? res.status(204).end() : res.status(404).json({ error: 'Record not found' });
    });
  }

  app.put('/api/profile', authenticate, [
    body('name').trim().notEmpty(), body('role').trim().notEmpty(), body('email').isEmail(),
    body('headline').trim().notEmpty(), body('bio').trim().notEmpty(),
  ], validate, (req, res) => {
    const profile = { ...req.body, id: 'profile' };
    store.update((data) => { data.profile = profile; });
    res.json(profile);
  });

  app.put('/api/auth/password', authenticate, [
    body('currentPassword').isString().notEmpty(),
    body('newPassword').isLength({ min: 8 }),
  ], validate, (req, res) => {
    let changed = false;
    store.update((data) => {
      const user = data.users.find((item) => item.id === req.user.sub);
      if (user && bcrypt.compareSync(req.body.currentPassword, user.passwordHash)) {
        user.passwordHash = bcrypt.hashSync(req.body.newPassword, 10);
        changed = true;
      }
    });
    return changed ? res.json({ message: 'Password updated' }) : res.status(400).json({ error: 'Current password is incorrect' });
  });

  if (options.frontendPath) {
    app.use(express.static(options.frontendPath));
    app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.join(options.frontendPath, 'index.html'));
      }
      return next();
    });
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
