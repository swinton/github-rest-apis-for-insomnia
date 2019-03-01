workflow "Regenerate github-rest-apis-for-insomnia.json" {
  on = "push"
  resolves = "Push changes"
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

action "Commit changes" {
  needs = ["Validate"]
  uses = "docker://alpine/git"
  args = ["commit", "-am", "':repeat: Regenerate github-rest-apis-for-insomnia.json'"]
  env = {
    "GIT_COMMITTER_NAME" = "GitHub Actions"
    "GIT_COMMITTER_EMAIL" = "actions@github.com"
  }
}

action "Push changes" {
  needs = ["Commit changes"]
  uses = "docker://alpine/git"
  args = "push"
  secrets = ["GITHUB_TOKEN"]
}
