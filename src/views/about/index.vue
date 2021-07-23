<style lang="scss">
.vue-grid-item {
  color: #ffffff;

}

.layout-level-0 {
  .vue-grid-item, .vue-row-item {
    background-color: #d3dce6;
  }
}

.layout-level-1 {
  .vue-grid-item, .vue-row-item {
    background-color: #99a9bf;
  }
}

.vue-row-item {
  display: inline-block;
}

//.render-layout__con {
//  position: relative;
//}
//
//.handle {
//  position: absolute;
//  left: 0;
//  top: 0;
//  z-index: 1111111;
//}
</style>

<template>
  <div class="page-search">
    <render-layout :items="layout"></render-layout>
    <!--    <table-a></table-a>-->
  </div>
</template>

<script>
import {defineComponent} from "vue";
import GridRow from "@/views/about/components/grid-row.vue";
import RenderLayout from "@/views/about/components/render-layout.vue";

export default defineComponent({
  mixins: [],
  data() {
    let demoRow = {
      type: 'row',
      data: [
        {
          w: 240,
          h: 120,
        },
        {
          w: '1fr',
          h: 210,
        },
        {
          w: '1fr',
          h: 170,
        }
      ]
    }

    let demoGrid = {
      type: 'grid',
      data: [
        {"x": 0, "y": 0, "w": 24, "h": 2, "i": "0"},
        {
          "x": 2, "y": 0, "w": 24, "h": 4, "i": "1",
        }
      ]
    }
    return {
      layout: [
        // demoRow,
        // demoRow,
        {
          type: 'grid',
          data: [
            {"x": 0, "y": 0, "w": 24, "h": 211, "i": "0"},
            {
              "x": 2, "y": 0, "w": 24, "h": 411, "i": "1",
              children: [
                  demoRow,
                // demoGrid
              ]
            }
          ]
        },
      ]
    }
  },
  methods: {},
  components: {
    RenderLayout,
    GridRow,
    // 'tableA': globalThis.loadComponent('tabledef.vue', '&config_id=s1212121222sss1212121')
  }
})
</script>
