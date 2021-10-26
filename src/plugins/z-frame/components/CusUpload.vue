<template>
  <template v-if="inited">
<!--    {{widgetConfig.enums}}-->
    <z-upload></z-upload>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";

export default {
  name: 'CusUpload',
  components: {},
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init, widgetConfig2 } = defineCustomRender(props, ctx)
    let state = data()
    init(props)

    return {
      state,
      widgetConfig: widgetConfig2,
      methods,
      listeners,
    }
  },
}
</script>

