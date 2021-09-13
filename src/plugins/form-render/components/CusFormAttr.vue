<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.value}}-->
   <el-form-item label="占位提示">
      <el-input v-model="state.value.placeholder" @change="onChange"></el-input>
   </el-form-item>
    <el-form-item label="状态">
      <el-radio-group v-model="state.value.statusType" @change="onChange">
        <el-radio-button label="common">普通</el-radio-button>
        <el-radio-button label="disabled">禁用</el-radio-button>
        <el-radio-button label="readonly">只读</el-radio-button>
        <el-radio-button label="hidden">隐藏</el-radio-button>
      </el-radio-group>
    </el-form-item>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";

export default {
  name: 'CusFormAttr',
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

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      onChange,
      methods,
      listeners,
    }
  },
}
</script>

