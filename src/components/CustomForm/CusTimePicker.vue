<template>
  <template v-if="inited">
    <el-time-picker v-model="state.value"
                    v-bind="widgetConfig"
                    @change="methods.onChange"
    ></el-time-picker>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils";
import {createAbleProp, createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";

export default {
  name: 'CusTimePicker',
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_TITLE: '时间',
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        format: {
          type: String,
          ui: {
            label: '格式化'
          }
        },
        clearable: createAbleProp({
          label: '清除'
        }),
        editable: createAbleProp({
          label: '输入'
        }),
      }
    }
  },
  setup(props, ctx) {
    let { data, methods } = defineCustomRender(props, ctx)
    let state = data()
    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      methods
    }
  },
}
</script>

