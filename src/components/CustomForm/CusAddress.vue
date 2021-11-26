<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    <!--{{state}}-->
    <z-address
        v-model="state.value"
        v-bind="state.OPT.widgetConfig"
        v-on="listeners"
    ></z-address>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import ZAddress from "@/plugins/z-frame/components/ZAddress.vue";

export default {
  name: 'CusAddress',
  components: {ZAddress},
  mixins: [
    CustomRenderControlMixin
  ],
  CUS_TITLE: '地址',
  CUS_EDITOR: function () {
    return {
      props: {

      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init, initDefaultVal } = defineCustomRender(props, ctx, {
      handleValueInit(v) {
        return v
      }
    })
    let state = data({
    })
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

