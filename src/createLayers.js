import fsPromises from 'fs/promises'
import fs from 'fs'

export async function createLayers({ mainPath, defaultMainFolder, layers}) {
  const path = `${mainPath}/${defaultMainFolder}`;
  const foldersToCreate = layers.filter(layer => !fs.existsSync(layer));
  const result = foldersToCreate
    .map(folder => fsPromises.mkdir(`${path}/${folder}`, { recursive: true }));

  return Promise.all(result);
}