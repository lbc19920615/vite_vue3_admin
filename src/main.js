import { moduleConfig } from '__remote/public/vue-bs-loader.js'
import { initTemplate } from '__remote/public/template-loader.js'
globalThis.initTemplate = initTemplate

import * as Vue from 'vue/dist/vue.cjs'
globalThis.Vue = Vue

import * as vuex from 'vuex'
globalThis.Vuex = vuex

import App from './App.vue'
import 'normalize.css/normalize.css'

import 'suitcss-utils-size/index.css'
import 'font-awesome/css/font-awesome.css'

import '@/components/WebElements/index'

import JsonViewer from "vue3-json-viewer";


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

import * as Framework from "@/mixins/framework";
globalThis.Framework = Framework

import * as ZPageHooks from "@/plugins/z-page/hooks";
globalThis.ZPageHooks = ZPageHooks

import * as ZPageBuild from "@/plugins/z-page/build";
globalThis.ZPageBuild = ZPageBuild

import * as NodeDefMap from "@/plugins/ComEditor/nodes.js";
import * as tabNodePlugin from '@/plugins/ComEditor/tabNode.plugin'
NodeDefMap.register(tabNodePlugin)

import * as v1ArrayPlugin from '@/plugins/ComEditor/v1arrayNode.plugin'
NodeDefMap.register(v1ArrayPlugin)

import * as v1objectPlugin from '@/plugins/ComEditor/v1objectNode.plugin'
NodeDefMap.register(v1objectPlugin)

import router, {addRoute} from './router'
import store from './store'

let routes = await store.dispatch('GenerateRoutes', {
  roles: ['admin']
})
routes.forEach(routeEntry => {
  // console.log(routeEntry)
  addRoute(routeEntry)
})

import icons from './icons/index'
import '@/styles/index.scss' // global css
import '@/styles/app.scss'

import eventBus from 'vue3-eventbus'

import '@/components/WebElements/dialog'

import * as remote from '@/plugins/remote'
import StoreApp from "./StoreApp.vue";

import * as highlightPlugin from '@/plugins/highlight'

import CodeMirrorPlugin from '@/plugins/CodeMirrorEditor/index'

// import VueGridLayout from '@/plugins/grid-layout'
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
  // app.use(VueGridLayout)
  app.use(CustomFormRenderPlugin)
  app.use(highlightPlugin)
  app.use(JsonViewer)
  app.use(CodeMirrorPlugin)
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
