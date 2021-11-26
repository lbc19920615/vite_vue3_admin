<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.OPT.propConfig}}-->
<!--    {{typeof state.value}}-->
    <template v-if="state.OPT.widgetConfig">
      <template v-if="state.OPT.widgetConfig.type === 'number' ">
        <el-input
            v-model.number="state.value"
            v-bind="state.OPT.widgetConfig"
            @change="onNumberChange"
        ></el-input>
      </template>
      <template v-else>
        <el-input
            v-model="state.value"
            v-bind="state.OPT.widgetConfig"
            v-on="listeners"
        ></el-input>
      </template>
    </template>
  </template>
</template>

<script>
import {CUSOM_RENDER_FROM_TYPES, CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {createAbleProp, createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";
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
        clearable: createAbleProp({
          label: '清除'
        }),
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
        showWordLimit: createAbleProp({
          label: '计数'
        }),
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
    let { data, methods, listeners, init, widgetConfig2, initDefaultVal } = defineCustomRender(props, ctx, {

    })
    // console.log(widgetConfig2)
    let state = data({

    })
    init(props);
    initDefaultVal();

    // let widgetConfig = props?.ui?.widgetConfig ?? {}

    function onNumberChange(v) {
      // console.log(v)
      let val = parseInt(v)
      methods.on_change(val)
    }

    return {
      state,
      onNumberChange,
      widgetConfig: widgetConfig2,
      methods,
      listeners,
    }
  },
}
</script>

