<style lang="scss">
.z-drag-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;

}
.z-drag-grid__item {
  background-color: #e0e0e0;
  border: 1px solid #f0f0f0;
}
</style>

<template>
  <div class="z-dragxml-com z-drag-grid"
       :class="drag_highlight_cls('itemUUID', uuid)"
       @mouseenter.stop="onMouseEnter"
       @dragleave="ondragleave"
       style="pointer-events: none"

  >
<!--    {{uuid}}-->

    <div class="z-drag-grid__item" style="height: 90px; pointer-events: all;"
         v-for="(item, itemKey) in state.dom"
         @dragover.prevent="ondragend(itemKey, $event)" >
      <render-jsx :render="item.jsx"></render-jsx>
    </div>

  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusInput from "@/components/CustomForm/CusInput.vue";
import {h, reactive} from "vue";
import RenderJsx from "@/components/renderJsx.vue";

export default {
  name: 'ZDragGrid',
  components: {RenderJsx, CusInput},
  DRAG_GRID: true,
  ZDragXmlCom: true,
  DRAG_CONFIG() {
    // let obj = CusInput.CUS_EDITOR() ?? { props: {} }
    // Reflect.deleteProperty(obj.props, 'type')
    return {}
  },
  DRAG_DATASET() {
    return {
      columnMax: 1
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1636618182481" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2847" width="16" height="16"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32z m-696 72h136v656H184V184z m656 656H384V384h456v456zM384 320V184h456v136H384z" p-id="2848"></path></svg>
<div class="z-dragxml-label__name">布局</div>
</div>`
  },
  mixins: [
      ZDragCommonMixin
  ],
  methods: {
    ondragend(itemKey, e) {
      // console.log('ondragend', e)
      this.dragxml.onGridDragEnter({
        e,
        state: this.state,
        context: this,
        itemKey,
      })
    },
    ondragleave() {
      this.dragxml.onGridDragleave()
    },
    initDomCom(itemKey, com) {
      // this.state.dom = h(com, {}, [])
      // console.log(itemKey)
      if (this.state.dom[itemKey]) {
        let ctx = this.state.dom[itemKey]
        ctx.jsx = h(com, {}, [])
      }
    }
  },
  data() {
    return {
      id: ZY.rid(6),
      ui: {
        widgetConfig: {
        }
      },
      state: {
        dom: {
          sjdhsjds: {
            jsx: null
          },
          sdhskdhsjdshjds: {
            jsx: null
          },
          sdsdsdsdsds: {
            jsx: null
          }
        }
      }
    }
  },
}
</script>
