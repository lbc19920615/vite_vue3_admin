<template>
  <template v-if="inited">
<!--    {{getConfig()}}-->
    <el-date-picker v-model="state.value"
                    v-bind="getConfig()"
                    @change="methods.onChange"
    ></el-date-picker>
  </template>
</template>

<script>
import {CUSOM_RENDER_FROM_TYPES, CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils";
import {createAbleProp, createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";
import {nextTick} from "vue";

export default {
  name: 'CusDateTimePicker',
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_TITLE: '时间选择',
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        type: {
          type: 'string',
          ui: {
            label: '类型',
            widget: 'CusSuggest',
            widgetConfig: {
              suggest: [
                {
                  label: '年',
                  value: 'year'
                },
                {
                  label: '月',
                  value: 'month'
                },
                {
                  label: '周',
                  value: 'week'
                }
              ]
            }
          }
        },
        format: {
          type: 'string',
          ui: {
            label: '格式化'
          }
        },
        clearable: createAbleProp({
          label: '清除'
        }),
      }
    }
  },
  setup(props, ctx) {
    let { data, methods, init, widgetConfig2, initDefaultVal } = defineCustomRender(props, ctx, {
      handleValueInit(v, from) {
        // console.log(v, state.OPT.propConfig.defaultVal)
        // if (from === CUSOM_RENDER_FROM_TYPES.init) {
        //   if (typeof v === 'undefined') {
        //     return state.OPT.propConfig.defaultVal
        //   }
        // }
        return v
      }
    })
    let state = data()

    function getConfig() {
      let obj = state.OPT.widgetConfig
      if (!obj.type) {
        obj.type = 'datetime'
      }
      obj.type = 'datetime'
      // console.log(obj)
      return obj
    }

    init(props)
    nextTick(() => {
      initDefaultVal()
    })


    return {
      state,
      widgetConfig: widgetConfig2,
      methods,
      getConfig
    }
  },
}
</script>

