<template>
  <div class="render-layout" :class="['render-layout-level-' + level]">
      <grid-column :class="levelItemCls" v-if="curObj.type === 'column'"
                :layout="curObj.items">
        <template v-slot:default="{item}">
<!--          {{getNext(item)}}-->
          <render-layout :level="level + 1" :map="map" :handle-next="handleNext"
                         :handle-def-map="handleDefMap"
                         :page="page"
                         :slotContent="innerSlots"
                         :id="getNext(item)">
          </render-layout>
        </template>
      </grid-column>
      <grid-row :class="levelItemCls" v-else-if="curObj.type === 'row'"
                :layout="curObj.items">
        <template v-slot:default="{item}">
          <render-layout :level="level + 1" :map="map"  :handle-next="handleNext"
                         :handle-def-map="handleDefMap"
                         :page="page"
                         :slotContent="innerSlots"
                         :id="getNext(item)">
          </render-layout>
        </template>
      </grid-row>
      <template  v-else-if="curObj.type === 'tab'">
<!--        {{curObj.items}}-->
        <render-tab :class="levelItemCls"
                  :layout="curObj.items">
          <template v-slot:default="{item}">
<!--            {{item}} {{getNext(item)}}-->
            <render-layout :level="level + 1" :map="map"  :handle-next="handleNext"
                           :handle-def-map="handleDefMap"
                           :page="page"
                           :slotContent="innerSlots"
                           :id="getNext(item)">
            </render-layout>
          </template>
        </render-tab>
      </template>
    <template  v-else-if="curObj.type === 'modal'">
      <render-modal :class="levelItemCls"
                  :layout="curObj.items"
                    :obj="curObj"
                    :page="page"
      >
        <template v-slot:default="{item}">
          <!--            {{item}} {{getNext(item)}}-->
          <render-layout :level="level + 1" :map="map"  :handle-next="handleNext"
                         :handle-def-map="handleDefMap"
                         :page="page"
                         :slotContent="innerSlots"
                         :id="getNext(item)">
          </render-layout>
        </template>
      </render-modal>
    </template>
      <template v-else>
        <template v-if="curObj && curObj.type && curObj.content">
<!--          {{curObj}} {{stepMap.test}}-->
<!--          :def="curObj.content"-->
          <AutoHttpCom
              :slotContent="innerSlots"
              :page="page"
              :def="getDef(getObj(curObj, 'data.partName', 'UNDEFINED'))"
          >
          </AutoHttpCom>
        </template>
      </template>
  </div>
</template>

<script>
import GridRow from "@/views/about/components/grid-row.vue";
import GridColumn from "@/views/about/components/grid-column.vue";
import RenderTab from "@/views/about/components/render-tab.vue";
import AutoHttpCom from "@/components/AutoHttpCom.vue";
import RenderModal from "@/views/about/components/render-modal.vue";

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
    page: null,
    id: {
      type: String,
    },
    handleNext: {
      type: Function,
      default: null
    },
    handleDefMap: {
      type: Function,
      default: null
    },
    slotContent: null
  },
  components: {
    RenderModal,
    RenderTab,
    AutoHttpCom,
    GridColumn,
    GridRow,
  },
  data() {
    return {
      innerSlots: this.slotContent ? this.slotContent : this.$slots,
    }
  },
  computed: {
    curObj() {
      // console.log(this.map, this.id)
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
    getObj(...args) {
      return ZY.lodash.get(...args)
    },
    render() {
      return this.$slots
    },
    getNext(item) {
      let id = ''
      // console.log('getNext', this.handleNext)
      if (this.handleNext) {
        id = this.handleNext(item)
      }
      return id
    },
    getDef(partName) {
      if (this.handleDefMap) {
        let r = this.handleDefMap(partName)
        return ZY.JSON5.stringify(r)
      }
      return '{}'
    }
  }
}
</script>
