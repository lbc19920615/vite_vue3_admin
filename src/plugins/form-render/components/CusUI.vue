<style lang="scss">
.cus-ui__class-props {
  .z-props__name {
    display: none;
  }
}
</style>

<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    {{state.value}}
<!--    <el-row>-->
<!--      <el-button @click="save">保存</el-button>-->
<!--    </el-row>-->
    <h3>class</h3>
    <ZProps class="cus-ui__class-props" v-model:value="state.value.classObj" @form:input:blur="onBlur" @props-change="onClassChange"></ZProps>

    <h3>attrs</h3>
    <ZProps v-model:value="state.value.attrsObj" @form:input:blur="onBlur" @props-change="onAttrsChange"></ZProps>

  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import ZProps from "@/plugins/z-frame/components/ZProps.vue";

export default {
  name: 'CusUI',
  components: {ZProps, EwSuggest},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {

    let {part_key} = props.defs;
    let obj;
    let JSON5 = ZY.JSON5;
    let { data, methods, listeners, init } = defineCustomRender(props, ctx, {
      handleValueInit(newVal) {
        if (!newVal) {
          newVal = {
            classObj: {},
            attrsObj: {},
            data: {}
          }
          return newVal
        }
        if (newVal) {
          // console.log('newVal', newVal, typeof  newVal)
          try {
            obj = JSON5.parse(newVal)
            if (!obj.data) {
              obj.data = {}
            }
            return obj
          } catch (e) {
            // console.log(e)
          }
        }
        return {}
      }
    })
    let state = data({
      value: {}
    })
    init(props)

    function onChange() {
      let str =JSON5.stringify(state.value)
      methods.on_change(str)
    }


    function onAttrsChange(e) {
      console.log('onAttrsChange', e.props)
      // state.value.attrsObj = e

      state.value.data.attrs = e.props.filter(v => {
        return v.name
      }).map(v => {
        return [
            v.name, ZY.defaultStr(v.value, '')
        ]
      })
    }

    function onClassChange(e) {
      state.value.data.class = e.props.filter(v => {
        return v.value
      }).map(v => {
        return ZY.defaultStr(v.value, '')
      })
    }

    function save() {
      onChange()
    }

    function onBlur() {
      onChange()
    }

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      onChange,
      methods,
      onAttrsChange,
      onClassChange,
      onBlur,
      save,
      listeners,
    }
  },
}
</script>

