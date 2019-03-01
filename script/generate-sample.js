// eslint-disable-next-line import/no-extraneous-dependencies
const importers = require('insomnia-importers');

(async () => {
  // Convert a Curl command
  const output = await importers.convert('curl -H "Accept: foo" -X POST https://insomnia.rest --data "Cool!"');
  // Pretty print the result
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(output, null, 2));
})();
