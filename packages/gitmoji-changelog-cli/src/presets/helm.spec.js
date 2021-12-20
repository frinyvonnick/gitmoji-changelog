const fs = require('fs')

const loadProjectInfo = require('./helm.js')

describe('getPackageInfo', () => {
  it('should extract info from Chart.yaml', async () => {
    fs.readFileSync.mockReturnValue(`
      name: chart-name
      version: 0.1.1
      description: Description of the chart
    `)

    const result = await loadProjectInfo()

    expect(result).toEqual({
      name: 'chart-name',
      version: '0.1.1',
      description: 'Description of the chart',
    })
  })
})

jest.mock('fs')
