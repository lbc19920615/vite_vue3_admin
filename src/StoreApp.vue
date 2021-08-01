<template>
  <div>
    <component :ref="serviceName" v-for="serviceName in serviceNames"
               :is="serviceName"></component>
  </div>
</template>

<script>
import {defineComponent, getCurrentInstance, ref} from "vue";
import * as Vue from "vue";
import { REMOTE_ORIGIN } from '@expose/main.js'
// console.log(REMOTE_ORIGIN)

export default defineComponent({
  components: {
  },
  mounted() {
    let app = getCurrentInstance()
    // console.log(app.appContext.config.globalProperties)
    if (app.appContext.config.globalProperties.$mainApp) {
      app.appContext.config.globalProperties.$mainApp
          .config.globalProperties.$globalStore = this
      app.appContext.config.globalProperties.$mainApp.provide('globalStore', this)
      // console.log(app.appContext.config.globalProperties.$mainApp
      // app.appContext.config.globalProperties.$context = this
      //     .config.globalProperties)
    }
    globalThis.storeApp = this
  },
  setup(props, ctx){
    let appInstance = getCurrentInstance()
    let serviceNames = ref([
    ])

    /**
     * installService
     * @param serviceName {string}
     * @param path {string}
     */
    function installService(serviceName = '', path = '') {
      if (serviceNames.value.indexOf(serviceName) < 0) {
        globalThis.importScripts(path)
            .then(res => {
          const service = res.install(Vue)
          appInstance.appContext.app.component(serviceName, service)
          setTimeout(() => {
            serviceNames.value.push(serviceName)
          }, 16)
        })
      }
    }

    /**
     * installExposeServices
     * @param serviceEnties [[string, object]]
     */
    function installExposeServices(serviceEnties = []) {
      for (let [serviceName, path] of serviceEnties) {
        installService(serviceName, REMOTE_ORIGIN + path)
      }
    }

    /**
     * run
     * @param name
     * @param method
     * @param args
     * @returns {Promise<*>}
     */
    async function run(name, method, ...args) {
      if (this.$refs[name] && this.$refs[name][method]) {
        let [err, ret] = await to(
            this.$refs[name][method].apply(null, args)
        )
        if (err) {
          return Promise.reject(err)
        } else {
          return ret
        }
      } else {
        console.error('no service')
      }
    }

    let num = ref(0)

    /**
     * setNum
     * @param v
     */
    function setNum(v) {
      num.value = v
    }

    return {
      serviceNames,
      num,
      installExposeServices,
      installService,
      run,
      setNum
    }
  }
})
</script>
