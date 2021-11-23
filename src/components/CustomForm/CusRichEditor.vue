<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.OPT.propConfig}}-->
<!--    {{ state.value}}-->
    <z-easy-modal title="编辑"
                  @opened="onOpened"
                  @closed="onClosed"
                  :modelAttr="{
                    width: '70vw',
                     appendToBody: true,
                     top: '10vh',
                     // modalClass: 'el-dialog--no-modal'
                  }"
                  :button-attr="{

                    size: 'small'
                  }"

    >
      <template #button-content>编辑</template>
      <template #default>
        <!--        {{state.insVars}}-->
        <z-wang-editor
            :ref="mainRef"
            :value="state.value" @val-change="onValChange"></z-wang-editor>
      </template>
    </z-easy-modal>
  </template>
</template>

<script>
import {CUSOM_RENDER_FROM_TYPES, CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {createAbleProp, createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";
import {QuickNumber, setPROPS} from "@/hooks/props";
import ZEasyModal from "@/plugins/z-frame/components/ZEasyModal.vue";
import ZWangEditor from "@/plugins/z-frame/components/ZWangEditor.vue";


export default {
  name: 'CusRichEditor',
  components: {ZWangEditor, ZEasyModal},
  mixins: [
    CustomRenderControlMixin
  ],
  CUS_TITLE: '输入',
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
      }
    }
  },
  setup(props, ctx) {
    let JSON5 = ZY.JSON5
    let { data, methods, listeners, init, widgetConfig2, buildGetRef, getRef } = defineCustomRender(props, ctx, {
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

    let mainRef = buildGetRef('main')
    // let widgetConfig = props?.ui?.widgetConfig ?? {}


    function onClosed() {
      // saveData()
      // let value = JSON5.stringify(e)
      // state.value = value
      console.log('onValChange', state.value)
      methods.on_change( state.value)
    }

    function onOpened() {
      let ctx = getRef('main')
      if (ctx) {
        ctx.init(state.value)
      }
    }

    function onValChange(e) {

      let value = JSON5.stringify(e)
      state.value = value
    }

    return {
      state,
      widgetConfig: widgetConfig2,
      onValChange,
      methods,
      onClosed,
      onOpened,
      mainRef,
      listeners,
    }
  },
}
</script>

