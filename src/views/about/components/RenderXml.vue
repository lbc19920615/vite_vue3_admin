<template>
  <div class="render-xml">
    <slot name="ais_render_xml_content"></slot>
  </div>
</template>

<script>
import GridRow from "@/views/about/components/grid-row.vue";
import GridColumn from "@/views/about/components/grid-column.vue";
import RenderTab from "@/views/about/components/render-tab.vue";
import AutoHttpCom from "@/components/AutoHttpCom.vue";
import RenderModal from "@/views/about/components/render-modal.vue";

export default {
  name: 'RenderXml',
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
    rootId: {
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
    console.log(this.$slots)
    return {
      lock: new ZY.Lock(),
      innerSlots: this.slotContent ? this.slotContent : this.$slots,
      cachedMap: {}
    }
  },
  computed: {


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
        // console.log('reload start')
       this.lock.lock(async () => {
         this.cachedMap[partName] = false
         await ZY.sleep(500)
         this.cachedMap[partName] = true
         // console.log('reload end')
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
