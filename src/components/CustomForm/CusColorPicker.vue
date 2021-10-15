<template>
  <template v-if="inited">
    <el-color-picker v-model="state.value"
                    v-bind="widgetConfig"
                    @change="methods.onChange"
    ></el-color-picker>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils";
import {createAbleProp, createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";

export default {
  name: 'CusColorPicker',
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        showAlpha: createAbleProp({
          label: '透明度'
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

