<template>
  <template v-if="inited">
<!--    {{widgetConfig.enums}}-->
<!--{{state.value}}-->
   <z-style-editor :value="state.value" @val:change="onChange" :ref="mainRef"></z-style-editor>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import ZStyleEditor from "@/plugins/z-frame/components/ZStyleEditor.vue";

export default {
  name: 'CusStyleEditor',
  components: {ZStyleEditor},
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_TITLE: '分数',
  CUS_EDITOR: function () {
    return {
      props: {

      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init, widgetConfig2, buildGetRef, getRef } = defineCustomRender(props, ctx, {
      handleValueInit(v, from) {
        // console.log(v)
        return v
      }
    })
    let state = data({
    })
    init(props)
    let mainRef = buildGetRef('main')

    function onChange(e) {
      // console.log('onChange', e)
      methods.on_change(e)
    }

    return {
      state,
      widgetConfig: widgetConfig2,
      mainRef,
      onChange,
      methods,
      listeners,
    }
  },
}
</script>

