<template>
  {{state.inited + ''}}
  <template v-if="state.inited">
    <template v-for="item in state.child" :key="item.uuid">
      <render-jsx :render="item.data"></render-jsx>
    </template>
  </template>
</template>

<script>
import {defineComponent,  nextTick, reactive, watch} from "vue";
import RenderJsx from "@/components/renderJsx.vue";

export default defineComponent( {
  name: 'RenderDom',
  components: {RenderJsx},
  emits: [
    'loaded'
  ],
  props: {
    uuids: {
      type: Array,
      default() {
        return []
      }
    },
    render: null
  },
  setup(props, ctx) {
    // let instanse = getCurrentInstance()
    // let root = new ChildDom()
    let state = reactive({
      child: [],
      oldUUIDS: [],
      inited: true
    })

    function reload() {
      state.inited = false
      load()
      setTimeout( () => {
        state.inited = true
      }, 150)
    }


    function load() {
      // let obj = []
      let ret = []
      let arr = ZY.JSON5.parse(props.uuids.str)
      let uuids = arr.map(v => {
        return v
      })

      // let diffed = ZY.diff(state.oldUUIDS, uuids)
      // console.log(diffed)

      let render = props.render
      uuids.map(uuid => {
        ret.push({
          uuid: uuid,
          data: render[uuid]
        })
        // obj.push(render[uuid].props.class)
      })
      // console.log(ret)
      state.child = ret
    }


    // watch(() => props.render, (newVal) => {
    //   console.log('render', newVal)
    // }, {
    //   immediate: true
    // })

    watch(props.uuids, (newVal) => {
      // console.log('props change', newVal)
      // root.children =  []
      // props.render.forEach((renderItem) => {
      //   // console.log(renderItem)
      //   root.push( renderItem)
      // })
      // root.push( newVal)
      // root.children = newVal
      // state.child = newVal
      load()
      nextTick(() => {
        ctx.emit('loaded', {
          reload
        })
      })
    })

    return {
      state,
      reload,
      load,
    }
  }
})
</script>
