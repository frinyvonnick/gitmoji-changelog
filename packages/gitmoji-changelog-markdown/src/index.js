function convert(changelog) {
  const versions = Object.keys(changelog)

  return versions.reduce((markdown, version) => {
    return changelog[version].commits.reduce((commitMarkdown, commit) => {
      return `${commitMarkdown}- ${commit.subject} (${commit.hash})\n`
    }, `${markdown}\n## ${version}\n\n`)
  }, '# Changelog\n')
}

module.exports = {
  convert,
}
