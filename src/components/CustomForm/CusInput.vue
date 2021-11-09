<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.OPT}}-->
    <el-input
        v-model="state.value"
        v-bind="state.OPT.widgetConfig"
        v-on="listeners"
    ></el-input>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";
import {QuickNumber, setPROPS} from "@/hooks/props";


export default {
  name: 'CusInput',
  mixins: [
    CustomRenderControlMixin
  ],
  CUS_TITLE: '输入',
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
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
        type: {
          type: 'string',
          ui: {
            label: '类型',
          },
          noticeIframe: `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types`
        },
        maxlength: {
          type: 'string',
          ui: {
            label: '最大长度',
            notice: ''
          },
        },
        showWordLimit: {
          type: 'boolean',
          ui: {
            label: '是否计数',
            widgetConfig:  {
              ext: 'booleanWithClearable'
            },
            notice: '是否可以计数'
          },
          rules: {
            type: 'any'
          }
        },
        // rows: {
        //   type: 'number',
        //   ui: {
        //     label: '行数',
        //   }
        // },
        rows: setPROPS(
            QuickNumber() ?? {},
            {
              ui: {
                label: '行数',
              }
            }
        ),
        prefixIcon: {
          type: 'string',
          ui: {
            label: '前面icon',
          }
        },
        suffixIcon: {
          type: 'string',
          ui: {
            label: '后面icon',
          }
        }
      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init } = defineCustomRender(props, ctx, {
      handleValueInit(v) {
        return v
      }
    })
    let state = data({
    })
    init(props)

    let widgetConfig = props?.ui?.widgetConfig ?? {}

    return {
      state,
      widgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

