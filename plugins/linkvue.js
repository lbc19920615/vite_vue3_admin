import { Twig } from './prasetwig'
const { parseComponent } = require('vue-sfc-parser')

console.log(Twig)

function parseLinkVue(str) {
  const res = parseComponent(str)
  // console.log(res)

  let _template = res.template.content

  let template = Twig.twig({
    data: _template
  }).render()

  console.log(_template)

  return {
    template: template
  }
}

const mdToJs = (str) => {
  return new Promise(resolve => {
    let data = {}
    let options = {}
    let { template } = parseLinkVue(str)
    let ret = `export default {
    install(app) {
      app.component('test-link', {
        template: \`${template}\`
      })
    }
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
