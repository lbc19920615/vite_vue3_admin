<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    <!--{{state}}-->
    <el-input-number
        v-model="state.value"
        v-bind="state.OPT.widgetConfig"
        v-on="listeners"
    ></el-input-number>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {createAbleProp, createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";

export default {
  name: 'CusInputNumber',
  mixins: [
    CustomRenderControlMixin
  ],
  CUS_TITLE: '数字',
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        clearable: createAbleProp({
          label: '清除'
        }),
        step: {
          type: 'number',
          ui: {
            label: '步数',
            widgetConfig: {
              clearable: true
            }
          }
        },
        min: {
          type: 'number',
          ui: {
            label: '最小',
            widgetConfig: {
              clearable: true
            }
          }
        },
        max: {
          type: 'number',
          ui: {
            label: '步数',
            widgetConfig: {
              clearable: true
            }
          }
        },
        precision: {
          type: 'number',
          ui: {
            label: '精度',
            widgetConfig: {
              clearable: true
            }
          }
        },
        controlsPosition: {
          type: String,
          ui: {
            label: '按钮位置'
          }
        }
      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init, initDefaultVal, widgetConfig2 } = defineCustomRender(props, ctx, {
      handleValueInit(v) {
        return v
      }
    })
    let state = data({
    })
    init(props)
    initDefaultVal()

    return {
      state,
      widgetConfig: widgetConfig2,
      methods,
      listeners,
    }
  },
}
</script>

