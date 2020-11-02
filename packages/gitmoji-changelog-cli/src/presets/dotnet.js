const slnParser = require('vs-parse')
const xml2js = require('xml2js')
const fs = require('fs')

module.exports = async () => {
  try {
    const dir = fs.readdirSync('./')
    const solutionName = dir.find(fileName => fileName.endsWith('.sln'))
    const solutionData = await slnParser.parseSolution(solutionName)

    const project = solutionData.projects[0]
    const csprojFile = fs.readFileSync(project.relativePath, { encoding: 'utf-8' })

    const xmlParser = new xml2js.Parser()
    const projectData = await xmlParser.parseStringPromise(csprojFile)
    const propertyGroup = projectData.Project.PropertyGroup[0]

    return {
      name: project.name,
      description: propertyGroup.Description[0],
      version: propertyGroup.Version[0],
    }
  } catch (e) {
    return null
  }
}
