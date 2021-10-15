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
import {createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";

export default {
  name: 'CusTimePicker',
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

