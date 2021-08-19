<template>
  <template v-if="inited">
    <el-select v-model="state.value"
               v-bind="widgetConfig"
               v-on="listeners"
    >
      <el-option v-for="(option, key) in dxValueTemplate(widgetConfig.enums)"
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
    let { data, methods, listeners } = defineCustomRender(props, ctx)
    let state = data()

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

