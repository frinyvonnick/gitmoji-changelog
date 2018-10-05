# Changelog

{{#each changelog}}
<a name="v{{version}}"></a>
## {{version}}{{#if date}} - {{date}}{{/if}}

{{#each groups}}
### {{label}}

{{#each commits}}
- {{subject}} ({{hash}})
{{/each}}

{{/each}}

{{/each}}
