<script lang="jsx">
import {defineComponent, h, inject, provide} from "vue";
import { createRefManager } from "@/hooks/ref";

export default defineComponent( {
  name: 'slot-com',
  props: {
    defs: null,
    name: {
      type: String,
      default: "default"
    }
  },
  setup(props, ctx) {
    // let curFormCon = inject('curFormCon')
    // provide('curFormCon', curFormCon)
    let RefsManager = createRefManager({
      eventHandler({type, e}) {
        // console.log('slot-com', type, e)
        ctx.emit('fires', {type, e})
      }
    })
    provide('slotComRefManager', RefsManager)
    let slotContents = []
    if (props.defs && ZY.lodash.isFunction(props.defs[props.name])) {
      slotContents = props.defs[props.name]()
    }
    // console.log(slotContents)
    return () => {
      return h('div', {}, slotContents)
    }
  }
})
</script>
