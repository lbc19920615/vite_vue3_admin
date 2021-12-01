<template>
  <template v-if="state.inited">
    <!--    {{widgetConfig.enums}}-->
    <el-input type="textarea" :value="prettyStr(state.value)" readonly></el-input>
  </template>

</template>

<script>
// import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import jsBeautify from 'js-beautify'
import {onMounted, reactive, watch} from "vue";

export default {
  name: 'EwXmlShower',
  mixins: [
  ],
  props: {
    value: String
  },
  setup(props, ctx) {
    let state = reactive({
      value: props.value ?? '',
      inited: false,
    })

    function prettyStr(v) {
      return jsBeautify.html(v)
    }

    onMounted(() => {
      state.inited = true
    })

    watch(() => props.value, (newVal) => {
      // console.log('sdsds', newVal)
      state.value = newVal ?? ''
    })

    return {
      state,
      prettyStr,
    }
  },
}
</script>

