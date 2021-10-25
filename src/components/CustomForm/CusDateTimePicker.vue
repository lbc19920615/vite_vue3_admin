<template>
  <template v-if="inited">
    <el-date-picker v-model="state.value"
                    type="datetime"
                    v-bind="widgetConfig"
                    @change="methods.onChange"
    ></el-date-picker>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils";
import {createAbleProp, createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";

export default {
  name: 'CusDateTimePicker',
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_TITLE: '时间选择',
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        type: {
          type: String,
          ui: {
            label: '类型',
            widget: 'CusSuggest',
            widgetConfig: {
              suggest: [
                {
                  label: '年',
                  value: 'year'
                },
                {
                  label: '月',
                  value: 'month'
                },
                {
                  label: '周',
                  value: 'week'
                }
              ]
            }
          }
        },
        format: {
          type: String,
          ui: {
            label: '格式化'
          }
        },
        clearable: createAbleProp({
          label: '清除'
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

