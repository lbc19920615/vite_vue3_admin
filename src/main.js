import { moduleConfig } from '__remote/public/vue-bs-loader.js'
import { initTemplate } from '__remote/public/template-loader.js'
globalThis.initTemplate = initTemplate

class CustomVueComponent {
  static defMap = new Map()
  static app = null
  static component(name, ctx) {
    this.app.component(name, ctx)
    this.defMap.set(name, ctx)
  }
  static register(ctx, name = ctx.name) {
    this.component(name, ctx)
  }
}
globalThis.CustomVueComponent = CustomVueComponent

import * as Vue from 'vue/dist/vue.cjs'
globalThis.Vue = Vue

import * as vuex from 'vuex'
globalThis.Vuex = vuex

import App from './App.vue'
import 'normalize.css/normalize.css'

import 'suitcss-utils-size/index.css'
// import 'font-awesome/css/font-awesome.css'


// element
import ElementPlus from 'element-plus';
// import 'element-plus/lib/theme-chalk/index.css';
import 'element-plus/dist/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'

import '@/components/WebElements/index'

// vant

import * as ZY from '@expose/main.js'
globalThis.ZY = ZY

import * as ZY_EXT from '@expose/ext.js'
globalThis.ZY_EXT = ZY_EXT

import request from '@/requests/index.js'
globalThis.Req = request

import * as ZformMana from '@/plugins/z-frame/formsMana'

import * as Framework from "@/mixins/framework";
globalThis.Framework = Framework

import * as ZPageHooks from "@/plugins/z-page/hooks";
globalThis.ZPageHooks = ZPageHooks

import * as ZPageBuild from "@/plugins/z-page/build";
globalThis.ZPageBuild = ZPageBuild

import * as ZFramePlugin from "@/plugins/z-frame/index";

import * as NodeDefMap from "@/plugins/ComEditor/nodes.js";
import * as tabNodePlugin from '@/plugins/ComEditor/tabNode.plugin'
NodeDefMap.register(tabNodePlugin)

import * as v1ArrayPlugin from '@/plugins/ComEditor/v1arrayNode.plugin'
NodeDefMap.register(v1ArrayPlugin)

import * as v1objectPlugin from '@/plugins/ComEditor/v1objectNode.plugin'
NodeDefMap.register(v1objectPlugin)

import * as modalNodePlugin from '@/plugins/ComEditor/modalNode.plugin'
NodeDefMap.register(modalNodePlugin)

import * as eleNodePlugin from '@/plugins/ComEditor/eleNode.plugin'
NodeDefMap.register(eleNodePlugin)

import router, {addRoute} from './router'
import store from './store'

(async () => {
  let routes = await store.dispatch('GenerateRoutes', {
    roles: ['admin']
  })
  routes.forEach(routeEntry => {
    // console.log(routeEntry)
    addRoute(routeEntry)
  })
})()

import icons from './icons/index'
import '@/styles/index.scss' // global css
import '@/styles/app.scss'

import eventBus from 'vue3-eventbus'

import * as remote from '@/plugins/remote'
import StoreApp from "./StoreApp.vue";

import CodeMirrorPlugin from '@/plugins/CodeMirrorEditor/index'

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
  app.use(ElementPlus, {
    size: 'medium',
    locale
  })
  app.use(ZformMana)
  app.use(CustomFormRenderPlugin)
  app.use(CodeMirrorPlugin)
  app.use(ZFramePlugin)
  app.use(eventBus)
  app.use(icons)
  app.use(router)
  app.use(store)
  // import JsonViewer from "vue3-json-viewer";
  import("vue3-json-viewer").then(res => {
    app.use(res.default)
  })
  // import * as highlightPlugin from '@/plugins/highlight'
  import('@/plugins/highlight').then(highlightPlugin => {
    app.use(highlightPlugin)
  })
  // import('vant/es/index').then(res => {
  //   // console.log(res.default)
  //   app.use(res.default)
  // })
  initStoreApp(storeApp)

  app.mount('#app')

  return app
}

globalThis.app = window.startApp()
