<style lang="scss">
.z-drag-layout {
  //border-bottom: 1px solid #e0e0e0;
  &::after {
    content: '';
    display: block;
    height: 1px;
    background-color: transparent;
    width: 100%;
  }
  padding: 0 10px;
  padding-bottom: var(--dragxml-drag-layout-pb, 10px);
}
.z-drag-layout__column {
  box-sizing: border-box;
  min-height: 10px;
  flex: 1;
  border: 1px solid transparent;
  //&[dragenter] {
  //  border-color: #0d84ff;
  //}
  //&:hover {
  //  border: 1px solid #eee;
  //}
}
</style>

<template>
<!--  {{state.column}}-->
<!--  <el-row class="z-drag-layout" :z-layout-uuid="layoutUUID"  layout-dom="layout-dom">-->

<!--    <draggable v-model="state.items"-->
<!--               v-for="(columnItem, columnIndex) in state.column"-->
<!--             item-key="id"-->
<!--             tag="el-row"-->
<!--             :sort="true"-->
<!--    >-->
<!--      <template #item="{element}">-->
<!--        <el-col  class="z-drag-layout__item"-->
<!--        @dragenter.prevent="onDragEnter(columnIndex, $event)"-->
<!--        >-->
<!--  &lt;!&ndash;        <div style="height: 90px;">{{element}}</div>&ndash;&gt;-->
<!--          <render-dom :render="state.doms[columnIndex]"  ></render-dom>-->
<!--        </el-col>-->
<!--      </template>-->
<!--    </draggable>-->
<!--  </el-row>-->

<!--  {{layoutUUID}}-->
<el-row class="z-drag-layout"
        :z-layout-uuid="state.layoutUUID"
        :z-uuid="uuid"
        :class="zdrag__highlight_cls('layoutUUID', state.layoutUUID)"
        layout-dom="layout-dom"
        :id="initId"
>
  <template v-for="(item, index) in state.column">
<!--   <div> {{state.uuids[index]}}</div>-->
    <el-col class="z-drag-layout__item z-drag-layout__column"
            @dragleave="onDragLeave"
            @dragenter.prevent="onDragEnter(index, $event)"
            :id="getColumnID(index)"
            :z-drag-layout__column="columnMax"
    >
<!--      {{state.uuids[index]}}-->
<!--      {{columnMax}}-->
      <render-dom
                  :ref="initRefs(index)"
                  :render="state.doms[index]"
                  :uuids="state.uuids[index]"
                  @loaded="onLoaded(index, $event)" ></render-dom>
    </el-col>
  </template>
</el-row>
<!--<el-button @click="appendColumn">appendColumn</el-button>-->
</template>

<script>
import RenderDom from "@/components/renderDom.vue";
import draggable from 'vuedraggable'
import {h, inject, nextTick, reactive, toRaw, provide, getCurrentInstance, onMounted} from "vue";
import {DATA_LAYOUT_ITEM_UUID_KEY, DATA_LAYOUT_UUID_KEY, DATA_UUID_KEY} from "@/vars";
import Sortable from 'sortablejs';
import {ZDragHighlightMixin} from "@/plugins/z-dragxml/mixins";

export default {
  name: "ZLayoutInit",
  components: {RenderDom, draggable,},
  mixins: [
      ZDragHighlightMixin
  ],
  props: {
    dragEnter: null,
    column: {
      type: Number,
      default: 1
    },
    columnLen: {
      type: Number,
      default: 12
    },
    columnMax: {
      type: Number,
      default: 1
    },
    uuid: String
  },
  setup(props, ctx) {
    // let instanse = getCurrentInstance()
    const RENDER_DOM_CLS = 'render-dom-item'
    const DRAGENTER_ATTR = 'dragenter'

    let initId = 'init___' + ZY.rid()

    let lodash = ZY.lodash
    let JSON5 = ZY.JSON5
    let sortable = null
    // console.log(props.columnMax)

    function initData() {
      let ret = []
      for (let i = 0; i < props.columnLen; i++) {
        ret.push([])
      }
      return ret
    }

    function initMaps() {
      let ret = []
      for (let i = 0; i < props.columnLen; i++) {
        ret.push({})
      }
      return ret
    }


    let columnContext = initData()


    let app = getApp()
    // let layoutUUID = ZY.rid()
    let state = reactive({
      doms: initMaps(),
      defs: initData(),
      uuids: initMaps(),
      column: props.column,
      layoutUUID:  ZY.rid()
      // items: initData()
    })


    let refs = new Map()
    function initRefs(index) {
      return function (el) {
        refs.set(index, el)
      }
    }

    let dragxml = inject('dragxml')
    function onMouseEnter(e) {
      // console.log('onMouseEnter', e)
      dragxml.onMouseEnter(e)
    }

    function buildInstanse(com, itemUUID, columnIndex) {
      return h(com, {
        class: [
          RENDER_DOM_CLS,
          DATA_LAYOUT_UUID_KEY + state.layoutUUID,
          DATA_LAYOUT_ITEM_UUID_KEY + columnIndex,
          DATA_UUID_KEY + itemUUID,
        ],
        layout_uuid: state.layoutUUID,
        uuid: itemUUID,
      }, Date.now())
    }

    function getColumnID(index = 0) {
      return 'zdrag__' + props.uuid
    }

    /**
     * 获取column dom
     * @param columnIndex
     * @returns {HTMLElement}
     */
    function getColumnDom(columnIndex) {
      return  document.getElementById(getColumnID(columnIndex))
    }

    /**
     *
     * @param columnIndex
     */
    function rebuildSortAble(columnIndex) {
      let el = getColumnDom(columnIndex)
       sortable = new Sortable(el, {
        name: 'layoutinit_' + ZY.rid(),
        onEnd: function (/**Event*/evt) {
          nextTick(() => {
            let uuids = buildUUIDS()
            // console.log(uuids)
            rebuildDefs(uuids, columnIndex)
            ctx.emit('clear-index')
            ctx.emit('drag-end', {
              columnIndex
            })
          })
          // console.log('evt', el, uuids)
        }
      })
    }

    function rebuildDefs(uuids = [], columnIndex = 0) {
      // console.log('call rebuildLayouts')
      // let suuids =    state.doms[columnIndex].map(layout => {
      //   let dom = layout.el
      //   return app.findUUIDfromClassList(dom)
      // })
      // console.log(uuids, suuids)
      let dlayouts = state.defs[columnIndex]
      let dlayouts_uuids = dlayouts.map(layout => {
        return layout.itemUUID
      })

      let layouts = []
      uuids.forEach(uuid => {
        let index = dlayouts_uuids.findIndex(dom_uuid => {
          // console.log(dom_uuid, uuid)
          return dom_uuid === uuid
        })
        if (index > -1) {
          layouts.push(dlayouts[index])
        }
        // console.log(uuid, index)
      })
      state.defs[columnIndex] = layouts

      nextTick(() => {
        genUUIDS(columnIndex, layouts.map(v => v.itemUUID))
      })
      // let doms = layouts.map(v => {
      //   // return v.buildInstanse(v.itemUUID)
      //   return buildInstanse(v.com, v.itemUUID, columnIndex)
      // })

      // let el = getColumnDom(columnIndex)
      // let children = Array.of(...el.children)
      // layouts.map((v,index)=> {
      //   // return v.buildInstanse(v.itemUUID)
      //   console.log(children, state.doms[columnIndex][index])
      //   state.doms[columnIndex][index].el = children[index]
      // })


      // state.doms[columnIndex] = doms
      // console.log(uuids, doms)
      // columnContext[columnIndex].reload(doms, function () {
      //   let el = getColumnDom(columnIndex)
      //   clearDragIndex(el)
      //   console.log('after reload')
      // })
    }

    function genUUIDS(columnIndex = 0, obj) {
      // state.uuids[columnIndex] = state.defs[columnIndex].map(v => {
      //   return v.itemUUID
      // })
      let arr = state.defs[columnIndex].map(v => {
        return v.itemUUID
      })
      if (obj) {
        arr = obj
      }
      // state.uuids[columnIndex].value = arr
      state.uuids[columnIndex].str = ZY.JSON5.stringify(arr)
      // console.log(state.uuids[columnIndex])
    }

    function buildUUIDS(columnIndex = 0) {
      // console.log('buildUUIDS', columnIndex)
      let el = getColumnDom(columnIndex)
      let zs = Array.of(...el.children)
      let uuids = zs.map(dom => {
        return app.findUUIDfromClassList(dom, DATA_UUID_KEY)
      })
      // state.uuids[columnIndex] = uuids
      return uuids
    }

    // let domRef = null
    // function getRef(v) {
    //   domRef = v
    // }

    /**
     *
     * @param columnIndex {number}
     * @returns {(function(*=, *=): void)|*}
     */
    function buildAppend(columnIndex) {
      return function append(com, trueDom) {
        let child = state.doms[columnIndex]
        let def = state.defs[columnIndex]
        let config = {}
        let DRAG_CONFIG = null
        if (com.methods && com.methods.DRAG_CONFIG) {
          DRAG_CONFIG = com.methods.DRAG_CONFIG
        }
        if (com.DRAG_CONFIG) {
          DRAG_CONFIG = com.DRAG_CONFIG
        }
        // console.log('buildAppend', def, com)
        if(def[0] && def[0]?.com?.DRAG_SUB_FORM) {
          console.log('this has subform', com.DRAG_SUB_FORM)
          //  子表单不能插入子表单
          if (com.DRAG_SUB_FORM) {
            return ;
          }
        }
        config =  DRAG_CONFIG()?? {}
        if (def.length < props.columnMax) {
          let itemUUID =  'z_layout_item__' + ZY.rid(10)
          let instanse = buildInstanse(com, itemUUID, columnIndex)
          let cachedDef = {
            layoutUUID: state.layoutUUID,
            attrs: {
              // test: 1,
            },
            itemUUID,
            /**
             * 容器uuid
             */
            con_uuid: props.uuid,
            com,
            config
            // instanse,
            // buildInstanse
          }
          // let keys = Object.keys(child)
          if (def.length < 1) {
            // child.push(instanse)
            def.push(cachedDef)
            child[itemUUID] = instanse
          } else {
            // console.log(trueDom.hasAttribute(DATA_UUID_KEY))
            if (trueDom) {
              let parentChild = Array.of(...trueDom.parentElement.children)
              let trueDom_uuid = app.findUUIDfromClassList(trueDom)
              // console.log(trueDom_uuid)
              let index  =  parentChild.findIndex(ele => {
                let uuid = app.findUUIDfromClassList(ele)
                return uuid === trueDom_uuid
              })
              // console.log(index, state.defs[columnIndex].map(v => v.itemUUID))
              if (!Number.isNaN(index)) {
                if (index < 0) {
                  // child.push(instanse)
                  def.push(cachedDef)
                } else {
                  index = index + 1
                  // child.splice(index, 0, instanse)
                  def.splice(index, 0, cachedDef)
                }
              }
              child[itemUUID] = instanse
            } else {
              console.log(trueDom)
            }
          }
          // console.log(child)
          // setRefMan(true)
          nextTick(() => {
            // buildItems(columnIndex)
            genUUIDS(columnIndex)
            rebuildSortAble(columnIndex)
            ctx.emit('changed')
            // let uuids = buildUUIDS(columnIndex)
          })
        } else {
          console.warn('超出限制', props.columnMax)
          ctx.emit('column-max-err')
        }
      }
    }

    function onDragEnter(columnIndex, e) {
      // console.log('onDragEnter', e)
      // e.target.setAttribute(DRAGENTER_ATTR, 1)
      if (props.dragEnter) {
        props.dragEnter({
          append: buildAppend(columnIndex),
          // index: type,
          // domRef
        })
      }
    }

    function initGrid(com) {
      // console.log('initGrid',com)
      let append = buildAppend(0)
      append(com)
    }

    function onDragLeave(e) {
      e.target.removeAttribute(DRAGENTER_ATTR)
    }

    function findCom(uuid, layout_item_uuid) {
      // console.log('layout_item_uuid', layout_item_uuid)
      // let com = state.doms[layout_item_uuid]
      let dom = state.defs[layout_item_uuid]
      if (dom) {
        let index = dom.findIndex(v => {
          return v.itemUUID === uuid
        })
        if (index > -1) {
          let def = dom[index]
          // console.log(def, index)
          return def
        }
        // console.log( dom.map(v => v.itemUUID))
        // console.log( uuid, index)
      } else {
        console.log(uuid, layout_item_uuid)
      }
    }

    function appendColumn() {
      state.column = state.column + 1
    }

    function clearDragIndex(el) {
      let e = el.querySelector(`[${DRAGENTER_ATTR}]`)
      if (e) {
        // console.log(e)
        e.removeAttribute(DRAGENTER_ATTR)
      }
      ctx.emit('clear-index')
    }

    function onLoaded(columnIndex, e) {
      // state.defs[columnIndex].map(v => {
      //   v.context = e
      //   return v
      // })
      columnContext[columnIndex] = e
      let el = getColumnDom(columnIndex)
      rebuildSortAble(columnIndex)
      clearDragIndex(el)
      // console.log(sortable, el)
    }

    function getUUIDS(columnIndex) {
      // console.log(state.defs[columnIndex])
      if (Array.isArray(state.defs[columnIndex])) {
        return state.defs[columnIndex].map(v => {
          return v.itemUUID
        })
      }
      return []
    }

    function getChildren() {
      let defs = toRaw(state.defs).filter(v => {
        return v.length > 0
      }).map((column, columnIndex) => {
        return {
          label: 'column' + columnIndex,
          children: column
        }
      })
      // console.log('sdsdsdsdsdsds', defs)
      return defs
    }

    function getFirstCom(columnIndex = 0) {
      let children = getChildren()
      console.log(children, refs)
      if (Array.isArray(children[columnIndex]?.children)) {
        return children[columnIndex].children[0]
      }
      return null
    }

    function removeChild(data) {
      state.defs.forEach((column, columnIndex) => {
        state.defs[columnIndex] = column.filter(v => {
          return v.itemUUID !== data.itemUUID
        })
      })
      state.doms.forEach((column, columnIndex) => {
        Reflect.deleteProperty(state.doms[columnIndex], data.itemUUID)
      })
      console.log(data, state.doms, state.uuids)
      nextTick(() => {
        // console.log('fromMemo', state, refs)
        lodash.each(state.defs, function (column, columnIndex) {
          genUUIDS(columnIndex)
          rebuildSortAble(columnIndex)
        })
        // refs.forEach(function (ref) {
        //   // console.log(ref)
        //   if (ref && ref.reload) {
        //     ref.reload()
        //   }
        // })
      })
    }

    function append(columnIndex = 0, data) {
      let child = state.doms[columnIndex]
      let def = state.defs[columnIndex]
      let config =  com?.DRAG_CONFIG()?? {}
      if (def.length < props.columnMax) {
        // let instanse = buildInstanse(com, itemUUID, columnIndex)
      }
    }

    /**
     * 存储
     * @returns {{defs: *, column: *, uuids: Array<UnwrapRefSimple<*>>}}
     */
    function toMemo() {
      // console.log(state.doms)
      return {
        defs: toRaw(state.defs),
        // doms: toRaw(state.doms),
        layoutUUID: state.layoutUUID,
        uuids:  toRaw(state.uuids),
        column: toRaw(state.column)
      }
    }


    function fromMemo(item) {

      state.layoutUUID = item.layoutUUID

      state.defs = item.defs.map((column, columnIndex) => {
        return lodash.map(column, function (row) {
          return row
        })
      })

      lodash.each(item.defs, function (column, columnIndex) {
        let child = state.doms[columnIndex]
        lodash.each(column, function (row) {
          // console.log(row)
          let com = CustomVueComponent.resolve(row.com.name)
          child[row.itemUUID] = buildInstanse(com, row.itemUUID, columnIndex)
        })
      })

      nextTick(() => {
        // console.log('fromMemo', state, refs)
        lodash.each(item.defs, function (column, columnIndex) {
          genUUIDS(columnIndex)
          rebuildSortAble(columnIndex)
        })
        refs.forEach(function (ref) {
          // console.log(ref)
          if (ref && ref.reload) {
            ref.reload()
          }
        })
      })
    }

    provide('draginit', {
      onMouseEnter() {
        // console.log(initId)
        let com = document.getElementById(initId)
        if (com) {
          onMouseEnter({
            target: com
          })
        }
      }
    })

    return {
      initId,
      state,
      // layoutUUID,
      onDragEnter,
      toMemo,
      onMouseEnter,
      removeChild,
      fromMemo,
      appendColumn,
      getColumnID,
      getUUIDS,
      onLoaded,
      getChildren,
      getFirstCom,
      onDragLeave,
      initRefs,
      initGrid,
      findCom,
      // getRef
    }
  }
}
</script>

<style scoped>

</style>
