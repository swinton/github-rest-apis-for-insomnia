const helpers = require('../lib/helpers');

describe('helpers', () => {
  describe('previewHeadersFromSpec', () => {
    it('generates accept headers from previews', () => {
      const spec = {
        'x-github': {
          previews: [
            {
              name: 'foo'
            }
          ]
        }
      };
      expect(helpers.previewHeadersFromSpec(spec)).toStrictEqual({
        name: 'Accept',
        value: 'application/vnd.github.foo-preview+json'
      });
    });

    it('handles multiple previews correctly', () => {
      const spec = {
        'x-github': {
          previews: [
            {
              name: 'foo'
            },
            {
              name: 'bar'
            }
          ]
        }
      };
      expect(helpers.previewHeadersFromSpec(spec)).toStrictEqual({
        name: 'Accept',
        value: 'application/vnd.github.foo-preview+json,application/vnd.github.bar-preview+json'
      });
    });

    it('returns null for no previews', () => {
      const spec = {
        'x-github': {
          previews: []
        }
      };
      expect(helpers.previewHeadersFromSpec(spec)).toBe(null);
    });
  });
});
