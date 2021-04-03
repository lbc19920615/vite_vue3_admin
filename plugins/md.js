import marked from 'marked'

const mdToJs = (str) => {
  const content = JSON.stringify(marked(str))
  return `export default ${content}`
}

export function md(pluginOptions) {
  let server
  return {
    name: 'vite-import-markdown',
    config() {
      marked.setOptions(pluginOptions)
    },
    transform(code, id) {
      if (!id.endsWith('.md')) return null

      return mdToJs(code)
    },
  }
}
