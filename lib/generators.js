const _ = require('lodash');

function requestGroupNameFromSpec(spec) {
  return spec.operationId.split('/')[0];
}

function queryParamsFromSpec(spec) {
  return spec.parameters
    .filter(param => param.in === 'query')
    .map(({ name, schema }) => {
      return {
        name,
        value: schema.default,
        disabled: false
      };
    });
}

function generateEnvironmentVariables(api) {
  // Use a set so that we de-duplicate
  const environmentVariables = new Set();

  Object.values(api.paths).forEach(methods => {
    Object.values(methods).forEach(spec => {
      spec.parameters
        .filter(param => param.in === 'path')
        .forEach(({ name }) => {
          // Add each environment variable as a key-value pair, initialize the value to variable's name
          environmentVariables.add([name, name]);
        });
    });
  });

  // Return an object composed of the environmentVariables set key-value pairs
  return _.fromPairs([...environmentVariables.values()].sort());
}
module.exports.generateEnvironmentVariables = generateEnvironmentVariables;

function generateRequestGroups(api, idGenerator, parentId) {
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

function generateRequests(api, idGenerator, requestGroups) {
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
      const headers = spec['x-github'].previews.map(preview => {
        return {
          name: 'Accept',
          value: `application/vnd.github.${preview.name}-preview+json`
        };
      });

      requests.push({
        parentId,
        _id: idGenerator(),
        _type: 'request',
        name: spec.summary,
        description: `${spec.description}\n\n${spec.externalDocs.url}`,
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
