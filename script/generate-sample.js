#!/usr/bin/env node
// eslint-disable-next-line import/no-extraneous-dependencies
const importers = require('insomnia-importers');

(async () => {
  // Convert a Curl command
  const output = await importers.convert(
    `curl --request POST \
    --url https://api.github.com/orgs/wintron/repos \
    --header 'authorization: Bearer TOKEN' \
    --header 'content-type: application/json' \
    --data '{
      "name": "demo",
      "description": "This is a demonstration repo for demonstrations",
      "homepage": "https://github.com/wintron/demo",
      "private": false,
      "has_issues": true,
      "has_projects": false,
      "has_wiki": false
    }'`
  );
  // Pretty print the result
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(output.data, null, 2));
})();
