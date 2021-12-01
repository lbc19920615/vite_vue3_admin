<template>
  <el-scrollbar :max-height="maxHeight">
    {{binds}}
    <slot></slot>
  </el-scrollbar>
</template>

<script>
export default {
  name: 'ZFilterList',
  props: {
    maxHeight: {
      type: String,
      default: '1000px'
    },
    binds: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
