<template>
  <template v-if="inited">
<!--    {{widgetConfig}}-->
    <el-select
        clearable
        v-model="state.value"
        v-on="listeners"
        v-bind="widgetConfig"
    >
      <el-option v-for="(option, key) in dxValueTemplate(widgetConfig.enums)"
                 :label="option.label" :value="option.value"
      ></el-option>
    </el-select>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender, PROPS_DEF} from "@/plugins/form-render/utils/index";

export default {
  name: 'CusSelect',
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
        },
        clearable: {
          type: Boolean,
          ui: {
            widgetConfig:  {
              ext: 'booleanWithClearable'
            },
            notice: '是否可以清除'
          }
        }
      }
    }
  },
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

