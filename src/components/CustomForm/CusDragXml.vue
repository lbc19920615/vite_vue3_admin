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

          <template v-if="state.OPT.widgetConfig && state.OPT.widgetConfig.hiddenAction"></template>
          <template v-else>
            <el-row>
              <el-button type="primary" size="small"
                         @click="saveData">更新表结构</el-button>
            </el-row>
          </template>
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
import {useToolApi} from "@/hooks/api";

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
    let drag_xml_uuid = ZY.rid();
    let oldObj = '{}'
    provide('cusDragXml', {
      getFormConfig() {
        return Object.assign({
          vertical: null,
        }, form_config)
      }
    })

    let obj = {}
    let { data, methods, listeners, init, widgetConfig2, buildGetRef, getRef, curFormCon } = defineCustomRender(props, ctx, {
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

    let toolApi = useToolApi()

    /**
     * 保存
     * @returns {Promise<void>}
     */
    async function save() {
      let ctx = getRef('main')
      if (ctx && ctx.getZprops) {
        obj.props = ctx.getZprops();
        obj.memos = ctx.getMemo();
        obj.oldProps = JSON5.parse(oldObj).props
        onChange()
      }
      return obj
    }

    /**
     * 保存
     * @returns {Promise<void>}
     */
    async function saveData() {
      let oldObjParsed =  JSON5.parse(oldObj)
      let tableName;
      if (oldObjParsed.metas) {
        tableName = oldObjParsed.metas.form_data
      }
      let ctx = getRef('main')
      obj.props = ctx.getZprops()
      obj.memos = ctx.getMemo()
      obj.oldProps = oldObjParsed.props
      obj.metas = {}
      obj.metas.form_data  = await toolApi.saveJson(
          JSON5.stringify(obj.props), drag_xml_uuid + '.json5',
          {
            newProps: obj.props,
            oldProps: obj.oldProps,
            tableName,
          }
      )

      onChange()
      return obj
    }

    function onClosed(e) {
      curFormCon.callPageEvent('dragxml:closed', {
        save
      }, e)
    }

    function onOpened() {
      let model = {}
      let ctx = getRef('main')
      // console.log(obj, ctx)
      oldObj = JSON5.stringify(obj)
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
      save,
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

