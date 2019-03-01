#!/bin/sh

set -e

USER_EMAIL=$( jq --raw-output '.pusher.email' "${GITHUB_EVENT_PATH}" )
USER_NAME=$( jq --raw-output '.pusher.name' "${GITHUB_EVENT_PATH}" )

git config user.email "${USER_EMAIL}"
git config user.name "${USER_NAME}"

git commit -am "build: spec"
