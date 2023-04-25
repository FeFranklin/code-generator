import { expect, describe, test, jest, beforeEach} from '@jest/globals'

import templates from './../../src/templates/index.js'

const {
  RepositoryTemplate,
  ServiceTemplate,
  FactoryTemplate
} = templates

import {
  RepositoryTemplateMock,
  ServiceTemplateMock,
  FactoryTemplateMock
} from './mocks/index.js'

describe('Codegen', () => {
  const componentName = 'product'
  const repositoryName = `${componentName}Repository`
  const serivceName = `${componentName}Service`
  const factoryName = `${componentName}Factory`
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('should generate repository template', () => {
    const expected = {
      fileName: repositoryName,
      template: RepositoryTemplateMock
    }

    const result = RepositoryTemplate(componentName)
    expect(result).toStrictEqual(expected)
  })
  test('should generate service template', () => {
    const expected = {
      fileName: serivceName,
      template: ServiceTemplateMock
    }

    const result = ServiceTemplate(componentName, repositoryName)
    expect(result).toStrictEqual(expected)
  })
  test('should generate factory template', () => {
    const expected = {
      fileName: factoryName,
      template: FactoryTemplateMock
    }

    const result = FactoryTemplate(componentName, repositoryName, serivceName)
    expect(result).toStrictEqual(expected)
  })
})