<template>
  <div id="app">
    <router-view></router-view>
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
