# `github-rest-apis-for-insomnia`

> A complete set of [GitHub REST API](https://developer.github.com/v3/) route specifications that can be imported straight into [Insomnia REST Client](https://insomnia.rest/).

## Usage

Import directly into Insomnia, via `Workspace` :arrow_right: `Import/Export` :arrow_right: `Import Data` :arrow_right: `From URL` and entering `https://raw.githubusercontent.com/swinton/github-rest-apis-for-insomnia/master/routes/api.github.com/github-rest-apis-for-insomnia.json`:

![github-rest-apis-for-insomnia](https://user-images.githubusercontent.com/27806/53533284-ea904a00-3abf-11e9-8b0a-0bfe8358369c.gif)

## Generating the route specifications

:warning: **Important**, running the following will _include_ your GitHub Token in the output, if set via a `$GITHUB_TOKEN` environment variable.

```
npx github-rest-apis-for-insomnia > github-rest-apis-for-insomnia.json
```

## Credits

:bow: [`@octokit/routes`](https://github.com/octokit/routes) for machine-readable, always up-to-date GitHub REST API route specifications.

## Feedback

Please [open an issue](/swinton/github-rest-apis-for-insomnia/issues/new).
