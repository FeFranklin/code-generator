import { expect, describe, test, jest, beforeEach} from '@jest/globals'

import fsPromises from 'fs/promises'
import fs from 'fs'
import { createFiles } from '../../src/createFiles.js'
import templates from '../../src/templates/index.js'

describe('Files - files structure', () => {
  const defaultLayers = ['Service', 'Factory', 'Repository']
  const config = {
    mainPath: './',
    defaultMainFolder: 'src',
    layers: defaultLayers,
    componentName: 'metadata'
  };
  const repositoryLayer = `${config.componentName}Repository`
  const serviceLayer = `${config.componentName}Service`
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('should not create file structure on inexistent templates', async () => {
    const myConfig = {
      ...config,
      layers: ['inexistent']
    }
    const expected = { error: 'the chosen layer does not have a template' }
    const result = await createFiles(myConfig)
    expect(result).toStrictEqual(expected)
  })

  test('repository should not add any additional dependencies', async () => {
    jest.spyOn(fsPromises, fsPromises.writeFile.name).mockResolvedValue()
    jest.spyOn(templates, templates.RepositoryTemplate.name).mockReturnValue({ fileName: '', template: '' })

    const myConfig = {
      ...config,
      layers: ['Repository']
    }
    const expected = { success: true }
    const result = await createFiles(myConfig)
    expect(result).toStrictEqual(expected)
    expect(fsPromises.writeFile).toHaveBeenCalledTimes(myConfig.layers.length)
    expect(templates.RepositoryTemplate).toHaveBeenCalledWith(myConfig.componentName)
  })

  test('service should have repository as dependency', async () => {
    jest.spyOn(fsPromises, fsPromises.writeFile.name).mockResolvedValue()
    jest.spyOn(templates, templates.ServiceTemplate.name).mockReturnValue({ fileName: '', template: '' })

    const myConfig = {
      ...config,
      layers: ['Repository', 'Service']
    }
    const expected = { success: true }
    const result = await createFiles(myConfig)
    expect(result).toStrictEqual(expected)
    expect(fsPromises.writeFile).toHaveBeenCalledTimes(myConfig.layers.length)
    expect(templates.ServiceTemplate).toHaveBeenCalledWith(myConfig.componentName, repositoryLayer)
  })
  test('factory should have repository and service as dependencies', async () => {
    jest.spyOn(fsPromises, fsPromises.writeFile.name).mockResolvedValue()
    jest.spyOn(templates, templates.FactoryTemplate.name).mockReturnValue({ fileName: '', template: '' })

    const myConfig = {
      ...config,
    }
    const expected = { success: true }
    const result = await createFiles(myConfig)
    expect(result).toStrictEqual(expected)
    expect(fsPromises.writeFile).toHaveBeenCalledTimes(myConfig.layers.length)
    expect(templates.FactoryTemplate).toHaveBeenCalledWith(myConfig.componentName, repositoryLayer, serviceLayer)
  })
})