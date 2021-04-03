import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { md } from './plugins/md'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [md({}), vue()],
})
