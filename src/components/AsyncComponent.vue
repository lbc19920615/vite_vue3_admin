<template>
  <div v-if="serviceLoaded"><slot v-bind="{serviceName}"></slot></div>
</template>
<script lang="jsx">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "AsyncComponent",
  setup() {
    let serviceLoaded = ref(false)
    let serviceName = ref('')
    let serviceId = 'AsyncComService' + ZY.nid(8).toLowerCase()
        .replace('_', '')
        .replace('-', '')
    globalThis.createServiceComFromCache(serviceId).then(name => {
      serviceName.value = name
      serviceLoaded.value = true
    })
    return {
      serviceLoaded,
      serviceName
    }
  }
})
</script>
