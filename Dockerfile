FROM node:10-stretch-slim

LABEL "com.github.actions.name"="github-rest-apis-for-insomnia"
LABEL "com.github.actions.description"="A complete set of GitHub REST API route specifications that can be imported straight into Insomnia REST Client."
LABEL "com.github.actions.icon"="refresh-cw"
LABEL "com.github.actions.color"="purple"
LABEL "repository"="https://github.com/swinton/github-rest-apis-for-insomnia"
LABEL "homepage"="https://github.com/swinton/github-rest-apis-for-insomnia"
LABEL "maintainer"="Steve Winton <stevewinton@gmail.com>"

WORKDIR /github-rest-apis-for-insomnia

# Copy over project files
COPY . .

# Install production dependencies
RUN npm install --only=production

# This is what GitHub will run
ENTRYPOINT ["node", "/github-rest-apis-for-insomnia/index.js"]
