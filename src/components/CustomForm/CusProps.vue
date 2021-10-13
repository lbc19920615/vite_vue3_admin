<template>
  <template v-if="inited">
<!--        {{state}}-->
    <DeepPropEditor
        :modal="false"
        v-model:posMap="state.posMap"
        v-model:deps="state.deps"
        v-model:links="state.links"
    @change="onChange"
    ></DeepPropEditor>
  </template>

</template>

<script>
import {toRaw} from 'vue'
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import DeepPropEditor from "@/views/about/components/DeepPropEditor.vue";

export default {
  name: 'CusProps',
  components: {DeepPropEditor},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let {part_key} = props.defs
    let JSON5 = ZY.JSON5

    let obj = {}
    let { data, methods, listeners, init } = defineCustomRender(props, ctx, {
      handleValueInit
    })
    let state = data({
      deps: [],
      links: [],
      posMap: {}
    })
    init(props)

    function handleValueInit(newVal) {
      if (!newVal) {
        newVal = '{links: [], deps: [], posMap: {}}'
      }
      if (newVal) {
        obj = JSON5.parse(newVal)
        // console.log('newVal handleValueInit', typeof newVal)
        state.deps = obj.deps
        state.links = obj.links
        state.posMap = obj.posMap
      }
      // console.log('handleValueInit', part_key, obj)
      return newVal
    }

    function onChange() {
      let value = JSON5.stringify({
        posMap: toRaw(state.posMap),
        deps: toRaw(state.deps),
        links: toRaw(state.links),
      })
      state.value = value
      methods.on_change(value)
    }

    return {
      onChange,
      state,
      widgetConfig: props.ui.widgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

