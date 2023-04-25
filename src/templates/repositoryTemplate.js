import Utils from "../utils.js"
const componentNameAnchor = '$$componentName'
const template = `
export default class $$componentNameRepository {
    constructor() { }

    create(data) {
        return Promise.reject("method not implemented!")
    }

    read(query) {
        return Promise.reject("method not implemented!")
    }

    update(id, data) {
        return Promise.reject("method not implemented!")
    }

    delete(id) {
        return Promise.reject("method not implemented!")
    }
}`

export function RepositoryTemplate(componentName) {
  return {
    fileName: `${componentName}Repository`,
    template: template.replaceAll(componentNameAnchor, Utils.upperCaseFirstLetter(componentName))
  }
}