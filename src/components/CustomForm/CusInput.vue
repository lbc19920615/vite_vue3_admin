<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    <!--{{state}}-->
    <el-input
        v-model="state.value"
        v-bind="widgetConfig"
        v-on="listeners"
    ></el-input>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";

export default {
  name: 'CusInput',
  mixins: [
    CustomRenderControlMixin
  ],
  CUS_EDITOR: function () {
    return {
      props: {
        clearable: {
          type: Boolean,
          ui: {
            label: '是否清除',
            widgetConfig:  {
              ext: 'booleanWithClearable'
            },
            notice: '是否可以清除'
          }
        },
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

    let widgetConfig = props?.ui?.widgetConfig ?? {}

    return {
      state,
      widgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

