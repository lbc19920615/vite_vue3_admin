<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    {{state.value}}
    <el-form-item label="type">
      <ew-suggest v-model="state.value.type" :suggest="typeSuggest"></ew-suggest>
    </el-form-item>
    <el-form-item label="message">
      <el-input v-model="state.value.message"
                clearable
                @change="onChange"></el-input>
    </el-form-item>
    <el-form-item label="required">
      <el-switch v-model="state.value.required" @change="onChange"
                 active-color="#13ce66" inactive-color="#ff4949"></el-switch>
    </el-form-item>
    <el-form-item label="pattern">
      <el-input v-model="state.value.pattern"
                clearable
                @change="onChange"></el-input>
    </el-form-item>
    <el-form-item label="max">
      <el-input-number
          v-model="state.value.max"
          @change="onChange"
          :min="1"
          :max="1000"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="min">
      <el-input-number
          v-model="state.value.min"
          @change="onChange"
          :min="1"
          :max="1000"
      ></el-input-number>
    </el-form-item>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import EwSuggest from "@/components/Ew/EwSuggest.vue";


export default {
  name: 'CusFormRules',
  components: {EwSuggest},
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
          newVal = {}
        }
        if (newVal) {
          // console.log('newVal', newVal, typeof  newVal)
          try {
            obj = JSON5.parse(newVal)
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

    let typeSuggest = [
      'string', 'number', 'boolean',
      'method', 'regexp', 'integer',
      'float', 'date', 'url',
        'hex', 'email', 'any'
    ].map(v => {
      return {
        label: v,
        value: v
      }
    })

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      onChange,
      methods,
      typeSuggest,
      listeners,
    }
  },
}
</script>

