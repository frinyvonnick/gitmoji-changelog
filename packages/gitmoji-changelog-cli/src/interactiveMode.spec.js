const inquirer = require('inquirer')
const interactiveMode = require('./interactiveMode')

describe('interactiveMode', () => {
  const commitAddProcess = {
    hash: '00c90b7844c3d030e967721eafea1b436ee51a6b',
    author: 'Franck',
    date: '2019-05-19T10:57:22+02:00',
    subject: ':sparkles: Add interactive process',
    emojiCode: 'sparkles',
    emoji: '✨',
    message: 'Add interactive process',
    group: 'added',
    siblings: [],
    body: '',
  }

  const commitAddOption = {
    hash: '3092ffd56e35fff7e35e8a9fcb7fff53005eac8a',
    author: 'Franck',
    date: '2019-05-18T18:39:44+02:00',
    subject: ':sparkles: Add interactive option',
    emojiCode: 'sparkles',
    emoji: '✨',
    message: 'Add interactive option',
    group: 'added',
    siblings: [],
    body: '',
  }

  const commitUpgradeDeps = {
    hash: 'b77199f96c8570b827dfcb11907d6f4edac98823',
    author: 's n',
    date: '2019-04-23T15:55:19+02:00',
    subject: ':arrow_up: Update handlebar to 4.0.14 (#78)',
    emojiCode: 'arrow_up',
    emoji: '⬆️',
    message: 'Update handlebar to 4.0.14 (#78)',
    group: 'changed',
    siblings: [],
    body: '',
  }

  const commitAddAuthor = {
    hash: '979da30f5e52385b99bd4a58e1a946793bd1196d',
    author: 'Benjamin Petetot',
    date: '2018-10-30T09:33:52+01:00',
    subject: ':sparkles: Add the author in changelog lines (#56)',
    emojiCode: 'sparkles',
    emoji: '✨',
    message: 'Add the author in changelog lines (#56)',
    group: 'added',
    siblings: [],
    body: '',
  }

  const groupAddedVersionNext = {
    group: 'added',
    label: 'Added',
    commits: [
      commitAddProcess,
      commitAddOption,
    ],
  }

  const groupChangedVersionNext = {
    group: 'changed',
    label: 'Changed',
    commits: [
      commitUpgradeDeps,
    ],
  }

  const groupAddedVersionOne = {
    group: 'added',
    label: 'Added',
    commits: [
      commitAddAuthor,
    ],
  }

  const versionNext = {
    version: 'next',
    groups: [
      groupAddedVersionNext,
      groupChangedVersionNext,
    ],
  }

  const versionOne = {
    version: '1.1.0',
    date: '2018-11-15',
    groups: [
      groupAddedVersionOne,
    ],
  }

  const initialChangelog = {
    changes: [
      versionNext,
      versionOne,
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('buildFormattedChoices', () => {
    it('should return a list of formatted choices from the given changelog', () => {
      const result = interactiveMode.buildFormattedChoices(initialChangelog)

      const expectedResult = [
        new inquirer.Separator(`${groupAddedVersionNext.label} (version ${versionNext.version})`),
        {
          name: `${commitAddProcess.emoji} ${commitAddProcess.message}`,
          value: commitAddProcess.hash,
          checked: true,
        },
        {
          name: `${commitAddOption.emoji} ${commitAddOption.message}`,
          value: commitAddOption.hash,
          checked: true,
        },
        new inquirer.Separator(`${groupChangedVersionNext.label} (version ${versionNext.version})`),
        {
          name: `${commitUpgradeDeps.emoji} ${commitUpgradeDeps.message}`,
          value: commitUpgradeDeps.hash,
          checked: true,
        },
        new inquirer.Separator(`${groupAddedVersionOne.label} (version ${versionOne.version})`),
        {
          name: `${commitAddAuthor.emoji} ${commitAddAuthor.message}`,
          value: commitAddAuthor.hash,
          checked: true,
        },
      ]

      expect(result).toEqual(expectedResult)
    })
  })

  describe('getFilteredChangelog', () => {
    it('should return a new filtered changelog from the given inital changelog and selected commits', () => {
      const selectedCommitsHashes = [commitAddProcess.hash, commitAddAuthor.hash]

      const result = interactiveMode.getFilteredChangelog(initialChangelog, selectedCommitsHashes)

      const expectedResult = {
        changes: [
          {
            version: 'next',
            groups: [{
              group: 'added',
              label: 'Added',
              commits: [
                commitAddProcess,
              ],
            }],
          },
          {
            version: '1.1.0',
            date: '2018-11-15',
            groups: [
              groupAddedVersionOne,
            ],
          },
        ],
      }

      expect(result).toEqual(expectedResult)
    })
  })

  describe('executeInteractiveMode', () => {
    it('should call buildFormattedChoices, createPromptModule and getFilteredChangelog with correct parameters', async () => {
      const formattedChoices = [{
        name: `${commitAddProcess.emoji} ${commitAddProcess.message}`,
        value: commitAddProcess.hash,
        checked: true,
      }]
      const selectedCommitsHashes = [commitAddProcess.hash, commitAddOption.hash]
      const prompt = jest.fn(() => Promise.resolve({ selectedCommitsHashes }))

      interactiveMode.buildFormattedChoices = jest.fn(() => formattedChoices)
      interactiveMode.getFilteredChangelog = jest.fn()
      inquirer.createPromptModule = jest.fn()
      inquirer.createPromptModule.mockReturnValueOnce(prompt)

      await interactiveMode.executeInteractiveMode(initialChangelog)

      expect(interactiveMode.buildFormattedChoices).toHaveBeenNthCalledWith(1, initialChangelog)
      expect(inquirer.createPromptModule).toHaveBeenCalledTimes(1)
      expect(prompt).toHaveBeenNthCalledWith(1, {
        type: 'checkbox',
        name: 'selectedCommitsHashes',
        message: 'Select commits',
        choices: formattedChoices,
        pageSize: 10,
      })
      expect(interactiveMode.getFilteredChangelog)
        .toHaveBeenNthCalledWith(1, initialChangelog, selectedCommitsHashes)
    })
  })
})
