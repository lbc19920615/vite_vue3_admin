<style lang="scss">
.z-drag-layout {
  border: 1px solid;
  padding: 10px;
}
.z-drag-layout__item {
  min-height: 10px;
  flex: 1;
  border: 1px solid #eee;
  &[dragenter] {
    border-color: #0d84ff;
  }
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

<el-row class="z-drag-layout" :z-layout-uuid="layoutUUID"  layout-dom="layout-dom">
  <template v-for="(item, index) in state.column">
<!--   <div> {{state.uuids[index]}}</div>-->
    <el-col class="z-drag-layout__item"
            @dragleave="onDragLeave"
            @dragenter.prevent="onDragEnter(index, $event)"
            :id="getColumnID(index)"
    >
      <render-dom :render="state.doms[index]" @loaded="onLoaded(index, $event)" ></render-dom>
    </el-col>
  </template>
</el-row>
<!--<el-button @click="appendColumn">appendColumn</el-button>-->
</template>

<script>
import RenderDom from "@/components/renderDom.vue";
import draggable from 'vuedraggable'
import {computed, h, nextTick, reactive} from "vue";
import {DATA_UUID_KEY, DATA_LAYOUT_UUID_KEY, DATA_LAYOUT_ITEM_UUID_KEY} from "@/vars";
import Sortable from 'sortablejs';

export default {
  name: "ZLayoutInit",
  components: {RenderDom, draggable,},
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
    }
  },
  setup(props, ctx) {
    const RENDER_DOM_CLS = 'render-dom-item'
    const DRAGENTER_ATTR = 'dragenter'
    console.log(props.columnMax)

    function initData() {
      let ret = []
      for (let i = 0; i < props.columnLen; i++) {
        ret.push([])
      }
      return ret
    }

    let app = getApp()
    let layoutUUID = ZY.rid()
    let state = reactive({
      doms: initData(),
      defs: initData(),
      uuids: initData(),
      column: props.column,
      items: [
      ]
    })

    function getColumnID(index = 0) {
      return 'zdrag'
    }

    function buildItems()  {
      state.items= state.doms[0].map((v, index) => {
        return {
          index: index,
          id: ZY.rid()
        }
      })
    }

    function buildUUIDS(columnIndex = 0) {
      // console.log('buildUUIDS', columnIndex)
      let el = document.getElementById(getColumnID(columnIndex))
      let zs = Array.of(...el.children)
      let uuids = zs.map(dom => {
        let layout_item_uuid = app.findUUIDfromClassList(dom, DATA_UUID_KEY)
        return layout_item_uuid
      })
      state.uuids[columnIndex] = uuids
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
        // console.log(trueDom)
        let child = state.doms[columnIndex]
        let def = state.defs[columnIndex]
        if (def.length < props.columnMax) {
          let itemUUID =  ZY.rid()
          let instanse = h(com, {
            class: [
              RENDER_DOM_CLS,
              DATA_LAYOUT_UUID_KEY + layoutUUID,
              DATA_LAYOUT_ITEM_UUID_KEY + columnIndex,
              DATA_UUID_KEY + itemUUID,
            ],
          }, Date.now())
          let cachedDef = {
            layoutUUID,
            attrs: {
              // test: 1,
            },
            itemUUID,
            instanse,
          }
          if (child.length < 1) {
            child.push(instanse)
            def.push(cachedDef)
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
              // console.log(index)
              if (!Number.isNaN(index)) {
                if (index < 0) {
                  child.push(instanse)
                  def.push(cachedDef)
                } else {
                  index = index + 1
                  child.splice(index, 0, instanse)
                  def.splice(index, 0, cachedDef)
                }
              }

            } else {
              console.log(trueDom)
            }
          }
          // setRefMan(true)
          nextTick(() => {
            buildItems()
            buildUUIDS(columnIndex)
          })
        } else {
          console.warn('超出限制', props.columnMax)
          ctx.emit('column-max-err')
        }
      }
    }

    function onDragEnter(columnIndex, e) {
      // console.log('onDragEnter', e)
      e.target.setAttribute(DRAGENTER_ATTR, 1)
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
      let com = state.doms[layout_item_uuid]
      let dom = state.defs[layout_item_uuid]
      if (dom) {
        let index = dom.findIndex(v => {
          return v.itemUUID === uuid
        })
        if (index > -1) {
          let def = dom[index]
          console.log(def, index)
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

    function onLoaded(columnIndex) {
      let el = document.getElementById(getColumnID(columnIndex))
      var sortable = new Sortable(el, {
        onEnd: function (/**Event*/evt) {
          // let el = document.getElementById(getColumnID())
          // let zs = Array.of(... el.children)
          // let uuids = zs.map(dom => {
          //   let layout_item_uuid = app.findUUIDfromClassList(dom, DATA_UUID_KEY)
          //   return layout_item_uuid
          // })
          // state.uuids[columnIndex] = uuids
          buildUUIDS()
          // console.log('evt', el, uuids)
        }
      })
      clearDragIndex(el)
      // console.log(sortable, el)
    }

    return {
      state,
      layoutUUID,
      onDragEnter,
      appendColumn,
      getColumnID,
      onLoaded,
      onDragLeave,
      initGrid,
      findCom,
      // getRef
    }
  }
}
</script>

<style scoped>

</style>
