import { request } from '@/plugins/z-request/index.js'
import { serviceOptions } from '@/requests/services/serviceOptions.js'
serviceOptions.axios = request

import { ProductsTestService } from "@/requests/services";

console.log(ProductsTestService)

ProductsTestService.productsTest()

export default request
