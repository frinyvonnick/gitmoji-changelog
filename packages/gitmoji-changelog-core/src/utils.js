const levenshtein = require('fast-levenshtein')

// FIXME: rename texts to sentences
function getGroupedTextsByDistance(texts = []) {
  const textsWithSortedWords = texts.map(text => text.split(' ').sort().join(''))

  const alreadyProcessedWords = new Set()
  const keyGroups = new Map()

  for (let i = 0; i < textsWithSortedWords.length; i += 1) {
    if (!alreadyProcessedWords.has(i)) {
      alreadyProcessedWords.add(i)
      keyGroups.set(i, [i])

      for (let j = i + 1; j < textsWithSortedWords.length; j += 1) {
        const distance = levenshtein.get(textsWithSortedWords[i], textsWithSortedWords[j])

        // this is a magic number, this comes from various testing
        // feel free to tweak it
        if (distance < 10) {
          keyGroups.get(i).push(j)
          alreadyProcessedWords.add(j)
        }
      }
    }
  }

  return Array.from(keyGroups.values())
}

module.exports = {
  getGroupedTextsByDistance,
}
