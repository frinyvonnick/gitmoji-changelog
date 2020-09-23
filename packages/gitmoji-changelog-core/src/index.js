const semver = require('semver')
const semverCompare = require('semver-compare')

const { isEmpty } = require('lodash')

const { parseCommit, getMergedGroupMapping } = require('./parser')
const logger = require('./logger')
const { groupSentencesByDistance } = require('./utils')
const { FunctionalError } = require('./errors')
const fromGitFileClient = require('./fromGitFile')

const HEAD = ''
const TAIL = ''

function makeGroups(commits) {
  if (isEmpty(commits)) return []

  const mapCommits = groups => {
    return groups
      .map(({ group, label }) => ({
        group,
        label,
        commits: commits
          .filter(commit => commit.group === group)
          .sort((first, second) => second.date.localeCompare(first.date)),
      }))
      .filter(group => group.commits.length)
  }

  const mergedCommitMapping = getMergedGroupMapping()
  return mapCommits(mergedCommitMapping)
}

function sanitizeVersion(version) {
  try {
    return semver.valid(version, {
      loose: false,
      includePrerelease: true,
    })
  } catch (e) {
    if (e.name === 'TypeError') {
      throw FunctionalError(e.message)
    }
    throw e
  }
}

function filterCommits(commits) {
  return commits
    .filter(commit => commit.group !== 'useless')
}

async function generateVersion(options) {
  const {
    from,
    to,
    version,
    groupSimilarCommits,
    client,
  } = options

  const rawCommits = await client.getCommits(from, to)

  let commits = filterCommits(rawCommits.map(parseCommit))

  if (groupSimilarCommits) {
    commits = groupSentencesByDistance(commits.map(commit => commit.message))
      .map(indexes => indexes.map(index => commits[index]))
      .map(([first, ...siblings]) => ({
        ...first,
        siblings,
      }))
  }

  const result = {
    version,
    groups: makeGroups(commits),
  }

  if (version !== 'next') {
    result.date = getLastCommitDate(commits)
  }

  return result
}

function sortVersions(c1, c2) {
  if (c1.version === 'next') return -1
  if (c2.version === 'next') return 1
  return semverCompare(c2.version, c1.version)
}

function hasNextVersion(tags, release) {
  if (!release || release === 'next') return true
  try {
    return tags.some(tag => semver.eq(tag, release))
  } catch (e) {
    if (e.name === 'TypeError') {
      throw FunctionalError(e.message)
    }
    throw e
  }
}

async function generateVersions({
  tags,
  hasNext,
  release,
  groupSimilarCommits,
  client,
}) {
  let nextTag = HEAD
  const targetVersion = hasNext ? 'next' : sanitizeVersion(release)
  const changes = await Promise.all(tags.map(async tag => {
    const version = sanitizeVersion(nextTag) || targetVersion
    const from = tag
    const to = nextTag
    nextTag = tag
    return generateVersion({
      from, to, version, groupSimilarCommits, client,
    })
  }))
    .then(versions => versions.sort(sortVersions))

  return changes
}

async function generateChangelog(from, to, {
  groupSimilarCommits, client = fromGitFileClient,
} = {}) {
  const gitTags = await client.getTags()
  let tagsToProcess = [...gitTags]
  const hasNext = hasNextVersion(gitTags, to)

  if (from === TAIL) {
    tagsToProcess = [...tagsToProcess, TAIL]
  } else {
    try {
      const fromIndex = tagsToProcess.findIndex(tag => semver.eq(tag, from))
      tagsToProcess.splice(fromIndex + 1)

      if (hasNext && isEmpty(tagsToProcess)) {
        tagsToProcess.push(HEAD)
      }
    } catch (e) {
      if (e.name === 'TypeError') {
        throw FunctionalError(e.message)
      }
      throw e
    }
  }

  const changes = await generateVersions({
    tags: tagsToProcess,
    hasNext,
    release: to,
    groupSimilarCommits,
    client,
  })

  if (from !== TAIL && changes.length === 1 && isEmpty(changes[0].groups)) {
    throw new FunctionalError('No changes found. You may need to fetch or pull the last changes.')
  }

  return {
    meta: {
      lastVersion: sanitizeVersion(from),
    },
    changes: changes.filter(({ groups }) => groups.length),
  }
}

function getLastCommitDate(commits) {
  if (isEmpty(commits)) return null

  return commits
    .map((commit) => new Date(commit.date))
    .reduce((lastCommitDate, currentCommitDate) => {
      if (currentCommitDate > lastCommitDate) {
        return currentCommitDate
      }
      return lastCommitDate
    })
    .toISOString().split('T')[0]
}

module.exports = {
  generateChangelog,
  logger,
}
