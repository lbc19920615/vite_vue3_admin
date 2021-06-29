import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { md } from './plugins/md'
import { linkvue } from './plugins/linkvue'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

const projectRootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  // 路径代理
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
    ]
  },
  plugins: [md({}), linkvue(), vue()],
})
