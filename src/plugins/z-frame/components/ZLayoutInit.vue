<template>
<div style="display: flex" >

  <div style="flex: 1" @dragenter="onDragEnter('dom1', $event)">1
    <template v-if="refMan.showed" >
    <render-dom :render="state.dom1"  ></render-dom>
    </template>
  </div>
  <div style="flex: 1"  @dragenter="onDragEnter('dom2', $event)">1
    <template v-if="refMan.showed" >
      <render-dom :render="state.dom2"  ></render-dom>
    </template>
  </div>
</div>
</template>

<script>
import RenderDom from "@/components/renderDom.vue";
import {reactive} from "vue";
import {useReloadMan} from "@/views/home/hooks";
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
        if (child.length < 1) {
          child.push(com)
        } else {
          if (trueDom && trueDom.hasAttribute('data-index')) {
            let movedatasetIndex = trueDom.getAttribute('data-index')
            let index  = parseInt(movedatasetIndex )
            console.log(trueDom, movedatasetIndex)
            if (!Number.isNaN(index)) {
              if (index < 0) {
                child.push(com)
              } else {
                index = index + 1
                child.splice(index, 0, com)
              }
            }
          } else {
            console.log(trueDom)
          }
        }
        setRefMan(true)
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
