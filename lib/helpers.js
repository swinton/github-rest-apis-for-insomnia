function requestGroupNameFromSpec(spec) {
  return spec.operationId.split('/')[0];
}
module.exports.requestGroupNameFromSpec = requestGroupNameFromSpec;

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
module.exports.queryParamsFromSpec = queryParamsFromSpec;

function previewHeadersFromSpec(spec) {
  return spec['x-github'].previews.length
    ? {
        name: 'Accept',
        value: spec['x-github'].previews.map(preview => `application/vnd.github.${preview.name}-preview+json`).join(',')
      }
    : null;
}
module.exports.previewHeadersFromSpec = previewHeadersFromSpec;
