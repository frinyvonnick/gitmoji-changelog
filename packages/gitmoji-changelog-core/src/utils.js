const levenshtein = require('fast-levenshtein')

function getGroupedTextsByDistance(texts = []) {
  const textsWithSortedWords = texts.map(text => text.split(' ').sort().join(''))
  const closedMeaningTexts = new Map()

  for (let i = 0; i < textsWithSortedWords.length; i += 1) {
    for (let j = i + 1; j < textsWithSortedWords.length; j += 1) {
      const distance = levenshtein.get(textsWithSortedWords[i], textsWithSortedWords[j])
      if (distance < 10) {
        // TODO: use conditions instead of spread/creating new set
        closedMeaningTexts.set(i, new Set([...(closedMeaningTexts.get(i) || []), j, i]))
        closedMeaningTexts.set(j, new Set([...(closedMeaningTexts.get(j) || []), i, j]))
      }
    }
  }

  return closedMeaningTexts
}

module.exports = {
  getGroupedTextsByDistance,
}
