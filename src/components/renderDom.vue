<script lang="jsx">
import {defineComponent, h} from "vue";

class ChildDom {
  constructor() {
    this.children = []
  }
  push(type) {

    this.children.push(
        h(type, {
          class: 'render-dom-item',
          ['data-index']: this.children.length
        }, Date.now())
    )
  }
  getChild() {
    return this.children
  }

}

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
    let root = new ChildDom()

    // console.log(props.render)
    props.render.forEach((renderItem) => {
      // console.log(renderItem)
      root.push( renderItem)
    })


    return () => {
      return root.children
    }
  }
})
</script>
