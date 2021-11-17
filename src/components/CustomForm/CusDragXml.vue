<template>
  <template v-if="inited">
<!--        {{state}}-->
    <z-easy-modal title="编辑"
                  @opened="onOpened"
                  @closed="onClosed"
                  :modelAttr="{width: '96vw', appendToBody: true}">
      <template #button-content>打开数据展示</template>
      <template #default>
        <z-drag-xml :ref="mainRef"></z-drag-xml>
      </template>
    </z-easy-modal>
<!--    <z-drag-xml></z-drag-xml>-->
  </template>

</template>

<script>
import {inject, provide, toRaw} from 'vue'
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import ZDragXml from "@/plugins/z-frame/components/ZDragXml.vue";
import ZEasyModal from "@/plugins/z-frame/components/ZEasyModal.vue";

export default {
  name: 'CusDragXml',
  components: {ZEasyModal, ZDragXml},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let {part_key} = props.defs
    let JSON5 = ZY.JSON5
    let CusFormExpose = inject('CusFormExpose')
    let form_config = {}
    provide('cusDragXml', {
      getFormConfig() {
        return Object.assign({
          vertical: null,
        }, form_config)
      }
    })

    let obj = {}
    let { data, methods, listeners, init, widgetConfig2, buildGetRef, getRef } = defineCustomRender(props, ctx, {
      handleValueInit
    })
    let state = data({

    })
    init(props)

    let mainRef = buildGetRef('main')

    function handleValueInit(newVal) {
      if (!newVal) {
        newVal = '{}'
      }
      if (newVal) {
        obj = JSON5.parse(newVal)
        // console.log('newVal handleValueInit', obj)
      }
      // console.log('handleValueInit', part_key, obj)
      return newVal
    }

    function onChange() {
      let value = JSON5.stringify(obj)
      state.value = value
      methods.on_change(value)
    }

    function onClosed() {
      let ctx = getRef('main')
      obj.props = ctx.getZprops()
      obj.memos = ctx.getMemo()
      // console.log(obj)
      onChange()
    }

    function onOpened() {
      let model = {}
      let ctx = getRef('main')
      // console.log(obj, ctx)
      if (CusFormExpose && CusFormExpose.getPartModel) {
        model = CusFormExpose.getPartModel()
        let ui = JSON5.parse(model.ui)
        console.log(ui)
        if (Array.isArray(ui.attrs)) {
          form_config = Object.fromEntries(ui.attrs)
        }
        console.log(form_config)
      }
      if (ctx) {
        ctx.importData(obj.memos)
      }
    }

    return {
      onChange,
      state,
      mainRef,
      onClosed,
      onOpened,
      widgetConfig: widgetConfig2,
      methods,
      listeners,
    }
  },
}
</script>

