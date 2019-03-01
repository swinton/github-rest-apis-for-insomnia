workflow "Regenerate github-rest-apis-for-insomnia.json" {
  on = "push"
  resolves = "Push changes"
}

action "Install" {
  uses = "actions/npm@master"
  args = "install --only=production"
}

action "Run" {
  needs = ["Install"]
  uses = "actions/npm@master"
  args = "start"
}

action "Add changes" {
  needs = ["Run"]
  uses = "docker://alpine/git"
  args = ["add", "."]
}

action "Commit changes" {
  needs = ["Add changes"]
  uses = "docker://alpine/git"
  args = ["commit", "-m", "':repeat: Regenerate github-rest-apis-for-insomnia.json'"]
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
