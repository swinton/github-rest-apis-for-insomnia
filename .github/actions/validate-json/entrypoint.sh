#!/bin/sh

set -e

jq --raw-output '.resources[].name' routes/api.github.com/github-rest-apis-for-insomnia.json
