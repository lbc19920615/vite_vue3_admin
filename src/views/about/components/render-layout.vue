<template>
  <div class="render-layout" :class="['render-layout-level-' + level]">
    <template class="render-layout__con" v-for="layoutItem in items">
<!--      <div class="handle">move</div>-->
      <layout-grid :class="['layout-level-' + level]" v-if="layoutItem.type === 'grid'"
                   :layout="layoutItem.data">
        <template v-slot:default="scope">
          <template v-if="scope.children && scope.children.length > 0"><render-layout :level="level + 1" :items="scope.children"></render-layout></template>
        </template>
      </layout-grid>
      <grid-row :class="['layout-level-' + level]" v-if="layoutItem.type === 'row'"
                :layout="layoutItem.data"></grid-row>
    </template>
  </div>
</template>

<script>


import GridRow from "@/views/about/components/grid-row.vue";
import LayoutGrid from "@/views/about/components/layout-grid.vue";
import Sortable from "sortablejs";

export default {
  name: 'RenderLayout',
  props: {
    items: {
      type: Array,
      default: []
    },
    level: {
      type: Number,
      default: 0
    }
  },
  components: {
    LayoutGrid,
    GridRow,
  },
  data() {
    return {}
  },
  mounted() {
    // this.resetSortable()
  },
  methods: {
    resetSortable() {
      let self = this

      console.log('row',  this.$el)
      new Sortable(this.$el, {
        // handle: '.handle',
        onEnd: function (/**Event*/evt) {

        }
      })
    },
  }
}
</script>
