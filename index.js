#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const meta = require('./package');
const generate = require('./lib/generate');

const apis = [
  ['api.github.com', path.join(__dirname, 'routes', 'api.github.com', 'github-rest-apis-for-insomnia.json')],
  ['ghe-2.16', path.join(__dirname, 'routes', 'ghe-2.16', 'github-rest-apis-for-insomnia.json')],
  ['ghe-2.17', path.join(__dirname, 'routes', 'ghe-2.17', 'github-rest-apis-for-insomnia.json')],
  ['ghe-2.18', path.join(__dirname, 'routes', 'ghe-2.18', 'github-rest-apis-for-insomnia.json')],
  ['ghe-2.19', path.join(__dirname, 'routes', 'ghe-2.19', 'github-rest-apis-for-insomnia.json')]
];

apis.forEach(([source, dest]) => {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const api = require(`@octokit/routes/${source}`);
  const data = generate({ api, meta });
  const destination = path.normalize(dest);

  // Write output straight to file
  const output = JSON.stringify(data, null, 2);
  fs.writeFileSync(destination, output);
});

process.exit(0);
