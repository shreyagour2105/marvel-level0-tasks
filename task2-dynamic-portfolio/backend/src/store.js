const fs = require('node:fs');
const path = require('node:path');
const { createSeedData, refreshPortfolioContent } = require('./seed');

class JsonStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.ensure();
  }

  ensure() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    if (!fs.existsSync(this.filePath)) {
      this.write(createSeedData());
      return;
    }
    const data = this.read();
    if (refreshPortfolioContent(data)) this.write(data);
  }

  read() {
    return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
  }

  write(data) {
    const temporaryPath = `${this.filePath}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(data, null, 2)}\n`);
    fs.renameSync(temporaryPath, this.filePath);
    return data;
  }

  update(mutator) {
    const data = this.read();
    const result = mutator(data);
    this.write(data);
    return result;
  }
}

module.exports = { JsonStore };
