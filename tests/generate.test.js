const { generate, getLatestRoutes } = require('../lib/generate');
const nock = require('nock');
const fs = require('fs');

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

  it('should retrieve latest description', async() => {
    global.Date = RealDate;
    
    const platform = 'api.github.com';
    const sha = 'abc123'

    nock('https://api.github.com:443', {"encodedQueryParams":true})
      .get('/repos/github/rest-api-description/contents/descriptions')
      .reply(200, [
        {
          "type": "dir",
          "name": `${platform}`,
          "path": `descriptions/${platform}`,
          "sha": `${sha}`
        }
      ])
      .get(`/repos/github/rest-api-description/contents/descriptions%2F${platform}%2Fdereferenced`)
      .reply(200, [
        {
          "type": `file`,
          "name": `api.github.com.deref.json`,
          "path": `descriptions/${platform}/dereferenced`,
          "sha": `${sha}`,
        }
      ])
      .get(`/repos/github/rest-api-description/git/blobs/${sha}`)
      .reply(200, {
          "content": "eyJtc2ciOiAiaGV5In0K",
          "encoding": "base64",
          "url": "https://api.github.com/repos/octocat/example/git/blobs/3a0f86fb8db8eea7ccbb9a95f325ddbedfb25e15",
          "sha": "3a0f86fb8db8eea7ccbb9a95f325ddbedfb25e15",
          "size": 19,
          "node_id": "Q29udGVudCBvZiB0aGUgYmxvYg=="
        }
      );
    
    await getLatestRoutes();
  });
});