<template>
  <template v-if="inited">
<!--    {{widgetConfig.enums}}-->
    <el-cascader
        v-model="state.value"
        v-bind="state.OPT.widgetConfig"
        v-on="listeners"
        :options="buildOptions()"
    ></el-cascader>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {createAbleProp, createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";
import {QuickNumber} from "@/hooks/props";
import ZCascader from "@/plugins/z-frame/components/ZCascader.vue";

export default {
  name: 'CusCascader',
  components: {ZCascader},
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_TITLE: '上传',
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        options2: {
          type: 'string',
           ui: {
             widget: 'CodeJsEditor',
           }
        }
      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init, widgetConfig2, buildOptions } = defineCustomRender(props, ctx)
    let state = data()
    init(props)

    return {
      state,
      buildOptions,
      widgetConfig: widgetConfig2,
      methods,
      listeners,
    }
  },
}
</script>

