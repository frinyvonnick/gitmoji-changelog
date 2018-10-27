# Changelog

{{#each changelog}}
<a name="{{version}}"></a>
## {{version}}{{#if date}} ({{date}}){{/if}}

{{#each groups}}
### {{label}}

{{#each commits}}
- {{emoji}} {{message}} [{{hash}}] (by {{author}})
{{/each}}

{{/each}}

{{/each}}
