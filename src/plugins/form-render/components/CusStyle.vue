<style lang="scss">
//.cus-ui__class-props {
//  .z-props__name {
//    display: none;
//  }
//}
//.cus-ui__label {
//  width: 80px;
//  font-weight: bold;
//  font-size: 18px;
//}
</style>

<template>
  <template v-if="inited">
<!--    {{state}}-->

    <template v-if="state.control">
      <section  class="a-space-mb-10" v-if="state.control.styles">
        <div class="cus-style__label">样式
          <el-divider></el-divider>
        </div>
        <ZStyles
            style="flex: 1"
            :value="state.control.styles" @form:input:blur="onBlur"
            @props-change="onStylesChange"></ZStyles>
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

export default {
  name: 'CusStyle',
  components: {ZStyles, ZProps, EwSuggest},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {

    let widgetConfig = props.ui.widgetConfig
    let obj;
    let JSON5 = ZY.JSON5;
    let { data, methods, listeners, init } = defineCustomRender(props, ctx, {
      handleValueInit(newVal, from) {
        // console.log(from)
        // console.log('CusStyle', newVal, typeof  newVal)
        return {}
      }
    })
    let state = data({
      value: {},
      control: {}
    })

    function onChange() {
      let clonedValue = JSON5.parse(JSON5.stringify(state.value))
      let str =JSON5.stringify(clonedValue)
      methods.on_change(str)
    }


    function onStylesChange(e) {
      console.log('onStylesChange', e)
      // state.control.styles = e
      state.value.styles = ZY.JSON5.parse(ZY.JSON5.stringify(e))
      //
      onChange()
    }

    function save() {
      onChange()
    }

    function onBlur() {
      onChange()
    }

    // onMounted(() => {
    //   init(props)
    // })

    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        try {
          obj = JSON5.parse(newVal)
          // console.log('watch', newVal, obj)
          state.control = obj
        } catch (e) {
        //
        }
      }
    }, {
      immediate: true
    })
    return {
      state,
      widgetConfig,
      onChange,
      methods,
      onStylesChange,
      onBlur,
      save,
      listeners,
    }
  },
}
</script>

