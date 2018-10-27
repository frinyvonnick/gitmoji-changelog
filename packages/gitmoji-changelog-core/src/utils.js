const levenshtein = require('fast-levenshtein')

function groupSentencesByDistance(texts = []) {
  const textsWithSortedWords = texts.map(text => text.split(' ').sort().join(''))

  const alreadyProcessedWords = new Set()
  const keyGroups = []

  for (let i = 0; i < textsWithSortedWords.length; i += 1) {
    if (!alreadyProcessedWords.has(i)) {
      alreadyProcessedWords.add(i)
      const group = [i]
      keyGroups.push(group)

      for (let j = i + 1; j < textsWithSortedWords.length; j += 1) {
        const distance = levenshtein.get(textsWithSortedWords[i], textsWithSortedWords[j])

        // this is a magic number, this comes from various testing
        // feel free to tweak it
        if (distance < 10) {
          group.push(j)
          alreadyProcessedWords.add(j)
        }
      }
    }
  }

  return keyGroups
}

module.exports = {
  groupSentencesByDistance,
}
