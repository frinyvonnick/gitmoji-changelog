const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')

const MARKDOWN_TEMPLATE = path.join(__dirname, 'template.md')

function convert(changelog) {
  const template = fs.readFileSync(MARKDOWN_TEMPLATE, 'utf-8')

  const generateMarkdown = handlebars.compile(template)

  return generateMarkdown({ changelog })
}

module.exports = {
  convert,
}
