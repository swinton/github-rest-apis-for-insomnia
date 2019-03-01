workflow "Regenerate github-rest-apis-for-insomnia.json" {
  on = "push"
  resolves = "Diff"
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

action "Diff" {
  needs = ["Run"]
  uses = "docker://alpine/git"
  args = "diff"
}
