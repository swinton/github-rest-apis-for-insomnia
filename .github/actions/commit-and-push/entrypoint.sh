#!/bin/sh

set -e

BRANCH=$( git symbolic-ref --short HEAD )

git commit routes/api.github.com/github-rest-apis-for-insomnia.json -m "build: spec" --author="${GITHUB_REPOSITORY}[bot] <bots@wintron.codes>" && git push --set-upstream origin "${BRANCH}"
