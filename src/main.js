import * as Vue from 'vue/dist/vue.cjs'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css'

console.log(Vue)

import router from './router'
import store from './store'

import content from './links/test.linkvue'
console.log(content)

// store.dispatch('ToggleSideBar')
store.dispatch('GenerateRoutes', {
  roles: ['admin']
})

import icons from './icons/index'

import '@/styles/index.scss' // global css
import '@/styles/app.scss'

import eventBus from 'vue3-eventbus'


const app = Vue.createApp(App)
  app.config.devtools = true
  app.use(content)
  app.use(ElementPlus, {
    size: 'medium'
  })
  app.use(eventBus)
  app.use(icons)
  app.use(router)
  app.use(store)
  app.mount('#app')

window.app = app
