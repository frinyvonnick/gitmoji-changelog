'use strict'

function convert(json) {
  const commits = JSON.parse(json)

  return commits.reduce((markdown, commit) => {
    return `${markdown}- ${commit.subject} (${commit.hash})\n`
  }, '# Changelog\n\n')
}

module.exports = {
  convert,
}
