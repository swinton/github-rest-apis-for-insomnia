workflow "Regenerate github-rest-apis-for-insomnia.json" {
  on = "push"
  resolves = "Diff"
}

action "Regenerate" {
  uses = "./"
}

action "Diff" {
  needs = ["Regenerate"]
  uses = "docker://alpine/git"
  args = "diff"
}
