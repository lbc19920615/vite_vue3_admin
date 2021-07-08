import * as Vue from 'vue/dist/vue.cjs'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css'

globalThis.Vue = Vue

import router from './router'
import store from './store'

// store.dispatch('ToggleSideBar')
store.dispatch('GenerateRoutes', {
  roles: ['admin']
})

import icons from './icons/index'

import '@/styles/index.scss' // global css
import '@/styles/app.scss'

import eventBus from 'vue3-eventbus'

import * as remote from '@/plugins/remote'
import StoreApp from "./StoreApp.vue";


globalThis.initBsLoader(Vue)

window.startApp = function () {

  const storeApp = Vue.createApp(StoreApp)
  const app = Vue.createApp(App)

  storeApp.use({
    install(_a) {
      _a.config.globalProperties.$mainApp = app
    }
  })

  app.use(globalThis.moduleConfig)
  app.config.devtools = true
  app.use(remote)
  app.use(ElementPlus, {
    size: 'medium'
  })
  app.use(eventBus)
  app.use(icons)
  app.use(router)
  app.use(store)


  storeApp.mount('#storeApp')
  app.mount('#app')

  return app
}
