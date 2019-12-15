#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const routes = require('@octokit/routes');
const meta = require('./package');
const generate = require('./lib/generate');

Object.entries(routes).forEach(([route, api]) => {
  const data = generate({ api, meta });
  const destination = path.normalize(path.join(__dirname, 'routes', `${route}.json`));

  // Write output straight to file
  const output = JSON.stringify(data, null, 2);
  fs.writeFileSync(destination, output);
});

process.exit(0);
