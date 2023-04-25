import { expect, describe, test, jest, beforeEach} from '@jest/globals'
import Utils from '../../src/utils'

describe('Utils', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('upperCaseFirstLetter should make the first letter upperCase', () => {
    const string = 'hello'
    const expe = 'Hello'
    const result = Utils.upperCaseFirstLetter(string)
    expect(result).toStrictEqual(expe)
  })
  test('upperCaseFirstLetter given an empty string it should return empty', () => {
    const string = ''
    const expe = ''
    const result = Utils.upperCaseFirstLetter(string)
    expect(result).toStrictEqual(expe)
  })
  test('lowerCaseFirstLetter should make the first letter lowerCase', () => {
    const string = 'Hello'
    const expe = 'hello'
    const result = Utils.lowerCaseFirstLetter(string)
    expect(result).toStrictEqual(expe)
  })
  test('lowerCaseFirstLetter given an empty string it should return empty', () => {
    const string = ''
    const expe = ''
    const result = Utils.lowerCaseFirstLetter(string)
    expect(result).toStrictEqual(expe)
  })
})