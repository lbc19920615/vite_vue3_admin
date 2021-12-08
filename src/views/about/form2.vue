<style lang="scss">
.page-layout-editor {
  .element-panel {
    display: none;
  }
}
.page-form2 {
  //--z-emoji-zoom: 0.9;
  .cm-filed__label {
    font-size: 16px;
  }
  .cus-ui__item-title {
    display: none;
  }
}
.em-props-item--active {
  width: 700px;
  height: 75vh;
}
</style>

<template>
  <div class="page-form2" v-if="page.inited" v-loading="state.loading">
<!--    {{store.model}}-->
<!--    {{store.computedModel}}-->


    <template v-if="store.model.textarea_step">
      <!--      {{store.computedModel}}-->
      <HttpComponent
          :defs="allDef"
          :is="store.model.textarea_step"
          :debug="false"
          @dragxml:closed="onClosed"
      >
        <template #array_beforebegin="scope">
          <template v-if="scope.key === 'events'">
            <el-space   align="middle">
              <h3>事件</h3>
              <el-button size="small" @click="page.callEvent('add:events', scope)">添加{{ scope.label }}</el-button>
              <el-button size="small" @click="page.callEvent(`open:${scope.key}`, scope)">打开{{ scope.label }}管理</el-button>
            </el-space>
          </template>
          <template v-else-if="scope.key === 'layoutSlotArr'">
            <el-space   align="middle">
              <h3>片段</h3>
              <el-button size="small" @click="page.callEvent('add:arr:common', scope)">添加{{ scope.label }}</el-button>
              <el-button size="small" @click="page.callEvent(`open:${scope.key}`, scope)">打开{{ scope.label }}管理</el-button>
            </el-space>
          </template>
          <template v-else-if="scope.key === 'forms'">
            <el-space   align="middle">
              <h3>表单</h3>
              <el-button size="small" @click="page.callEvent('add:forms', scope)">添加{{ scope.label }}</el-button>
              <el-button size="small" @click="page.callEvent(`open:forms`, scope)">打开{{ scope.label }}管理</el-button>
            </el-space>
          </template>
          <template v-else>
            <!-- -->
          </template>
        </template>
        <template #array_afterbegin="scope">
          <el-col v-if="scope.key !== 'events' && scope.key !== 'layoutSlotArr' && scope.key !== 'forms'" >
            <el-space align="middle">
              <h3>{{ scope.selfpath }}</h3>
            </el-space>
          </el-col>
        </template>
        <template #array_con_beforeend="scope">
          <el-space wrap>
            <el-popconfirm title="确定删除吗？" @confirm="page.callEvent('remove:events', scope)">
              <template #reference>
                <el-button type="danger" size="small">删除{{ scope.label }}</el-button>
              </template>
            </el-popconfirm>
            <template v-if="scope.key === 'forms'">
              <el-button size="small"
                         @click="page.callEvent(`save:single:${scope.key}`, scope)">保存{{ scope.label }}文件</el-button>
              <el-button size="small"
                         @click="page.callEvent(`load:single:${scope.key}`, scope)">导入{{ scope.label }}文件</el-button>
            </template>
            <template v-if="scope.key === 'events'">
              <el-button size="small"
                         @click="page.callEvent(`save:single:${scope.key}`, scope)">保存{{ scope.label }}文件</el-button>
            </template>
            <template v-if="scope.key === 'layoutSlotArr'">
              <el-button size="small"
                         @click="page.callEvent(`save:single:${scope.key}`, scope)">保存{{ scope.label }}文件</el-button>
              <el-button size="small"
                         @click="page.callEvent(`load:single:${scope.key}`, scope)">导入{{ scope.label }}文件</el-button>
            </template>
          </el-space>
        </template>
        <template #form_beforebegin="scope">
          <div class="mao-bo-li" style="position: sticky; top: 0; z-index: 121; padding: var(--z-size-10) var(--z-size-10)">
            <el-space>
              <el-button type="primary"
                         @click="page.callEvent('call:save', scope)">保存</el-button>
              <el-button type="primary"
                         @click="page.callEvent('call:save:file', scope)">保存本地文件</el-button>
              <el-button type="primary"
                         @click="page.callEvent('load:file')">加载本地文件</el-button>
              <el-button type="primary"
                         @click="page.callEvent('get:xml:file', scope)">导出小程序文件</el-button>
            </el-space>
          </div>
        </template>
        <template #prop_beforeend="scope">
<!--          {{scope.selfpath}}-->
          <template v-if="scope.selfpath === 'props'">
          </template>
          <template v-else-if="scope.selfpath === 'name'">
<!--            <h3>组件关系</h3>-->
<!--            <z-easy-modal>-->
<!--              <ZLayoutEditor-->
<!--                  :ref="layoutRef"-->
<!--                  :controls="false"-->
<!--                  :open-panel="false"-->
<!--                  :store-prefix="layoutStorePrefix"-->
<!--                  class="page-layout-editor"-->
<!--                  @save-layout="onSaveLayout"></ZLayoutEditor>-->
<!--            </z-easy-modal>-->
          </template>
          <template v-else>
            <!--            -->
          </template>
        </template>
        <template #prop_afterbegin="scope">

          <!--          {{scope}}-->
          <template v-if="scope.selfpath === 'props'">
            <h3>页面变量</h3>
          </template>
          <template v-else-if="scope.selfpath === 'onInited'">
            <h3>当初始化</h3>
          </template>
          <template v-else>
            <!--            -->
          </template>

        </template>
      </HttpComponent>
    </template>


  </div>
</template>

<script>

import '@/plugins/form-render/ext.js';
import {defineComponent, toRaw, onMounted, provide, reactive} from "vue";
import {
  extendControl2Page,
  useControl,
  useAppPageControl,
  PageControlMixin,
} from "@/mixins/framework";
import CustomElement from "@/components/CustomElement.vue";
import {FormsMana, useFormsMana} from "@/plugins/z-frame/formsMana";
import {FormsEvent} from "@/plugins/z-frame/formsEvent";
import FormsManaSelect from "@/plugins/z-frame/components/FormsManaSelect.vue";
import FormManager from "@/views/about/components/FormManager.vue";
// import ZLayoutEditor from "@/plugins/z-frame/components/ZLayoutEditor.vue";
import FormsLayoutSelect from "@/plugins/z-frame/components/FormsLayoutSelect.vue";
import {FormsLayout} from "@/plugins/z-frame/formsLayout";
// import EwMathJax from "@/components/Ew/EwMathjax.vue";
import {COMMAND, sendJSON5ChannelMessage} from "@/channel";
// import ZEasyModal from "@/plugins/z-frame/ZEasyModal.vue";
// import ZCascader from "@/plugins/z-frame/components/ZCascader.vue";
import {useRouter2} from "@/hooks/router";
import {VARS_PAGE_MODEL_NAME} from "@/vars";
// import ZDragXml from "@/plugins/z-frame/components/ZDragXml.vue";
// import ZOptionsManager from "@/plugins/z-frame/components/ZOptionsManager.vue";
// import ZEchartsEasy from "@/plugins/z-frame/components/ZEchartsEasy.vue";
// import ZQuickDialog from "@/plugins/z-frame/components/ZQuickDialog.vue";
import {formsToDef} from "@/plugins/z-frame/hooks/form";
import {fetchVueTpl} from "@/hooks/remote";
import tpllib from '@/utils/tpllib'
import {useToolApi} from "@/hooks/api";
import {buildFormDep} from "@/plugins/z-page/build";

/**
 *
 * @param name
 * @param fileMap { Map<String, String> }
 * @param fileSave
 * @returns {Promise<unknown>}
 */
function downloadFiles(name, fileMap, fileSave = ZY_EXT.FS.fileSave) {
  return new Promise(resolve => {
    if (globalThis.JSZip) {
      let zip = new globalThis.JSZip();
      fileMap.forEach((fileContent, fileName) => {
        zip.file(fileName, fileContent);
      })
      console.log(name)
      zip.generateAsync({type:"blob"})
          .then(function(content) {
            // see FileSaver.js
            fileSave(content, {
              fileName: name
            });
            resolve()
          });
    }
  })
}
globalThis.downloadFiles = downloadFiles

export default defineComponent({
  mixins: [
    PageControlMixin,
  ],
  data() {
    return {
    }
  },
  components: {
    // ZQuickDialog,
    // ZEchartsEasy,
    // ZOptionsManager,
    // ZDragXml,
    // ZCascader,
    // ZEasyModal,
    // EwMathJax,
    // FormsLayoutSelect,
    // ZLayoutEditor,
    // FormManager,
    // FormsManaSelect,
    // CustomElement,
  },
  setup(props, ctx) {

    let Lib;
    import('__remote/public/message.js').then(res => {
      Lib = res
    })
    // ZY.PinYin.initDict()
    let cachedPageControlModel = null
    let { currentRoute, router } = useRouter2()
    // console.log(currentRoute)
    let global_pageStoreName
    let global_path = currentRoute.query.path
    global_pageStoreName = currentRoute.query.storeName ?? VARS_PAGE_MODEL_NAME

    let toolApi = useToolApi();
    let state = reactive({
      loading: false
    })

    let comMap = new Map();
    provide('formPage', {
      registerCom(key, value) {
        comMap.set(key, value)
      }
    })

    function onInited({storeControl}) {
      page.commonLoadStep(
          import('./Form2EditorConfig'),
          'textarea_step',
          {
            async onMounted(config) {
              // console.log('commonLoadStep onMounted')
              let eventModel = await page.dispatchRoot('GetStoreEvents', {
                storeName: global_pageStoreName
              })
              cachedPageControlModel = eventModel
              page.setPartModel(config.name, 'form2', eventModel ?? {})
              // console.log('eventModel', config, eventModel)
            }
          }
      )
    }
    let properties =  {
      textarea_step: {
        type: String
      },
      domes: {
        type: Array
      },
    }
    let computedProps = {
    }
    let page = useControl({properties, computed: computedProps}, {
      onInited,
      extendContext: {
      },
      servicePrefix: 'PageDemoForm2Service'
    })
    page = extendControl2Page(page)
    page = useAppPageControl(page)

    let formsMana = useFormsMana();

    let currentFromDialog = null

    globalThis.getPageCachedModel = function () {
      return cachedPageControlModel
    }

    globalThis.getFormItem = function (
        {formName = 'process-step2', depId = 'ix4c', itemId = 'ix4c-ufobWE'} = {},
        model = cachedPageControlModel
    ) {
      const lodash = ZY.lodash
      const JSON5 = ZY.JSON5
      let formAlias = model.forms.find(form => form.name === formName)
      let formValue = JSON5.parse(formAlias.value)
      let part = formValue.parts[0]
      let propsObj = JSON5.parse(part.props)
      if (Array.isArray(propsObj.deps)) {
        let curDep = propsObj.deps.find(dep => dep.id === depId)
        if (curDep && Array.isArray(curDep.items)) {
          let curItem = curDep.items.find(item => item.id === itemId)
          if (curItem) {
            return {
              setData(updatedData = {}) {
                let data = JSON5.parse(item0.data)
                lodash.each(updatedData, function (objItem, objKey) {
                  // data.ui.label = ZY.Time.formatDateTime()
                  let updatedValue = objItem
                  if (lodash.isFunction(updatedValue)) {
                    updatedValue = objItem()
                  }
                  else {
                  //
                  }
                  lodash.set(data, objKey, updatedValue)
                })
                curItem.data = JSON5.stringify(data)
                // console.log(propsObj)
                part.props = JSON5.stringify(propsObj)
                formAlias.value = JSON5.stringify(formValue)
              }
            }
          }

          console.log('curItem', curDep, curItem)
        }
      }
      return null
    }

    function getPreviewUrl() {
      // console.log(global_path)
      var pattern = new ZUrlPattern(global_path);
      let obj = {}
      pattern.names.forEach(name => {
        obj[name] = ZY.rid(6)
      })
      return pattern.stringify(obj)
    }


    page.setEventHandler({
      ['add:arr:common'](e) {
        let { parts, partName, pathArr, process } = e
        // console.log('add:events', e, model)
        let s_path = ZY.getObjPathFromPathArr(pathArr)
        parts[partName].arrAppend(s_path)
      },
      async ['load:file'](e) {
        let obj = await ZY_EXT.fileOpenJSON5()
        if (obj.data) {
          await page.dispatchRoot('SetStoreLocal', {
            storeName: global_pageStoreName,
            data: obj.data
          })
          await ZY.sleep(300)
        }
        if (obj.layout) {
          // console.log('layout', obj.layout, obj)
          // await page.ctx.LayoutContext.importToolsData(obj.layout)
          await page.runRefMethod('layout', 'importToolsData', obj.layout)
          await ZY.sleep(300)
          // await page.ctx.LayoutContext.saveCache2Storage(obj.layout)
          await page.runRefMethod('layout', 'saveCache2Storage', obj.layout)
        }
        await ZY.sleep(300)
        location.reload()
      },
      async ['cursform:event'](e) {
        // console.log('cursform:event', e)
        let scope = e.scope
        if (scope.type === 'dragxml:closed') {
          scope.e.scope.save()
        }
      },
      async ['call:save'](e) {
        let { parts, partName, pathArr, process } = e
        try {
          // console.log(parts[partName],  page, comMap)
          // let pArr = []
          // comMap.forEach(function (value) {
          //   if (value && value.save) {
          //     pArr.push(
          //         new Promise (function(resolve, reject) {
          //           value.save().then((res) => {
          //             resolve(res)
          //           })
          //         })
          //     )
          //   }
          // })
          // console.log(pArr)
          // Promise.all(pArr).then(async (resArr) => {
          //   // console.log(resArr)
          //
          // })
          // console.log(cachedPageControlModel)
          state.loading = true
          let value = ZY.JSON5.parse(cachedPageControlModel.value)
          let form = value.parts[0]
          let drag_cached = ZY.JSON5.parse(form.drag_cached)
          // console.log(drag_cached)

          // console.log(import.meta.env)
          if (import.meta.env.MODE !== 'development') {
            let res = await toolApi.saveJson(form.properties,
                cachedPageControlModel.name + '.json5',
                {
                  newProps: ZY.JSON5.parse(form.properties),
                  oldProps: drag_cached.oldProps
                }
            )
            form.metas = {
              form_data: res
            }
          }

          cachedPageControlModel.value = ZY.JSON5.stringify(value)
          let formDef = buildFormDep(value, value.name, {
            src: 'comformscr2.twig'
          });
          // console.log(value, formDef)
          cachedPageControlModel.def = formDef.init.def

          // console.log(form, res, cachedPageControlModel)
          await page.dispatchRoot('SetStoreLocal', {
            storeName: global_pageStoreName,
            data: cachedPageControlModel
          })
          window.parent.postMessage(
              new Lib.CommandMessage('form:save', {
                metas: form.metas,
                form
              }),
              '*')

          state.loading = false
        } catch (e) {
          console.log('JSON5 parse err', e, cachedPageControlModel)
        }
        // try {
        //   let res = await Req.post('/api-assess/assess_json/json', JSON.stringify(obj.props))
        //   obj.metas = {
        //     form_data: res.data
        //   }
        //   onChange()
        // } catch (e) {
        //   console.log(e)
        // }
      },
      ['call:save:file'](e) {
        // console.log(e)
        let {partName, parts} = e
        let model = parts[partName].getModel()
        let obj = toRaw(
            model
        )
        let saved = {
          data: obj,
          date: Date.now()
        }


        // saved.layout = page.runRefMethod('layout', 'getToolsData')

        // let d = new Date()
        let fileName = obj.name ??  ZY.rid(6)
        // let time = ZY.Time.formatDateTime(d, 'YYYY-MM-DD__HH')

        // console.log('call:save:file', saved)
        // ZY_EXT.saveObjAsJson5File(saved, `page_${fileName}_${time}_${d.getTime()}`)
        ZY_EXT.saveJSONFile({data: saved, fileName, prefix: 'form2_',
          saveFun(str, {file} ={}) {
            // console.log('saveDesignFile', str)
            return ZY_EXT.saveStrUseFS(str, {
              extensions: ['.json5'],
              fileName: file,
              type: 'text/plain',
            })
          }
        })
      },
      async ['get:xml:file'](e) {
        // let {partName, parts} = e
        const ZFORM_RELATIVE_PATH = '../zform';
        let prefix = ZY.Time.formatDateTime(new Date(), 'YYYY-MM-DD__HH_mm_ss')
        if (cachedPageControlModel && cachedPageControlModel.def) {

          let value = ZY.JSON5.parse(cachedPageControlModel.value)
          let form = value.parts[0]

          let formConfig = cachedPageControlModel.def
          let partStrArr = tpllib.getPartStrArr(formConfig, tpllib.renderWeappForm);
          let partStrArrFirst = partStrArr[0]
          // let  partStr = {
          //   [partStrArrFirst.name]: partStrArrFirst.value
          // }

          // console.log(partStr)
          let fileMap = new Map();

          let formComName = cachedPageControlModel.name;
          let formSlotComName = formComName + '-slots';



          // 处理form slots的导出
          ;( function () {
            let templateArr = form.slots.map(slot => {
              console.log(slot.value)
              let obj = {
                web: '',
                weapp: '',
              }
              try {
                obj = ZY.JSON5.parse(slot.value)
              } catch (e) {
              //
              }
              return `
<template name="${slot.name}">
${obj.weapp}
</template>
`
            })

            let slotman = globalThis.createParseComponentMan(
                document.getElementById('output-form-slot-com-tpl').innerHTML
            );
            let templateContent = slotman.get('template').content;

            let xmlContent =  globalThis.twigRender(templateContent, {
              ZFORM_RELATIVE_PATH,
              slots_str: templateArr.join('\n')
            });
            console.log(xmlContent)
            fileMap.set(formSlotComName + '.wxml',  xmlContent);
            let scriptContent = slotman.get('script').content
            scriptContent = globalThis.twigRender(scriptContent, {
              ZFORM_RELATIVE_PATH,
            })
            fileMap.set(formSlotComName + '.js', scriptContent)
            let configContent = slotman.get('config').content
            fileMap.set(formSlotComName + '.json', configContent)
          })();


          // 处理form的导出
          ( function() {
            let man = globalThis.createParseComponentMan(
                document.getElementById('output-form-tpl').innerHTML
            );
            let templateContent = man.get('template').content
            let xmlContent =  globalThis.twigRender(templateContent, {
              ZFORM_RELATIVE_PATH,
              form_tpl:partStrArrFirst.value
            });
            // console.log(xmlContent)
            fileMap.set(formComName + '.wxml',  xmlContent)
            let scriptContent = man.get('script').content
            scriptContent = globalThis.twigRender(scriptContent, {
              ZFORM_RELATIVE_PATH,
              json5_config: ZY.JSON5.stringify(formConfig.parts[0]),
            })
            fileMap.set(formComName + '.js', scriptContent);
            let configContent = man.get('config').content;
            configContent = globalThis.twigRender(configContent, {
              ZFORM_RELATIVE_PATH,
              slot_com_name: formSlotComName,
              cm_field_name: 'cm-field',
            })
            fileMap.set(formComName + '.json', configContent)
          })();

          // 处理slot的导出

          console.log(cachedPageControlModel, form)

          downloadFiles(cachedPageControlModel.name + '__' + prefix, fileMap)
        }



        // ZY_EXT.saveStrAs(res.data, {
        //   file: 'test.vue'
        // })
        // await ZY_EXT.saveStrUseFS(res, {
        //   fileName: obj.name + '.vue',
        //   extensions: ['.vue'],
        //   type: 'text/plain',
        //   options: {
        //     mimeTypes: ['text/*'],
        //   }
        // })
        // console.log(forms, def)
      },
      ['add:part'](e) {
        let { parts, partName, selfpath, process } = e
        parts[partName].arrAppend(selfpath)
      },
      ['add:forms'](e) {
        let { parts, partName, selfpath, process } = e
        parts[partName].arrAppend(selfpath)
      },
      async ['forms:select-form'](e) {
        let {value, scope} = e
        let { parts, partName, selfpath, process } = currentFromDialog
        // console.log('forms:select-form', e, currentFromDialog)
        // let obj = ZY.JSON5.parse(value.value)
        let appendData = {
          name: value.label,
          value: value.value
        }
        // console.log(appendData)
        parts[partName].arrAppend(selfpath, appendData)
        await ZY.sleep(300)
        page.webComponentRef.toggleDialog('form-mana-dialog');
      },
      async ['load:single:forms'](e) {
        let { parts, partName, selfpath } = e
        // console.log(parts[partName], selfpath)
        try {
          let data = await FormsMana.readFile()
          let appendData = data[0].value
          let updatedPath = `${selfpath}.value`
          // console.log('sdsdsds', updatedPath,
          // ZY.JSON5.parse(appendData)
          // )
          parts[partName].setModelByPath(updatedPath, appendData)
        } catch (e) {
        //
        }
      },
      async ['load:single:layoutSlotArr'](e) {
        let { parts, partName, selfpath } = e
        // console.log(parts[partName], selfpath)
        try {
          let data = await FormsLayout.readFile()
          let appendData = data[0].value
          let updatedPath = `${selfpath}`
          // console.log('sdsdsds', updatedPath,appendData)
          parts[partName].setModelByPath(updatedPath, appendData)
        } catch (e) {
          //
          console.log(e)
        }
      },
      async ['save:single:forms'](e) {
        let { parts, partName, selfpath } = e
        let model = parts[partName].getModel()
        let current = toRaw(ZY.lodash.get(model, selfpath))
        console.log('save:single:forms', e, current)
        await FormsMana.saveCache2File(
           [
             current
           ],
            {
              fileName: current.name
            }
        )
      },
      ['save:forms'](e) {
        let { parts, partName } = e
        let model = parts[partName].getModel()
        let forms = toRaw(
            ZY.lodash.get(model, 'forms')
        )
        // console.log('save:forms', forms, formsMana)
        formsMana.setStorage(forms)
      },
      async ['save:forms:file'](e) {
        let {parts, partName} = e
        let model = parts[partName].getModel()
        // let forms = toRaw(
        //     ZY.lodash.get(model, 'forms')
        // )
        // ZY_EXT.saveObjAsJson5File({
        //   data: forms,
        //   date: Date.now()
        // }, 'forms_' + ZY.rid(6))
        await FormsMana.saveCache2File(
            ZY.lodash.get(model, 'forms', [])
        )
      },
      ['open:forms'](e) {
        currentFromDialog = e
        page.refsManager.runCom('form-mana-select', 'load')
        page.webComponentRef.toggleDialog('form-mana-dialog');
      },
      async ['forms:select-layout'](e) {
        let {value, scope} = e
        let { parts, partName, selfpath, process } = currentFromDialog
        // console.log('forms:select-form', e, currentFromDialog)
        // let obj = ZY.JSON5.parse(value.value)
        let appendData = ZY.JSON5.parse(ZY.JSON5.stringify(value))
        // let appendData = {
        //   name: value.label,
        //   value: value.value
        // }
        // // console.log(appendData)
        parts[partName].arrAppend(selfpath, appendData)
        await ZY.sleep(300)
        page.webComponentRef.toggleDialog('form-layout-dialog');
      },
      ['open:layoutSlotArr'](e) {
        currentFromDialog = e
        page.refsManager.runCom('form-layout-select', 'load')
        page.webComponentRef.toggleDialog('form-layout-dialog');
      },
      async ['save:single:layoutSlotArr'](e) {
        let {parts, partName, selfpath} = e
        let current = toRaw(
            parts[partName].getModelByPath(selfpath)
        )
        await FormsLayout.saveCache2File(
            [
              {
                name: current.name,
                value: current
              }
            ],
            {
              fileName: current.name
            }
        )
      },
      ['add:events'](e) {
        let { parts, partName, selfpath } = e
        parts[partName].arrAppend(selfpath)
        // console.log('add:events',  parts[partName])
      },
      ['open:events'](e) {
        currentFromDialog = e
        page.refsManager.runCom('form-event-select', 'load')
        page.webComponentRef.toggleDialog('form-event-dialog');
      },
      async ['save:single:events'](e) {
        let { parts, partName, selfpath } = e
        let model = parts[partName].getModel()
        let current = toRaw(ZY.lodash.get(model, selfpath))
        // console.log('save:single:events', e, current)
        await FormsEvent.saveCache2File(
            [
              {
                name: current.name,
                value: current
              }
            ],
            {
              fileName: current.name
            }
        )
      },
      async ['forms:select-event'](e) {
        let {value, scope} = e
        let { parts, partName, selfpath, process } = currentFromDialog
        // console.log('forms:select-form', e, currentFromDialog)
        let appendData = value
        // // console.log(appendData)
        parts[partName].arrAppend(selfpath, appendData)
        await ZY.sleep(300)
        page.webComponentRef.toggleDialog('form-event-dialog');
      },
      ['remove:events'](e) {
        // console.log('sdsdsdsdsdsds', e)
        let { parts, partName, fromPath, indexKey } = e
        parts[partName].arrSplice(fromPath, indexKey)
      },
      ['submit:form'](e) {
        let { scope, parts } = e
        let model = parts[scope.name].getModel()
        // console.log('submit:form',e, model);
        if (scope.process === page.store.model.textarea_step) {
          // console.log('sddddddddddddd');
        }
      },
      async ['load:plumb:layout']() {
        if (page.ctx.LayoutContext) {
          let obj = await ZY_EXT.fileOpenJSON5()
          if (obj.layout) {
            // console.log('layout', obj.layout, obj)
            await page.ctx.LayoutContext.importToolsData(obj.layout)
            await ZY.sleep(300)
            await page.ctx.LayoutContext.saveCache2Storage(obj.layout)
          }
        }
      },
      ['model:update:all'](e) {
        let { model, key, newVal, config } = e
        if (config.process === page.store.model.textarea_step) {
          console.log('page about model:update:all', model)
          cachedPageControlModel = model
        }
      },
      ['preview']() {
        let url = getPreviewUrl()
        let manager = ZY.BOM.createWindowManager({url: url, target: 'previewWin-' + global_pageStoreName})
        manager.open({
          left: window.innerWidth * .1,
          top: 50,
          width: 1440,
          height: 700
        })
        setTimeout(() => {
          let refernce = manager.getReference()
          // console.log(refernce, refernce.Z_PAGE_VERSION)
        }, 1000)
        // router.push(url)
      }
      // ['model:update'](e) {
      //   let { model, key, newVal, config } = e
      // }
    })


    // function detectChange() {
    //   let doms =  Array.of(
    //       ...document.querySelectorAll('.http-com .z-form__object [scroll-control]'))
    //   page.setData({
    //     domes: doms
    //   })
    //   if (Array.isArray(doms) && doms.length > 0) {
    //     interval1.stop()
    //   }
    // }
    //
    // let interval1 = new ZY.Interval(detectChange, 6000);
    // interval1.start()
    //
    // function jumpTo(o) {
    //   // console.log(o.getBoundingClientRect().top + window.scrollY)
    //   let top = o.getBoundingClientRect().top + window.scrollY - 40
    //   // ZY.U.scrollToView(o)
    //   window.scrollTo({
    //     top: top,
    //     behavior: "smooth"
    //   });
    // }

    async function onSaveLayout(e) {
      if (cachedPageControlModel) {

        // await page.dispatchRoot('SetStoreEvents', cachedPageControlModel)

        cachedPageControlModel.layoutDesign = e.currentData

        await page.dispatchRoot('SetStoreLocal', {
          storeName: global_pageStoreName,
          data: cachedPageControlModel
        })

      }
      console.log('onSaveLayout', cachedPageControlModel, e)
      // await ZY_EXT.store.setItem('current-data', e.currentData)
      // sendChannelMessage(COMMAND.RELOAD)
      sendJSON5ChannelMessage({
        type: COMMAND.RELOAD,
        e: {}
      })
    }

    let layoutRef = page.setRef('layout')

    onMounted(() => {
      // console.log('onMounted')
    })

    // let formula = `x^{y^z}=(1+{\\rm e}^x)^{-2xy^w}`

    let layoutStorePrefix = global_pageStoreName + '-play'


    function onClosed() {
      console.log('sdsdsds')
    }


    return {
      layoutRef,
      store: page.store,
      onSaveLayout,
      // formula,
      state,
      getPreviewUrl,
      onClosed,
      layoutStorePrefix,
      // jumpTo,
      page,
      allDef: page.defMap,
    }
  }
})
</script>
