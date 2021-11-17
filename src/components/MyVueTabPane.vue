<style>
.my-vue-tab-pane:not(.my-vue-tab-pane--loaded) {
  display: none;
}
</style>

<template>
<div class="my-vue-tab-pane"
     :class="{'my-vue-tab-pane--loaded': load}"
     :style="styleObj">
  <template v-if="load"><slot></slot></template>
</div>
</template>

<script>
export default {
  name: "MyVueTabPane",
  props: {
    name: String
  },
  data() {
    return {
      load: false,
      styleObj: {
      }
    }
  },
  created() {
    if (this.$parent && this.$parent.registerTab) {
      this.$parent.registerTab(this)
    }
  },
  beforeUnmount() {
    if (this.$parent && this.$parent.unRegisterTab) {
      this.$parent.unRegisterTab(this)
    }
  },
  methods: {
    toggle(booleanV) {
      this.load = booleanV
       // let display = booleanV ? 'block' : 'none'
      // this.styleObj.display = display
    }
  }
}
</script>

<style scoped>

</style>
