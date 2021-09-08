
<template>
  <div class="page-search" v-if="page.inited">

<!--    {{store.model}}-->
<!--    {{store.computedModel}}-->
<!--  <z-upload></z-upload>-->

    <my-fixed>
<!--      {{page.dxValue('ZY_ARRAY_NOT_EMPTY(MODEL(\'domes\'))')}}-->
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
           {{o.getAttribute('scroll-control')}}
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

    <template v-if="store.model.textarea_step">
<!--      {{store.computedModel}}-->
      <HttpComponent
          :defs="allDef"
          :is="store.model.textarea_step"
          :debug="false"
      >
        <template #array_prev="scope">
          <template v-if="scope.key === 'events'">
           <el-space   align="middle">
             <h3>{{ scope.selfpath }}</h3>
             <el-button size="small" @click="page.callEvent('add:events', scope)">添加{{ scope.key }}</el-button>
             <el-button size="small" @click="page.callEvent(`open:${scope.key}`, scope)">打开{{ scope.key }}管理</el-button>
           </el-space>
          </template>

        </template>
        <template #array_before="scope">
<!--          {{scope}}-->
          <el-col v-if="scope.key !== 'events'">
            <el-space   align="middle">
              <h3>{{ scope.selfpath }}</h3>
              <template v-if="scope.key === 'layoutSlotArr'">
                <el-button size="small" @click="page.callEvent('add:arr:common', scope)">添加{{ scope.key }}</el-button>
              </template>
              <template v-if="scope.key === 'forms'">
                <el-button size="small" @click="page.callEvent(`add:${scope.key}`, scope)">添加{{ scope.key }}</el-button>
                <el-button size="small" @click="page.callEvent(`open:${scope.key}`, scope)">打开{{ scope.key }}管理</el-button>
              </template>

              <!--                <el-button size="small" @click="page.callEvent(`save:${scope.key}:file`, scope)">保存{{ scope.key }}到本地</el-button>-->
            </el-space>
          </el-col>
        </template>
        <template #array_item_after="scope">
<!--                           {{scope}}-->
          <el-space wrap>
            <el-button type="danger" size="small" @click="page.callEvent('remove:events', scope)">删除{{ scope.key }}</el-button>
            <template v-if="scope.key === 'forms'">
              <el-button size="small" @click="page.callEvent(`save:single:${scope.key}`, scope)">保存{{ scope.key }}</el-button>
            </template>
            <template v-if="scope.key === 'events'">
              <el-button size="small" @click="page.callEvent(`save:single:${scope.key}`, scope)">保存{{ scope.key }}</el-button>
            </template>
          </el-space>
        </template>
        <template #form_before="scope">
          <div class="mao-bo-li" style="position: sticky; top: 0; z-index: 111;">
            <el-space>
              <el-button type="primary" @click="page.callEvent('call:save', scope)">保存</el-button>
              <el-button type="primary" @click="page.callEvent('call:save:file', scope)">保存文件</el-button>
              <el-button type="primary" @click="page.callEvent('load:file')">加载文件</el-button>
              <template v-if="showCurrent">
                <el-link href="/show" target="_blank">打开预览</el-link>
              </template>
            </el-space>
          </div>
        </template>
      </HttpComponent>
    </template>

    <template v-if="page.inited">
<!--      <div>-->
<!--        {{store.model}}-->
<!--      </div>-->
      <el-row class="a-space-mb-10">
        <el-button type="primary" @click="page.callEvent('load:plumb:layout')">加载plumbLayout</el-button>
      </el-row>

      <el-row style="flex-wrap: nowrap;">
        <PlumbLayout
            style="flex: 1"
            @init="onPlumbLayoutInit"
            :root-id="rootId"
            :handleAppend="handleAppend"
            :handle-dep="handleDep"
            :handle-group="handleGroup"
            @save-data="onSaveData"
            @edit-dep="onEditDep"
        ></PlumbLayout>

        <el-drawer
            title="编辑"
            size="600px"
            v-model="renderFormDesigner"
            :lock-scroll="false"
            destroy-on-close>
          <template #default>
            <div v-loading="renderFormLoading">
              <template v-if="renderFormDesigner">
                <HttpComponent
                    :defs="allDef"
                    :is="store.model.editor_step"
                >
                  <template #array_item_before="scope">
                    <h3>{{ scope.key }}</h3>
                  </template>
                  <template #array_before="scope">
                    <!--                 {{scope}}-->
                    <el-button  @click="page.callEvent('add:part', scope)">添加{{ scope.key }}</el-button>
                  </template>
                </HttpComponent>
              </template>
            </div>
          </template>
        </el-drawer>

      </el-row>
    </template>

  </div>
</template>

<script>

import {defineComponent, nextTick, getCurrentInstance, toRaw} from "vue";
import RenderLayout from "@/views/about/components/render-layout.vue";
import PlumbLayout from "@/views/about/components/PlumbLayout.vue";
import * as NodeDefMap from "@/plugins/ComEditor/nodes.js";


let depManagerMixin = {
  data() {
    return {
      renderFormLoading: false,
      renderFormDesigner: false,
      currentEditDep: null
    }
  },
  methods: {
    async onEditDep(dep) {
      // console.log('onEditDep', dep)
      this.renderFormLoading = true
      this.renderFormDesigner = false
      this.currentEditDep = dep
      if (dep.editor) {
        await this.loadStepByContent(dep.editor, 'editor_step')
      }
      // console.log(currentHtc)
      this.$nextTick(() => {
        setTimeout(() => {
          this.renderFormLoading = false
          this.renderFormDesigner = true
        }, 30)
      })
    }
  }
}

let renderLayoutMixin = {
  methods: {
    handleNext(item) {
      let fromId = item.id
      let connections = this.currentLinks.filter(v => v.from === fromId)
      if (Array.isArray(connections)) {
        // return connection.toPID
        if (connections[0]) {
          // console.log('handleNext', fromId, connections[0].toPID)
          return connections[0].toPID
        }
        return ''
      }
      return ''
    }
  }
}

let plumbLayoutMixin = {
  data() {
    return {
      LayoutContext: null,
      showCurrent: true,
      currentLinks: [],
      currentLayoutMap: {},
    }
  },
  methods: {
    async onPlumbLayoutInit(self) {
      this.LayoutContext = self
      let defaultDeps  = [
      ]
      await self.usePosMap();
      await self.useDeps(defaultDeps)
      await self.$nextTick()
      await ZY.sleep(300)
      self.insDeps(self.deps)
      await ZY.sleep(300)
      self.useLinks()
    },
    handleDep(dep) {
      // console.log('handleDep', dep)
    },
    handleGroup(groups) {
      // console.log(NodeDefMap.getClsDefs())
      let clsDefs = NodeDefMap.getClsDefs() ?? []
      let arr = clsDefs.map(v=> {
        return v[1]
      })
      return groups.concat(arr)
    },
    handleAppend(newItem, dep) {
      NodeDefMap.handleItemAppend(newItem, dep)
    },
    async onSaveData({deps, links = []}) {
      // console.log('onSaveData', deps, links)
      this.page.rootStore.dispatch('SetStoreData', {deps, links})
      let map = {
        [this.rootId]: deps.find(v => v.id === this.rootId)
      }
      links.forEach(link => {
        let { toPID = '' } = link
        if (toPID) {
          let dep = deps.find(v => v.id === toPID)
          if (dep) {
            map[toPID] = dep
          }
        }
      })

      let currentLayoutMap = JSON.parse(JSON.stringify(map))
      let currentLinks = JSON.parse(JSON.stringify(links))

      this.currentLayoutMap = currentLayoutMap
      this.currentLinks = currentLinks
      this.showCurrent = false
      // console.log(
      //     this.currentLayoutMap
      // )
      let currentData =  {
        uuid: ZY.nid(),
        currentLayoutMap,
        currentLinks,
      }
      await ZY_EXT.store.setItem('current-data', currentData)

      await ZY.sleep(500)


      await this.onSaveLayout({
        origin: { deps, links},
        currentData
      })

      this.showCurrent = true
    }
  }
}

import {
  extendControl2Page,
  useControl,
  useAppPageControl,
  PageControlMixin,
  extendControlComputedWatch
} from "@/mixins/framework";
import AutoHttpCom from "@/components/AutoHttpCom.vue";
import AsyncPlumbLayout from "@/components/AsyncPlumbLayout.vue";
import DeepPropEditor from "@/views/about/components/DeepPropEditor.vue";
import {buildFormDepContent} from "@/views/about/build";
import CustomElement from "@/components/CustomElement.vue";
import CusForm from "@/components/CustomForm/CusForm.vue";
import {FormsMana, useFormsMana} from "@/plugins/z-frame/formsMana";
import {FormsEvent} from "@/plugins/z-frame/formsEvent";
import FormsManaSelect from "@/plugins/z-frame/components/FormsManaSelect.vue";

export default defineComponent({
  mixins: [
    PageControlMixin,
    plumbLayoutMixin,
    renderLayoutMixin,
    depManagerMixin,
  ],
  data() {
    return {
      rootId: 'i1',
      layoutMap: {
      },
      layout: [
      ],
    }
  },
  components: {
    FormsManaSelect,
    CusForm,
    DeepPropEditor,
    AsyncPlumbLayout,
    AutoHttpCom,
    PlumbLayout,
    RenderLayout,
    CustomElement,
  },
  setup() {
    let self = getCurrentInstance().ctx

    function onInited({storeControl}) {
      // console.log('page inited')
    }
    let properties =  {
      editor_step: {
        type: String,
      },
      code_str: {
        type: String,
      },
      textarea_step: {
        type: String
      },
      selected: {
        type: String
      },
      links: {
        type: Array
      },
      deps: {
        type: Array
      },
      domes: {
        type: Array
      }
    }
    let computedProps = {
      ['curss']: `A.getDeeps(MODEL('links'),MODEL('deps'))`,
      ['domes']: `E.getDoms()`
    }
    let page = useControl({properties, computed: computedProps}, {
      onInited,
      extendContext: {

        getDoms() {
          let ret = Array.of(
              ...document.querySelectorAll('.http-com .z-form__object [scroll-control]')
          )
          return ret
        }
      }
    })
    page = extendControl2Page(page)
    page = useAppPageControl(page)

    let formsMana = useFormsMana();

    let currentFromDialog = null
    let cachedPageControlModel = null
    let cachedPageLayout = null

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
          await page.ctx.LayoutContext.importToolsData(obj.layout)
          await ZY.sleep(300)
          await page.ctx.LayoutContext.saveCache2Storage(obj.layout)
        }
        await ZY.sleep(300)
        location.reload()
      },
      ['call:save'](e) {
        if (page.ctx.LayoutContext) {
          // console.log('call:save', cachedPageControlModel)
          page.ctx.LayoutContext.save()
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

        saved.layout = page.ctx.LayoutContext.getToolsData()

        let fileName = obj.name ??  ZY.rid(6)

        console.log('call:save:file', saved)
        ZY_EXT.saveObjAsJson5File(saved, 'forms_' + fileName)
      },
      ['random:tab'](e) {
        let index = ZY.lodash.random(1,2)
        page.setData({
          selected: 'tab-panel-' + index
        })
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
        console.log('save:single:events', e, current)
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
        if (config.process === page.store.model.textarea_step) {
          // console.log('sdsdsdsdsdsdsds', model)
          // page.dispatchRoot('SetStoreEvents', model)
          cachedPageControlModel = model
        }
      },
      ['model:update'](e) {
        let { model, key, newVal, config } = e
        // console.log(key, model, config, self.currentEditDep)
        if (config.process === page.store.model.editor_step) {
          self.currentEditDep.data = model
          if (self.currentEditDep.type === 'form') {
            try {
              self.currentEditDep.content = buildFormDepContent(
                  model.parts,
                  model,
              )
              // 设置Layout里dep的content 手动注入
              self.LayoutContext.setDep(self.currentEditDep.id, {
                content: self.currentEditDep.content
              })
            } catch (e) {
              console.error(e)
            }
          }
        }
      }
    })

    page.commonLoadStep(
        import('./EventEditorConfig'),
        'textarea_step',
        {
          async onMounted(config) {
            let eventModel = await page.dispatchRoot('GetStoreEvents')
            page.setPartModel(config.name, 'form2', eventModel ?? {})
            // console.log('eventModel', config, eventModel)
          }
        }
    )

    async function loadStepByContent(content = '', varName = '') {
      let [,res] = await ZY.awaitTo(
          ZY.importJsStr(content)
      )
      if (!res || !res.default) {
        throw new Error('loadStepByContent res')
      }
      const config = res.default
      // console.log(config)
      let ret = {
        updateData(part, data) {
          page.setPartModel( config.name, part,
             data
          )
        }
      };

      page.setDef(config, function ({done}) {
        for (let [partName, partConfig] of Object.entries(config.defaultVal)) {
          // console.log(self.currentEditDep, depPath, ZY.lodash.get( self.currentEditDep, depPath))
          if (self.currentEditDep.data) {
            if (ZY.lodash.keys(self.currentEditDep.data).length > 0) {
              ret.updateData(partName,  self.currentEditDep.data)
            } else {
              console.log('partConfig', partConfig)
              ret.updateData(partName,  partConfig)
            }
          } else {
            ret.updateData(partName,  self.currentEditDep)
          }
        }
        done()
      })

      await nextTick()

      page.setByPath(varName, config.name)

      return ret;
    }

    async function onSaveLayout({origin}) {
      if (cachedPageControlModel) {
        await page.dispatchRoot('SetStoreEvents', cachedPageControlModel)
      }
      cachedPageLayout = ZY.JSON5.parse(ZY.JSON5.stringify(origin))
      // console.log('currentData', origin, cachedPageControlModel)
      return '';
    }

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

    return {
      onSaveLayout,
      loadStepByContent,
      store: page.store,
      jumpTo,
      page,
      allDef: page.defMap,
    }
  }
})
</script>
