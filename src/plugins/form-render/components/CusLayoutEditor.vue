<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    <el-row type="flex">
      <el-button @click="getXML">获取xml</el-button>
    </el-row>
    <ZLayoutEditor
        :ref="setLayoutRef"
        :controls="false"
        store-prefix="layouts"
        @save-layout="onSaveLayout"></ZLayoutEditor>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import ZLayoutEditor from "@/plugins/z-frame/components/ZLayoutEditor.vue";

export default {
  name: 'CusLayoutEditor',
  components: {ZLayoutEditor},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let { data, methods, listeners, init } = defineCustomRender(props, ctx)
    let state = data()
    init(props)

    let layoutRef = null
    function setLayoutRef(target, options) {
      layoutRef = target
    }

    function onSaveLayout(e) {

    }

    function getXML() {
      let v = layoutRef.getXML()
      console.log('getXML', v)
    }

    return {
      state,
      getXML,
      onSaveLayout,
      setLayoutRef,
      widgetConfig: props.ui.widgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

