<style lang="scss">
.page-layout-editor {
  .element-panel {
    display: none;
  }
}
.page-search {
  //--z-emoji-zoom: 0.9;
}
</style>

<template>
  <div class="page-search" v-if="page.inited">
<!--    {{store.model}}-->
<!--    {{store.computedModel}}-->

    <my-fixed>
      <el-card class="box-card" v-show="page.dxValue('ZY_ARRAY_NOT_EMPTY(MODEL(\'domes\'))')">
        <template #header>
          <div class="card-header">
            <span>跳转</span>
          </div>
        </template>
       <el-space direction="vertical">
         <div v-for="o in store.model.domes"
              style="cursor: pointer;"
              @click="jumpTo(o)"
              :key="o" class="text item">
           {{o && o.getAttribute('scroll-control')}}
         </div>
       </el-space>
      </el-card>
    </my-fixed>

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

    <z-emoji face="fuck"></z-emoji>

    <z-emoji zoom="0.7" face="fuck"></z-emoji>

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
          <div class="mao-bo-li" style="position: sticky; top: 0; z-index: 121212121; padding: var(--z-size-10) var(--z-size-10)">
            <el-space>
              <el-button type="primary" @click="page.callEvent('call:save', scope)">保存</el-button>
              <el-button type="primary" @click="page.callEvent('call:save:file', scope)">保存文件</el-button>
              <el-button type="primary" @click="page.callEvent('load:file')">加载文件</el-button>
              <el-link href="/show/sdsds" target="_blank">打开预览</el-link>
              <router-link class="el-link" to="/form" >跳转Form</router-link>
            </el-space>
          </div>
        </template>
        <template #prop_beforebegin="scope">
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

    <ZLayoutEditor
        :ref="layoutRef"
        :controls="false"
        :open-panel="false"
        class="page-layout-editor"
        @save-layout="demo.onSaveLayout"></ZLayoutEditor>

  </div>
</template>

<script>

import '@/plugins/form-render/ext.js';
import "@/register";
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



export default defineComponent({
  mixins: [
    PageControlMixin,
  ],
  data() {
    return {
    }
  },
  components: {
    FormsLayoutSelect,
    ZLayoutEditor,
    FormManager,
    FormsManaSelect,
    CustomElement,
  },
  setup() {
    function onInited({storeControl}) {
      page.commonLoadStep(
          import('./EventEditorConfig'),
          'textarea_step',
          {
            async onMounted(config) {
              // console.log('commonLoadStep onMounted')
              let eventModel = await page.dispatchRoot('GetStoreEvents')
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
      servicePrefix: 'PageDemoIndexService'
    })
    page = extendControl2Page(page)
    page = useAppPageControl(page)

    let formsMana = useFormsMana();

    let currentFromDialog = null
    let cachedPageControlModel = null

    page.setEventHandler({
      ['add:arr:common'](e) {
        let { parts, partName, selfpath, process } = e
        // console.log('add:events', e, model)
        parts[partName].arrAppend(selfpath)
      },
      async ['load:file'](e) {
        let obj = await ZY_EXT.fileOpenJSON5()
        if (obj.data) {
          await page.dispatchRoot('SetStoreEvents', obj.data)
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
          console.log('sdsdsds', updatedPath,appendData)
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
        let { parts, partName, selfpath, process } = e
        // console.log('add:events', e, model)
        parts[partName].arrAppend(selfpath)
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
        console.log('forms:select-form', e, currentFromDialog)
        let appendData = value
        // // console.log(appendData)
        parts[partName].arrAppend(selfpath, appendData)
        await ZY.sleep(300)
        page.webComponentRef.toggleDialog('form-event-dialog');
      },
      ['remove:events'](e) {
        // console.log('sdsdsdsdsdsds', e)
        let { parts, partName, fromPath, indexKey } = e
        parts[partName].appSplice(fromPath, indexKey)
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
        // console.log('page about model:update:all', e)
        if (config.process === page.store.model.textarea_step) {
          cachedPageControlModel = model
        }
      },
      ['model:update'](e) {
        let { model, key, newVal, config } = e
      }
    })


    function detectChange() {
      let doms =  Array.of(
          ...document.querySelectorAll('.http-com .z-form__object [scroll-control]'))
      page.setData({
        domes: doms
      })
      if (Array.isArray(doms) && doms.length > 0) {
        interval1.stop()
      }
    }

    let interval1 = new ZY.Interval(detectChange, 6000);
    interval1.start()

    function jumpTo(o) {
      // console.log(o.getBoundingClientRect().top + window.scrollY)
      let top = o.getBoundingClientRect().top + window.scrollY - 40
      // ZY.U.scrollToView(o)
      window.scrollTo({
        top: top,
        behavior: "smooth"
      });
    }

    let demo = {
      async onSaveLayout(e) {
        if (cachedPageControlModel) {
          await page.dispatchRoot('SetStoreEvents', cachedPageControlModel)
        }
        console.log('onSaveLayout', e)
        await ZY_EXT.store.setItem('current-data', e.currentData)
      }
    }

    let layoutRef = page.setRef('layout')

    onMounted(() => {
      // console.log('onMounted')
    })

    return {
      layoutRef,
      store: page.store,
      demo,
      jumpTo,
      page,
      allDef: page.defMap,
    }
  }
})
</script>
