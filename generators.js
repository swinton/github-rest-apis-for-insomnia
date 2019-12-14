function requestGroupNameFromSpec(spec) {
  return spec.operationId.split('/')[0];
}

/**
 * Takes a path like:
 *
 *   /repos/{owner}/{repo}/compare/{base}...{head}
 *
 * And captures all the variable parts of the path ({owner}, {repo}, ...) etc.
 *
 * As well, updates the path so that the variable parts are treated as environment
 * variables by Insomnia.
 */
function captureVariablesFromPath(path) {
  const capturedVars = {};
  const re = /{(.*?)}/g;

  return [
    path.replace(re, (match, captured) => {
      // Capture this environment variable
      capturedVars[captured] = captured;
      return `{{ ${captured} }}`;
    }),
    capturedVars
  ];
}

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
  const environmentVariables = {};
  const requests = [];

  // Generate an index of requestGroups by group
  const requestGroupsByGroup = {};
  requestGroups.forEach(requestGroup => {
    // eslint-disable-next-line no-underscore-dangle
    requestGroupsByGroup[requestGroup.name] = requestGroup._id;
  });

  Object.entries(api.paths).forEach(([path, methods]) => {
    const [normalizedPath, capturedEnvironmentVariables] = captureVariablesFromPath(path);
    Object.assign(environmentVariables, capturedEnvironmentVariables);

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
          token: '{{ github_token }}',
          type: 'bearer'
        },
        method: method.toUpperCase(),
        url: `{{ github_api_root }}${normalizedPath}`,
        body: {},
        parameters: []
      });
    });
  });

  // Return requests and environment variables
  return [requests, environmentVariables];
}
module.exports.generateRequests = generateRequests;
