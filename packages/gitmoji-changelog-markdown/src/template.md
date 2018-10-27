# Changelog

{{#each changelog}}
<a name="{{version}}"></a>
## {{version}}{{#if date}} ({{date}}){{/if}}

{{#each groups}}
### {{label}}

{{#each commits}}
- {{emoji}} {{message}} ({{hash}})
  {{#each siblings}}
    * {{emoji}} {{message}} ({{hash}})
  {{/each}}
{{/each}}

{{/each}}

{{/each}}
