# Changelog

{{#each changelog}}
<a name="{{version}}"></a>
## {{version}}{{#if date}} ({{date}}){{/if}}

{{#each groups}}
### {{label}}

{{#each commits}}
- {{emoji}} {{message}} ({{hash}})
  {{#if siblings}}

    **siblings:**

  {{#each siblings}}
    * {{emoji}} {{message}} ({{hash}})
  {{/each}}
  {{/if}}
{{/each}}

{{/each}}

{{/each}}
