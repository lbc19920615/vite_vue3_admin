<style>
.cus-form {
  /*--my-dialog-z-index: 10;*/
}
</style>

<template>
  <div class="cus-form" v-if="page.inited" :style="widgetConfig.style">
    <div hidden>{{store.model}}</div>
    <HttpComponent
        :defs="page.defMap"
        :is="store.model.editor_step"
        v-if="!useDrag || store.model.dialog_open"
    >
      <template #array_con_afterbegin="scope">
      </template>
      <template #array_afterbegin="scope">
        <el-button type="primary" size="small"
                   @click="page.callEvent(EVENT_NAMES.ARR_APPEND_COMMON, scope)">添加</el-button>
      </template>
      <template #array_con_beforeend="scope">
        <el-popconfirm title="确定删除吗？" @confirm="page.callEvent(EVENT_NAMES.ARR_REMOVE_COMMON, scope)">
          <template #reference>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-popconfirm>
<!--        <el-button type="danger" size="small"-->
<!--                   @click="page.callEvent(EVENT_NAMES.ARR_REMOVE_COMMON, scope)">删除</el-button>-->
      </template>
    </HttpComponent>
  </div>

</template>
<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils";
import HttpComponent from "@/components/HttpComponent.vue";
import {extendCommonArrEventHandler, extendControl2Page, useControl} from "@/mixins/framework";
import {getCurrentInstance, inject, nextTick, onMounted, onBeforeMount, toRaw} from 'vue';
import CustomElement from "@/components/CustomElement.vue";
import buildEditorConfig from './CusComputed/editorConfig'

export default {
  name: 'CusComputed',
  components: {CustomElement, HttpComponent},
  mixins: [
    CustomRenderControlMixin
  ],
  props: {
  },
  setup(props, ctx) {
    let instanse = getCurrentInstance()

    let parentModelArr = props.path_arr.slice(0, props.path_arr.length - 1)
    let parentModelPath =
        ZY.getObjPathFromPathArr(parentModelArr)

    let widgetConfig = props.ui.widgetConfig
    let locks = true
    let cached = null
    let { methods, init, data, widgetConfig2 } = defineCustomRender(props, ctx, {
      handleValueInit(newVal) {
        // console.log('handleValueInit', newVal, typeof newVal)
        if (typeof newVal !== 'undefined') {
          try {
            cached = ZY.JSON5.parse(newVal)
            // console.log('cached', cached)
          } catch (e) {
            console.error(new Error('json parse err', {
              cause: e
            }))
          }
        }
        return newVal
        // page.setPartModel('form-editor', 'form2', obj)
      }
    })
    data({
    })
    let properties =  {
      editor_step: {
        type: String,
      },
      json: {
        type: String,
      },
      dialog_open: {
        type: Boolean
      },
      loaded: {
        type: Boolean
      }
    }
    let dialogName = 'cus_form_dialog_' + ZY.rid(6)
    let computed = {}
    function onInited({storeControl}) {
      page.setByPath('dialog_open', true)
    }
    let page = useControl({properties, computed}, {
      onInited,
      extendContext: {
      }
    })
    page = extendControl2Page(page)
    let { EVENT_NAMES } = extendCommonArrEventHandler(page)

    page.setEventHandler({
      async ['model:update:all'](e) {
        let { model, key, newVal, config } = e
        // console.log('cus:form model:update:all', model)
        if (!locks) {
          let val = ZY.JSON5.stringify(model)
          page.setData({
            json: val
          })
          await nextTick();
          methods.on_change(val)
        }
      },
    })

    let setStepModel = null

    let self_config = {}

    onMounted(function () {
      let parentModel = instanse.ctx.dxValueTemplate(`MODEL('${parentModelPath}')`)
      let properties = {}
      try {
        properties = ZY.JSON5.parse(parentModel.properties)
      } catch (e) {
        console.error(e)
      }

      let asyncPromise =  async function () {
        let insertText = []
        if (properties.properties) {
          insertText = Object.keys(properties.properties)
        }
        let ___buildEditorConfig = buildEditorConfig({
          insFun: ['ROOT_STATE'],
          insVars: insertText
        })
        // console.log('___buildEditorConfig', ___buildEditorConfig)
        return {
          default: ___buildEditorConfig
        }
      }

      // console.log(asyncPromise())

      page.commonLoadStep(
          asyncPromise(),
          'editor_step',
          {
            async onMounted(config, {setPartModel}) {
              self_config = config

              init(props)
              setStepModel = function () {
                if (cached) {
                  setPartModel(config.name, 'form2', cached)
                }
              }
              if (locks) {

                locks = false
                setStepModel()
              }

              // page.setByPath('loaded', true)
              // console.log('sdsdsdsdsdsds')
            }
          }
      )
    })

    function openDialog() {
      let currentPageWebComponentRef =  globalThis.getCurrentPage('page.webComponentRef')
      if (currentPageWebComponentRef && currentPageWebComponentRef.toggleDialog) {
        currentPageWebComponentRef.toggleDialog(dialogName);
      }
      // console.log('formEditorConfig', cached)
      if (!locks) {
        setStepModel()
      }
      page.setByPath('dialog_open', true)
    }

    function onClosed() {
      console.log('onClosed')
    }

    let useDrag = true
    if ( props.ui.widgetConfig.hasOwnProperty('useDrag')) {
      useDrag = props.ui.widgetConfig.useDrag
    }

    // let CurCmField = inject('CurCmField')

    //context.get_SELF_CONFIG('properties.parts.ui.label')
    function getArrItemBeforeKey(scope) {
      // let fieldContext = globalThis.cmFieldContext.get(props.field_uuid)
      // console.log(scope, self_config)

      let c = {
        config: self_config.init.def
      }

      let partCONFIG =  ZY.lodash.get(c, scope.configPath)

      // console.log(partCONFIG)

      let label = ZY.getStrFromObj(partCONFIG, 'ui.label', scope.key)

      return label
    }

    return {
      dialogName,
      widgetConfig: widgetConfig2,
      page,
      EVENT_NAMES,
      openDialog,
      getArrItemBeforeKey,
      useDrag,
      onClosed,
      store: page.store
    }

  }
}
</script>
