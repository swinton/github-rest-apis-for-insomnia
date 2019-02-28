workflow "Regenerate github-rest-apis-for-insomnia.json" {
  on = "push"
  resolves = "Regenerate"
}

action "Regenerate" {
  uses = "swinton/github-rest-apis-for-insomnia"
}
