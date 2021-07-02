import ejs from 'ejs'

const mdToJs = (str) => {
  return new Promise(resolve => {
    let data = {}
    let options = {}
    let template = ejs.compile(str, options);
    const content = template(data)
    let ret = `export default {
    install(app) {
      app.component('test-link', {
        template: \`${content}\`
      })
            console.log(app)
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
