<style>
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
}
[current-to-move=line] {
  border-top: none;
}
[test-play] * {
  /*border: 20px solid blue*/
  /*margin-top: 20px;*/
  /*margin-bottom: 20px;*/
}
</style>

<template>
  <div class="z-drag-xml" >
<!--    {{state}}-->
    <el-row>
      <el-col :span="8" >
        <div draggable="true" >draggable</div>
        <el-scrollbar height="60vh">
          <draggable
              class="dragArea g-list-group"
              v-model="state.list"
              @start="onDropStart"
              @end="onDropEnd"
              :move="onDragMove"
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
              @dragover="onDragMove" @mouseover="onMouseMove" >
        <z-layout-init :drag-enter="onLayoutDragEnter"></z-layout-init>
        <h3>two</h3>
        <z-layout-init :len="2" :drag-enter="onLayoutDragEnter"></z-layout-init>
      </el-col>
    </el-row>
    <div id="test"></div>
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
      renderDom: []
    })

    let domRef = null
    function getRef(v) {
      domRef = v
    }

    function fromPoint(x, y) {
      return document.elementFromPoint(x, y)
    }

    state.list = getXmlData().filter(v => {
      return v.name.startsWith('el-')
    })

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

      let trueDom = null
      if (currentToTarget && playground.contains(currentToTarget)) {
        trueDom = getNestRenderDom(currentToTarget)
      }


      // console.log(currentToTarget, trueDom)

      let root = containers.get('root')
      let com = CustomVueComponent.resolve(dataset.name)

      if (currentDragEnterContext) {
        currentDragEnterContext.append(com, trueDom)
      }

      //
      // if (root.children.length < 1) {
      //   root.children.push(com)
      // } else {
      //   if (trueDom && trueDom.hasAttribute('data-index')) {
      //     let movedatasetIndex = trueDom.getAttribute('data-index')
      //     let index  = parseInt(movedatasetIndex )
      //     console.log(trueDom, movedatasetIndex)
      //     if (!Number.isNaN(index)) {
      //       if (index < 0) {
      //         root.children.push(com)
      //       } else {
      //         index = index + 1
      //         root.children.splice(index, 0, com)
      //       }
      //     }
      //   } else {
      //     console.log(trueDom)
      //   }
      // }
      //
      //
      // state.renderDom = root.getChild()
      // setRefMan(true)
      // let test = document.getElementById('test')
      // test.innerHTML = ''
      // console.log(domRef)
      // domRef.reload(root.getChild())
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

    function clearTool(clone) {
      let test = document.getElementById('test')
      test.innerHTML = ''
      if (clone) {
        test.appendChild(clone)
      }
    }

    function inspcetDom(e, type = 'line') {
      let playground = document.getElementById('playground')
      currentToMove = fromPoint(e.pageX, e.pageY)
      let trueDom = null
      if (currentToMove && playground.contains(currentToMove)) {
        trueDom = getNestRenderDom(currentToMove)
      }
      if (trueDom) {
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
        }
        clone.setAttribute('current-to-move', type)
        clearTool(clone)
      }  else {
        clearTool()
      }
    }

    function onMouseMove(e) {
      inspcetDom(e,'rect')
      // clearTool()
    }

    function onDragMove(e) {
      // console.log('onDragMove', e.pageX)
      inspcetDom(e)
    }

    function onLayoutDragEnter(e) {
      // console.log('onLayoutDragEnter', e)
      currentDragEnterContext  = e
    }


    return {
      list1ItemCls,
      state,
      getRef,
      onDropStart,
      refMan,
      onDragMove,
      onLayoutDragEnter,
      onDropEnd,
      onMouseMove
    }
  }
}
</script>
