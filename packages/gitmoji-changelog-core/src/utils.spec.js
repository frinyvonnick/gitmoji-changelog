const { getGroupedTextsByDistance } = require('./utils')

describe('utils', () => {
  describe('getGroupedTextsByDistance', () => {
    it('should group values together', () => {
      const messages = [
        'add levenshtein', // 0 - group1
        'some kind of bug', // 1 - group2
        'levenshtein', // 2 - group1
        'sparkles/levenshtein', // 3 - group1
        'nothing to group with me',
        'an other kind of bug', // 5 - group2
      ]

      expect(getGroupedTextsByDistance(messages)).toEqual([[0, 2, 3], [1, 5], [4]])
    })
  })
})
