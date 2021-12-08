import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import { md } from './plugins/md'
// import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import htmlPlugin from './plugins/html'
// const projectRootDir = path.resolve(__dirname);
import {initEnvConfig} from "./config";

//直接获取文件的text
const rawTransform =  (fileRegex) => {
  return {
    name: 'get-file-raw',
    transform: (src, id) => {
      if (fileRegex.filter((re) => re.test(id)).length > 0) {
        return `export default ${JSON.stringify(src)}`;
      }
    }
  }
}


export default (({mode}) => {
  // console.log('mode', mode, loadEnv(mode, process.cwd()))
  const config = initEnvConfig(mode)
  return defineConfig({
    // 路径代理
    resolve: {
      alias: [
        { find: '@', replacement: '/src' },
        { find: '@expose', replacement: config.VITE_REMOTE_LIB_EXPOSE_URL },
        { find: '__remote', replacement: config.VITE_REMOTE_LIB_ORIGIN },
      ]
    },
    plugins: [
      md({}),
      htmlPlugin(),
      vue(),
      rawTransform([/\.bpmn$/]),
      vueJsx(),
    ],
    server: {
      // https: true,
      proxy: {
        // 字符串简写写法
        // '/api': 'http://192.168.1.51:10010',
        '/api': {
          target: 'http://192.168.1.51:8085',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
      cors: true,
    },
  })
})
