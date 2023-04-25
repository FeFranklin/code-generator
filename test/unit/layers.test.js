import { expect, describe, test, jest, beforeEach} from '@jest/globals'
import { createLayers } from '../../src/createLayers.js'
import fsPromises from 'fs/promises'
import fs from 'fs'

describe('Layers - folders structure', () => {
  const defaultLayers = ['service', 'factory', 'repository']
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('should create folder if does not exist', async () => {
    jest.spyOn(fsPromises, fsPromises.mkdir.name).mockResolvedValue()
    jest.spyOn(fs, fs.existsSync.name).mockReturnValue(false)

    await createLayers( { mainPath: '', layers: defaultLayers})

    expect(fs.existsSync).toHaveBeenCalledTimes(defaultLayers.length)    
    expect(fsPromises.mkdir).toHaveBeenCalledTimes(defaultLayers.length)    
  })
  test('should not create folder if exist', async () => {
    jest.spyOn(fsPromises, fsPromises.mkdir.name).mockResolvedValue()
    jest.spyOn(fs, fs.existsSync.name).mockReturnValue(true)

    await createLayers( { mainPath: '', layers: defaultLayers})

    expect(fs.existsSync).toHaveBeenCalledTimes(defaultLayers.length)    
    expect(fsPromises.mkdir).not.toHaveBeenCalled()    
  })
})