# Changelog

{{#each changelog}}
## {{version}}{{#if date}} - {{date}}{{/if}}

{{#each groups}}
### {{label}}

{{#each commits}}
- {{subject}} ({{hash}})
{{/each}}

{{/each}}

{{/each}}
