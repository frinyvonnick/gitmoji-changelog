# Changelog

{{#each changelog}}
## {{version}}{{#if date}} - {{date}}{{/if}}

{{#each groups}}
### {{label}}

{{#each commits}}
- {{emoji}} {{message}} ({{hash}})
{{/each}}

{{/each}}

{{/each}}
