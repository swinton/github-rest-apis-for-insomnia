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
