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
  pointer-events: none;
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
      <el-col :span="6">
        <div draggable="true" >draggable</div>
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
      </el-col>
      <el-col test-play :span="18" @dragover="onDragMove" @mousemove="onMouseMove" >
        <template v-if="refMan.showed" >
          <render-dom :render="state.renderDom"  ></render-dom>
        </template>
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

class ChildDom {
  constructor() {
    this.children = []
  }
  push(v) {

    this.children.push(
      v
    )
  }
  getChild() {
    return this.children
  }

}

export default {
  name: 'ZDragXml',
  components: {
    RenderDom,
    JsxRender,
    draggable,
  },
  setup() {
    let [refMan, setRefMan] = useReloadMan({timeout: 500})
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

    state.list = getXmlData()

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
    containers.set('root', new ChildDom())

    function onDropEnd(e) {
      state.isDragging = false
      originalEvent = e.originalEvent
      // console.log('onDropEnd', e.item.dataset)
      let dataset = e?.item?.dataset ?? {}
      currentToTarget = fromPoint(originalEvent.pageX, originalEvent.pageY)
      if (currentToTarget) {
        // console.log(currentToTarget, currentToTarget.innerHTML)
        // child.push(
        //     element
        // )
        // currentToTarget.innerHTML = 'currentToTarget'
        // currentToTarget.innerHTML = `<test-com></test-com>`  + currentToTarget.innerHTML

        // let html = ZY.createEle({
        //   name: dataset.name
        //
        // })

        // currentToTarget.insertAdjacentHTML('afterbegin', html)
        // currentToTarget.append(html)
        // console.log(renderDom)
        let root = containers.get('root')
        let com = CustomVueComponent.resolve(dataset.name)
        console.log(currentToMove)
        let movedataset = currentToMove.dataset
        let index  = parseInt(movedataset.index )
        console.log(movedataset, index)
        if (!Number.isNaN(index)) {
          index = index + 1
          root.children.splice(index, 0, com)
        } else {
          root.children.push(com)
        }

        state.renderDom = root.getChild()
        setRefMan(true)

      }
    }

    function inspcetDom(e) {
      currentToMove = fromPoint(e.pageX, e.pageY)
      if (currentToMove && currentToMove.classList.contains('render-dom-item')) {
        // let clone = currentToMove.cloneNode(true)
        // clone.innerHTML = ''
        let dataset = currentToMove.dataset
        // console.log(dataset)
        let clone = document.createElement('div')
        let client = currentToMove.getBoundingClientRect()
        // console.log(clone, client)
        clone.style.position = 'fixed'
        clone.style.left = client.left + 'px'
        clone.style.top = ( client.top + client.height) + 'px'
        clone.style.width = client.width + 'px'
        clone.style.height = 1 + 'px'
        clone.setAttribute('current-to-move', 1)
        // Array.of(
        //     ...document.querySelectorAll('[currentToMove]')
        // ).forEach(item => {
        //   item.removeAttribute('currentToMove')
        // })
        // currentToMove.setAttribute('currentToMove', 1)
        // console.log(clone, domRef)
        let test = document.getElementById('test')
        test.innerHTML = ''
        test.appendChild(clone)
      }
    }

    function onMouseMove(e) {
      inspcetDom(e)
    }

    function onDragMove(e) {
      // console.log('onDragMove', e.pageX)
      inspcetDom(e)
    }


    function renderDom() {
      return state.renderDom
    }

    return {
      list1ItemCls,
      state,
      getRef,
      onDropStart,
      refMan,
      onDragMove,
      renderDom,
      onDropEnd,
      onMouseMove
    }
  }
}
</script>
