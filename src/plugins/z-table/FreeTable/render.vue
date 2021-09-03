<script>
import {h} from 'vue';
export default {
  name: 'FreeRender',
  // functional: true,
  props: {
    scope: Object,
    render: Function
  },
  // render: (h, ctx) => {
  //   console.log(ctx.props)
  //   return ctx.props.render ? ctx.props.render(h, ctx.props.scope) : ''
  // }
  setup(props) {
    return () => {
      // return h('div', {}, slotContents)
      return props.render(h, props)
    }
  }
}
</script>
