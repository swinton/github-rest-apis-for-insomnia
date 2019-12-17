const generate = require('../lib/generate');

const RealDate = Date;

describe('generate', () => {
  const unixEpoch = new Date(Date.UTC(1970, 0, 1));

  beforeEach(() => {
    global.Date = jest.fn((...props) => (props.length ? new RealDate(...props) : new RealDate(unixEpoch)));
  });

  it('generates', () => {
    const api = {
      info: {
        title: 'This is my API'
      },
      servers: [
        {
          url: 'https://api.example.org/'
        }
      ],
      paths: {
        '/foo/bar/{owner}/baz/{foo_id}/': {
          get: {
            summary: 'GET /foo/bar/{owner}/baz/{foo_id}/',
            description: 'There are many like it, but this one is mine.',
            externalDocs: {
              url: 'https://developer.example.org/v3/operation#foo/bar/baz'
            },
            operationId: 'operation/foo/bar/baz',
            parameters: [
              {
                name: 'owner',
                in: 'path',
                required: true,
                schema: {
                  type: 'string'
                }
              },
              {
                name: 'foo_id',
                in: 'path',
                required: true,
                schema: {
                  type: 'integer'
                }
              },
              {
                name: 'per_page',
                in: 'query',
                schema: {
                  type: 'integer',
                  default: 30
                }
              },
              {
                name: 'page',
                in: 'query',
                schema: {
                  type: 'integer',
                  default: 1
                }
              }
            ],
            'x-github': {
              previews: [
                {
                  name: 'preview'
                }
              ]
            }
          }
        }
      }
    };
    const meta = {
      name: 'github-rest-apis-for-insomnia',
      version: '0.0.0'
    };
    const data = generate({ api, meta });
    expect(data).toStrictEqual({
      __export_date: unixEpoch,
      __export_format: 4,
      __export_source: 'github-rest-apis-for-insomnia:0.0.0',
      _type: 'export',
      resources: [
        {
          _id: '__FLD_1__',
          _type: 'request_group',
          environment: {
            foo_id: 0,
            github_api_root: 'https://api.example.org/',
            owner: ''
          },
          name: 'This is my API',
          parentId: '__WORKSPACE_ID__'
        },
        {
          _id: '__FLD_2__',
          _type: 'request_group',
          name: 'operation',
          parentId: '__FLD_1__'
        },
        {
          _id: '__REQ_1__',
          _type: 'request',
          authentication: {
            token: '{{ github_token }}',
            type: 'bearer'
          },
          body: {},
          description:
            'There are many like it, but this one is mine.\n\nhttps://developer.example.org/v3/operation#foo/bar/baz',
          headers: [
            {
              name: 'Accept',
              value: 'application/vnd.github.preview-preview+json'
            }
          ],
          method: 'GET',
          name: 'GET /foo/bar/{owner}/baz/{foo_id}/',
          parameters: [
            {
              disabled: false,
              name: 'per_page',
              value: 30
            },
            {
              disabled: false,
              name: 'page',
              value: 1
            }
          ],
          parentId: '__FLD_2__',
          url: '{{ github_api_root }}/foo/bar/{{ owner }}/baz/{{ foo_id }}/'
        }
      ]
    });
  });
});
