<template>
  <template v-if="inited">
    <z-easy-modal title="编辑"
                  @opened="onOpened"
                  @closed="onClosed"
                  :modelAttr="{
                    width: '96vw',
                     appendToBody: true,
                     top: '10vh',
                     modalClass: 'el-dialog--no-modal'
                  }"
                  :button-attr="{

                    size: 'small'
                  }"

    >
      <template #button-content>编辑</template>
      <template #default>
<!--        {{state.insVars}}-->
        <el-row>
          <el-button type="primary" size="small"
                     @click="saveData">保存</el-button>
        </el-row>
        <z-drag-xml :ins-vars="state.insVars" :ref="mainRef"></z-drag-xml>
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

import { request, context } from '@/plugins/z-request/index.js'

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
      insVars: []
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

    async function saveData() {
      let ctx = getRef('main')
      obj.props = ctx.getZprops()
      obj.memos = ctx.getMemo()
      try {
        let res = await request.post('/api-assess/assess_json/json', JSON.stringify(obj.props))
        obj.metas = {
          form_data: res.data
        }
        onChange()
      } catch (e) {
        console.log(e)
      }


    }

    function onClosed() {
      // saveData()
    }

    function onOpened() {
      let model = {}
      let ctx = getRef('main')
      // console.log(obj, ctx)
      state.insVars =  [
        [
          '爱你11',
          'xy-text',
          `val="MODEL('field__cov27IMEbX')"`
        ]
      ]
      if (CusFormExpose && CusFormExpose.getPartModel) {
        model = CusFormExpose.getPartModel()
        let ui = JSON5.parse(model.ui)
        console.log('CusFormExpose', ui)
        if (Array.isArray(ui.attrs)) {
          form_config = Object.fromEntries(ui.attrs)
        }
        // console.log(form_config)
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
      saveData,
      widgetConfig: widgetConfig2,
      methods,
      listeners,
    }
  },
}
</script>

