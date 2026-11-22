const path = require('node:path');
require('dotenv').config();
const { createApp } = require('./app');

const portArgument = process.argv.indexOf('--port');
const cliPort = portArgument >= 0 ? Number(process.argv[portArgument + 1]) : 0;
const port = cliPort || Number(process.env.PORT) || 5000;
const app = createApp({
  frontendPath: process.env.NODE_ENV === 'production' ? path.join(__dirname, '../../frontend/dist') : undefined,
});

app.listen(port, () => {
  console.log(`Portfolio API listening on http://localhost:${port}`);
});
