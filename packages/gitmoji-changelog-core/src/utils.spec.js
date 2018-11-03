const { groupSentencesByDistance } = require('./utils')

describe('utils', () => {
  describe('groupSentencesByDistance', () => {
    it('should group values together', () => {
      const messages = [
        'add levenshtein', // 0 - group1
        'fix a bug about failures graph', // 1 - group2
        'levenshtein', // 2 - group1
        'fix levenshtein', // 3 - group1
        'nothing to group with me',
        'fix a graph of failures bug', // 5 - group2
      ]

      expect(groupSentencesByDistance(messages)).toEqual([[0, 2, 3], [1, 5], [4]])
    })
  })
})
