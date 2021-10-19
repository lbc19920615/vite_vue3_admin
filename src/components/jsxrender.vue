<script lang="jsx">
import {defineComponent, provide} from "vue";

export default defineComponent( {
  name: 'JsxRender',
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
    // console.log(props.name, slotContents)
    return () => {
      // return h('div', {}, slotContents)
      // return props.render()
      if (props.render) {
        return props.render
      }
    }
  }
})
</script>
