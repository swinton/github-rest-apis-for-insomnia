const _ = require('lodash');
const { requestGroupNameFromSpec, queryParamsFromSpec, previewHeadersFromSpec } = require('./helpers');

function generateEnvironmentVariables (api) {
  // Use a set so that we de-duplicate
  const environmentVariables = new Set();

  // Set defaults based on type
  const defaultValues = {
    string: '',
    integer: 0
  };

  Object.values(api.paths).forEach(methods => {
    Object.values(methods).forEach(spec => {
      if (!spec.parameters) {
        return [];
      }
      return spec.parameters
        .filter(param => param.in === 'path')
        .forEach(({ name, schema }) => {
          // Add each environment variable as a key-value pair, initialize the value to default
          environmentVariables.add([name, _.get(defaultValues, schema.type, name)]);
        });
    });
  });

  // Return an object composed of the environmentVariables set key-value pairs
  return _.fromPairs([...environmentVariables.values()].sort());
}
module.exports.generateEnvironmentVariables = generateEnvironmentVariables;

function generateRequestGroups (api, idGenerator, parentId) {
  const groups = new Set();

  Object.values(api.paths).forEach(methods => {
    Object.values(methods).forEach(spec => {
      groups.add(requestGroupNameFromSpec(spec));
    });
  });

  return []
    .concat(...groups.values())
    .sort()
    .map(group => {
      return { parentId, _id: idGenerator(), _type: 'request_group', name: group };
    });
}
module.exports.generateRequestGroups = generateRequestGroups;

function generateRequests (api, idGenerator, requestGroups) {
  const requests = [];

  // Generate an index of requestGroups by group
  const requestGroupsByGroup = {};
  requestGroups.forEach(requestGroup => {
    // eslint-disable-next-line no-underscore-dangle
    requestGroupsByGroup[requestGroup.name] = requestGroup._id;
  });

  Object.entries(api.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, spec]) => {
      // Use our requestGroups by group index to identify the parent group
      const parentId = requestGroupsByGroup[requestGroupNameFromSpec(spec)];

      // Replace '{' and '}' in path with '{{' and '}}'
      // E.g.
      //   /repos/{owner}/{repo}/compare/{base}...{head}
      // becomes
      //   /repos/{{ owner }}/{{ repo }}/compare/{{ base }}...{{ head }}
      const url = `{{ github_api_root }}${path.replace(/{/g, '{{ ').replace(/}/g, ' }}')}`;

      // Include preview headers
      const headers = [];
      const previewHeaders = previewHeadersFromSpec(spec);
      if (previewHeaders !== null) {
        headers.push(previewHeaders);
      }

      requests.push({
        parentId,
        _id: idGenerator(),
        _type: 'request',
        name: spec.summary,
        description: spec.externalDocs ? `${spec.description}\n\n${spec.externalDocs.url}` : '',
        headers,
        authentication: {
          token: '{{ github_token }}',
          type: 'bearer'
        },
        method: method.toUpperCase(),
        url,
        body: {},
        parameters: queryParamsFromSpec(spec)
      });
    });
  });

  return requests;
}
module.exports.generateRequests = generateRequests;
