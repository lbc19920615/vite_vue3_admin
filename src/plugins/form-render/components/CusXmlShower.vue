<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    <el-input type="textarea" :value="prettyStr(state.value)" readonly></el-input>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import jsBeautify from 'js-beautify'

export default {
  name: 'CusXmlShower',
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let { data, methods, listeners, init } = defineCustomRender(props, ctx)
    let state = data()
    init(props)

    function prettyStr(v) {
      return jsBeautify.html(v)
    }

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      methods,
      listeners,
      prettyStr,
    }
  },
}
</script>

