<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    <!--{{state}}-->
    <el-slider
        v-model="state.value"
        v-bind="widgetConfig"
        v-on="listeners"
    ></el-slider>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {createAbleProp} from "@/plugins/z-frame/CusBaseEditor";

export default {
  name: 'CusSlider',
  mixins: [
    CustomRenderControlMixin
  ],
  CUS_TITLE: '滑块',
  CUS_EDITOR: function () {
    return {
      props: {
        min: {
          type: Number,
          ui: {
            label: '最小',
            widgetConfig: {
              clearable: true
            }
          }
        },
        max: {
          type: Number,
          ui: {
            label: '最大',
            widgetConfig: {
              clearable: true
            }
          }
        },
        step: {
          type: Number,
          ui: {
            label: '步数',
            widgetConfig: {
              clearable: true
            }
          }
        },
        showStops: createAbleProp({
          label: '显示间断点'
        }),
        enums: {
          type: String,
          ui: {
            label: '枚举',
            notice: '枚举可以使用的方法 [sdsd](sdsds)'
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

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

