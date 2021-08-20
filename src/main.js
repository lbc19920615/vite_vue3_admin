import { moduleConfig } from '__remote/public/vue-bs-loader.js'
import { initTemplate } from '__remote/public/template-loader.js'
globalThis.initTemplate = initTemplate

import * as Vue from 'vue/dist/vue.cjs'
globalThis.Vue = Vue

import * as vuex from 'vuex'
globalThis.Vuex = vuex

import App from './App.vue'
import 'normalize.css/normalize.css'

import 'font-awesome/css/font-awesome.css'

// element
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'

// vant

import * as ZY from '@expose/main.js'

globalThis.ZY = ZY

import * as ZY_EXT from '@expose/ext.js'
globalThis.ZY_EXT = ZY_EXT

import request from '@/requests/index.js'
globalThis.Req = request

import router from './router'
import store from './store'

store.dispatch('GenerateRoutes', {
  roles: ['admin']
})

import icons from './icons/index'
import '@/styles/index.scss' // global css
import '@/styles/app.scss'

import eventBus from 'vue3-eventbus'

import '@/components/WebElements/dialog'

import * as remote from '@/plugins/remote'
import StoreApp from "./StoreApp.vue";

import * as highlightPlugin from '@/plugins/highlight'

import VueGridLayout from '@/plugins/grid-layout'
import CustomFormRenderPlugin from "@/plugins/form-render";
import {initStoreApp} from "@/storeApp";


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
  // app.use(vant)
  app.use(ElementPlus, {
    size: 'medium',
    locale
  })
  app.use(VueGridLayout)
  app.use(CustomFormRenderPlugin)
  app.use(highlightPlugin)
  app.use(eventBus)
  app.use(icons)
  app.use(router)
  app.use(store)
  import('vant/es/index').then(res => {
    // console.log(res.default)
    app.use(res.default)
  })
  initStoreApp(storeApp)
  app.mount('#app')

  return app
}

window.testQuery = function () {
  let query = {
    src: 'stable.twig',
  }
  let data = {
    tableDef: [
      {
        label: '日期',
        prop: 'date',
        width: 100,
        rules: [
          {
            age: 111,
            name: {
              validator() {
                console.log('111')
              }
            }
          }
        ]
      },
      {
        label: '姓名', prop: 'name' },
      { label: '邮编', prop: 'zip' }
    ],
  }
  // fetchContentV2(query).then((res) => {
  //   console.log('fetchreq', res)
  // })
  ZY.fetchContentV3(data, query).then((res) => {
    console.log('fetchreq', res)
  })
}
