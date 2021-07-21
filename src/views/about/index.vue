<style lang="scss">
.vue-grid-item {
  background-color: #99a9bf;
  color: #ffffff;
}
</style>

<template>
  <div>
    <grid-layout
        :layout.sync="layout"
        :col-num="24"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
    >

      <grid-item v-for="item in layout"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i"
                 :min-w="item.minW"
      >
        {{item.i}}
      </grid-item>
    </grid-layout>
    <table-a></table-a>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data () {
    return {
      layout: [
        {"x":0,"y":0,"w":2,"h":2,"i":"0"},
        {"x":2,"y":0,"w":2,"h":4,"i":"1"},
        {"x":4,"y":0,"w":2,"h":5,"i":"2"}
      ]
    }
  },
  methods: {},
  components: {
    'tableA': globalThis.loadComponent('tabledef.vue', '&config_id=s1212121222sss1212121')
  }
})
</script>
