<template>
  <div>
    <component :ref="serviceName" v-for="serviceName in serviceNames"
               :is="serviceName"></component>
  </div>
</template>

<script>
import {defineComponent, getCurrentInstance, ref} from "vue";

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
      //     .config.globalProperties)
    }
    globalThis.storeApp = this
  },
  setup(){
    let app = getCurrentInstance()
    let serviceNames = ref([
    ])

    // function installService(serviceName = '', path = '') {
    //   if (serviceNames.value.indexOf(serviceName) < 0) {
    //     /* @vite-ignore */
    //     import(path).then(res => {
    //       const service = res.default
    //       app.appContext.app.component(serviceName, service)
    //       setTimeout(() => {
    //         serviceNames.value.push(serviceName)
    //       }, 16)
    //     })
    //   }
    // }

    // installService('serviceA', './storecoms/service.vue')


    let num = ref(0)
    function setNum(v) {
      num.value = v
    }

    return {
      serviceNames,
      num,
      installService,
      setNum
    }
  }
})
</script>
