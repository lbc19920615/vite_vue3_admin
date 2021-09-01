<!--<template>-->
<!--  <http-component :defs="defs" :is="step"></http-component>-->
<!--</template>-->

<script lang="jsx">
import {defineComponent, h, inject, provide, ref, resolveComponent, watch} from "vue";

export default defineComponent( {
  name: 'auto-http-com',
  props: {
    // defs: null,
    def: String,
    slotContent: null,
    page: null,
    is: String
  },
  setup(props, ctx) {
    let page = props.page
    let step = ref('')
    let config
    let httpCtx = null

    function load(newDef) {
      config = ZY.JSON5.parse(newDef)
      // console.log(config, typeof config)
      page.setDef(config, function ({done}) {
        // console.log('on fomeerered', config)

        for (let [partName, data] of Object.entries(config.defaultVal)) {
          let defaultObj = ZY.JSON5.parse(ZY.JSON5.stringify(data))
          // console.log(partName, depPath)
          // console.log(self.currentEditDep, depPath, ZY.lodash.get( self.currentEditDep, depPath))
          page.setPartModel( config.name, partName,
              defaultObj
          )
        }
        done()
      })
      step.value = config.name
    }

    watch(() => props.def, (newVal) => {
      // console.log('is change', props.def)
      load(newVal)
    }, {
      immediate: true
    })

    let HttpComponent = resolveComponent('HttpComponent')
    // console.log(HttpComponent)
    return () => {

      let children = props.render ? props.render() : []
      // console.log(children)
      // console.log(config.slots)
      httpCtx = h(HttpComponent, {
        defs: page.defMap,
        is:  step.value,
        slotContent: props.slotContent ? props.slotContent : ctx.slots,
        debug: true,
      })
      return httpCtx
    }
  }
})
</script>
