<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    <!--{{state}}-->
    <el-input
        v-model="state.value"
        v-bind="widgetConfig"
        v-on="listeners"
    ></el-input>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";

export default {
  name: 'CusInput',
  mixins: [
    CustomRenderControlMixin
  ],
  CUS_EDITOR: function () {
    return {
      props: {
        clearable: {
          type: Boolean,
          ui: {
            label: '是否清除',
            widgetConfig:  {
              ext: 'booleanWithClearable'
            },
            notice: '是否可以清除'
          }
        },
        type: {
          type: String,
          ui: {
            label: '类型',
          },
          noticeIframe: `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types`
        },
        maxlength: {
          type: String,
          ui: {
            label: '最大长度',
            notice: ''
          }
        },
        showWordLimit: {
          type: Boolean,
          ui: {
            label: '是否计数',
            widgetConfig:  {
              ext: 'booleanWithClearable'
            },
            notice: '是否可以计数'
          }
        },
        rows: {
          type: Number,
          ui: {
            label: '行数',
          }
        },
        prefixIcon: {
          type: String,
          ui: {
            label: '前面icon',
          }
        },
        suffixIcon: {
          type: String,
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

