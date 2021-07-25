<style lang="scss">
.vue-grid-item {
  color: #ffffff;

}

.layout-level-0 {
  .vue-column-item {
    background-color: #ebebeb;
  }
}

.layout-level-1 {
  .vue-row-item {
    background-color: #99a9bf;
  }
}

.render-layout-level-2 {
  width: 100%;
  .vue-column-item {
    background-color: #001528;
  }
}

</style>

<template>
  <div class="page-search">
    <render-layout :map="layoutMap"
                   id="id1111"></render-layout>
<!--    <PlumbLayout></PlumbLayout>-->
    <!--    <table-a></table-a>-->
  </div>
</template>

<script>
import {defineComponent} from "vue";
import GridRow from "@/views/about/components/grid-row.vue";
import RenderLayout from "@/views/about/components/render-layout.vue";
import PlumbLayout from "@/views/about/components/PlumbLayout.vue";

export default defineComponent({
  mixins: [],
  data() {
    let demoColumn = {
      type: 'column',
      data: [
        {
          h: 120,
        },
        {
          h: 120,
          to: 'id222'
        },
      ]
    }


    let demoRow = {
      type: 'row',
      data: [
        {
          w: 240,
          h: 120,
          to: 'id333'
        },
      ]
    }

    let demoColumn2 = {
      type: 'column',
      data: [
        {
          h: 30,
        },
        {
          h: 30,
        },
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
      layoutMap: {
        'id1111': demoColumn,
        'id222': demoRow,
        'id333': demoColumn2
      },
      layout: [
        demoColumn,
        // demoRow,
        // {
        //   type: 'grid',
        //   data: [
        //     {"x": 0, "y": 0, "w": 24, "h": 211, "i": "0"},
        //     {
        //       "x": 2, "y": 0, "w": 24, "h": 411, "i": "1",
        //       children: [
        //           demoRow,
        //         // demoGrid
        //       ]
        //     }
        //   ]
        // },
      ]
    }
  },
  methods: {},
  components: {
    PlumbLayout,
    RenderLayout,
    GridRow,
    // 'tableA': globalThis.loadComponent('tabledef.vue', '&config_id=s1212121222sss1212121')
  }
})
</script>
