#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const api = require('@octokit/routes/api.github.com');
const meta = require('./package');
const data = require('./lib/generate')({ api, meta });

// Destination for output
const destination = path.normalize(
  path.join(__dirname, 'routes', 'api.github.com', 'github-rest-apis-for-insomnia.json')
);

// Write output straight to file
const output = JSON.stringify(data, null, 2);
fs.writeFileSync(destination, output);
