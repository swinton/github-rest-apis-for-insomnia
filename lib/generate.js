const _ = require('lodash');
const { idGenerator } = require('./id-generator');
const { generateEnvironmentVariables, generateRequestGroups, generateRequests } = require('./generators');
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = 'github';
const repo = 'rest-api-description';

const fldIdGenerator = idGenerator('FLD');
const reqIdGenerator = idGenerator('REQ');

const getContentAtPath = async (path) => {
  return await octokit.repos.getContent({
    owner,
    repo,
    path
  });
};

const getFileContent = async (sha) => {
  return await octokit.git.getBlob({
    owner,
    repo,
    file_sha: sha
  });
};

const generate = ({ api, meta }) => {
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
};

const getLatestRoutes = async () => {
  const routes = {};
  const { data: platforms } = await getContentAtPath('descriptions');

  await Promise.all(platforms.map(async platform => {
    const { data: files } = await getContentAtPath(platform.path + '/dereferenced');
    const file = files.find(f => f.name.indexOf('json') >= 0);
    const { data: blob } = await getFileContent(file.sha);
    const content = Buffer.from(blob.content, 'base64').toString('utf-8');
    routes[platform.name] = JSON.parse(content);
  }));

  return routes;
};

module.exports = {
  generate,
  getLatestRoutes
};
