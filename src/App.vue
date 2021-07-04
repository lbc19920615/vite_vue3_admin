<template>
  <div id="app">
    <test-link></test-link>
    <remote-com></remote-com>
  </div>
</template>

<script>
import {defineAsyncComponent, defineComponent} from "vue";

export default {
  components: {
    remoteCom:defineAsyncComponent({
      loader: () =>  import('./components/base.vue')
    })
  }
}
</script>

<style>
</style>
