<template>
  <template v-if="inited">
<!--        {{state}}-->
    <z-easy-modal title="编辑"
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
import {toRaw} from 'vue'
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
        // console.log('newVal handleValueInit', typeof newVal)
      }
      // console.log('handleValueInit', part_key, obj)
      return newVal
    }

    function onChange() {
      let value = JSON5.stringify({
      })
      state.value = value
      methods.on_change(value)
    }

    function onClosed() {
      let ctx = getRef('main')
      console.log(ctx)
    }

    return {
      onChange,
      state,
      mainRef,
      onClosed,
      widgetConfig: widgetConfig2,
      methods,
      listeners,
    }
  },
}
</script>

