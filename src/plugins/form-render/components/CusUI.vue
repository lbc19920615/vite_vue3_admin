<style lang="scss">
.cus-ui__class-props {
  .z-props__name {
    display: none;
  }
}
.cus-ui__label {
  width: 80px;
  font-weight: bold;
  font-size: 18px;
}
</style>

<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.value}}-->
<!--    <el-row>-->
<!--      <el-button @click="save">保存</el-button>-->
<!--    </el-row>-->
    <el-row class="a-space-mb-10">
      <div class="cus-ui__label">label</div>
      <el-input  style="width: auto; flex: 1"
                v-model="state.value.data.label" @blur="onBlur"></el-input>
    </el-row>
    <el-row  class="a-space-mb-10">
      <div class="cus-ui__label">class</div>
      <ZProps
          style="flex: 1"
          class="cus-ui__class-props" v-model:value="state.value.control.classObj" @form:input:blur="onBlur" @props-change="onClassChange"></ZProps>
    </el-row>

    <el-row  class="a-space-mb-10">
      <div class="cus-ui__label">attrs</div>
      <ZProps
          style="flex: 1"
          v-model:value="state.value.control.attrsObj" @form:input:blur="onBlur" @props-change="onAttrsChange"></ZProps>

    </el-row>

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
            // classObj: {},
            // attrsObj: {},
            control: {},
            data: {}
          }
          return newVal
        }
        if (newVal) {
          console.log('newVal', newVal, typeof  newVal)
          try {
            obj = JSON5.parse(newVal)
            if (!obj.data) {
              obj.data = {}
            }
            if (!obj.control) {
              obj.control = {}
            }
            // delete obj.data.classObj;

            if (obj.data.attrs) {
              let props = []
              for (let [key, value] of obj.data.attrs) {
                props.push({
                  name: key,
                  value: value,
                })
              }
              obj.control.attrsObj = {
                props
              }
            }

            if (obj.data.class) {
              let props = []
              for (let value of obj.data.class) {
                props.push({
                  name: value,
                  value: value,
                })
              }
              obj.control.classObj  = {
                props
              }
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
      let clonedValue = JSON5.parse(JSON5.stringify(state.value))
      // console.log(clonedValue)
      Reflect.deleteProperty(clonedValue, 'control')
      let str =JSON5.stringify(clonedValue)
      methods.on_change(str)
    }


    function onAttrsChange(e) {
      // console.log('onAttrsChange', e.props)
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

