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

module.exports.pathNormalizer = pathNormalizer;

const mapPreviewsToHeaders = function mapPreviewsToHeaders(previews = []) {
  const headers = [];
  const acceptValue = previews
    // Filter out any previews that are not required
    .filter(preview => preview.required)
    // Allow for multiple required previews per-endpoint
    .reduce((previousValue, requiredPreview) => {
      const glue = previousValue.length > 0 ? ',' : '';
      return `${previousValue}${glue}application/vnd.github.${requiredPreview.name}-preview+json`;
    }, '');

  // Include an Accept header only if we have required previews
  if (acceptValue.length > 0) {
    headers.push(Object.assign({}, { name: 'Accept' }, { value: acceptValue }));
  }

  return headers;
};

module.exports.mapPreviewsToHeaders = mapPreviewsToHeaders;
