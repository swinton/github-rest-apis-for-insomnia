#!/usr/bin/env node
const api = require('@octokit/routes/routes/api.github.com');
const meta = require('./package');
const { pathNormalizer } = require('./lib/utils');

const rootRequestGroup = {
  parentId: '__WORKSPACE_ID__',
  _id: '__FLD_1__',
  _type: 'request_group',
  name: 'GitHub REST v3 API'
};

const environment = {
  // eslint-disable-next-line no-underscore-dangle
  parentId: '__WORKSPACE_ID__',
  _id: '__ENV_1__',
  _type: 'environment',
  name: 'Base Environment',
  data: {
    github_api_root: 'https://api.github.com',
    github_token: process.env.GITHUB_TOKEN || ''
  }
};

const requestGroups = [];
const resources = [];

let reqCounter = 0;
const normalizePath = pathNormalizer();
Object.keys(api).forEach((group, index) => {
  // Add a new request group
  const parentId = `__FLD_${index + 2}__`;
  requestGroups.push({
    // eslint-disable-next-line no-underscore-dangle
    parentId: rootRequestGroup._id,
    _id: parentId,
    _type: 'request_group',
    name: group
  });

  // Add all routes within this group
  const routes = api[group];
  routes.forEach(route => {
    const id = `__REQ_${reqCounter}__`;
    resources.push({
      parentId,
      _id: id,
      _type: 'request',
      name: route.name,
      description: `${route.description}\n\n${route.documentationUrl}`,
      headers: [],
      authentication: {
        token: '{{ github_token  }}',
        type: 'bearer'
      },
      method: route.method,
      url: `{{ github_api_root  }}${normalizePath(route.path)}`,
      body: {},
      parameters: []
    });
    reqCounter += 1;
  });
});

// Add captured environment variables to environment
// eslint-disable-next-line no-restricted-syntax
for (const env of pathNormalizer.capturedEnvironmentVars) {
  if (env.match(/^([a-zA-Z_]+)$/) !== null) {
    Object.assign(environment.data, { [env]: env });
  }
}

const data = {
  _type: 'export',
  __export_format: 3,
  __export_date: new Date(),
  __export_source: `${meta.name}:${meta.version}`,
  resources: [rootRequestGroup]
    .concat(environment)
    .concat(requestGroups)
    .concat(resources)
};

console.log(JSON.stringify(data, null, 2));
