<template>
  <div class="z-cascader">
    <el-cascader-panel  :props="props" />
  </div>
</template>

<script>
import {reactive, toRefs} from "vue";

export default {
  name: 'ZCascader',
 setup() {
   let id = 0
   const state = reactive({
     props: {
       lazy: true,
       async lazyLoad(node, resolve) {
         const { level } = node
         await ZY.sleep(500)
         const nodes = Array.from({ length: level + 1 }).map((item) => ({
           value: ++id,
           label: `Option - ${id}`,
           leaf: level >= 2,
         }))
         // Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.
         resolve(nodes)
       },
     },
   })
   return {
     ...toRefs(state),
   }
 }
}
</script>
