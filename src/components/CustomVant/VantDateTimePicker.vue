<template>

  <el-button @click="state.drawer = true"
             type="primary" style="margin-left: 16px;">
    点我打开
  </el-button>

  <van-popup
      v-model:show="state.drawer"
      round
      position="bottom"
  >

    <van-datetime-picker
        v-model="state.value"
        v-bind="widgetConfig.picker"

        @confirm="onConfirm"
        @cancel="onCancel"
    />
  </van-popup>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "../../plugins/form-render/utils";

export default {
  name: 'VantDateTimePicker',
  mixins: [
      CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let { data, methods } = defineCustomRender(props, ctx)
    let state = data({
      drawer: false
    })


    function onConfirm() {
      // console.log('state.value', state.value)
      methods.onChange(state.value)
      state.drawer = false
    }

    function onCancel() {
      state.drawer = false
    }

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      methods,
      onConfirm,
      onCancel
    }
  },
}
</script>

