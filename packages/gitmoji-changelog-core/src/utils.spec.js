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

      const groups = getGroupedTextsByDistance(messages)

      const expectedGroup1 = [0, 2, 3]
      const expectedGroup2 = [1, 5]

      expect(Array.from(groups.keys())).toEqual([...expectedGroup1, ...expectedGroup2])

      // first group
      expect(Array.from(groups.get(0))).toEqual(expectedGroup1)
      expect(Array.from(groups.get(2))).toEqual(expectedGroup1)
      expect(Array.from(groups.get(3))).toEqual(expectedGroup1)

      // second group
      expect(Array.from(groups.get(1))).toEqual(expectedGroup2)
      expect(Array.from(groups.get(5))).toEqual(expectedGroup2)
    })
  })
})
