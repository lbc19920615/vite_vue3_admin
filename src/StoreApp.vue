<template>
  <div>
    <component :ref="serviceName" v-for="serviceName in serviceNames"
               :is="serviceName"></component>
  </div>
</template>

<script>
import {defineComponent, getCurrentInstance, ref, inject} from "vue";
import * as Vue from "vue";
import { REMOTE_ORIGIN } from '@expose/main.js'
import {createRefManager} from "@/hooks/ref";
import {useStore} from "vuex";

export default defineComponent({
  created() {
    let store = useStore()

    let self = this
    let servicesManager = createRefManager({
      eventHandler({type, e}) {
        if (type === self.EVENT_TYPES.SET_MODEL_READY) {
          // const {ctx, model} = e
          // vuexStore.commit('increment')
          // vuexStore.dispatch('storeApp/ToggleSideBar')
          // console.log('SET_MODEL_READY', ctx)
        }
      }
    })

    Vue.provide('servicesManager', servicesManager)
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
    Vue.provide('globalStore', this)
  },
  setup(props, ctx){


    let appInstance = getCurrentInstance()
    let serviceNames = ref([
    ])

    function installServiceComponent(serviceName, res) {
      const service = res.install(Vue)
      if (!service.mixins) {
        service.mixins = []
      }
      service.mixins.push({
        data() {
          return {
            serviceName,
            RefsManager: null
          }
        },
        created() {
          const servicesManager = inject('servicesManager');
          this.RefsManager = servicesManager.register(this, serviceName)
          // console.log(serviceName, servicesManager.Refs)
        },
        beforeUnmount() {
          const servicesManager = inject('servicesManager');
          servicesManager.destory(this.RefsManager.uuid)
        },
      })
      appInstance.appContext.app.component(serviceName, service)
      setTimeout(() => {
        serviceNames.value.push(serviceName)
      }, 16)
    }

    /**
     * installService
     * @param serviceName {string}
     * @param path {string}
     */
    function installService(serviceName = '', path = '') {
      if (serviceNames.value.indexOf(serviceName) < 0) {
        globalThis.importScripts(path)
            .then(res => {
              installServiceComponent(serviceName, res)
            }
        )
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
    function run(name, method, ...args) {
      if (this.$refs[name] && this.$refs[name][method]) {
        // let [err, ret] = await to(
        //     this.$refs[name][method].apply(null, args)
        // )
        // console.log('run',  name, [err, ret])
        // if (err) {
        //   return Promise.reject(err)
        // } else {
        //   return ret
        // }
        return this.$refs[name][method].apply(null, args)
      } else {
        // console.error('no service')
        // return Promise.reject(new Error('no service'))
      }
    }

    const EVENT_TYPES = {
      INIT_MODEL_READY: Symbol('INIT_MODEL_READY'),
      SET_MODEL_READY: Symbol('SET_MODEL_READY')
    }

    return {
      serviceNames,
      installServiceComponent,
      installExposeServices,
      EVENT_TYPES,
      installService,
      run,
    }
  }
})
</script>
