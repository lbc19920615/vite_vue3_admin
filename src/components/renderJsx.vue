<script lang="jsx">
import {defineComponent,  nextTick, reactive, watch} from "vue";

export default defineComponent( {
  name: 'RenderJsx',
  emits: [
  ],
  props: {
    render: null
  },
  setup(props, ctx) {
    console.log(props.render)
    return () => {
      return props.render
    }
  }
})
</script>
