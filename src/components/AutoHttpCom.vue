<!--<template>-->
<!--  <http-component :defs="defs" :is="step"></http-component>-->
<!--</template>-->

<script lang="jsx">
import {defineComponent, h, inject, provide, ref, resolveComponent} from "vue";

export default defineComponent( {
  name: 'auto-http-com',
  props: {
    // defs: null,
    def: String,
    slotContent: null,
    page: null,
  },
  setup(props, ctx) {
    let page = props.page
    // console.log('props', props.render)
    let step = ref('')
    let config
    let httpCtx = null

    function load() {
      config = ZY.JSON5.parse(props.def)
      // config = props.def
      page.setDef(config, function ({done}) {
        // console.log('on fomeerered')
        done()
      })
      step.value = config.name
    }

    load()


    let HttpComponent = resolveComponent('HttpComponent')
    // console.log(HttpComponent)
    return () => {

      let children = props.render ? props.render() : []
      // console.log(children)
      // console.log(config.slots)
      httpCtx = h(HttpComponent, {
        defs: page.allDef,
        is:  step.value,
        slotContent: props.slotContent ? props.slotContent : ctx.slots
      })
      return httpCtx
    }
  }
})
</script>
