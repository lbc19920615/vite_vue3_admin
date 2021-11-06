<style lang="scss">

//test-com {
//  display: block;
//  border: 1px solid;
//  /*background-color: #00bb00;*/
//  /*width: 50px;*/
//  height: 50px;
//}
[z-drag-start] {
  border-bottom: 1px dashed transparent;
  //&:hover {
  //  border-bottom-color: #0d84ff;
  //}
}
.form-first-item {
  height: 3px;
  padding: 1px;
  border: none;
  //pointer-events: none;
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
        <xy-tab>
          <xy-tab-content label="组件">
            <el-scrollbar height="30vh">
            <draggable
                class="dragArea g-list-group"
                v-model="state.components"
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
          </xy-tab-content>
          <xy-tab-content label="结构">
            <el-scrollbar height="30vh">
              <el-tree default-expand-all
                       :data="treeState.data" :props="treeState.defaultProps" @node-click="handleNodeClick" />
            </el-scrollbar>
          </xy-tab-content>
        </xy-tab>
      </el-col>
      <el-col :id="playgroundId"
              style="border: 1px solid #eee;"
              data-index="-1" test-play :span="10"
              @dragover="onDragMove" @mouseover="onMouseMove"

      >
        <div style="height: 5px" z-drag-start>&nbsp;</div>
<!--        <z-layout-init-->
<!--            :z-uuid="121111111111"-->
<!--            :uuid="121111111111"-->
<!--            :column="1"-->
<!--            :column-max="1"-->
<!--            @dragenter.prevent="onLayoutSelfDragEnter"-->
<!--            :drag-enter="onLayoutDragEnter"-->
<!--        ></z-layout-init>-->
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
            @changed="onChangedLayout(item, $event)"
            @drag-end="onDragEnd(item, $event)"
            :style="item.style"
            :class="item.class"
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
import {computed, nextTick, onMounted, reactive} from "vue";
import draggable from 'vuedraggable'
import JsxRender from "@/components/jsxrender.vue";
import RenderDom from "@/components/renderDom.vue";
import ZLayoutInit from "@/plugins/z-frame/components/ZLayoutInit.vue";
import {DATA_LAYOUT_ITEM_UUID_KEY, DATA_LAYOUT_UUID_KEY} from "@/vars";
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
      components: [],
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

    let treeState = reactive({
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      }
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

    /**
     * 初始化拖拽组件
     * @type {{name, label: string}[]}
     */
    state.components = [
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
        // console.log(ret)
        return {
          name: v.value,
          label: label,
          ...extDataset
        }
      }),
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
      let com = CustomVueComponent.resolve(dataset.name)
      let uuid = ZY.rid()
      let columnMax = parseFloat(dataset.columnMax)
      if (!Number.isNaN(columnMax)) {
        dataset.columnMax = columnMax
      }
      let item = {
        uuid,
        columnMax,
        comName: dataset.name,
        dataset,
        com,
      }
      // console.log('createLayoutItem', columnMax,item)
      return item
    }

    function appendLayout(dataset, {style = '', className = {}} = {}) {
      let item = createLayoutItem(dataset)
      item.style = style
      item.class = className
      state.layouts.push(item)
    }


    /**
     *
     * @returns {*[]|*[]}
     */
    function buildUUIDS() {
      let el = getPlaygroundDOM()
      if (el) {
        let zs = Array.of(...el.children)
        if (zs.length > 1) {
          let df = zs.slice(1)
          let uuids = df.filter(v => {
            return true
          }).map(dom => {
            return dom.getAttribute(Z_UUID_KEY)
          })
          // console.log(uuids)
          state.uuids = uuids
          return uuids
        }
        return []
      }
      return []
    }

    function reloadLayoutsSort() {
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
      console.log(uuids, state.layouts)
    }

    let sortable;
    /**
     *
     */
    function rebuildSortable() {
      let el = getPlaygroundDOM()
      sortable = new Sortable(el, {
        group: "drag-level1",
        onEnd: function (/**Event*/evt) {
          test1Tool()
          test2Tool()
          reloadLayoutsSort()

          nextTick(() => {
            treeState.data = buildTree()
          })
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

      // console.log(currentToTarget)
      if (!currentToTarget) {
        return;
      }

      /**
       * 获取组件定义
       * @type {*}
       */
      let com = CustomVueComponent.resolve(dataset.name)
      let item = createLayoutItem(dataset)

      if (currentToTarget.hasAttribute('z-drag-start')) {
        state.layouts.unshift(item);
        nextTick(() => {
          onDropEndItemsChanged(item)
        })
        return;
      }

      if (playground.isEqualNode(currentToTarget)) {
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

    /**
     * 创建观察
     * @param trueDom
     * @param type
     * @returns {HTMLElement | HTMLDivElement | any}
     */
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

    /**
     * 观察DOM
     * @param e
     * @param type
     * @param actionFun
     * @param findDom
     */
    function inspcetDom(e, type = 'line', {
      actionFun = test1Tool, findDom = getNestRenderDom
    } = {}) {
      let playground = getPlaygroundDOM()
      currentToMove = fromPoint(e.pageX, e.pageY)
      let trueDom = null
      if (currentToMove && playground.contains(currentToMove)) {
        trueDom = findDom(currentToMove)
      }
      if (currentToMove.hasAttribute('z-drag-start')) {
        trueDom = currentToMove
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

    function buildTreeChild(child = []) {
      return child.map(item => {
        item.label = item.com.name
        return item
      })
    }

    function buildTree() {
      if (Array.isArray(state.layouts)) {
        // console.log(state.layouts)
        return state.layouts.map(layout => {
          // console.log(layout, state.layoutsMap)
          let ret = {
            label: 'item',
            children: []
          }
          let context =state.layoutsMap[layout.uuid]?.el
          if (context) {
            // console.log(context)
            let columns = context.getChildren()
            // console.log(columns)

            if (columns.length  > 0) {
              let child = columns.map(function (column) {
                let child = column.children
                let res = []
                if (Array.isArray(child) && child.length > 0) {
                  let first = child[0]
                  // console.log(child)
                  if (first && first.com && first.com.DRAG_SUB_FORM) {
                    let arr = buildTreeChild(child.slice(1))
                    res =  {
                      ...first,
                      label: first.com.name,
                      children: arr
                    }
                  } else {
                    res = buildTreeChild(child)
                  }
                }
                column.children = res
                // console.log('res', res)
                return column
              })
              ret = {
                label: 'row',
                children: child
              }
              if (child.length === 1) {
                // 单个组件
                if (Array.isArray(child[0].children)) {
                  ret = child[0].children[0]
                } else {
                  ret = child[0].children
                }
              } else {
                // console.log(child)
              }
            }

          }
          return ret
        })
      }  else {
        return []
      }
    }


    function onChangedLayout() {
      treeState.data = buildTree()
    }

    /**
     * 当子表单内部拖动结束后
     */
    function onDragEnd() {
      treeState.data = buildTree()
    }

    function handleNodeClick(e) {
      console.log('handleNodeClick', e)
    }

    onMounted(() => {
      // appendLayout({
      //   name: 'ZDragFormStart'
      // }, {
      //   style: {
      //     // height: 0
      //   },
      //   className: {
      //     'form-first-item': true
      //   }
      // })
    })

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
      onChangedLayout,
      onDragEnd,
      onClearIndex,
      testId1: TEST1_ID,
      testId2: TEST2_ID,
      onDropEnd,
      onMouseMove,
      treeState,
      handleNodeClick,
    }
  }
}
</script>
