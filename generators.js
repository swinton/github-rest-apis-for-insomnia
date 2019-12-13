function requestGroupNameFromSpec(spec) {
  return spec.operationId.split('/')[0];
}

function generateRequestGroups(api, idGenerator, parentId = '__WORKSPACE_ID__') {
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
      return { parentId, _id: idGenerator(), name: group, _type: 'request_group' };
    });
}
module.exports.generateRequestGroups = generateRequestGroups;

function generateRequests(api, idGenerator, requestGroups) {
  const environmentVariables = {};
  const requests = [];

  // Generate an index of requestGroups by group
  const requestGroupsByGroup = {};
  requestGroups.forEach(requestGroup => {
    // eslint-disable-next-line no-underscore-dangle
    requestGroupsByGroup[requestGroup.name] = requestGroup._id;
  });

  Object.entries(api.paths).forEach(([path, methods]) => {
    // Capture environment variables in this path
    path
      .split('/')
      .filter(component => /^\{.+\}$/.test(component))
      .map(component => component.replace(/[{}]/g, ''))
      .forEach(component => {
        environmentVariables[component] = component;
      });

    // Replace variable components with their environment variable reference
    const normalizedPath = path
      .split('/')
      .map(component => component.replace(/^{/, '{{ ').replace(/}$/, ' }}'))
      .join('/');

    Object.entries(methods).forEach(([method, spec]) => {
      // Use our requestGroups by group index to identify the parent group
      const parentId = requestGroupsByGroup[requestGroupNameFromSpec(spec)];

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
        description: spec.description,
        headers,
        authentication: {
          token: '{{ github_token  }}',
          type: 'bearer'
        },
        method: method.toUpperCase(),
        url: `{{ github_api_root  }}${normalizedPath}`,
        body: {},
        parameters: []
      });
    });
  });

  // Return requests and environment variables
  return [requests, environmentVariables];
}
module.exports.generateRequests = generateRequests;
