<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.OPT.widgetConfig}}-->
<!--    {{ state.value}}-->
    <div v-html="getHtml()"></div>
  </template>
</template>

<script>
import {CUSOM_RENDER_FROM_TYPES, CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {createAbleProp, createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";
import {QuickNumber, setPROPS} from "@/hooks/props";


export default {
  name: 'CusRichText',
  mixins: [
    CustomRenderControlMixin
  ],
  CUS_TITLE: '输入',
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        html_content: {
          type: 'string',
          ui: {
            label: 'html内容',
            widget: 'CusRichEditor',
            widgetConfig: {}
          }
        }
      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init, widgetConfig2 } = defineCustomRender(props, ctx, {
      handleValueInit(v, from) {
        // console.log('widgetConfig2?.defaultVal', v)
        if (from === CUSOM_RENDER_FROM_TYPES.init) {
          if (typeof v === 'undefined') {
            return state.OPT.propConfig.defaultVal
          }
        }
        return v
      }
    })
    // console.log(widgetConfig2)
    let state = data({

    })
    init(props)

    // let widgetConfig = props?.ui?.widgetConfig ?? {}

    function getHtml() {
      let html = ''
      let obj = {}
      if (state.OPT.widgetConfig.html_content) {
        try {
          obj = ZY.JSON5.parse(state.OPT.widgetConfig.html_content)
          html = obj.html
        } catch (e) {
        //
        }
      }
      return html
    }

    return {
      state,
      widgetConfig: widgetConfig2,
      getHtml,
      methods,
      listeners,
    }
  },
}
</script>

