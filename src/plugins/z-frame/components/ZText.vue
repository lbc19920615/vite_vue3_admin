<style>
.z-text {
  display: inline-block;
}
</style>

<template>
<div class="z-text">{{ellipsisVal}}</div>
</template>

<script>
export default {
  name: 'ZText',
  props: {
    value: String,
    ellipsisLength: {
      type: Number,
      default: 10
    },
    ellipsisStyle: {
      type: String,
      default: '...'
    },
  },
  computed: {
    ellipsisVal() {
      let value = this.value
      if (!value) return "";
      if (value.length > this.ellipsisLength) {
        return value.slice(0, this.ellipsisLength) + this.ellipsisStyle;
      }
      return value;
    }
  }
}
</script>
