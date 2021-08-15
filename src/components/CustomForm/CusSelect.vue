<template>
  <template v-if="inited">
    <el-select v-model="state.value"
               v-bind="widgetConfig"
               @change="onChange"
    >
      <el-option v-for="(option, key) in curFormCon.dxEval(widgetConfig.enums)"
                 :label="option.label" :value="option.value"
      ></el-option>
    </el-select>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "../../plugins/form-render/utils";

export default {
  name: 'CusSelect',
  mixins: [
      CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let { data, methods } = defineCustomRender(props, ctx)
    let state = data()

    function onChange(v) {
      methods.callComManager('cus_select:change', v)
      methods.onChange(v)
    }

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      methods,
      onChange
    }
  },
}
</script>

