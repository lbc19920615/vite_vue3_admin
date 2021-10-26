<style lang="scss">

</style>

<template>
  <template v-if="inited">
<!--    {{state}}-->
    <template v-if="state.control">
      <section  class="a-space-mb-10">
        <ZAttrs
            style="flex: 1"
            :value="state.control.styles"
            @form:input:blur="onBlur"
            @props-change="onStylesChange"
        ></ZAttrs>
      </section>
    </template>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import ZProps from "@/plugins/z-frame/components/ZProps.vue";
import ZStyles from "@/plugins/z-frame/components/ZStyles.vue";
import {onMounted, watch} from "vue";
import ZAttrs from "@/plugins/z-frame/components/ZAttrs.vue";

export default {
  name: 'CusAttr',
  components: {ZAttrs, ZStyles, ZProps, EwSuggest},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {

    let widgetConfig = props?.ui?.widgetConfig ?? {}
    let obj;
    let JSON5 = ZY.JSON5;
    let { data, methods, listeners, init, widgetConfig2 } = defineCustomRender(props, ctx, {
      handleValueInit(newVal, from) {
        // console.log(from)
        console.log('CusAttr', newVal, typeof  newVal)
        if (newVal) {
          try {
            obj = JSON5.parse(newVal)
            state.control = obj
          } catch (e) {
            //
          }
        } else {
          state.control.styles = []
        }
        return {}
      }
    })
    let state = data({
      value: {},
      control: {},
    })

    function onChange() {
      let clonedValue = JSON5.parse(JSON5.stringify(state.value))
      let str =JSON5.stringify(clonedValue)
      methods.on_change(str)
    }


    function onStylesChange(e) {
      // console.log('onStylesChange', e)
      // state.control.styles = e
      state.value.styles = ZY.JSON5.parse(ZY.JSON5.stringify(e))
      //
      onChange()
    }

    let styleInitData = null
    function onStylesInited({initData}) {
      styleInitData = initData
    }

    function save() {
      onChange()
    }

    function onBlur() {
      onChange()
    }

    onMounted(() => {
      if (widgetConfig.mounted) {
        init(props)
      }
    })

    return {
      state,
      widgetConfig,
      onChange,
      methods,
      onStylesInited,
      onStylesChange,
      onBlur,
      save,
      listeners,
    }
  },
}
</script>

