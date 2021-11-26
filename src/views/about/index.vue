<style lang="scss">
.page-layout-editor {
  .element-panel {
    display: none;
  }
}
.page-search {
  //--z-emoji-zoom: 0.9;
}
.em-props-item--active {
  width: 700px;
  height: 75vh;
}
</style>

<template>
  <div class="page-search" v-if="page.inited">
<!--    {{store.model}}-->
<!--    {{store.computedModel}}-->

<!--    <my-fixed>-->
<!--      <el-card class="box-card" v-show="page.dxValue('ZY_ARRAY_NOT_EMPTY(MODEL(\'domes\'))')">-->
<!--        <template #header>-->
<!--          <div class="card-header">-->
<!--            <span>跳转</span>-->
<!--          </div>-->
<!--        </template>-->
<!--       <el-space direction="vertical">-->
<!--         <div v-for="o in store.model.domes"-->
<!--              style="cursor: pointer;"-->
<!--              @click="jumpTo(o)"-->
<!--              :key="o" class="text item">-->
<!--           {{o && o.getAttribute('scroll-control')}}-->
<!--         </div>-->
<!--       </el-space>-->
<!--      </el-card>-->
<!--    </my-fixed>-->
<!--    <z-quick-dialog title="编辑" :modelAttr="{width: '100vw'}">-->
<!--      <template #button-content>打开数据展示</template>-->
<!--      <template #default>-->
<!--        <z-drag-xml></z-drag-xml>-->
<!--      </template>-->
<!--    </z-quick-dialog>-->

<!--    <z-drag-xml></z-drag-xml>-->

    <CustomElement is="my-vue-dialog" name="form-event-dialog"
                   :params="{sstyle: 'width: 60vw; min-width: 720px;'}">
      <template #default="scope">
        <FormsEventSelect
            com-name="form-event-select"
            @select-form="page.callEvent('forms:select-event', {
              scope,
              value: $event
            })"></FormsEventSelect>
      </template>
    </CustomElement>

    <CustomElement is="my-vue-dialog" name="form-mana-dialog"
                   :params="{sstyle: 'width: 60vw; min-width: 720px;'}">
      <template #default="scope">
<!--        {{scope}}-->
        <FormsManaSelect
            com-name="form-mana-select"
            @select-form="page.callEvent('forms:select-form', {
              scope,
              value: $event
            })"></FormsManaSelect>
      </template>
    </CustomElement>


    <CustomElement is="my-vue-dialog" name="form-layout-dialog"
                   :params="{sstyle: 'width: 60vw; min-width: 720px;'}">
      <template #default="scope">
<!--                {{scope}}-->
        <FormsLayoutSelect
            com-name="form-layout-select"
            @select-form="page.callEvent('forms:select-layout', {
              scope,
              value: $event
            })"></FormsLayoutSelect>
      </template>
    </CustomElement>

<!--    <z-cascader></z-cascader>-->

<!--    <z-options-manager></z-options-manager>-->

<!--   <z-echarts-easy></z-echarts-easy>-->

<!--    <z-wang-editor></z-wang-editor>-->

<!--    <z-style-editor></z-style-editor>-->
<!--    <z-address></z-address>-->

    <template v-if="store.model.textarea_step">
      <!--      {{store.computedModel}}-->
      <HttpComponent
          :defs="allDef"
          :is="store.model.textarea_step"
          :debug="false"
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
              <el-button type="primary" @click="page.callEvent('call:save', scope)">保存</el-button>
              <el-button type="primary" @click="page.callEvent('call:save:file', scope)">保存文件</el-button>
              <el-button type="primary" @click="page.callEvent('load:file')">加载文件</el-button>
              <el-button type="primary" @click="page.callEvent('preview')">打开预览</el-button>
              <el-button ><router-link class="el-link" to="/form" >跳转Form</router-link></el-button>
            </el-space>
          </div>
        </template>
        <template #prop_beforeend="scope">
<!--          {{scope.selfpath}}-->
          <template v-if="scope.selfpath === 'props'">
          </template>
          <template v-else-if="scope.selfpath === 'name'">
            <h3>组件关系</h3>
            <z-easy-modal>
              <ZLayoutEditor
                  :ref="layoutRef"
                  :controls="false"
                  :open-panel="false"
                  :store-prefix="layoutStorePrefix"
                  class="page-layout-editor"
                  @save-layout="onSaveLayout"></ZLayoutEditor>
            </z-easy-modal>
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
import {defineComponent, toRaw, onMounted} from "vue";
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
import ZLayoutEditor from "@/plugins/z-frame/components/ZLayoutEditor.vue";
import FormsLayoutSelect from "@/plugins/z-frame/components/FormsLayoutSelect.vue";
import {FormsLayout} from "@/plugins/z-frame/formsLayout";
import EwMathJax from "@/components/Ew/EwMathjax.vue";
import {COMMAND, sendJSON5ChannelMessage} from "@/channel";
import ZEasyModal from "@/plugins/z-frame/ZEasyModal.vue";
import ZCascader from "@/plugins/z-frame/components/ZCascader.vue";
import {useRouter2} from "@/hooks/router";
import {VARS_PAGE_MODEL_NAME} from "@/vars";
import ZDragXml from "@/plugins/z-frame/components/ZDragXml.vue";
import ZOptionsManager from "@/plugins/z-frame/components/ZOptionsManager.vue";
import ZEchartsEasy from "@/plugins/z-frame/components/ZEchartsEasy.vue";
import ZQuickDialog from "@/plugins/z-frame/components/ZQuickDialog.vue";
// import ZWangEditor from "@/plugins/z-frame/components/ZWangEditor.vue";
// import ZStyleEditor from "@/plugins/z-frame/components/ZStyleEditor.vue";
import ZAddress from "@/plugins/z-frame/components/ZAddress.vue";


export default defineComponent({
  mixins: [
    PageControlMixin,
  ],
  data() {
    return {
    }
  },
  components: {
    ZAddress,
    // ZStyleEditor,
    // ZWangEditor,
    ZQuickDialog,
    ZEchartsEasy,
    ZOptionsManager,
    ZDragXml,
    ZCascader,
    ZEasyModal,
    EwMathJax,
    FormsLayoutSelect,
    ZLayoutEditor,
    FormManager,
    FormsManaSelect,
    CustomElement,
  },
  setup(props, ctx) {

    // ZY.PinYin.initDict()
    let cachedPageControlModel = null
    let { currentRoute, router } = useRouter2()
    // console.log(currentRoute)
    let global_pageStoreName
    let global_path = currentRoute.query.path
    global_pageStoreName = currentRoute.query.storeName ?? VARS_PAGE_MODEL_NAME

    function onInited({storeControl}) {
      if (!currentRoute.query.page) {
        alert('缺少page')
      } else {

        page.commonLoadStep(
            import('./EventEditorConfig'),
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
      servicePrefix: 'PageDemoIndexService'
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
      ['call:save'](e) {
        page.runRefMethod('layout', 'save')
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


        saved.layout = page.runRefMethod('layout', 'getToolsData')

        let d = new Date()
        let fileName = obj.name ??  ZY.rid(6)
        let time = ZY.Time.formatDateTime(d, 'YYYY-MM-DD__HH')

        console.log('call:save:file', saved)
        ZY_EXT.saveObjAsJson5File(saved, `page_${fileName}_${time}_${d.getTime()}`)
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
          // console.log('page about model:update:all', model)
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

    let formula = `x^{y^z}=(1+{\\rm e}^x)^{-2xy^w}`

    let layoutStorePrefix = global_pageStoreName + '-play'

    return {
      layoutRef,
      store: page.store,
      onSaveLayout,
      formula,
      getPreviewUrl,
      layoutStorePrefix,
      // jumpTo,
      page,
      allDef: page.defMap,
    }
  }
})
</script>
