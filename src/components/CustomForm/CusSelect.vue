<template>
  <template v-if="inited">
<!--    {{parsedWidgetConfig}}-->
    <el-select
        v-model="state.value"
        v-on="listeners"
        v-bind="widgetConfig"
        @change="onSelectChange"
    >
      <el-option vs-for="(option, key) in options"
                 v-for="(option, key) in dxValueTemplate(widgetConfig.enums)"
                 :label="option.label" :value="option.value"
      ></el-option>
    </el-select>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {createBaseCusCONFIG, createBaseCusEnumsCONFIG} from "@/plugins/z-frame/CusBaseEditor";
import {toRaw} from "vue";

export default {
  name: 'CusSelect',
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        ...createBaseCusEnumsCONFIG(),
        clearable: {
          type: Boolean,
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
        },
        filterable: {
          type: Boolean,
          ui: {
            label: '是否过滤',
            widgetConfig:  {
              ext: 'booleanWithClearable'
            },
            notice: '是否可以过滤'
          },
          rules: {
            type: 'any'
          }
        },
        multiple: {
          type: Boolean,
          ui: {
            label: '是否多选',
            widgetConfig:  {
              ext: 'booleanWithClearable'
            },
            notice: '是否可以多选'
          },
          rules: {
            type: 'any'
          }
        },
        collapseTags: {
          type: Boolean,
          ui: {
            label: '是否折叠',
            widgetConfig:  {
              ext: 'booleanWithClearable'
            },
            notice: '是否可以折叠'
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
    let { data, methods, listeners, init, parsedWidgetConfig, curFormCon, dxValueEval, selfpath } = defineCustomRender(props, ctx)
    let state = data()
    init(props)

    console.log('selfpath', selfpath)

    let options = dxValueEval(props.ui.widgetConfig.enums)
    if (!options) {
      options = []
    } else {
      options = ZY.JSON5.parse(ZY.JSON5.stringify(options))
    }

    function onSelectChange(e) {
      let defs = toRaw(props.defs)
  let sendObj =         {
    defs: defs,
    selfpath,
    context: defs.context,
    value: state.value,
    model: curFormCon,
    options
  }
      curFormCon.callPageEvent('CUS_SELECT:CHANGE',sendObj, e)
      curFormCon.callPageEvent(`CUS_SELECT:CHANGE(${selfpath})`,sendObj, e)
    }

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      options,
      onSelectChange,
      parsedWidgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

