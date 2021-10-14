<template>
  <template v-if="inited">
<!--    {{parsedWidgetConfig}}-->
    <el-select
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
import {createBaseCusEnumsCONFIG} from "@/plugins/z-frame/CusBaseEditor";

export default {
  name: 'CusSelect',
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusEnumsCONFIG(),
        clearable: {
          type: Boolean,
          ui: {
            label: '是否清除',
            widgetConfig:  {
              ext: 'booleanWithClearable'
            },
            notice: '是否可以清除'
          }
        }
      },
      computed: {
          enums_content: `A.getCusInsertContent(MODEL('enums2'))`
      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init, parsedWidgetConfig } = defineCustomRender(props, ctx)
    let state = data()
    init(props)

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      parsedWidgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

