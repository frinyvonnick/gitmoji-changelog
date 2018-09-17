# Changelog

{{#each changelog}}
## {{version}}

{{#each groups}}
### {{label}}

{{#each commits}}
- {{subject}} ({{hash}})
{{/each}}

{{/each}}

{{/each}}
