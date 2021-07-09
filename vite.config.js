import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { md } from './plugins/md'
import fileloader from './plugins/fileloader'
import path from 'path'

const projectRootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  // 路径代理
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '__remote', replacement: 'http://localhost:7002/public' },
    ]
  },
  plugins: [
    md({}),
    fileloader({
      virtualFileId: '@my-virtual-file',
      origin: 'http://localhost:7002/getcontent'
    }),
    vue()
  ],
})
