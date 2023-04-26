import { expect, describe, test, jest, beforeEach, beforeAll, afterAll } from '@jest/globals'

import fsPromises from 'fs/promises'
import { createLayers } from '../../src/createLayers.js'
import { createFiles } from '../../src/createFiles.js'
import { tmpdir } from 'os'
import { join } from 'path'
import Utils from '../../src/utils.js'

function generateFilePath ({ mainPath, defaultMainFolder, layers, componentName }) {
  return layers.map(layer => {
    const filename = `${componentName}${Utils.upperCaseFirstLetter(layer)}.js`
    return join(mainPath, defaultMainFolder, Utils.lowerCaseFirstLetter(layer), filename)
  })
}

function getAllFunctionsFromInstance(instance) {
  return Reflect.ownKeys(Reflect.getPrototypeOf(instance))
      .filter(method => method !== 'constructor')
}

describe('Files integration', () => {
  const config = {
    defaultMainFolder: 'src',
    mainPath: '',
    layers: ['Service', 'Factory', 'Repository'].sort(),
    componentName: 'heroes'
  }
  const packageJSON = 'package.json'
  const packageJSONLocation = join('./test/integration/mocks/', packageJSON)

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })
  beforeAll(async () => {
    config.mainPath = await fsPromises.mkdtemp(join(tmpdir(), 'layers-'))
    await fsPromises.copyFile(
      packageJSONLocation,
      join(config.mainPath, packageJSON)
    )
    await createLayers(config)
  })
  afterAll(async () => {
    await fsPromises.rm(config.mainPath, { recursive: true })
  })
  test('Repository class should have create, read, update and delete', async () => {
    const myConfig = {
      ...config,
      layers: ['Repository']
    }

    await createFiles(myConfig)
    const [ repositoryFile ] = generateFilePath(myConfig)
    const { default: Repository } = await import(repositoryFile)
    const instance = new Repository()
    const expectNotImplemented = fn => expect(() => fn.call()).rejects.toEqual("method not implemented!")

    expectNotImplemented(instance.create)
    expectNotImplemented(instance.read)
    expectNotImplemented(instance.update)
    expectNotImplemented(instance.delete)
  })

  test('Service class should have create, read, update and delete', async () => {
    const myConfig = {
      ...config,
      layers: ['Repository', 'Service']
    }

    await createFiles(myConfig)
    const [repositoryFile, serviceFile] = generateFilePath(myConfig)

    const { default: Repository } = await import(repositoryFile)
    const { default: Service } = await import(serviceFile)

    const repository = new Repository()
    const service = new Service({ repository })

    const allRepositoryMethods = getAllFunctionsFromInstance(repository)

    allRepositoryMethods
      .forEach(method => jest.spyOn(repository, method).mockResolvedValue())

    getAllFunctionsFromInstance(service)
      .forEach(method => service[method].call(service, []))

    allRepositoryMethods
      .forEach(method => expect(repository[method]).toHaveBeenCalled())
  })
  
  test('Factory should match layers', async () => {
    const myConfig = {
      ...config
    }

    await createFiles(myConfig)

    const [factoryFile, repositoryFile, serviceFile] = generateFilePath(myConfig)

    const { default: Repository } = await import(repositoryFile)
    const { default: Service } = await import(serviceFile)
    const { default: Factory } = await import(factoryFile)

    const expectedInstance = new Service({ repository: new Repository() })
    const instance = Factory.getInstance()

    expect(instance).toMatchObject(expectedInstance)
    expect(instance).toBeInstanceOf(Service)
  })
})
