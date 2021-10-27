<style>
.z-drag-layout__item {
  min-height: 10px;
  flex: 1;
}
</style>

<template>
<el-row class="z-drag-layout" layout-dom="layout-dom">
  <template v-for="(item, index) in len">
    <el-col class="z-drag-layout__item" @dragenter.prevent="onDragEnter(index, $event)">
      <render-dom :render="state.doms[index]"  ></render-dom>
    </el-col>
  </template>
</el-row>
</template>

<script>
import RenderDom from "@/components/renderDom.vue";
import {h, reactive} from "vue";
import {useReloadMan} from "@/views/home/hooks";

const DATA_UUID_KEY = 'data-uuid___'

export default {
  name: "ZLayoutInit",
  components: {RenderDom},
  props: {
    dragEnter: null,
    len: {
      type: Number,
      default: 1
    }
  },
  setup(props, ctx) {
    let [refMan, setRefMan] = useReloadMan({timeout: 30})
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
      ]
    })

    function findUUIDfromClassList(trueDom) {
      let uuid_cls =  Array.of(...trueDom.classList).find(v => {
        return v.startsWith(DATA_UUID_KEY)
      })
      let uuid = null
      if (uuid_cls) {
        uuid = uuid_cls.replace(DATA_UUID_KEY, '')
      }
      return uuid
    }

    function buildAppend(type) {
      return function append(com, trueDom) {
        let child = state.doms[type]
        let instanse =   h(com, {
          class: [
            'render-dom-item',
            DATA_UUID_KEY + ZY.rid()
          ],
          // [DATA_UUID_KEY]: ZY.rid()
        }, Date.now())
        if (child.length < 1) {
          child.push(instanse)
        } else {
          // console.log(trueDom.hasAttribute(DATA_UUID_KEY))
          if (trueDom) {
            let parentChild = Array.of(...trueDom.parentElement.children)
            let trueDom_uuid = findUUIDfromClassList(trueDom)
            console.log(trueDom_uuid)
            let index  =  parentChild.findIndex(ele => {
              let uuid = findUUIDfromClassList(ele)
              return uuid === trueDom_uuid
            })
            console.log(index)
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
