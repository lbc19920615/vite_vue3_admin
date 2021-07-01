import ejs from 'ejs'

const mdToJs = (str) => {
  let data = {}
  let options = {}
  let template = ejs.compile(str, options);
  const content = template(data)
  return `export default {
    install(app) {
      app.component('test-link', {
        template: \`${content}\`
      })
            console.log(app)
    }
  }`
}

export function linkvue(pluginOptions) {
  let server
  return {
    name: 'vite-import-linkvue',
    config() {
    },
    transform(code, id) {
      if (!id.endsWith('.linkvue')) return null

      return mdToJs(code)
    },
  }
}
