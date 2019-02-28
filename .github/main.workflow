workflow "Regenerate github-rest-apis-for-insomnia.json" {
  on = "push"
  resolves = "Inspect"
}

action "Regenerate" {
  uses = "./"
}

Action "Inspect" {
  needs = ["Regenerate"]
  uses = "actions/bin/sh"
  runs = ["git diff"]
}
