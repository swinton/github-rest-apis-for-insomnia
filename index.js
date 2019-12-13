#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const generate = require('./generate');

const data = generate();

// Destination for output
const destination = path.normalize(
  path.join(__dirname, 'routes', 'api.github.com', 'github-rest-apis-for-insomnia.json')
);

// Write output straight to file
const output = JSON.stringify(data, null, 4);
fs.writeFileSync(destination, output);
