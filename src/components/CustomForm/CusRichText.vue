<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.OPT.widgetConfig}}-->
<!--    {{getCss()}}-->
<!--    {{ state.value}}-->
<!--    <div v-html="getHtml()"></div>-->
    <z-shadow :ref="mainRef" :id="id"></z-shadow>
  </template>
</template>

<script>
import {CUSOM_RENDER_FROM_TYPES, CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index.js";
import { createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";
import {onMounted, watch} from "vue";


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
    let { data, methods, listeners, init, widgetConfig2,buildGetRef, getRef } = defineCustomRender(props, ctx, {
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
    let mainRef = buildGetRef('main')
    // console.log(widgetConfig2)
    let state = data({

    })
    init(props)
    let id = ZY.rid()

    // let widgetConfig = props?.ui?.widgetConfig ?? {}

    let _getContext = null
    function getContext(e) {
      _getContext = e.detail[0]
    }

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

    function getCss() {
      let css = ''
      if (state.OPT.widgetConfig.html_content) {
        try {
          css = state.OPT.widgetConfig.css_style
        } catch (e) {
          //
        }
      }
      return css
    }

    function getShadow() {
      return  document.getElementById(id)
      // return _getContext
    }

    watch(state, (newVal) => {
      // console.log('sdsdsds', document.getElementById(id))
      getShadow().setContent(getCss(), getHtml())
    })

    onMounted(() => {
      setTimeout(() => {
        // console.dir(getShadow())
        getShadow().setContent(getCss(), getHtml())
      }, 300)
    })

    return {
      state,
      widgetConfig: widgetConfig2,
      getHtml,
      mainRef,
      getContext,
      id,
      getCss,
      methods,
      listeners,
    }
  },
}
</script>

