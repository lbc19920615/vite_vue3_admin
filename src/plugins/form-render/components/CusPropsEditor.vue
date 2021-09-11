<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.value}}-->
    <ZProps v-model:value="state.value" :valueConfig="widgetConfig.valueConfig" @change="onChange"></ZProps>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import ZProps from "@/plugins/z-frame/components/ZProps.vue";

export default {
  name: 'CusPropsEditor',
  components: {ZProps},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let { data, methods, listeners, init } = defineCustomRender(props, ctx)
    let state = data({
      value: []
    })
    init(props)

    function onChange() {
      methods.on_change(state.value)
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

