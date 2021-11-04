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
<el-row class="z-drag-layout" :z-layout-uuid="layoutUUID" :ref="getRef" layout-dom="layout-dom">
  <template v-for="(item, index) in state.len">
    <el-col class="z-drag-layout__item"
            @dragleave="onDragLeave"
            @dragenter.prevent="onDragEnter(index, $event)">
      <render-dom :render="state.doms[index]"  ></render-dom>
    </el-col>
  </template>
</el-row>
<!--<el-button @click="appendColumn">appendColumn</el-button>-->
</template>

<script>
import RenderDom from "@/components/renderDom.vue";
import {h, reactive} from "vue";
import {DATA_UUID_KEY, DATA_LAYOUT_UUID_KEY, DATA_LAYOUT_ITEM_UUID_KEY} from "@/vars";

export default {
  name: "ZLayoutInit",
  components: {RenderDom},
  props: {
    dragEnter: null,
    len: {
      type: Number,
      default: 1
    },
  },
  setup(props, ctx) {
    let app = getApp()
    let layoutUUID = ZY.rid()
    let state = reactive({
      doms: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ],
      defs: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ],
      len: props.len
    })

    let domRef = null
    function getRef(v) {
      domRef = v
    }

    /**
     *
     * @param type {number}
     * @returns {(function(*=, *=): void)|*}
     */
    function buildAppend(type) {
      return function append(com, trueDom) {
        // console.log(trueDom)
        let child = state.doms[type]
        let def = state.defs[type]
        let itemUUID =  ZY.rid()
        let instanse = h(com, {
          class: [
            'render-dom-item',
            DATA_LAYOUT_UUID_KEY + layoutUUID,
            DATA_LAYOUT_ITEM_UUID_KEY + type,
            DATA_UUID_KEY + itemUUID,
          ],
        }, Date.now())
        let cachedDef = {
          layoutUUID,
          attrs: {
            test: 1,
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
      }
    }

    function onDragEnter(type, e) {
      // console.log('onDragEnter', e)
      e.target.setAttribute('dragenter', 1)
      if (props.dragEnter) {
        props.dragEnter({
          append: buildAppend(type),
          index: type,
          domRef
        })
      }
    }

    function initGrid(com) {
      console.log('initGrid',com)
      let append = buildAppend(0)
      append(com)
    }

    function onDragLeave(e) {
      e.target.removeAttribute('dragenter')
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
      state.len = state.len + 1
    }

    return {
      state,
      layoutUUID,
      onDragEnter,
      appendColumn,
      onDragLeave,
      initGrid,
      findCom,
      getRef
    }
  }
}
</script>

<style scoped>

</style>
