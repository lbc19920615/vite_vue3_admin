<style lang="scss">
.page-layout-editor {
  .element-panel {
    display: none;
  }
}
.page-form2 {
  //height: 100vh;
  //overflow: auto;
  //overflow-x: hidden;
  //background: #000;
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

    <wechat-export-dialog
        :ref="wechatDialogRef" :page="page"
        @submit="page.callEvent('get:xml:file', $event)"
    ></wechat-export-dialog>
    <vue2-export-dialog
        :ref="vue2DialogRef" :page="page"
        @submit="page.callEvent('get:vue:file', $event)"
    ></vue2-export-dialog>

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
          <div class="mao-bo-li" style="position: sticky; top: 0; z-index: 121; padding: var(--z-size-10) var(--z-size-10);">
            <el-space>
              <el-button type="primary"
                         @click="page.callEvent('call:save', scope)">保存</el-button>
              <el-button type="primary"
                         @click="page.callEvent('call:save:file', scope)">保存本地文件</el-button>
              <el-button type="primary"
                         @click="page.callEvent('load:file')">加载本地文件</el-button>
              <el-button type="primary"
                         @click="page.callEvent('open:dialog')">导出小程序文件</el-button>
              <el-button type="primary"
                         @click="page.callEvent('open:vue2')">导出vue2文件</el-button>
            </el-space>
          </div>
        </template>
        <template #prop_beforeend="scope">
<!--          {{scope.selfpath}}-->
          <template v-if="scope.selfpath === 'props'">
          </template>
          <template v-else-if="scope.selfpath === 'name'">
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
import {COMMAND, sendJSON5ChannelMessage} from "@/channel";

import {useRouter2} from "@/hooks/router";
import {VARS_PAGE_MODEL_NAME} from "@/vars";

// import formConfig from './Form2EditorConfig';
import tpllib from '@/utils/tpllib'
// import {useToolApi} from "@/hooks/api";
import {buildFormDep} from "@/plugins/z-page/build";
import WechatExportDialog from "@/views/about/components/WechatExportDialog.vue";
import {createDeepTraverl} from "@/hooks/deep";
import Vue2ExportDialog from "@/views/about/components/Vue2ExportDialog.vue";

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
    Vue2ExportDialog,
    WechatExportDialog
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
    let iframeCached = null
    let Lib;
    /* @vite-ignore */
    globalThis.importScripts(location.origin + '/server1/message.js')
        .then(res => {
          Lib = res
          window.parent.postMessage(
              new Lib.CommandMessage('__form:inited__', {
              }),
              '*')
        })

    window.addEventListener('message', function (e) {
      if (Lib) {
        let data = e.data
        let isCustom = Lib.detectIsCustomMessage(data)
        if (isCustom) {
          let {name, value} = data.msg
          if (name === '__iframe:ok__') {
            iframeCached = value
          }
        }
      }
    })




    // ZY.PinYin.initDict()
    let cachedPageControlModel = null
    let { currentRoute, router } = useRouter2()
    // console.log(currentRoute)
    let global_pageStoreName
    let global_path = currentRoute.query.path
    global_pageStoreName = currentRoute.query.storeName ?? VARS_PAGE_MODEL_NAME

    globalThis.getCachedPageControlModel =function () {
      return cachedPageControlModel
    }

    let toolApi = null;
    import('@/hooks/api').then(res => {
      toolApi = res.useToolApi();
    })

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
          // (async function() {
          //   return {
          //     default: formConfig
          //   }
          // })(),
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
    let wechatDialogRef = page.setRef('wechatDialogRef')
    let vue2DialogRef = page.setRef('vue2DialogRef')
    // let formsMana = useFormsMana();

    let currentFromDialog = null

    globalThis.getPageCachedModel = function () {
      return cachedPageControlModel
    }

    // function getPreviewUrl() {
    //   // console.log(global_path)
    //   var pattern = new ZUrlPattern(global_path);
    //   let obj = {}
    //   pattern.names.forEach(name => {
    //     obj[name] = ZY.rid(6)
    //   })
    //   return pattern.stringify(obj)
    // }

    let comEventHandler = new Map();
    page.setComEventHandler = function (name, value) {
      comEventHandler.set(name, value)
    }
    page.execComEventHandler = function (name, e) {
      if (comEventHandler.has(name)) {
        comEventHandler.get(name)(e)
      }
    }

    // console.log(window.process);
    page.setEventHandler({
      ['add:arr:common'](e) {
        let { parts, partName, pathArr, process } = e
        // console.log('add:events', e, model)
        let s_path = ZY.getObjPathFromPathArr(pathArr)
        parts[partName].arrAppend(s_path)
      },
      async ['load:file'](e) {
        try {
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
        } catch (e) {
          console.log(e)
        }
      },

      async ['call:save'](e) {
        let { parts, partName, pathArr, process } = e

        async function onSuccess(value, form) {
          cachedPageControlModel.value = ZY.JSON5.stringify(value)
          let formDef = buildFormDep(value, value.name, {
            src: 'comformscr2.twig'
          });
          // console.log(value, formDef)
          cachedPageControlModel.def = formDef.init.def
          cachedPageControlModel.metas = form.metas

          console.log(form, cachedPageControlModel)
          await page.dispatchRoot('SetStoreLocal', {
            storeName: global_pageStoreName,
            data: cachedPageControlModel
          })
          window.parent.postMessage(
              new Lib.CommandMessage('form:save', {
                metas: getMetas(form.metas),
                formName: cachedPageControlModel.name,
                form
              }),
              '*')
        }

        function getMetas(metas) {
          if (typeof metas === 'string') {
            return ZY.JSON5.parse(metas)
          }
          return metas
        }

        try {
          state.loading = true
          // console.log(parts[partName],  page, comMap)
          let pArr = []
          comMap.forEach(function (value) {
            if (value && value.save) {
              pArr.push(
                  new Promise (function(resolve, reject) {
                    value.save().then((res) => {
                      resolve(res)
                    })
                  })
              )
            }
          })
          // console.log(pArr)
          Promise.all(pArr).then(async (resArr) => {
            // console.log(cachedPageControlModel)
            // console.log(resArr)
            let value = ZY.JSON5.parse(cachedPageControlModel.value)
            let form = value.parts[0]
            let drag_cached = ZY.JSON5.parse(form.drag_cached)
            let metas = getMetas(form.metas)
            // console.log(drag_cached)


            // console.log( metas)
            if (import.meta.env.MODE !== 'development') {
              let [err, res] = await ZY.awaitTo(
                  toolApi.saveJson(form.properties,
                      cachedPageControlModel.name + '.json5',
                      {
                        headers: {
                          'X-Access-Token': iframeCached ? iframeCached.token : '',
                        },
                        data: {
                          formName: cachedPageControlModel.name
                        },
                        newProps: ZY.JSON5.parse(form.properties),
                        oldProps: drag_cached.oldProps,
                        // tableName: metas?.form_data ?? ''
                      }
                  )
              );
              if (err) {
                globalThis.ElMessage.error('保存表单失败 saveJson')
                return;
              }
              console.log('res', res)
              form.metas = ZY.JSON5.stringify({
                form_data: res
              })
              await onSuccess(value, form)
            } else {
              await onSuccess(value, form)
            }



            state.loading = false
          })



        } catch (e) {
          console.log('JSON5 parse err', e, cachedPageControlModel)
        }

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
      async ['open:dialog'](e) {
        let dialog = page.getRef('wechatDialogRef')
        dialog.show();
      },
      async ['open:vue2'](e) {
        let dialog = page.getRef('vue2DialogRef')
        dialog.show();
      },
      async ['get:vue:file'](e) {
        let {model = {}} = e;
        let JSON5 = ZY.JSON5;
        let lodash = ZY.lodash;

        const ZFORM_RELATIVE_PATH = model?.libPath ?? '@/zform/zform';
        const FORM_TPL_ID = 'output-form-vue2-tpl';
        let prefix = 'vue2__';
        let suffix = '__' + ZY.Time.formatDateTime(new Date(), 'YYYY-MM-DD__HH_mm_ss');

        function replaceEventName(str) {
          return str.replaceAll('@tap', '@click');
        }

        if (cachedPageControlModel && cachedPageControlModel.def) {
          let formComName = cachedPageControlModel.name;
          let value = JSON5.parse(cachedPageControlModel.value);
          let form = value.parts[0];

          let fileMap = new Map();
          // let formProperties = JSON5.parse(form.properties);
          // console.log(formProperties)
          console.log(cachedPageControlModel)
          // 处理form slots的导出
          ;( function () {
            let formConfig = cachedPageControlModel.def;
            let json5_config = JSON5.stringify(formConfig.parts[0]);
            let templateContent = document.getElementById(FORM_TPL_ID).innerHTML
            let templateArr = form.slots.map(slot => {
              // console.log(slot.value)
              let obj = {
                web: '',
                weapp: '',
              }
              try {
                obj = JSON5.parse(slot.value)
              } catch (e) {
                //
              }
              return `
<template v-slot:${slot.name}="scope">
${replaceEventName(obj.web)}
</template>
`;
            });
            let xmlContent =  globalThis.twigRender(templateContent, {
              ZFORM_RELATIVE_PATH,
              formComName,
              slots_str: templateArr.join('\n'),
              json5_config,
              metas: cachedPageControlModel.metas
            });
            fileMap.set(formComName + '.vue',  xmlContent);
          })();

          globalThis.downloadFiles(prefix + formComName + suffix, fileMap)
        }
      },
      async ['get:xml:file'](e) {
        let {model = {}} = e;
        let JSON5 = ZY.JSON5;
        let lodash = ZY.lodash;

        const ZFORM_RELATIVE_PATH = model?.libPath ?? '../zform';
        const FORM_SLOT_TPL_ID = 'output-form-slot-com-tpl';
        const FORM_TPL_ID = 'output-form-tpl';
        const CM_FIELD_NAME = 'cm-field';
        const CM_FIELD_PREFIX = 'cm-field--';

        let prefix = 'mp-weixin__';
        let suffix = '__' + ZY.Time.formatDateTime(new Date(), 'YYYY-MM-DD__HH_mm_ss')
        if (cachedPageControlModel && cachedPageControlModel.def) {

          let value = JSON5.parse(cachedPageControlModel.value);
          let form = value.parts[0];
          let formProperties = JSON5.parse(form.properties);
          console.log(formProperties)

          let deepTraverl = createDeepTraverl({
            handleProp({obj, s_path, path, ext}) {
              let fieldKey = path[path.length - 1]
              let config = lodash.get(formProperties, s_path);
              // console.log(config, key)
              if (config.css) {
                let cssarr = []
                let parsed = JSON5.parse(config.css);
                lodash.each(parsed.cached, function (item, key) {
                  let selector = (`.${CM_FIELD_PREFIX}${fieldKey} ` + key.replaceAll(':host', 'rich-text')
                      .replace('(', '')
                      .replace(')', ''));
                  cssarr.push(
                      [
                        selector,
                        ZY.CSS.parseObj(item, {
                          split: ';\n',
                        }).trim()
                      ]
                  )
                })
                // console.log(parsed, cssarr)
                obj[fieldKey] = cssarr.map(([selector, css]) => {
                if (css) {
                  return `${selector} {
${css}
}`
                }
                return ''
                }).filter(v => v).join('\n')
              }

            }
          });
          let wsxxobj =deepTraverl.run(formProperties);
          let wsxxstr = Object.entries(wsxxobj).map(v => {
            return v[1]
          }).join('\n')
          // console.log(wsxxstr);


          let formConfig = cachedPageControlModel.def;
          let partStrArr = tpllib.getPartStrArr(formConfig, tpllib.renderWeappForm);
          let partStrArrFirst = partStrArr[0];
          // console.log(partStrArrFirst)
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
              // console.log(slot.value)
              let obj = {
                web: '',
                weapp: '',
              }
              try {
                obj = JSON5.parse(slot.value)
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
                document.getElementById(FORM_SLOT_TPL_ID).innerHTML
            );
            let templateContent = slotman.get('template').content;

            let xmlContent =  globalThis.twigRender(templateContent, {
              ZFORM_RELATIVE_PATH,
              formComName,
              slots_str: templateArr.join('\n')
            });
            // console.log(xmlContent)
            fileMap.set(formSlotComName + '.wxml',  xmlContent);
            let scriptContent = slotman.get('script').content
            scriptContent = globalThis.twigRender(scriptContent, {
              ZFORM_RELATIVE_PATH,
              formComName
            })
            fileMap.set(formSlotComName + '.js', scriptContent)
            let configContent = slotman.get('config').content
            fileMap.set(formSlotComName + '.json', configContent)
          })();


          // 处理form的导出
          ( function() {
            let man = globalThis.createParseComponentMan(
                document.getElementById(FORM_TPL_ID).innerHTML
            );
            let templateContent = man.get('template').content
            let xmlContent =  globalThis.twigRender(templateContent, {
              ZFORM_RELATIVE_PATH,
              formComName,
              form_tpl:partStrArrFirst.value
            });
            // console.log(xmlContent)
            fileMap.set(formComName + '.wxml',  xmlContent)
            let scriptContent = man.get('script').content
            scriptContent = globalThis.twigRender(scriptContent, {
              ZFORM_RELATIVE_PATH,
              formComName,
              json5_config: JSON5.stringify(formConfig.parts[0]),
            })
            fileMap.set(formComName + '.js', scriptContent);
            let configContent = man.get('config').content;
            configContent = globalThis.twigRender(configContent, {
              ZFORM_RELATIVE_PATH,
              formComName,
              slot_com_name: formSlotComName,
              cm_field_name: CM_FIELD_NAME,
            })
            fileMap.set(formComName + '.json', configContent);
            let styleContent = man.get('styles')[0].content;
            // console.log(styleContent)
            // let cssContent = wsxxstr.trim();
            let cssContent = globalThis.twigRender(styleContent, {
              css: wsxxstr.trim(),
              ZFORM_RELATIVE_PATH,
              formComName,
            })
            fileMap.set(formComName + '.wxss', cssContent)
          })();

          console.log(cachedPageControlModel, form)

          globalThis.downloadFiles(prefix + formComName + suffix, fileMap)
        }
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
      // ['add:events'](e) {
      //   let { parts, partName, selfpath } = e
      //   parts[partName].arrAppend(selfpath)
      //   // console.log('add:events',  parts[partName])
      // },
      // ['open:events'](e) {
      //   currentFromDialog = e
      //   page.refsManager.runCom('form-event-select', 'load')
      //   page.webComponentRef.toggleDialog('form-event-dialog');
      // },
      // async ['save:single:events'](e) {
      //   let { parts, partName, selfpath } = e
      //   let model = parts[partName].getModel()
      //   let current = toRaw(ZY.lodash.get(model, selfpath))
      //   // console.log('save:single:events', e, current)
      //   await FormsEvent.saveCache2File(
      //       [
      //         {
      //           name: current.name,
      //           value: current
      //         }
      //       ],
      //       {
      //         fileName: current.name
      //       }
      //   )
      // },
      // async ['forms:select-event'](e) {
      //   let {value, scope} = e
      //   let { parts, partName, selfpath, process } = currentFromDialog
      //   // console.log('forms:select-form', e, currentFromDialog)
      //   let appendData = value
      //   // // console.log(appendData)
      //   parts[partName].arrAppend(selfpath, appendData)
      //   await ZY.sleep(300)
      //   page.webComponentRef.toggleDialog('form-event-dialog');
      // },
      // ['remove:events'](e) {
      //   // console.log('sdsdsdsdsdsds', e)
      //   let { parts, partName, fromPath, indexKey } = e
      //   parts[partName].arrSplice(fromPath, indexKey)
      // },
      ['submit:form'](e) {
        let { scope, parts } = e
        let model = parts[scope.name].getModel()
        // console.log('submit:form',e, model);
        if (scope.process === page.store.model.textarea_step) {
          // console.log('sddddddddddddd');
        }
      },
      // async ['load:plumb:layout']() {
      //   if (page.ctx.LayoutContext) {
      //     let obj = await ZY_EXT.fileOpenJSON5()
      //     if (obj.layout) {
      //       // console.log('layout', obj.layout, obj)
      //       await page.ctx.LayoutContext.importToolsData(obj.layout)
      //       await ZY.sleep(300)
      //       await page.ctx.LayoutContext.saveCache2Storage(obj.layout)
      //     }
      //   }
      // },
      ['model:update:all'](e) {
        let { model, key, newVal, config } = e
        if (config.process === page.store.model.textarea_step) {
          // console.log('page about model:update:all', model)
          // cachedPageControlModel = model
          Object.entries(model).forEach(([key, value]) => {
            cachedPageControlModel[key] = model[key]
          })
        } else {
          page.execComEventHandler('model:update:all', e)
        }
      },
    })


    function onClosed() {
      console.log('onClosed')
    }


    return {
      store: page.store,
      vue2DialogRef,
      wechatDialogRef,
      state,
      onClosed,
      page,
      allDef: page.defMap,
    }
  }
})
</script>
