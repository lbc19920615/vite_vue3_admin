import { request, context } from '@/plugins/z-request/index.js'
import { serviceOptions } from '@/requests/services/serviceOptions.js'
serviceOptions.axios = request

import {ElMessage} from "element-plus";
context.Message = ElMessage

let services = {}
import("@/requests/services").then(res => {
  services['auth'] = res
  console.log(services)
})
let API = {}
API.call = function (path, ...args) {
  if (ZY.lodash.has(services, path)) {
    let fun = ZY.lodash.get(services, path)
    return fun(...args);
  }
  return Promise.reject(new Error('no service'))
}
globalThis.API = API

// ProductsTestService.productsTest()

export default request
