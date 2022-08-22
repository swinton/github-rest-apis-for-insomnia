#!/usr/bin/env node
const path = require('path');
const fs = require('fs/promises');
const meta = require('./package');
const { generate, getLatestRoutes } = require('./lib/generate');

(async () => {
  const routes = await getLatestRoutes();

  Object.entries(routes).forEach(async ([route, api]) => {
    const data = generate({ api, meta });
    const destination = path.normalize(path.join(__dirname, 'routes', `${route}.json`));

    // Write output straight to file
    const output = JSON.stringify(data, null, 2);
    await fs.writeFile(destination, output);
  });
})();
