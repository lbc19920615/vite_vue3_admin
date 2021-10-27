<template>
<div style="display: flex" >

  <div style="flex: 1" @dragenter="onDragEnter('dom1', $event)">1
    <render-dom :render="state.dom1"  ></render-dom>
  </div>
  <div style="flex: 1"  @dragenter="onDragEnter('dom2', $event)">1
<!--    <template v-if="refMan.showed" >-->
      <render-dom :render="state.dom2"  ></render-dom>
<!--    </template>-->
  </div>
</div>
</template>

<script>
import RenderDom from "@/components/renderDom.vue";
import {h, reactive} from "vue";
import {useReloadMan} from "@/views/home/hooks";

const DATA_UUID_KEY = 'data-uuid'

export default {
  name: "ZLayoutInit",
  components: {RenderDom},
  props: {
    dragEnter: null
  },
  setup(props, ctx) {
    let [refMan, setRefMan] = useReloadMan({timeout: 30})
    let state = reactive({
      dom1: [],
      dom2: []
    })
    function buildAppend(type) {
      return function append(com, trueDom) {
        let child = state[type]
        let instanse =   h(com, {
          class: 'render-dom-item',
          [DATA_UUID_KEY]: ZY.rid()
        }, Date.now())
        if (child.length < 1) {
          child.push(instanse)
        } else {
          if (trueDom && trueDom.hasAttribute(DATA_UUID_KEY)) {
            let parentChild = Array.of(...trueDom.parentElement.children)
            let uuid =  trueDom.getAttribute(DATA_UUID_KEY)
            let index  =  parentChild.findIndex(v => {
              return v.getAttribute(DATA_UUID_KEY) === uuid
            })
            if (!Number.isNaN(index)) {
              if (index < 0) {
                child.push(instanse)
              } else {
                index = index + 1
                child.splice(index, 0, instanse)
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
      if (props.dragEnter) {
        props.dragEnter({
          append: buildAppend(type)
        })
      }
    }
    return {
      state,
      onDragEnter,
      refMan
    }
  }
}
</script>

<style scoped>

</style>
