<style>
.z-iframe > iframe {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="z-iframe" v-loading="loading">
    <iframe ref="iframe" @load="onIframeLoad" v-if="show" :src="src"
            frameborder="0" ></iframe>
  </div>
</template>

<script>
export default {
  name: 'ZIframe',
  props: {
    src: String,
    show: Boolean
  },
  data() {
    return {
      loading: false
    }
  },
  watch: {
    show: {
      handler(val) {
        if (val) {
          this.loading = true
        }
      }
    }
  },
  methods: {
    onIframeLoad() {
      console.log('iframe')
      this.loading = false
    }
  }
}
</script>
