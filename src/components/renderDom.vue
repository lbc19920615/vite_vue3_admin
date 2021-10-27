<script lang="jsx">
import {defineComponent, h, reactive, watch} from "vue";

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
    render: null
  },
  setup(props, ctx) {
    // let root = new ChildDom()
    let state = reactive({
      child: []
    })

    // console.log(props.render)


    watch(props.render, (newVal) => {
      // console.log('props change', newVal)
      // root.children =  []
      // props.render.forEach((renderItem) => {
      //   // console.log(renderItem)
      //   root.push( renderItem)
      // })
      // root.push( newVal)
      // root.children = newVal
      state.child = newVal
    })

    return () => {
      return state.child
    }
  }
})
</script>
