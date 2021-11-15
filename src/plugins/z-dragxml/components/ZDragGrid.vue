<style lang="scss">
.z-drag-grid {
  //display: grid;
  //grid-template-columns: 1fr 1fr;
  //grid-template-rows: auto;
  //margin-bottom: 50px;
  padding-bottom: 10px;
  //pointer-events: none;
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
       @mouseleave="ondragleave"

  >
<!--    {{uuid}}-->

    <div class="z-drag-grid__item"
         style="height: 90px; pointer-events: initial"
         v-for="(item, itemKey) in state.dom"
         @dragover.prevent="ondragend(itemKey, $event)"
         @mousemove="onGridItemMouseEnter"
         :data-grid-id="uuid"
         :data-key="itemKey"
         :data-item-id="item.sef ? item.sef.uuid : ''"
         z-drag-grid-item=""
    >
      <render-jsx :render="item.jsx"></render-jsx>
    </div>

  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusInput from "@/components/CustomForm/CusInput.vue";
import {h, reactive, toRaw} from "vue";
import RenderJsx from "@/components/renderJsx.vue";
import {DATA_LAYOUT_ITEM_UUID_KEY, DATA_LAYOUT_UUID_KEY, DATA_UUID_KEY} from "@/vars";

function getDomRange(trueDom, heightRatio = 1) {
  let computedStyle = getComputedStyle(trueDom)
  let marginBottom = parseFloat(computedStyle.marginBottom)
  let marginTop = parseFloat(computedStyle.marginTop)
  let rect =   trueDom.getBoundingClientRect()
  let xRange = [rect.left, rect.left + rect.width]
  let yRange = [rect.top - marginTop, rect.top + (rect.height * heightRatio) + marginBottom]
  return {
    xRange,
    yRange
  }
}

export default {
  name: 'ZDragGrid',
  components: {RenderJsx, CusInput},
  DRAG_GROUP: 'high',
  DRAG_GRID: true,
  ZDragXmlCom: true,
  DRAG_EXPORT() {
    return {
      wrap: 'z-drag-grid'
    }
  },
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
<div class="z-dragxml-label__name">布局容器</div>
</div>`
  },
  mixins: [
      ZDragCommonMixin
  ],
  methods: {
    ondragend(itemKey, e) {
      // console.log('ondragend', e)
      let range = getDomRange(e.target, .5)
      // console.log(range.yRange[1], e.pageY)
      if (e.pageY < range.yRange[1]) {
        this.dragxml.onGridDragEnter({
          e,
          state: this.state,
          context: this,
          itemKey,
        })
      }
    },
    ondragleave() {
      this.dragxml.onGridDragleave()
    },
    getDom(key)  {
      return this.state.dom[key]
    },

    initDomCom(itemKey, com) {
      // this.state.dom = h(com, {}, [])
      // console.log(itemKey)
      if (this.state.dom[itemKey]) {
        let ctx = this.state.dom[itemKey]
        let itemUUID = 'z_drag_grid__' + ZY.rid()
        let props = {
          // class: [
          //   DATA_LAYOUT_UUID_KEY + this.layout_uuid,
          //   // DATA_LAYOUT_ITEM_UUID_KEY + columnIndex,
          //   DATA_UUID_KEY + itemUUID,
          // ],
          layoutUUID: this.layout_uuid,
          gridUUID: this.uuid,
          itemUUID: itemUUID,
          gridItemUUID: itemKey,
          layout_uuid: this.layout_uuid,
          uuid: itemUUID,
        }
        // console.log(com, props)
        ctx.jsx = h(com, props, [])
        ctx.def = {
          com,
          ...props
        }
        if (com.DRAG_LABEL_XML) {
          ctx.def .label_xml = com.DRAG_LABEL_XML()
        }
        ctx.sef = {
          comName: com.name,
          uuid: props.uuid,
          props
        }
      }
    },
    getTree() {
      let self = this
      let dom = toRaw(this.state.dom)
      let ret = []

      ZY.lodash.each(dom, function (item, key) {
        // console.log(item)
        let column = {
          id: key,
          itemUUID: key,
          NOT_ACTION: true,
          DRAG_GRID_ITEM: true,
          GRID_UUID: self.uuid,
          label: '布局',
        }
        if (item.def) {
          let com = item.def.com
          let c = {
            label: com.name,
            id: item.def.itemUUID,
            ...item.def,
          }
          if (com.DRAG_LABEL_XML) {
            c.label_xml = com.DRAG_LABEL_XML()
          }
          column.children = [c]
        }
        ret.push(column)
      })

      return ret
    },
    clearGridItem(gridItemUUID = '') {
      // console.log(itemUUID)
      if (this.state.dom[gridItemUUID]) {
        // console.log('sdsdsdsdsdswdsdsdsdsdsdsdsds', this.state.dom)
        // Reflect.deleteProperty(this.state.dom, itemUUID)
        this.state.dom[gridItemUUID].jsx = null
        this.state.dom[gridItemUUID].def = null
      }
    },
    toMemo() {
      let dom =  toRaw(this.state.dom)
      let ret = {}
      ZY.lodash.each(dom, function (item, key) {
        ret[key] = {
          sef: ZY.JSON5.parse(ZY.JSON5.stringify(dom[key].sef))
        }
      })
      return {
        dom: ret
      }
    },
    fromMemo(data) {
      // console.log('fromMemo', data)
      let self = this
      ZY.lodash.each(data.dom, function (item, key) {
        if (item.sef) {
          let com = CustomVueComponent.resolve(item.sef.comName)
          self.state.dom[key] = {
            sef: item.sef,
            def: {
              com,
              ...item.sef.props
            },
            jsx: h(com, item.sef.props, [])
          }
        }
      })
    },
    onGridItemMouseEnter(e) {
      // let dom =  document.elementFromPoint(e.pageX, e.pageY)
      // console.log('onGridItemMouseEnter', e.target)
      if (e.target ) {
        if (e.target.children && e.target.children[0]) {
          let trueDom  = e.target.children[0]
          let computedStyle = getComputedStyle(trueDom)
          let marginBottom = parseFloat(computedStyle.marginBottom)
          let marginTop = parseFloat(computedStyle.marginTop)
          let rect =   e.target.children[0].getBoundingClientRect()
          let xRange = [rect.left, rect.left + rect.width]
          let yRange = [rect.top - marginTop, rect.top + rect.height + marginBottom]
          // console.log(xRange, yRange, e.pageX, e.pageY)
          if (e.pageX < xRange[1] && e.pageX > xRange[0]) {
            if (e.pageY < yRange[1] && e.pageY > yRange[0]) {
              this.dragxml.onMouseEnter2(e.target.children[0])
              return;
            }
          }
          this.dragxml.onMouseEnter2(e.target)
        } else {
          this.dragxml.onMouseEnter2(e.target)
        }
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
      gridItemMouseEnterLast: null,
      state: {
        dom: {
          sjdhsjds: {
            jsx: null,
            def: null,
            sef: null,
          },
          sdhskdhsjdshjds: {
            jsx: null,
            def: null,
            sef: null,
          },
          sdsdsdsdsds: {
            jsx: null,
            def: null,
            sef: null,
          }
        }
      }
    }
  },
  mounted() {
    this.dragxml.reloadTree()
  }
}
</script>
