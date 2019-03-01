workflow "Regenerate github-rest-apis-for-insomnia.json" {
  on = "push"
  resolves = "Commit, and push changes"
}

action "Install" {
  uses = "actions/npm@master"
  args = "install --only=production"
}

action "Regenerate" {
  needs = ["Install"]
  uses = "actions/npm@master"
  args = "start"
}

action "Validate" {
  needs = ["Regenerate"]
  uses = "./.github/actions/validate-json"
}

action "Commit, and push changes" {
  needs = ["Validate"]
  uses = "./.github/actions/commit-and-push"
  secrets = ["GITHUB_TOKEN"]
}
