workflow "Regenerate github-rest-apis-for-insomnia.json" {
  on = "push"
  resolves = "Commit"
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

action "Commit" {
  needs = ["Run"]
  uses = "docker://alpine/git"
  args = "commit -am 'Regenerate' && git push"
  secrets = [ "GITHUB_TOKEN" ]
}
