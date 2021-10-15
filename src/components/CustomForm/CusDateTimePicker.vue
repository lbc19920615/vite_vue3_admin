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
import {createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";

export default {
  name: 'CusDateTimePicker',
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG()
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

