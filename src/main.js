import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import router, { constantRouterMap } from './router'
import store from './store'

// store.dispatch('ToggleSideBar')
store.dispatch('GenerateRoutes', {
  roles: ['admin']
})


import '@/styles/index.scss' // global css
import '@/styles/app.scss'


const app = createApp(App)
  app.use(ElementPlus)
  app.use(router)
  app.use(store)
  app.mount('#app')
