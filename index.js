#!/usr/bin/env node
const routes = require('@octokit/routes/routes/api.github.com/repos');

const pathNormalizer = function pathNormalizer() {
  const capturedEnvironmentVars = new Set();
  pathNormalizer.capturedEnvironmentVars = capturedEnvironmentVars;
  const re = /:([^/]+)/g;
  return path => {
    // Replace paths like /repos/:owner/:repo with /repos/{{ owner }}/{{ repo }}
    return path.replace(re, (match, captured) => {
      // Capture this environment variable
      capturedEnvironmentVars.add(captured);
      return `{{ ${captured} }}`;
    });
  };
};
const normalizePath = pathNormalizer();

const environment = {
  parentId: '__WORKSPACE_ID__',
  _id: `__ENV_1__`,
  _type: 'environment',
  name: 'Base Environment',
  data: {
    github_api_root: 'https://api.github.com'
  }
};

const rootRequestGroup = {
  parentId: '__WORKSPACE_ID__',
  _id: '__FLD_1__',
  _type: 'request_group',
  name: 'GitHub REST v3 API'
};

const reposRequestGroup = {
  parentId: '__FLD_1__',
  _id: '__FLD_2__',
  _type: 'request_group',
  name: 'Repos'
};

const resources = routes.map((route, index) => {
  return {
    parentId: '__FLD_2__',
    _id: `__REQ_${index}__`,
    _type: 'request',
    name: route.name,
    description: `${route.description}\n\n${route.documentationUrl}`,
    headers: [],
    authentication: {},
    method: route.method,
    url: `{{ github_api_root  }}${normalizePath(route.path)}`,
    body: {},
    parameters: []
  };
});

// Add captured environment variables to environment
// eslint-disable-next-line no-restricted-syntax
for (const env of pathNormalizer.capturedEnvironmentVars) {
  if (env.match(/^([a-zA-Z_]+)$/) !== null) {
    Object.assign(environment.data, { [env]: env });
  }
}

resources.unshift(environment);
resources.unshift(reposRequestGroup);
resources.unshift(rootRequestGroup);

const data = {
  _type: 'export',
  __export_format: 3,
  __export_date: new Date(),
  __export_source: 'insomnia.importers:v0.1.0',
  resources
};

console.log(JSON.stringify(data, null, 2));
