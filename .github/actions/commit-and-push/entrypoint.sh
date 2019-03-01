#!/bin/sh

set -e

# Hard-code user config
git config user.email "bots@wintron.codes"
git config user.name "${GITHUB_REPOSITORY}[bot]"

# Grab granch name
BRANCH=$( git symbolic-ref --short HEAD )

# Commit and push _just_ the specs
git commit routes/api.github.com/github-rest-apis-for-insomnia.json -m "build: spec" && git push --set-upstream origin "${BRANCH}"
