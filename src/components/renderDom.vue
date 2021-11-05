<script lang="jsx">
import {defineComponent, getCurrentInstance, Fragment, nextTick, reactive, watch} from "vue";

// class ChildDom {
//   constructor() {
//     this.children = []
//   }
//   push(type) {
//     this.children.push(
//         h(type, {
//           class: 'render-dom-item',
//           ['data-index']: this.children.length
//         }, Date.now())
//     )
//   }
//   getChild() {
//     return this.children
//   }
//
// }


export default defineComponent( {
  name: 'RenderDom',
  emits: [
    'loaded'
  ],
  props: {
    // defs: null,
    // attrs: {
    //   type: Object,
    //   default() {
    //     return {}
    //   }
    // },
    // name: {
    //   type: String,
    //   default: "default"
    // },
    // binds:{
    //   type: Object,
    //   default() {
    //     return {}
    //   }
    // },
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
      child: []
    })

    // console.log(props.render)

    function reload(newVal, cb) {
      // console.log('props change', newVal.map(v => v.props.class), state.child.map(v => v.props.class))
      state.child = newVal
      nextTick(() => {
        if (cb) {
          cb()
        }
      })
    }

    function load() {
      let ret = []
      let arr = ZY.JSON5.parse(props.uuids.str)
      let uuids = arr.map(v => {
        return v
      })
      let render = props.render
      uuids.map(uuid => {
        ret.push(render[uuid])
      })
      // console.log(render, uuids)
      state.child = ret
    }

    watch(props.uuids, (newVal) => {
      console.log('props change', newVal)
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

    return () => {
      return state.child
    }
  }
})
</script>
