import { moduleConfig, initBrowserVueSFCLoader } from '__remote/public/vue-bs-loader.js'
import { initTemplate } from '__remote/public/template-loader.js'
globalThis.initTemplate = initTemplate

import * as Vue from 'vue/dist/vue.cjs'
import App from './App.vue'
import 'normalize.css/normalize.css'

// element
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'

globalThis.Vue = Vue

import { fetchreq, qs } from '@expose/main.js'
globalThis.qs = qs

window.testQuery = function () {
  let query = qs.stringify({
    src: 'stable.twig',
    tableDef: [
      {
        label: '日期',
        prop: 'date',
        width: 100
      },
      {
        label: '姓名', prop: 'name' },
      { label: '邮编', prop: 'zip' }
    ],
  })
  fetchreq('/getcontentv2?' + query, {
    baseUrl: 'http://localhost:7002'
  }).then((res) => {
    console.log('fetchreq', res)
  })
}

import router from './router'
import store from './store'

store.dispatch('GenerateRoutes', {
  roles: ['admin']
})

import icons from './icons/index'
import '@/styles/index.scss' // global css
import '@/styles/app.scss'

import eventBus from 'vue3-eventbus'

import * as remote from '@/plugins/remote'
import StoreApp from "./StoreApp.vue";

import * as highlightPlugin from '@/plugins/highlight'

initBrowserVueSFCLoader(Vue)

window.startApp = function () {

  const storeApp = Vue.createApp(StoreApp)
  const app = Vue.createApp(App)

  app.config.compilerOptions.isCustomElement = tag => {
    return tag === 'app-loading'
  }
  app.config.devtools = true

  storeApp.use({
    install(_a) {
      _a.config.globalProperties.$mainApp = app
    }
  })

  app.use(moduleConfig)
  app.use(remote)
  app.use(ElementPlus, {
    size: 'medium',
    locale
  })
  app.use(highlightPlugin)
  app.use(eventBus)
  app.use(icons)
  app.use(router)
  app.use(store)

  storeApp.mount('#storeApp')
  app.mount('#app')
  return app
}
