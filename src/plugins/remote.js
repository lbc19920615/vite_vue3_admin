

export function install (app) {


  import("__remote/getscript?src=alDatetimeRange/index.twigvue").then((def) => {
    if (def.default) {
      const com = def.default('AlDatetimeRange')
      app.component(com.name, com)
    }
  })

  import("__remote/getscript?src=cmField/index.twigvue").then((def) => {
    if (def.default) {
      const com = def.default('CmField')
      // console.log(com)
      app.component(com.name, com)
    }
  })
}
