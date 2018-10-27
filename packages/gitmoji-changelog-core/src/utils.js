const levenshtein = require('fast-levenshtein')

function groupSentencesByDistance(texts = []) {
  const textsWithSortedWords = texts.map(text => text.split(' ').sort().join(''))

  const alreadyProcessedWords = new Set()
  const keyGroups = []

  for (
    let indexesFromStart = 0;
    indexesFromStart < textsWithSortedWords.length;
    indexesFromStart += 1
  ) {
    if (!alreadyProcessedWords.has(indexesFromStart)) {
      alreadyProcessedWords.add(indexesFromStart)
      const group = [indexesFromStart]
      keyGroups.push(group)

      for (
        let indexesFromNext = indexesFromStart + 1;
        indexesFromNext < textsWithSortedWords.length;
        indexesFromNext += 1
      ) {
        const distance = levenshtein.get(
          textsWithSortedWords[indexesFromStart],
          textsWithSortedWords[indexesFromNext],
        )

        // this is a magic number, this comes from various testing
        // feel free to tweak it
        if (distance < 10) {
          group.push(indexesFromNext)
          alreadyProcessedWords.add(indexesFromNext)
        }
      }
    }
  }

  return keyGroups
}

module.exports = {
  groupSentencesByDistance,
}
