<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    <!--{{state}}-->
    <el-switch
        v-model="state.value"
        v-bind="state.OPT.widgetConfig"
        v-on="listeners"
    ></el-switch>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender, PROPS_DEF} from "@/plugins/form-render/utils/index";

export default {
  name: 'CusSwitch',
  mixins: [
    CustomRenderControlMixin
  ],
  CUS_TITLE: '选择',
  CUS_EDITOR: function () {
    return {
      props: {
        activeText: {
          type: 'string',
          ui: {
            label: '激活text'
          }
        },
        inactiveText: {
          type: 'string',
          ui: {
            label: '不激活text'
          }
        },
        activeValue: {
          type: 'string',
          ui: {
            label: '激活值'
          }
        },
        inactiveValue: {
          type: 'string',
          ui: {
            label: '不激活值'
          }
        },
        enums: {
          type: 'string',
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

