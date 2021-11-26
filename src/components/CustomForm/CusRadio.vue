\<template>
  <template v-if="inited">
<!--    {{widgetConfig.enums}}-->
<!--    {{state.OPT.widgetConfig}}-->
    <el-radio-group
        v-model="state.value"
        v-bind="state.OPT.widgetConfig"
        v-on="listeners"
    >
      <el-radio v-for="(option, key) in buildOptions()"
                :label="option.value"
      ><span v-html="option.label"></span></el-radio>
    </el-radio-group>
  </template>

</template>

<script>
import {
  CUSOM_RENDER_FROM_TYPES,
  CustomRenderControlMixin,
  defineCustomRender,
} from "@/plugins/form-render/utils/index";
import {createBaseCusCONFIG, createBaseCusEnumsCONFIG} from "@/plugins/z-frame/CusBaseEditor";
import {nextTick} from "vue";

export default {
  name: 'CusRadio',
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_TITLE: '单选',
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        ...createBaseCusEnumsCONFIG(),
        clearable: {
          type: 'boolean',
          ui: {
            label: '是否清除',
            widgetConfig:  {
              ext: 'booleanWithClearable'
            },
            notice: '是否可以清除'
          },
          rules: {
            type: 'any'
          }
        }
      },
      computed: {
        enums_content: `A.getCusInsertContent(MODEL('enums2'))`
      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init, widgetConfig2, buildOptions, initDefaultVal } = defineCustomRender(props, ctx, {

    })
    let state = data()
    init(props)
    nextTick(() => {
      initDefaultVal()
    })

    return {
      state,
      widgetConfig: widgetConfig2,
      buildOptions,
      methods,
      listeners,
    }
  },
}
</script>

