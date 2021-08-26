import { request, context } from '@/plugins/z-request/index.js'

import { serviceOptions } from '@/requests/services/serviceOptions.js'
serviceOptions.axios = request

import {ElMessage} from "element-plus";
context.Message = ElMessage

let services = {}
let servicesConfig = new Map()

Promise.all(
 [import("@/requests/services/index.js"), import("@/requests/services/config.js")],
).then(([index, config]) => {
  services['auth'] = index
  // console.log(services, index, config)
  servicesConfig.set('auth', config.default)
})
let API = {}
// API.call('auth', 'AuthApiImplService.info')
API.call = function (lib, path, ...args) {
  let truePath = `${lib}.${path}`

  let lodash = ZY.lodash

  if (lodash.has(services, truePath)) {
    let cache = lodash.get(services, lib)
    let fun = lodash.get(services, truePath)
    let config = servicesConfig.get(lib)
    let pathName = path + 'Path'
    let methodName = path + 'Method'
    let configPath = lodash.get(cache, pathName)
    let method = lodash.get(cache, methodName)
    let pathDef = lodash.get(config, `paths['${configPath}']['${method}']` )
    let params = {}
    if (pathDef) {
      let { parameters = [] } = pathDef
      if (Array.isArray(parameters) && parameters.length > 0) {
        parameters.forEach(item => {
          let defArr = []
          let $ref = item.schema.$ref
          if ($ref) {
            defArr = $ref.split('/')
          }
          if (defArr.length > 1) {
            let defArrName = defArr[defArr.length - 1]
            params[defArrName] = config.definitions[defArrName]
          }
        })
      }
    }
    console.log(config, params, pathDef, method)
    return fun(...args);
  }
  return Promise.reject(new Error('no service'))
}
globalThis.API = API

// ProductsTestService.productsTest()

export default request
