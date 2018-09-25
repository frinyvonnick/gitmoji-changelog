# Changelog

{{#each changelog}}
## {{version}}

{{#each groups}}
### {{label}}

{{#each commits}}
- {{subject}} ([{{shortHash}}]({{urlHash}}))
{{/each}}

{{/each}}

{{/each}}
