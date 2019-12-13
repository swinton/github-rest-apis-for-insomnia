const _ = require('lodash');
const api = require('@octokit/routes/api.github.com');
const meta = require('./package');
const { idGenerator } = require('./id-generator');
const { generateRequestGroups, generateRequests } = require('./generators');

// eslint-disable-next-line no-underscore-dangle
const _api = _(api);

const fldIdGenerator = idGenerator('FLD');
const envIdGenerator = idGenerator('ENV');
const reqIdGenerator = idGenerator('REQ');

const rootRequestGroup = {
  parentId: '__WORKSPACE_ID__',
  _id: fldIdGenerator(),
  _type: 'request_group',
  name: _api.get('info.title')
};

const environment = {
  parentId: '__WORKSPACE_ID__',
  _id: envIdGenerator(),
  _type: 'environment',
  name: 'Base Environment',
  data: {
    github_api_root: _api.get('servers.0.url'),
    github_token: ''
  }
};

function generate() {
  const requestGroups = generateRequestGroups(api, fldIdGenerator);
  const [requests, environmentVariables] = generateRequests(api, reqIdGenerator, requestGroups);

  // Update environment variables
  Object.assign(environment.data, environmentVariables);

  const data = {
    _type: 'export',
    __export_format: 3,
    __export_date: new Date(),
    __export_source: `${meta.name}:${meta.version}`,
    resources: [rootRequestGroup]
      .concat(environment)
      .concat(requestGroups)
      .concat(requests)
  };

  return data;
}

module.exports = generate;

if (require.main === module) {
  const data = JSON.stringify(generate(), null, 4);
  console.log(data);
}
