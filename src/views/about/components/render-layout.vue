<template>
  <div class="render-layout" :class="['render-layout-level-' + level]">
    <template class="render-layout__con" v-for="layoutItem in items">
<!--      <div class="handle">move</div>-->
<!--      <layout-grid :class="['layout-level-' + level]" v-if="layoutItem.type === 'grid'"-->
<!--                   :layout="layoutItem.data">-->
<!--        <template v-slot:default="scope">-->
<!--          <template v-if="scope.children && scope.children.length > 0"><render-layout :level="level + 1" :items="scope.children"></render-layout></template>-->
<!--        </template>-->
<!--      </layout-grid>-->
      <grid-column :class="levelItemCls" v-if="layoutItem.type === 'column'"
                :layout="layoutItem.data">
        <template v-slot:default="{item}">
          <template v-if="item.children && item.children.length > 0"><render-layout :level="level + 1" :items="item.children"></render-layout></template>
        </template>
      </grid-column>
      <grid-row :class="levelItemCls" v-if="layoutItem.type === 'row'"
                :layout="layoutItem.data"></grid-row>
    </template>
  </div>
</template>

<script>
import GridRow from "@/views/about/components/grid-row.vue";
import LayoutGrid from "@/views/about/components/layout-grid.vue";
import Sortable from "sortablejs";
import GridColumn from "@/views/about/components/grid-column.vue";

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
    GridColumn,
    LayoutGrid,
    GridRow,
  },
  data() {
    return {}
  },
  computed: {
    levelItemCls() {
      return ['layout-level-' + this.level]
    }
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
