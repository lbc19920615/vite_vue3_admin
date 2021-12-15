<template>
  <template v-if="inited">
<!--    {{state}}-->
    <template v-if="state.control">
      <section  class="a-space-mb-10">
        <ZStyles
            style="flex: 1"
            @inited="onStylesInited"
            :value="state.control.styles" @form:input:blur="onBlur"
            @props-change="onStylesChange"></ZStyles>
      </section>
    </template>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index.js";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import ZStyles from "@/plugins/z-frame/components/ZStyles.vue";
import {onMounted, watch} from "vue";

export default {
  name: 'CusStyle',
  components: {ZStyles, EwSuggest},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {

    let widgetConfig = props?.ui?.widgetConfig ?? {}
    let obj;
    let JSON5 = ZY.JSON5;
    let needInited = false
    let { data, methods, listeners, init } = defineCustomRender(props, ctx, {
      handleValueInit(newVal, from) {
        // console.log(from)
        console.log('CusStyle', newVal, typeof  newVal)
        if (newVal) {
          try {
            obj = JSON5.parse(newVal)
            state.control = obj
          } catch (e) {
            //
          }
        } else {
          state.control.styles = []
          // console.log('sdsdsds')
        }
        if (styleInitData) {
          // styleInitData(state.control.styles)
        } else {
          // needInited = true
        }
        return {}
      }
    })
    let state = data({
      value: {},
      control: {},
      chushi: false
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

    watch(() => props.modelValue, (newVal) => {

    }, {
      // immediate: true
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

