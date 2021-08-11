//给webstorm提供vue cli3项目别名正确解析
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  resolve: {
    alias: {
      '@': resolve('/src'),
    }
  }
}
