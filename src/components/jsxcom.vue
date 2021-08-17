<script lang="jsx">
import { defineComponent, h } from "vue";

export default defineComponent( {
  name: 'jsx-com',
  props: {
    childs: null
  },
  setup(props) {
    console.log('props', props)
    return () => {
      return h('div', {}, props.childs)
    }
  }
})
</script>
