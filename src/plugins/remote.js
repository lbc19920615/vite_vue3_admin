import {initCmField} from "@/cmField";


export function install (app) {


  CustomVueComponent.app = app

  initCmField().then(com => {
    // console.log(com)
    CustomVueComponent.register(com)
  })

  // import("__remote/getscript?src=alDatetimeRange/index.twigvue").then((def) => {
  //   if (def.default) {
  //     const com = def.default('AlDatetimeRange')
  //     CustomVueComponent.register(com)
  //   }
  // })

  // import("__remote/getscript?src=cmField/index.twigvue").then((def) => {
  //   if (def.default) {
  //     const com = def.default('CmField')
  //     // console.log(com)
  //     CustomVueComponent.register(com)
  //   }
  // })

  app.config.globalProperties.$lodash = ZY.lodash
}
