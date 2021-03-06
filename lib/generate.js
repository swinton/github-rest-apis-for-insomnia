const _ = require('lodash');
const { idGenerator } = require('./id-generator');
const { generateEnvironmentVariables, generateRequestGroups, generateRequests } = require('./generators');

const fldIdGenerator = idGenerator('FLD');
const reqIdGenerator = idGenerator('REQ');

function generate({ api, meta }) {
  // eslint-disable-next-line no-underscore-dangle
  const _api = _(api);

  const rootRequestGroup = {
    parentId: '__WORKSPACE_ID__',
    _id: fldIdGenerator(),
    _type: 'request_group',
    name: _api.get('info.title'),
    environment: {
      github_api_root: _api.get('servers.0.url')
    }
  };

  // Update environment variables
  Object.assign(rootRequestGroup.environment, generateEnvironmentVariables(api));

  // eslint-disable-next-line no-underscore-dangle
  const requestGroups = generateRequestGroups(api, fldIdGenerator, rootRequestGroup._id);
  const requests = generateRequests(api, reqIdGenerator, requestGroups);

  const data = {
    _type: 'export',
    __export_format: 4,
    __export_date: new Date(),
    __export_source: `${meta.name}:${meta.version}`,
    resources: [rootRequestGroup].concat(requestGroups).concat(requests)
  };

  return data;
}

module.exports = generate;
