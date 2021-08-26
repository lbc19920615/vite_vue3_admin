import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import { md } from './plugins/md'
import fileloader from './plugins/fileloader'
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
        { find: '@expose', replacement: config.REMOTE_LIB_EXPOSE_URL },
        { find: '__remote', replacement: config.REMOTE_LIB_ORIGIN },
      ]
    },
    plugins: [
      md({}),
      htmlPlugin(),
      fileloader({
        virtualFileId: '@my-virtual-file',
        origin: 'http://localhost:7002/getcontent'
      }),
      vue(),
      rawTransform([/\.bpmn$/]),
      vueJsx(),
    ],
  })
})
