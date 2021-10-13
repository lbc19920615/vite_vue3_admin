<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.value}}-->
    <z-cell-item label="类型">
      <ew-suggest v-model="state.value.type"
                  @value:change="onChange"
                  :suggest="typeSuggest"></ew-suggest>
    </z-cell-item>
    <z-cell-item label="名称">
      <el-input v-model="state.value.eventName"
                clearable
                @change="onChange"></el-input>
    </z-cell-item>

  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import EwSuggest from "@/components/Ew/EwSuggest.vue";


export default {
  name: 'CusComEvents',
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
      'click', 'change', 'input',
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

