<template>
  <template v-if="inited">
<!--    {{widgetConfig.enums}}-->
    <el-radio-group
        v-model="state.value"
        v-bind="widgetConfig"
        v-on="listeners"
    >
      <el-radio v-for="(option, key) in dxValueTemplate(widgetConfig.enums)"
                :label="option.value"
      ><span v-html="option.label"></span></el-radio>
    </el-radio-group>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender, PROPS_DEF} from "@/plugins/form-render/utils/index";
import {createBaseCusCONFIG, createBaseCusEnumsCONFIG} from "@/plugins/z-frame/CusBaseEditor";

export default {
  name: 'CusRadio',
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        ...createBaseCusEnumsCONFIG(),
        clearable: {
          type: Boolean,
          ui: {
            label: '是否清除',
            widgetConfig:  {
              ext: 'booleanWithClearable'
            },
            notice: '是否可以清除'
          },
          rules: {
            type: 'any'
          }
        }
      },
      computed: {
        enums_content: `A.getCusInsertContent(MODEL('enums2'))`
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

