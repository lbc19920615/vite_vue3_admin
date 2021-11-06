<style lang="scss">
test-com {
  display: block;
  border: 1px solid;
  /*background-color: #00bb00;*/
  /*width: 50px;*/
  height: 50px;
}
[current-to-move] {
   /*background-color: #0d84ff;*/
  border: 1px dashed #0d84ff;
  /*border-bottom: 2px solid;*/
  /*border-bottom-color: #0d84ff;*/
  pointer-events: none;
  position: relative;
  > button {
    position: absolute;
    //transform: translate(-100%);
    left: 0;
    top: 0;
    pointer-events: all;
    font-size: 12px;
  }
}
[current-to-move=line] {
  border-top: none;
}
.debug-tool2 {
  [current-to-move] {
    border-color: #00bb00;
    border-width: 1px;
  }
}
</style>

<template>
  <div class="z-drag-xml" >
<!--    {{state}}-->
    <el-row>
      <el-col :span="8" >
        <div>tree</div>
        <el-scrollbar height="60vh">
          <draggable
              class="dragArea g-list-group"
              v-model="state.list"
              @start="onDropStart"
              @end="onDropEnd"
              :group="{ name: 'people', pull: 'clone', put: false }"
              :sort="false"
              item-key="id"
              tag="el-row"
              style="align-items: flex-start; flex-wrap: wrap;"
          >
            <template #item="{element}">
              <el-col class="g-list-group-item"
                      :class="list1ItemCls(element)"
                      :span="12"
                      :data-name="element.name"
                      :data-column-max="element.columnMax"
              ><div
                  class="g-list-group-item__element" v-html="element.label"></div></el-col>
            </template>
          </draggable>
        </el-scrollbar>
      </el-col>
      <el-col :id="playgroundId"
              style="border: 1px solid #eee;"
              data-index="-1" test-play :span="10"
              @dragover="onDragMove" @mouseover="onMouseMove"

      >
        <z-layout-init
            :z-uuid="item.uuid"
            :uuid="item.uuid"
            v-for="(item, index) in state.layouts"
            :key="item.uuid"
            :column="1"
            :ref="initRef(item)"
            :column-max="item.columnMax"
            @dragenter.prevent="onLayoutSelfDragEnter"
            :drag-enter="onLayoutDragEnter"
            @clear-index="onClearIndex"
            @column-max-err="onClearIndex"
        ></z-layout-init>
      </el-col>
      <el-col :span="6">
        sdsdsds
      </el-col>
    </el-row>
    <div class="debug-tool1" :id="testId1"></div>
    <div class="debug-tool2" :id="testId2"></div>
  </div>
</template>

<script>
import {reactive, h, resolveComponent, nextTick} from "vue";
import {getXmlData} from "@/views/about/components/PlumbLayout/xmlData";
import draggable from 'vuedraggable'
import JsxRender from "@/components/jsxrender.vue";
import {useReloadMan} from "@/views/home/hooks";
import RenderDom from "@/components/renderDom.vue";
import ZLayoutInit from "@/plugins/z-frame/components/ZLayoutInit.vue";
import {DATA_LAYOUT_ITEM_UUID_KEY, DATA_LAYOUT_UUID_KEY, DATA_UUID_KEY} from "@/vars";
import Sortable from 'sortablejs';



export default {
  name: 'ZDragXml',
  components: {
    ZLayoutInit,
    RenderDom,
    JsxRender,
    draggable,
  },
  setup() {
    const Z_UUID_KEY = 'z-uuid'
    const PLAY_ID = 'playground__' + ZY.rid(6)
    const TEST1_ID = 'test1__' + ZY.rid(6)
    const TEST2_ID = 'test2__' + ZY.rid(6)
    let JSON5 = ZY.JSON5
    let originalEvent = {
    }
    let currentToTarget = null
    let currentToMove = null
    let state = reactive({
      list: [],
      filterList: '',
      isDragging: false,
      disableDrag: false,
      tree: [],
      renderDom: [],
      layouts: [],
      layoutsMap: {},
      layoutRefs: {},
      uuids: []
    })

    let domRef = null
    function getRef(v) {
      domRef = v
    }

    function fromPoint(x, y) {
      return document.elementFromPoint(x, y)
    }


    function clearTool(id = TEST1_ID) {
      return function (clone) {
        let tool = document.getElementById(id)
        tool.innerHTML = ''
        if (clone) {
          tool.appendChild(clone)
        }
      }
    }

    let test1Tool = clearTool()
    let test2Tool = clearTool(TEST2_ID)

    let app = getApp()
    state.list = [
      ...app.get_custom_components(
          function ([comName, comDef]) {
            return comDef.ZDragXmlCom
          }
      ).map(v => {
        // console.log(v)
        let extDataset = {}
        if (v.origin && v.origin.DRAG_DATASET) {
          extDataset = v.origin.DRAG_DATASET()
        }
        let label = v.label ?? ''
        if (v.origin && v.origin.DRAG_LABEL_XML) {
          label = v.origin.DRAG_LABEL_XML()
        }
        let ret = {
          name: v.value,
          label: label,
          ...extDataset
        }
        // console.log(ret)
        return ret
      }),
      // {
      //   name: 'el-card'
      // },
      // {
      //   name: 'el-alert'
      // }
    ]

    function list1ItemCls(element) {
      let filted = !element.name.includes(state.filterList)
      return {
        ['list-group-item--hidden']: filted
      }
    }

    function onDropStart(e) {
      state.isDragging = true
      state.disableDrag = true
    }

    let currentDragEnterContext = null
    function initLayoutRefs(item) {
      // console.log(uuid, state.layoutsMap)
      let context = state.layoutsMap[item.uuid]
      if (context && context.el) {
        let com = CustomVueComponent.resolve(item.dataset.name)
        context.el.initGrid(com)
      }
    }

    /**
     * 创建layout item
     */
    function createLayoutItem(dataset) {
      let uuid = ZY.rid()
      let columnMax = parseFloat(dataset.columnMax)
      if (!Number.isNaN(columnMax)) {
        dataset.columnMax = columnMax
      }
      let item = {
        uuid,
        columnMax,
        dataset,
      }
      // console.log('createLayoutItem', columnMax,item)
      return item
    }

    function buildUUIDS() {
      let el = getPlaygroundDOM()
      if (el) {
        let zs = Array.of(...el.children)
        let uuids = zs.map(dom => {
          return dom.getAttribute(Z_UUID_KEY)
        })
        // console.log(uuids)
        state.uuids = uuids
        return uuids
      }
      return []
    }

    function rebuildSortable() {
      let el = getPlaygroundDOM()
      let sortable = new Sortable(el, {
        group: "drag-level1",
        onEnd: function (/**Event*/evt) {
          test1Tool()
          test2Tool()
          let uuids = buildUUIDS()
          // console.log(uuids, state.layouts)

          let dlayouts = JSON5.parse(JSON5.stringify( state.layouts))

          let layouts = []
          uuids.forEach(uuid => {
            let index = dlayouts.findIndex(layout => {
              return layout.uuid === uuid
            })
            if (index > -1) {
              layouts.push(dlayouts[index])
            }
            // console.log(uuid, index)
          })
          state.layouts = layouts
          // console.log(layouts.map(v => v.uuid))
        }
      })
    }

    function getPlaygroundDOM() {
      return  document.getElementById(PLAY_ID)
    }

    function onDropEndItemsChanged(item) {
      test2Tool()
      initLayoutRefs(item)
      rebuildSortable()
      buildUUIDS()
    }

    function onDropEnd(e) {
      let playground = getPlaygroundDOM()
      state.isDragging = false
      originalEvent = e.originalEvent
      // console.log('onDropEnd', originalEvent)

      let dataset = e?.item?.dataset ?? {}
      currentToTarget = fromPoint(originalEvent.pageX, originalEvent.pageY)

      if (!currentToTarget) {
        return;
      }

      if (playground.isEqualNode(currentToTarget)) {
        let item = createLayoutItem(dataset)
        state.layouts.push(item)
        nextTick(() => {
          onDropEndItemsChanged(item)
        })
        return;
      }


      if (currentToTarget.hasAttribute(Z_UUID_KEY)) {
        let uuid = currentToTarget.getAttribute(Z_UUID_KEY)
        // let index = Array.of(...playground.children).findIndex(v => {
        //   return v.getAttribute(Z_UUID_KEY) === uuid
        // })

        let index = state.uuids.findIndex((v) => v === uuid)
        // console.log(index, uuid)
        // let newUUID = ZY.rid()
        let item = createLayoutItem(dataset)
        // console.log(uuid, index, newUUID)
        if (index > -1) {
          let newIndex = index + 1
          state.layouts.splice(newIndex, 0, item)
          nextTick(() => {
            onDropEndItemsChanged(item)
          })
        }
        return;
      }

      let trueDom = null
      if (playground.contains(currentToTarget)) {
        trueDom = getNestRenderDom(currentToTarget)
      }

      let com = CustomVueComponent.resolve(dataset.name)

      if (currentDragEnterContext) {
        currentDragEnterContext.append(com, trueDom)
      }


    }

    function getNestRenderDom(dom) {
      if (dom.classList.contains('render-dom-item')) {
        return dom
      }
      if (dom.parentElement) {
        return getNestRenderDom(dom.parentElement)
      }
      return null
    }

    function getLayoutRenderDom(dom) {
      if (dom.hasAttribute('layout-dom')) {
        return dom
      }
      // if (dom.parentElement) {
      //   return getNestRenderDom(dom.parentElement)
      // }
      return null
    }


    function createInspect(trueDom, type) {
      function handleButtonClick() {
        // console.log(trueDom)
        if (trueDom.hasAttribute('z-layout-uuid')) {
          let layout_uuid = trueDom.getAttribute('z-layout-uuid')
          let context = state.layoutRefs[layout_uuid]
          // console.log(layout_uuid, context)
          if (context) {
          }
        }
        else {
          let trueDom_uuid = app.findUUIDfromClassList(trueDom)
          let layout_uuid = app.findUUIDfromClassList(trueDom, DATA_LAYOUT_UUID_KEY)
          let layout_item_uuid = app.findUUIDfromClassList(trueDom, DATA_LAYOUT_ITEM_UUID_KEY)
          // console.log(layout_uuid, trueDom_uuid)
          let context = state.layoutRefs[layout_uuid]
          if (context) {
            context.findCom(trueDom_uuid, layout_item_uuid)
          }
        }
      }

      let clone = document.createElement('div')
      let computedStyle = getComputedStyle(trueDom)
      // console.log(computedStyle.marginBottom)
      let marginBottom = parseFloat(computedStyle.marginBottom)
      let marginTop = parseFloat(computedStyle.marginTop)
      let client = trueDom.getBoundingClientRect()
      // console.log(clone, client)
      clone.setAttribute('data-type', type)
      clone.style.position = 'fixed'
      clone.style.left = client.left + 'px'
      // clone.style.top = (client.top - marginBottom) + 'px'
      clone.style.width = client.width + 'px'
      if (type === 'line') {
        clone.style.top = ( client.top + client.height + marginBottom) + 'px'
        clone.style.height = 1 + 'px'
      }
      else if (type === 'rect') {
        clone.style.top = (client.top - marginBottom) + 'px'
        clone.style.height = (client.height + marginTop + marginBottom + 1) + 'px'

        let button = document.createElement('button')
        button.textContent = '编辑'
        button.addEventListener('click', handleButtonClick)
        clone.appendChild(button)
      }
      clone.setAttribute('current-to-move', type)
      return clone
    }

    function inspcetDom(e, type = 'line', {
      actionFun = test1Tool, findDom = getNestRenderDom
    } = {}) {
      let playground = getPlaygroundDOM()
      currentToMove = fromPoint(e.pageX, e.pageY)
      let trueDom = null
      if (currentToMove && playground.contains(currentToMove)) {
        trueDom = findDom(currentToMove)
      }
      if (trueDom) {
        let clone = createInspect(trueDom, type)
        actionFun(clone)
      }  else {
        actionFun()
      }
    }

    function onMouseMove(e) {
      // inspcetDom(e,'rect')
      // inspcetDom(e,'rect', {
      //   actionFun: test2Tool,
      //   findDom: getLayoutRenderDom
      // })
      // clearTool()
    }

    function onDragMove(e) {
      // console.log('onDragMove', e.pageX)
      inspcetDom(e)
      inspcetDom(e,'line', {
        actionFun: test2Tool,
        findDom: getLayoutRenderDom
      })
    }

    function onLayoutDragEnter(e) {
      // console.log('onLayoutDragEnter', e)
      currentDragEnterContext  = e
    }

    function onLayoutSelfDragEnter(e) {
      // console.log(e.target)
    }

    function initRef(item) {
      // console.log('item', item)
      return function (el) {
        if (el) {
          state.layoutsMap[item.uuid] = {
            el
          }
          state.layoutRefs[el.layoutUUID] = el
        }
      }
    }

    function onClearIndex() {
      test1Tool()
    }

    return {
      list1ItemCls,
      state,
      getRef,
      playgroundId: PLAY_ID,
      onDropStart,
      initRef,
      onDragMove,
      onLayoutSelfDragEnter,
      onLayoutDragEnter,
      onClearIndex,
      testId1: TEST1_ID,
      testId2: TEST2_ID,
      onDropEnd,
      onMouseMove
    }
  }
}
</script>
