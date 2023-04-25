import fsPromises from 'fs/promises'
import fs from 'fs'
import templates from './templates/index.js'
import Utils from './utils.js'

const defaultDependencies = (layer, componentName) => {
  const dependencies = {
    Repository: [],
    Service: [`${componentName}Repository`],
    Factory: [`${componentName}Repository`, `${componentName}Service`]
  }

  return dependencies[layer].map(Utils.lowerCaseFirstLetter)
}

async function writeToDisk (pedingFilesToWrite) {
  return Promise.all(pedingFilesToWrite
    .map(({ fileName, txtFile}) => fsPromises.writeFile(fileName, txtFile)))
}

export async function createFiles({ mainPath, defaultMainFolder, layers, componentName}) {
  const keys = Object.keys(templates)

  const pedingFilesToWrite = []
  for (const layer of layers) {
    const chosenTemplate = keys.find(key => key.includes(layer))
    if(!chosenTemplate) {
      return {error: 'the chosen layer does not have a template'}
    }

    const template = templates[chosenTemplate]
    const targetFolder = `${mainPath}/${defaultMainFolder}/${layer}`
    const dependencies = defaultDependencies(layer, componentName)
    const { fileName: className, template: txtFile } = template(componentName, ...dependencies)
    const fileName = `${targetFolder}/${Utils.lowerCaseFirstLetter(className)}.js`
    pedingFilesToWrite.push({ fileName, txtFile})
  }

  await writeToDisk(pedingFilesToWrite)

  return { success: true }
}