const { deburr } = require('lodash')
const levenshtein = require('fast-levenshtein')

// this is a magic number, this comes from various testing
// feel free to tweak it
const MAX_DISTANCE_PERCENT = 0.30

function groupSentencesByDistance(texts = []) {
  const textsWithSortedWords = texts
    .map(text => (
      // to basic latin characters
      deburr(text)
        // replace specials characters by a filler
        .replace(/[^\w\s]/gi, '▩')
        // split words
        .split(' ')
        // little words are replaces by fillers
        // this way -> we remove useless word like (a, of, etc)
        // we keep the string length for the algorithm
        .map(word => word.length < 4 ? Array.from({ length: word.length }).join('▩') : word)
        // we sort words
        .sort()
        // we make them a sentence
        .join('')
    ))

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
        const textA = textsWithSortedWords[indexesFromStart]
        const textB = textsWithSortedWords[indexesFromNext]
        const distance = levenshtein.get(textA, textB)
        const textAverageLength = (textA.length + textB.length) / 2

        if ((textAverageLength * MAX_DISTANCE_PERCENT) >= distance) {
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
