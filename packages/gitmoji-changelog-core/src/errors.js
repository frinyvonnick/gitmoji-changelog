class FunctionalError extends Error {
  constructor(message) {
    super(message)
    this.name = 'FunctionalError'
  }
}

module.exports = {
  FunctionalError,
}
