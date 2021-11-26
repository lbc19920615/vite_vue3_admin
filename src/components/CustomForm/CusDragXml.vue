<template>
  <template v-if="inited">
<!--    {{state.OPT.widgetConfig}}-->
    <template v-if="state.OPT.widgetConfig && state.OPT.widgetConfig.flat">
      <z-drag-xml :ins-vars="state.insVars" :ref="mainRef"></z-drag-xml>
    </template>
    <template v-else>
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
          <el-row>
            <el-button type="primary" size="small"
                       @click="saveData">更新表结构</el-button>
          </el-row>
          <z-drag-xml :ins-vars="state.insVars" :ref="mainRef"></z-drag-xml>
        </template>
      </z-easy-modal>
    </template>
  </template>

</template>

<script>
import {inject, onMounted, provide, toRaw} from 'vue'
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
    let drag_xml_uuid = ZY.rid()
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

    async function saveServer() {
      let ctx = getRef('main')
      let serverProps = ctx.getZprops(true)
      // console.log(serverProps)
      // onChange()
      try {
        let res = await Req.post('/api/json', ZY.JSON5.stringify(serverProps))
        obj.metas = {
          form_data: res.data
        }
        onChange()
      } catch (e) {
        console.log(e)
      }
    }

    /**
     * 保存
     * @returns {Promise<void>}
     */
    async function saveData() {
      let ctx = getRef('main')
      obj.props = ctx.getZprops()
      obj.memos = ctx.getMemo()
      obj.metas = {}
       await saveServer()
      return obj
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
        // console.log('CusFormExpose', ui)
        if (Array.isArray(ui.attrs)) {
          form_config = Object.fromEntries(ui.attrs)
        }
        // console.log(form_config)
      }
      if (ctx) {
        ctx.importData(obj.memos)
      }
    }

    let ret =  {
      onChange,
      drag_xml_uuid,
      state,
      mainRef,
      onClosed,
      onOpened,
      saveData,
      widgetConfig: widgetConfig2,
      methods,
      listeners,
    }

    onMounted(() => {
      let formPage = inject('formPage')
      if (formPage) {

        formPage.registerCom(drag_xml_uuid, ret)
      }
    })


    return ret
  },
}
</script>

