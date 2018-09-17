function convert(changelog) {
  return changelog.reduce((markdown, { version, commits }) => {
    return commits.reduce((commitMarkdown, commit) => {
      return `${commitMarkdown}- ${commit.subject} (${commit.hash})\n`
    }, `${markdown}\n## ${version}\n\n`)
  }, '# Changelog\n')
}

module.exports = {
  convert,
}
