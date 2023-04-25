import Utils from "../utils.js"
const serviceNameAnchor = '$$serviceName'
const repositoryNameAnchor = '$$repositoryName'

const serviceNameDepAnchor = '$$serviceNameDep'
const repositoryNameDepAnchor = '$$repositoryNameDep'


const componentNameAnchor = '$$componentName' 

const template = `
import $$serviceName from '../service/$$serviceNameDep.js'
import $$repositoryName from '../service/$$repositoryNameDep.js'

export default class $$componentNameFactory {
    static getInstance() {
        const repository = new $$repositoryName()
        const service = new $$serviceName({ repository })
        return service
    }
}`

export function FactoryTemplate(componentName, repositoryName, serviceName) {
    
    const txtFile = template
        .replaceAll(componentNameAnchor, Utils.upperCaseFirstLetter(componentName))
        
        .replaceAll(serviceNameDepAnchor, Utils.lowerCaseFirstLetter(serviceName))
        .replaceAll(repositoryNameDepAnchor, Utils.lowerCaseFirstLetter(repositoryName))

        .replaceAll(serviceNameAnchor, Utils.upperCaseFirstLetter(serviceName))
        .replaceAll(repositoryNameAnchor, Utils.upperCaseFirstLetter(repositoryName))
  

    return {
        fileName: `${componentName}Factory`,
        template: txtFile
    }
}