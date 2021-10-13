<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.value}}-->
   <z-cell-item label="占位提示">
      <el-input v-model="state.value.placeholder"
                clearable
                @change="onChange"></el-input>
   </z-cell-item>
    <z-cell-item label="状态">
      <el-radio-group v-model="state.value.statusType" @change="onChange">
        <el-radio-button label="common">普通</el-radio-button>
        <el-radio-button label="disabled">禁用</el-radio-button>
        <el-radio-button label="readonly">只读</el-radio-button>
        <el-radio-button label="hidden">隐藏</el-radio-button>
      </el-radio-group>
    </z-cell-item>
    <z-cell-item label="清除按钮">
      <el-switch v-model="state.value.clearable" @change="onChange"
                 active-color="#13ce66" inactive-color="#ff4949"></el-switch>
    </z-cell-item>
    <z-cell-item label="字数统计">
      <el-switch v-model="state.value.showWordLimit" @change="onChange"
                 active-color="#13ce66" inactive-color="#ff4949"></el-switch>
    </z-cell-item>
    <z-cell-item label="最大长度">
      <el-input-number
          v-model="state.value.maxlength"
          @change="onChange"
          :min="1"
          :max="1000"
      ></el-input-number>
    </z-cell-item>
    <z-cell-item label="最小长度">
      <el-input-number
          v-model="state.value.minlength"
          @change="onChange"
          :min="1"
          :max="1000"
      ></el-input-number>
    </z-cell-item>
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

