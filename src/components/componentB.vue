<style lang="scss">
$tag: "componentB";
$sel: ".componentB";

#{$sel} {
}
</style>

<template>
<el-button @click="change">change</el-button>
</template>

<script>
import bus from 'vue3-eventbus'

export default {
  name: "componentB",
  mounted() {
  },
  data() {
    return {}
  },
  methods: {
    change() {
      bus.emit('priceChange', Math.random())
    }
  }
}
</script>
