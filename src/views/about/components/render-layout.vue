<template>
  <div class="render-layout" :class="['render-layout-level-' + level]">
<!--      <div class="handle">move</div>-->
<!--      <layout-grid :class="['layout-level-' + level]" v-if="layoutItem.type === 'grid'"-->
<!--                   :layout="layoutItem.data">-->
<!--        <template v-slot:default="scope">-->
<!--          <template v-if="scope.children && scope.children.length > 0"><render-layout :level="level + 1" :items="scope.children"></render-layout></template>-->
<!--        </template>-->
<!--      </layout-grid>-->
      <grid-column :class="levelItemCls" v-if="curObj.type === 'column'"
                :layout="curObj.items">
        <template v-slot:default="{item}">
          <render-layout :level="level + 1" :map="map" :handle-next="handleNext"
                         :id="getNext(item)"></render-layout>
        </template>
      </grid-column>
      <grid-row :class="levelItemCls" v-if="curObj.type === 'row'"
                :layout="curObj.items">
        <template v-slot:default="{item}">
          <render-layout :level="level + 1" :map="map"  :handle-next="handleNext"
                         :id="getNext(item)"></render-layout>
        </template>
      </grid-row>
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
    level: {
      type: Number,
      default: 0
    },
    map: {
      type: Object,
      default() {
        return {}
      }
    },
    id: {
      type: String,
    },
    handleNext: {
      type: Function,
      default: null
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
    curObj() {
      console.log(this.map, this.id)
      if (this.map[this.id]) {
        return this.map[this.id]
      }
      return {
        data: []
      }
    },
    levelItemCls() {
      return ['layout-level-' + this.level]
    }
  },
  methods: {
    getNext(item) {
      let id = ''
      // console.log('getNext')
      if (this.handleNext) {
        id = this.handleNext(item)
      }
      return id
    },
    resetSortable() {
      let self = this
      // console.log('row',  this.$el)
      new Sortable(this.$el, {
        // handle: '.handle',
        onEnd: function (/**Event*/evt) {

        }
      })
    },
  }
}
</script>
