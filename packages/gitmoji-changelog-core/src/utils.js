const levenshtein = require('fast-levenshtein')

function addToMapValues(map, reference, toAdd) {
  let set = map.get(reference)
  if (!set) {
    set = new Set()
    map.set(reference, set)
  }

  set.add(toAdd)
  set.add(reference)
}

function getGroupedTextsByDistance(texts = []) {
  const textsWithSortedWords = texts.map(text => text.split(' ').sort().join(''))
  const closedMeaningTexts = new Map()

  for (let i = 0; i < textsWithSortedWords.length; i += 1) {
    for (let j = i + 1; j < textsWithSortedWords.length; j += 1) {
      const distance = levenshtein.get(textsWithSortedWords[i], textsWithSortedWords[j])

      // const minLength = Math.min(texts[i].length, texts[j].length)

      // console.log(minLength, distance, texts[i], texts[j])

      // this is a magic number, this comes from various testing
      // feel free to tweak it
      if (distance < 10) {
        closedMeaningTexts.get(i)
        addToMapValues(closedMeaningTexts, i, j)
        addToMapValues(closedMeaningTexts, j, i)
      }
    }
  }

  // sort values
  const isSorted = new Set()
  closedMeaningTexts.forEach((value, key) => {
    if (isSorted.has(key)) return

    const sortedValues = new Set(Array.from(value).sort())

    value.forEach((index) => {
      isSorted.add(index)
      closedMeaningTexts.set(index, sortedValues)
    })
  })

  return closedMeaningTexts
}

module.exports = {
  getGroupedTextsByDistance,
}
