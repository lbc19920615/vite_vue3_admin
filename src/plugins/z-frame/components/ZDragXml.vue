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
#test2 {
[current-to-move] {
  border-color: #00bb00;
  border-width: 3px;
}
}
</style>

<template>
  <div class="z-drag-xml" >
<!--    {{state}}-->
    <el-row>
      <el-col :span="8" >
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
              ><div
                  class="g-list-group-item__element">{{element.label ? element.label : element.name}}</div></el-col>
            </template>
          </draggable>
        </el-scrollbar>
      </el-col>
      <el-col id="playground"
              style="border: 1px solid #eee;"
              data-index="-1" test-play :span="16"
              @dragover="onDragMove" @mouseover="onMouseMove"

      >
<!--        <z-layout-init :drag-enter="onLayoutDragEnter"></z-layout-init>-->
<!--        <h3>two</h3>-->
<!--        <z-layout-init :len="2" :drag-enter="onLayoutDragEnter"></z-layout-init>-->
<!--        <h3>OTH</h3>-->
        <z-layout-init
            :z-uuid="item.uuid"
            v-for="(item, index) in state.layouts"
            :key="item.uuid"
            :len="2"
            :ref="el => { if (el) state.layoutRefs[el.layoutUUID] = el }"
            @dragenter.prevent="onLayoutSelfDragEnter"
            :drag-enter="onLayoutDragEnter"></z-layout-init>
      </el-col>
    </el-row>
    <div id="test1"></div>
    <div id="test2"></div>
  </div>
</template>

<script>
import {reactive, h, resolveComponent} from "vue";
import {getXmlData} from "@/views/about/components/PlumbLayout/xmlData";
import draggable from 'vuedraggable'
import JsxRender from "@/components/jsxrender.vue";
import {useReloadMan} from "@/views/home/hooks";
import RenderDom from "@/components/renderDom.vue";
import ZLayoutInit from "@/plugins/z-frame/components/ZLayoutInit.vue";
import {DATA_LAYOUT_ITEM_UUID_KEY, DATA_LAYOUT_UUID_KEY} from "@/vars";

export default {
  name: 'ZDragXml',
  components: {
    ZLayoutInit,
    RenderDom,
    JsxRender,
    draggable,
  },
  setup() {
    let [refMan, setRefMan] = useReloadMan({timeout: 30})
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
      layoutRefs: {}
    })

    let domRef = null
    function getRef(v) {
      domRef = v
    }

    function fromPoint(x, y) {
      return document.elementFromPoint(x, y)
    }

    // state.list = getXmlData().filter(v => {
    //   return v.name.startsWith('el-')
    // })

    let app = getApp()
    state.list = [
      ...app.get_custom_components().map(v => {
        return {
          name: v.value,
          label: v.label
        }
      }),
      {
        name: 'el-card'
      },
      {
        name: 'el-alert'
      }
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




    let containers = new Map()
    let currentDragEnterContext = null

    function onDropEnd(e) {
      let playground = document.getElementById('playground')
      state.isDragging = false
      originalEvent = e.originalEvent
      // console.log('onDropEnd', originalEvent)

      let dataset = e?.item?.dataset ?? {}
      currentToTarget = fromPoint(originalEvent.pageX, originalEvent.pageY)

      if (!currentToTarget) {
        return;
      }

      if (playground.isEqualNode(currentToTarget)) {
        // console.log('playground')
        state.layouts.push({
          uuid: ZY.rid()
        })
        return;
      }

      if (currentToTarget.hasAttribute('z-uuid')) {
        let uuid = currentToTarget.getAttribute('z-uuid')
        let index = Array.of(...playground.children).findIndex(v => {
          return v.getAttribute('z-uuid') === uuid
        })
        let newUUID = ZY.rid()
        console.log(uuid, index, newUUID)
        if (index > -1) {
          let newIndex = index + 1
          state.layouts.splice(newIndex, 0, {
            uuid: newUUID
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

    function clearTool(id = 'test1') {
      return function (clone) {
        let tool = document.getElementById(id)
        tool.innerHTML = ''
        if (clone) {
          tool.appendChild(clone)
        }
      }
    }

    let test1Tool = clearTool()
    let test2Tool = clearTool('test2')

    function createInspect(trueDom, type) {
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
        button.addEventListener('click', function () {
          // console.log(state.layoutRefs)
          let trueDom_uuid = app.findUUIDfromClassList(trueDom)
          let layout_uuid = app.findUUIDfromClassList(trueDom, DATA_LAYOUT_UUID_KEY)
          let layout_item_uuid = app.findUUIDfromClassList(trueDom, DATA_LAYOUT_ITEM_UUID_KEY)
          // console.log(layout_uuid, trueDom_uuid)
          let context = state.layoutRefs[layout_uuid]
          if (context) {
            context.findCom(trueDom_uuid, layout_item_uuid)
          }
        })
        clone.appendChild(button)
      }
      clone.setAttribute('current-to-move', type)
      return clone
    }

    function inspcetDom(e, type = 'line', {
      actionFun = test1Tool, findDom = getNestRenderDom
    } = {}) {
      let playground = document.getElementById('playground')
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
      inspcetDom(e,'rect')
      inspcetDom(e,'rect', {
        actionFun: test2Tool,
        findDom: getLayoutRenderDom
      })
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
      // if (e.domRef && e.domRef.$el)  {
      //   console.log(e.domRef.$el)
      //   let clone = createInspect(e.domRef.$el, 'rect')
      //   test2Tool(clone)
      // }
    }

    function onLayoutSelfDragEnter(e) {
      // console.log(e.target)
    }

    return {
      list1ItemCls,
      state,
      getRef,
      onDropStart,
      refMan,
      onDragMove,
      onLayoutSelfDragEnter,
      onLayoutDragEnter,
      onDropEnd,
      onMouseMove
    }
  }
}
</script>
