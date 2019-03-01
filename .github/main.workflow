workflow "Regenerate github-rest-apis-for-insomnia.json" {
  on = "push"
  resolves = "Push changes"
}

action "Install" {
  uses = "actions/npm@master"
  args = "ci"
}

action "Run" {
  needs = ["Install"]
  uses = "actions/npm@master"
  args = "start"
}

action "Commit changes" {
  needs = ["Run"]
  uses = "docker://alpine/git"
  args = "commit -am ':repeat: Regenerate github-rest-apis-for-insomnia.json'"
}

action "Push changes" {
  needs = ["Commit changes"]
  uses = "docker://alpine/git"
  args = "push"
  secrets = [ "GITHUB_TOKEN" ]
}
