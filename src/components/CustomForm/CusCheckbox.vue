<template>
  <template v-if="inited">
<!--    {{widgetConfig.enums}}-->
<!--{{state}}-->
    <el-checkbox-group v-model="state.value"
                       v-bind="widgetConfig"
                       v-on="listeners"
    >
      <el-checkbox v-for="(option, key) in dxValueTemplate(widgetConfig.enums)"
                 :label="option.value"
      ></el-checkbox>
    </el-checkbox-group>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";

export default {
  name: 'CusCheckbox',
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
        if (!Array.isArray(v)) {
          return []
        }
        return v
      }
    })
    let state = data({
      value: []
    })
    init(props)
    let widgetConfig = props.ui.widgetConfig

    return {
      state,
      widgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

