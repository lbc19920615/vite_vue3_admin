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
    page: null
  },
  setup(props, ctx) {
    let page = props.page
    // console.log('porps', props.def)
    // console.log('parsed', parsed)
    let step = ref('')
    let httpCtx = null

    function load() {
      let config = ZY.JSON5.parse(props.def)
      page.setDef(config, function ({done}) {
        console.log('on fomeerered')
        done()
      })
      step.value = config.name
    }

    load()

    // console.log(page.allDef)

    // return {
    //   defs: page.allDef,
    //   step,
    // }

    let HttpComponent = resolveComponent('HttpComponent')
    // console.log(HttpComponent)
    return () => {
      httpCtx = h(HttpComponent, {
        defs: page.allDef,
        is:  step.value
      })
      return httpCtx
    }
  }
})
</script>
