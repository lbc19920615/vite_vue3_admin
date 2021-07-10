<style lang="scss">
#canvas {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div>
    <table-a></table-a>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data () {
    return {
      scene: null, // 场景
      camera: null, // 摄像机
      renderer: null, // 渲染器
      map: null // 地图容器
    }
  },
  methods: {},
  components: {
    'tableA': globalThis.loadComponent('tabledef.vue', '&config_id=s1212121222sss1212121')
  }
})
</script>
