<style lang="scss">
$tag: "componentA";
$sel: ".componentA";

#{$sel} {
}
</style>

<template>
<div>componentA: {{price}}</div>
</template>

<script>
import bus from 'vue3-eventbus'

export default {
  name: "componentA",
  data() {
    return {
      price: 0
    }
  },
  mounted() {
    bus.on('priceChange', this.handleChange)
  },
  beforeDestroy() {
    bus.off('priceChange', this.handleChange)
  },
  methods: {
    handleChange(v) {
      this.price = v
    }
  }
}
</script>
