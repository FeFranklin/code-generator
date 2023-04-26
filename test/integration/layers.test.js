import { expect, describe, test, jest, beforeEach, beforeAll, afterAll } from '@jest/globals'

import fsPromises from 'fs/promises'
import { createLayers } from '../../src/createLayers.js'
import { tmpdir } from 'os'
import { join } from 'path'

async function getFolders ({ mainPath, defaultMainFolder}) {
  return fsPromises.readdir(join(mainPath, defaultMainFolder))
}

describe('Folders integration', () => {
  const config = {
    defaultMainFolder: 'src',
    mainPath: '',
    layers: ['Service', 'Factory', 'Repository'].sort()
  }
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })
  beforeAll(async () => {
    config.mainPath = await fsPromises.mkdtemp(join(tmpdir(), 'skeleton-'))
  })
  afterAll(async () => {
    await fsPromises.rm(config.mainPath, { recursive: true })
  })
  test('should not create folder if it exists', async () => {
    const beforeRun = await fsPromises.readdir(config.mainPath)

    await createLayers(config)

    const afterRun = await getFolders(config)
    expect(beforeRun).not.toStrictEqual(afterRun)
    expect(afterRun).toEqual(config.layers)
  })
  test('should create folders if it does not exist', async () => {
    const beforeRun = await getFolders(config)
    await createLayers(config)

    const afterRun = await getFolders(config)
    expect(afterRun).toEqual(beforeRun)
  })
})
