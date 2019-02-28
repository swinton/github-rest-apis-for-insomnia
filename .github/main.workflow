workflow "Regenerate github-rest-apis-for-insomnia.json" {
  on = "push"
  resolves = "Inspect"
}

action "Regenerate" {
  uses = "./"
}

action "Inspect" {
  needs = ["Regenerate"]
  uses = "actions/bin/sh@master"
  runs = ["git diff"]
}
