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
<!--          {{page.stepMap}}-->
<!--          {{getObj(curObj, 'data.partName', 'UNDEFINED')}}-->
<!--          {{getObj(page.stepMap, getObj(curObj, 'data.partName', 'UNDEFINED'))}}-->

<!--          v-if="getShow(-->
<!--          getObj(curObj, 'data.partName', 'UNDEFINED'),-->
<!--          getObj(page.stepMap, getObj(curObj, 'data.partName', 'UNDEFINED'))-->
<!--          )"-->

          <template  v-if="getShow(getObj(curObj, 'data.partName', 'UNDEFINED'))">

            <AutoHttpCom
                :slotContent="innerSlots"
                :page="page"
                :def="getDef(getObj(curObj, 'data.partName', 'UNDEFINED'))"
                :is="getObj(page.stepMap, getObj(curObj, 'data.partName', 'UNDEFINED'))"
            >
            </AutoHttpCom>
          </template>


<!--          <AutoHttpCom-->
<!--              :slotContent="innerSlots"-->
<!--              :page="page"-->
<!--              :def="getDef(getObj(curObj, 'data.partName', 'UNDEFINED'))"-->
<!--          >-->
<!--          </AutoHttpCom>-->
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
      lock: new ZY.Lock(),
      innerSlots: this.slotContent ? this.slotContent : this.$slots,
      cachedMap: {}
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
    },

  },
  methods: {
    getShow(partName) {
      // let oldVal = this.cachedMap[partName]
      // if (oldVal !== newVal) {
      //   if (!lock.isLocked) {
      //     lock.lock(() => {
      //
      //     }, 1000)
      //   }
      //   return false
      // }
      // return true
      if (typeof this.cachedMap[partName] === 'undefined') {
        this.lock.lock(() => {
          this.cachedMap[partName] = true
        }, 100)
        // return true
      } else {
      //
        return this.cachedMap[partName]
      }
      // console.log(this.cachedMap)
    },
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
      if (!this.lock.isLocked) {
        console.log('reload start')
       this.lock.lock(async () => {
         this.cachedMap[partName] = false
         await ZY.sleep(500)
         this.cachedMap[partName] = true
         console.log('reload end')
       }, 3000)
      }
      if (this.handleDefMap) {
        let r = this.handleDefMap(partName)
        // console.log('sdsdsds', this.cachedMap[partName])
        return ZY.JSON5.stringify(r)
      }
      return '{}'
    }
  }
}
</script>
