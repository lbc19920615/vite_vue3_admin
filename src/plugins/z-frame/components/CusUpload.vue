<template>
  <template v-if="inited">
<!--    {{widgetConfig.enums}}-->
    <z-upload></z-upload>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";

export default {
  name: 'CusUpload',
  components: {},
  mixins: [
      CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let { data, methods, listeners, init } = defineCustomRender(props, ctx)
    let state = data()
    init(props)

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

