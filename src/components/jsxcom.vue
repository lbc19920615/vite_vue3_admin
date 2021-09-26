<script lang="jsx">
import {defineComponent, h, inject, provide} from "vue";
import { createRefManager } from "@/hooks/ref";

export default defineComponent( {
  name: 'SlotCom',
  props: {
    defs: null,
    attrs: {
      type: Object,
      default() {
        return {}
      }
    },
    name: {
      type: String,
      default: "default"
    },
    binds:{
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props, ctx) {
    // let curFormCon = inject('curFormCon')
    // provide('curFormCon', curFormCon)
    let RefsManager = createRefManager({
      eventHandler({type, e}) {
        // console.log(type, e)
        // if (type.startsWith('self:')) {
        //   if (type === 'self:created') {
        //     // if (ZY.lodash.isFunction(e)) {
        //     //   e(props.attrs)
        //     // }
        //   }
        // } else {
        //   ctx.emit('fires', {type, e})
        // }
        ctx.emit('fires', {type, e})
        // console.log('slot-com', type, e)
      }
    })
    RefsManager.attrs = props.attrs
    provide('slotComRefManager', RefsManager)
    let slotContents = []
    if (props.defs && ZY.lodash.isFunction(props.defs[props.name])) {
      // console.log('sdsdsds', props.binds)
      slotContents = props.defs[props.name](props.binds)
    }
    // console.log(props.name, slotContents)
    return () => {
      // return h('div', {}, slotContents)
      return slotContents
    }
  }
})
</script>
