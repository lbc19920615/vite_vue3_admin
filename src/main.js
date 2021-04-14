import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css'

import router from './router'
import store from './store'

// store.dispatch('ToggleSideBar')
store.dispatch('GenerateRoutes', {
  roles: ['admin']
})

import icons from './icons/index'

import '@/styles/index.scss' // global css
import '@/styles/app.scss'


const app = createApp(App)
  app.use(ElementPlus, {
    size: 'medium'
  })
  app.use(icons)
  app.use(router)
  app.use(store)
  app.mount('#app')
