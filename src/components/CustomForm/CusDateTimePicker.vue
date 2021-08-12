<template>
  <el-date-picker v-model="state.value"
                  v-bind="widgetConfig"
                  @change="methods.onChange"
  ></el-date-picker>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "../../plugins/form-render/utils";

export default {
  name: 'CusDateTimePicker',
  mixins: [
      CustomRenderControlMixin
  ],
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

