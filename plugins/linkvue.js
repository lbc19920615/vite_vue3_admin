import { Twig, render } from './prasetwig'
const { parseComponent } = require('vue-sfc-parser')


const config = {
  'username': {
    vistrual: ''
  }
}

function parseLinkVue(str) {
  const res = parseComponent(str)
  // console.log(res)

  let _template = res.template.content

  let [template, vuecoms] = render(_template)

  for (let [key, value] of Object.entries(vuecoms)) {
    console.log(key, value)
  }


  let _script = res.script.content

  let script = `
    let ENV = {}
    ENV.config = {
      template: \`${template}\`
    }
    app.component('test-link', ${_script})
  `

  return {
    template: template,
    script
  }
}

const mdToJs = (str) => {
  return new Promise(resolve => {
    let data = {}
    let options = {}
    let { template, script } = parseLinkVue(str)
    let ret = `export default {
    install(app) {${script}}
  }`
    resolve(ret)
  })
}

export function linkvue(pluginOptions) {
  let server
  return {
    name: 'vite-import-linkvue',
    config() {
    },
    async transform(code, id) {
      if (!id.endsWith('.linkvue')) return null

      return mdToJs(code)
    },
  }
}
