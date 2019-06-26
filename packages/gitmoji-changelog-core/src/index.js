const semver = require('semver')
const gitRawCommits = require('git-raw-commits')
const gitSemverTags = require('git-semver-tags')
const semverCompare = require('semver-compare')
const through = require('through2')
const concat = require('concat-stream')
const { head, isEmpty, get } = require('lodash')
const { promisify } = require('util')

const { parseCommit } = require('./parser')
const { getPackageInfo, getRepoInfo } = require('./metaInfo')
const groupMapping = require('./groupMapping')
const logger = require('./logger')
const { groupSentencesByDistance } = require('./utils')

const gitSemverTagsAsync = promisify(gitSemverTags)

const COMMIT_FORMAT = '%n%H%n%an%n%cI%n%s%n%b'

function getCommits(from, to) {
  return new Promise((resolve) => {
    gitRawCommits({
      format: COMMIT_FORMAT,
      from,
      to,
    }).pipe(through.obj((data, enc, next) => {
      next(null, parseCommit(data.toString()))
    })).pipe(concat(data => {
      resolve(data)
    }))
  })
}

function makeGroups(commits) {
  if (isEmpty(commits)) return []

  return groupMapping
    .map(({ group, label }) => ({
      group,
      label,
      commits: commits
        .filter(commit => commit.group === group)
        .sort((first, second) => second.date.localeCompare(first.date)),
    }))
    .filter(group => group.commits.length)
}

function sanitizeVersion(version) {
  return semver.valid(version, {
    loose: false,
    includePrerelease: true,
  })
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
  } = options
  let commits = filterCommits(await getCommits(from, to))

  if (groupSimilarCommits) {
    commits = groupSentencesByDistance(commits.map(commit => commit.message))
      .map(indexes => indexes.map(index => commits[index]))
      .map(([first, ...siblings]) => ({
        ...first,
        siblings,
      }))
  }

  return {
    version,
    date: version !== 'next' ? getLastCommitDate(commits) : undefined,
    groups: makeGroups(commits),
  }
}

async function generateVersions({ tags, groupSimilarCommits, meta }) {
  const HEAD = ''
  let nextTag = HEAD

  const initialFrom = meta && meta.lastVersion ? meta.lastVersion : ''
  return Promise.all(
    [...tags, initialFrom]
      .map(tag => {
        console.log('tag', tag)
        const params = {
          groupSimilarCommits,
          from: tag,
          to: nextTag,
          version: nextTag ? sanitizeVersion(nextTag) : 'next',
        }
        nextTag = tag
        return params
      })
      .map(generateVersion)
  )
    .then(versions => versions.sort((c1, c2) => {
      if (c1.version === 'next') return -1
      if (c2.version === 'next') return 1
      return semverCompare(c2.version, c1.version)
    }))
}

async function generateChangelog(options = {}) {
  const {
    mode,
    release,
  } = options

  console.log('OPTIONS', options)

  if (mode === 'init') {
    console.log('INIT MODE')
    const packageInfo = await getPackageInfo()
    let requestedVersion = release === 'from-package' ? packageInfo.version : release

    const tags = await gitSemverTagsAsync()
    tags.push('')

    const hasNext = tags.includes(`v${requestedVersion}`)

    const HEAD = ''
    let nextTag = HEAD
    const changes = await Promise.all(tags.map(async tag => {
      let version = tag
      if (!tag) {
        version = hasNext ? 'next' : requestedVersion
      }
      const from = tag
      const to = nextTag
      nextTag = tag
      const commits = await getCommits(from, to)
      const groups = makeGroups(commits)

      return {
        version,
        date: getLastCommitDate(commits),
        groups,
      }
    }))
      .then(versions => versions.sort((c1, c2) => {
        if (c1.version === 'next') return -1
        if (c2.version === 'next') return 1
        return semverCompare(c2.version, c1.version)
      }))

    const repository = await getRepoInfo(packageInfo)

    return {
      meta: {
        package: packageInfo,
        repository,
        lastVersion: sanitizeVersion(requestedVersion),
      },
      changes,
    }
  }
  console.log('UPDATE MODE', options)

  const packageInfo = await getPackageInfo()
  let requestedVersion = release === 'from-package' ? packageInfo.version : release

  const { meta: { lastVersion } } = options
  let tags = await gitSemverTagsAsync()
  const hasNext = tags.includes(`v${requestedVersion}`)
  const lastVersionIndex = tags.findIndex(tag => tag === lastVersion)
  tags.splice(0, lastVersionIndex + 1)
  tags.push('')

  const HEAD = ''
  let nextTag = HEAD
  const changes = await Promise.all(tags.map(async tag => {
    let version = tag
    if (!tag) {
      version = hasNext ? 'next' : requestedVersion
    }
    const from = tag
    const to = nextTag
    nextTag = tag
    const commits = await getCommits(from, to)
    const groups = makeGroups(commits)

    return {
      version,
      date: getLastCommitDate(commits),
      groups,
    }
  }))
    .then(versions => versions.sort((c1, c2) => {
      if (c1.version === 'next') return -1
      if (c2.version === 'next') return 1
      return semverCompare(c2.version, c1.version)
    }))

  const repository = await getRepoInfo(packageInfo)

  console.log('CHANGES', JSON.stringify(changes, undefined, 2))

  return {
    meta: {
      package: packageInfo,
      repository,
      lastVersion: sanitizeVersion(lastVersion),
    },
    changes,
  }

  /*
  let version = release === 'from-package' ? packageInfo.version : release
  if (version && version !== 'next') {
    if (!semver.valid(version)) {
      throw new Error(`${version} is not a valid semver version.`)
    }

    version = sanitizeVersion(version)
  }

  let changes = []

  const tags = await gitSemverTagsAsync()
  const lastTag = get(options, 'meta.lastVersion', head(tags))

  if (mode === 'init') {
    changes = await generateVersions({ tags, groupSimilarCommits })
  } else if (lastTag === head(tags)) {
    const lastChanges = await generateVersion({
      groupSimilarCommits,
      from: lastTag,
      version,
    })

    if (isEmpty(lastChanges.groups)) {
      throw new Error('No changes found. You may need to fetch or pull the last changes.')
    }

    changes.push(lastChanges)
  } else {
    const lastTagIndex = tags.findIndex(tag => tag === lastTag)
    const missingTags = tags.splice(0, lastTagIndex)

    const lastChanges = await generateVersions({ tags: missingTags, groupSimilarCommits, meta })
    changes = [
      ...changes,
      ...lastChanges,
    ]
  }

  const repository = await getRepoInfo(packageInfo)

  return {
    meta: {
      package: packageinfo,
      repository,
      lastversion: sanitizeversion(lasttag),
    },
    changes: changes.filter(({ groups }) => groups.length),
  }
  */
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
