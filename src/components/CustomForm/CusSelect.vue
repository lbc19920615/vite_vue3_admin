<template>
  <div v-if="inited">
<!--    {{parsedWidgetConfig}}-->
<!--    {{buildOptions()}}-->
    <el-select
        v-model="state.value"
        v-on="listeners"
        v-bind="state.OPT.widgetConfig"
        @change="onSelectChange"
    >
      <template   v-if="state.OPT.widgetConfig.template">
        <el-option vs-for="(option, key) in options"
                   v-for="(option, key) in buildOptions()"
                   :label="option.label" :value="option.value"
        >
          <jsx-render :render="dom(option)" ></jsx-render>
        </el-option>
      </template>
      <template v-else>
        <el-option vs-for="(option, key) in options"
                   v-for="(option, key) in buildOptions()"
                   :label="option.label" :value="option.value"
        >
        </el-option>
      </template>
    </el-select>
  </div>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {createBaseCusCONFIG, createBaseCusEnumsCONFIG} from "@/plugins/z-frame/CusBaseEditor";
import {toRaw, h} from "vue";
import JsxRender from "@/components/jsxrender.vue";

export default {
  name: 'CusSelect',
  components: {JsxRender},
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_TITLE: '下拉',
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        ...createBaseCusEnumsCONFIG(),
        // template: {
        //   type: 'string,
        //   ui: {
        //     label: '模板',
        //     widgetConfig:  {
        //       type: 'textarea'
        //     }
        //   }
        // },

        template: {
          type: 'string',
          ui: {
            label: '模板',
            widgetConfig:  {
              type: 'textarea',
              disabled: true
            }
          },
          computedProp: 'template2_jsx'
        },
        template2: {
          type: 'string',
          ui: {
            label: '模板',
            widget: 'CusJsxEditor',
            widgetConfig:  {
            }
          }
        },
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
        },
        filterable: {
          type: 'boolean',
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
          type: 'boolean',
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
          type: 'boolean',
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
          enums_content: `A.getCusInsertContent(MODEL('enums2'))`,
        template2_jsx: `A.getCusJsxEditor(MODEL('template2'))`
      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init, parsedWidgetConfig, buildOptions, curFormCon, dxValueEval, selfpath, widgetConfig2 } = defineCustomRender(props, ctx)
    let state = data()
    init(props)

    // console.log('selfpath', selfpath)

    // console.log(widgetConfig2)


    function onSelectChange(e) {
      let defs = toRaw(props.defs)
      let sendObj =         {
        defs: defs,
        selfpath,
        context: defs.context,
        value: state.value,
        model: curFormCon,
        options: buildOptions()
      }
      if (curFormCon) {
        curFormCon.callPageEvent('CUS_SELECT:CHANGE',sendObj, e)
        curFormCon.callPageEvent(`CUS_SELECT:CHANGE(${selfpath})`,sendObj, e)
      }
    }

    function dom(option) {
      return ZY_EXT.eval5(parsedWidgetConfig.template, {
        h,
        OPT: function (key) {
          return option[key]
        },
        option,
      })
    }

    return {
      buildOptions,
      state,
      widgetConfig: props?.ui?.widgetConfig ?? {},
      onSelectChange,
      parsedWidgetConfig,
      methods,
      dom,
      listeners,
    }
  },
}
</script>

