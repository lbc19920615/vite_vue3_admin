<!--<template>-->
<!--  <http-component :defs="defs" :is="step"></http-component>-->
<!--</template>-->

<script lang="jsx">
import {defineComponent, h, inject, provide, ref, resolveComponent, watch} from "vue";
import {createFormModel} from "@/hooks/form";

export default defineComponent( {
  name: 'auto-http-com',
  props: {
    // defs: null,
    def: String,
    slotContent: null,
    page: null,
    is: String,
    debug: Boolean
  },
  setup(props, ctx) {
    let page = props.page
    let step = ref('')
    let config
    let httpCtx = null
    let oldIs = undefined
    let partConfig = {}
    let fromDefModel

    function load(newDef) {
      let JSON5 = ZY.JSON5;
      config = JSON5.parse(newDef);

      // console.log(config, typeof config)
      page.setDef(config, function ({done}) {
        // console.log('autohttp com load', config)

        for (let [partName, data] of Object.entries(config.defaultVal)) {
          let defaultObj = JSON5.parse(JSON5.stringify(data))
          partConfig = config.init.def.parts.find(v => v.name === partName)
          if (partConfig.def) {
            fromDefModel = createFormModel(partConfig.def)
          }
          defaultObj = Object.assign(defaultObj, fromDefModel)
          // console.log('autohttp', config, partName, partConfig, fromDefModel)
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
      // console.log('auto http com', newVal)
      if (typeof oldIs === 'undefined') {

        load(newVal)
        oldIs = props.is
      }
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
        debug: props.debug,
      })
      return httpCtx
    }
  }
})
</script>
