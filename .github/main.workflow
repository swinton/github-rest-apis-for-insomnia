workflow "Regenerate github-rest-apis-for-insomnia.json" {
  on = "push"
  resolves = "Diff"
}

action "Install" {
  uses = "actions/npm@master"
  args = "install --only=production"
}

action "Diff" {
  needs = ["Install"]
  uses = "docker://alpine/git"
  args = "diff"
}
