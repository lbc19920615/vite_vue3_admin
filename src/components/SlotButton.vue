<template>
  <el-button type="primary" @click="sendEvent('click', $event)">option</el-button>
</template>

<script>
import {inject, onBeforeUnmount} from "vue";

export default {
  name: "SlotButton",
  setup() {
    let slotComRefManager = inject('slotComRefManager')
    let obj;
    let instance = {}
    instance.uuid = ZY.nid()
    instance.sendEvent = function (...args) {
      obj.emit(...args)
    }
    obj = slotComRefManager.register(instance, instance.uuid)
    onBeforeUnmount(() => {
      slotComRefManager.destory(instance.uuid)
    })
    return instance
  }
}
</script>

<style scoped>

</style>
