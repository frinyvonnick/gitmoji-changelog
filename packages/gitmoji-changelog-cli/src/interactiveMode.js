const { get, isEmpty, cloneDeep } = require('lodash')
const inquirer = require('inquirer')
const { set } = require('immutadot')

function buildFormattedChoices(changelog) {
  const formattedChoices = []

  changelog.changes
    .forEach(change => {
      change.groups
        .forEach(group => {
          formattedChoices.push(new inquirer.Separator(`${group.label} (version ${change.version})`))

          group.commits.forEach(commit => {
            formattedChoices.push({
              name: `${get(commit, 'emoji', '')} ${commit.message}`,
              value: commit.hash,
              checked: true,
            })
          })
        })
    })

  return formattedChoices
}

function getFilteredChangelog(changelog, selectedCommitsHashes) {
  const changes = changelog.changes.map(change => {
    const groups = change.groups.map(group => {
      const filteredCommits = group.commits.filter(commit => {
        return selectedCommitsHashes.find(hash => commit.hash === hash)
      })

      return set(group, 'commits', filteredCommits)
    }).filter(group => !isEmpty(group.commits))

    return set(change, 'groups', groups)
  }).filter(change => !isEmpty(change.groups))

  return {
    ...changelog,
    changes,
  }
}

async function executeInteractiveMode(initialChangelog) {
  const initialChangelogCopy = cloneDeep(initialChangelog)
  const formattedChoices = buildFormattedChoices(initialChangelogCopy)
  const prompt = inquirer.createPromptModule()
  const question = {
    type: 'checkbox',
    name: 'selectedCommitsHashes',
    message: 'Select commits',
    choices: formattedChoices,
    pageSize: 10,
  }

  const { selectedCommitsHashes } = await prompt(question)

  return getFilteredChangelog(initialChangelogCopy, selectedCommitsHashes)
}

module.exports = { executeInteractiveMode }
