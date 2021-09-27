<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    <!--{{state}}-->
    <el-slider
        v-model="state.value"
        v-bind="widgetConfig"
        v-on="listeners"
    ></el-slider>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender, PROPS_DEF} from "@/plugins/form-render/utils/index";

export default {
  name: 'CusSlider',
  mixins: [
    CustomRenderControlMixin
  ],
  CUS_EDITOR: function () {
    return {
      props: {
        enums: {
          type: String,
          ui: {
            label: '枚举',
            notice: '枚举可以使用的方法 [sdsd](sdsds)'
          }
        }
      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init } = defineCustomRender(props, ctx, {
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

