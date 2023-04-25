export default class Utils {
  static #transform({ string: [firstLetter, ...rest], upperCase = true}) {
    if (!firstLetter) return ''
    const transformedFirstLetter = upperCase ? firstLetter.toUpperCase() : firstLetter.toLowerCase()

    return [transformedFirstLetter, ...rest].join('')
  }
  static upperCaseFirstLetter(string){
    return Utils.#transform({ string })
  }
  static lowerCaseFirstLetter(string){
    return Utils.#transform({ string, upperCase: false})
  }
}