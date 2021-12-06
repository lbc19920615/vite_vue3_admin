<style lang="scss">
.z-layout-editor {
  .el-drawer__body {
    overflow: auto;
  }
  .content-item {
    display: flex;
    align-items: center;
  }
}
</style>
<template>
  <div class="z-layout-editor" v-if="page.inited">

    <template v-if="page.inited">
      <el-row class="a-space-mb-10"
              v-if="controls">
        <el-button type="primary"
                   @click="page.callEvent('call:save')">保存</el-button>
        <el-button type="primary"
                   @click="page.callEvent('get:xml')">获取xml</el-button>
      </el-row>

      <el-row style="flex-wrap: nowrap;">
        <PlumbLayout
            style="flex: 1"
            :storePrefix="storePrefix"
            @init="onPlumbLayoutInit"
            :root-id="rootId"
            :handleAppend="handleAppend"
            :handle-dep="handleDep"
            :open-panel="openPanel"
            :handleList1="handleList1"
            :handle-group="handleGroup"
            @delete-dep="onDeleteDep"
            @save-data="onSaveData"
            @edit-dep="onEditDep"
            @ele-drag-change="onFires('ele-drag-change', $event)"
        >
          <template #item-action-beforeend="scope">
            <slot name="plumb-layout-item-action-beforeend" v-bind="scope"></slot>
          </template>
          <template #plus-action="scope">
            <slot name="plumb-layout-plus-action" v-bind="scope"></slot>
          </template>
        </PlumbLayout>

        <el-drawer
            title="属性"
            size="900px"
            :size="drawerWidth"
            v-model="renderFormDesigner"
            :lock-scroll="false"
            destroy-on-close
            @closed="onDrawerClose(currentEditItem, currentEditDep)"
        >
          <template #default>
            <div v-loading="renderFormLoading">
              <template v-if="renderFormDesigner">
                <HttpComponent
                    :defs="allDef"
                    :is="store.model.editor_step"
                    :debug="debug"
                >
                  <template #array_con_afterbegin="scope">
                    <el-divider></el-divider>
                  </template>
                  <template #array_afterbegin="scope">
                    <el-space align="middle">
                      <h3>{{ scope.label }}</h3>
                      <template v-if="scope.key !== 'items'">
                        <el-button type="primary" size="small"
                                   @click="page.callEvent(EVENT_NAMES.ARR_APPEND_COMMON, scope)">添加{{ scope.label }}</el-button>
                      </template>
                    </el-space>
                  </template>
                  <template #array_con_beforeend="scope">
                    <template v-if="scope.key !== 'items'">
                      <div>
                        <el-button type="danger" size="small"
                                   @click="page.callEvent(EVENT_NAMES.ARR_REMOVE_COMMON, scope)">删除{{ scope.label }}</el-button>
                      </div>
                    </template>
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
import {
  extendCommonArrEventHandler,
  extendControl2Page,
  useControl,
  // PageControlMixin,
} from "@/mixins/framework";
import {buildFormDepContent} from "./ZLayoutEditor/build";
import CustomElement from "@/components/CustomElement.vue";
import {buildXml} from "@/plugins/z-frame/components/ZLayoutEditor/xml";

function findMultiRoots(deps = [], links = []) {
  let eleDeps  = deps
  let multiRoots = []
  let linkFromPIDS = links.map((item) => item.fromPID)
  let linkToPIDS = links.map((item) => item.toPID)
  let linkFroms = links.map((item) => item.from)
  let append = {
    eleDeps,
    linkToPIDS,
    linkFroms,
    links,
    linkFromPIDS
  }
  if (linkToPIDS.length === 0 && linkFromPIDS.length === 0) {
    if (eleDeps.length > 0) {
      multiRoots.push(eleDeps[0])
      let eleDep = eleDeps[0]
      let id = eleDep.id
      // context[id] = {
      //   str: '',
      //   id: eleDep.id,
      //   append
      // }
    }
  }
  else {
    eleDeps.forEach((eleDep) => {
      let id = eleDep.id

      if (linkFromPIDS.includes(id) && !linkToPIDS.includes(id)) {
        multiRoots.push(eleDep)
        // context[id] = {
        //   str: '',
        //   id: eleDep.id,
        //   append
        // }
      }

    })
  }
  return multiRoots
}

let depManagerMixin = {
  props: {
    editorContent: String
  },
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
      if (this.editorContent) {
        await this.loadStepByContent(this.editorContent, 'editor_step')
      } else {
        if (dep.editor) {
          await this.loadStepByContent(dep.editor, 'editor_step')
        }
        if (Array.isArray(dep.editorTpl)) {
          let [name] = dep.editorTpl
          let editor = NodeDefMap.getEditorConfig(name)(dep, {
            weapp: this.weapp
          })
          // console.log('sdsdsdsdsds', name, editor)
          await this.loadStepByContent(editor, 'editor_step')
        }
      }
      // console.log(currentHtc)
      await this.$nextTick();
      await ZY.sleep(30)
      this.renderFormLoading = false
      this.renderFormDesigner = true
    },
    async onDeleteDep({dep}) {
      let depId = dep.id
      // console.log(dep, this.LayoutContext.deletePos(depId))
      this.LayoutContext.deletePos(depId)
      this.$emit('del-dep')
    }
  },
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
  props: {
    autoLoad: {
      type: Boolean,
      default: true
    },
    debug: Boolean,
    drawerWidth: {
      type: String,
      default: '600px'
    }
  },
  methods: {
    async onPlumbLayoutInit(self) {
      this.LayoutContext = self
      if (this.autoLoad) {
        let defaultDeps  = [
        ]
        await self.usePosMap();
        await self.useDeps(defaultDeps)
        await self.$nextTick()
        await ZY.sleep(300)
        self.insDeps(self.deps)
        await ZY.sleep(300)
        self.useLinks()
      }
      this.$emit('plumb-inited', {
        LayoutContext: self,
        context: this
      })
    },
    handleDep(dep) {
      // console.log('handleDep', dep)
    },
    handleGroup(groups) {
      let clsDefs = NodeDefMap.getClsDefs() ?? []
      // console.log(clsDefs)
      let notUseGroups = ['array', 'object']
      let arr = clsDefs
          .filter(v=> {
            return !notUseGroups.includes(v[0])
          })
          .map(v=> {
        return v[1]
      })
      return groups.concat(arr)
    },
    handleAppend(newItem, dep) {
      NodeDefMap.handleItemAppend(newItem, dep)
    },
    async onSaveData({deps, links = []}) {
      // console.log(findMultiRoots(deps, links))
      let multiRoots = findMultiRoots(deps, links)

      let rootId = multiRoots[0].id
      let map = {
        [rootId]: deps.find(v => v.id === rootId)
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

      // console.log('onSaveData', map, rootId)

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

      await this.onSaveLayout({
        origin: { deps, links},
        currentData
      })

      this.showCurrent = true
    }
  }
}

export default defineComponent({
  name: 'ZLayoutEditor',
  mixins: [
    plumbLayoutMixin,
    renderLayoutMixin,
    depManagerMixin,
  ],
  props: {
    storePrefix: {
      type: String,
      default: 'play'
    },
    controls: {
      type: Boolean,
      default: true
    },
    openPanel: {
      type: Boolean,
      default: true
    },
    handleList1: null,
    weapp:{
      type: Boolean,
      default: false
    }
  },
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
    PlumbLayout,
    RenderLayout,
    CustomElement,
  },
  setup(props, ctx) {
    let self = getCurrentInstance().ctx
    let cachedDeepEditorModel;
    function onInited({storeControl}) {
      // console.log('page inited')
    }
    let properties =  {
      editor_step: {
        type: String,
      },
    }
    let computedProps = {
    }
    let page = useControl({properties, computed: computedProps}, {
      onInited,
      extendContext: {
      }
    })
    page = extendControl2Page(page)
    // page = useAppPageControl(page)
    let { EVENT_NAMES } = extendCommonArrEventHandler(page)

    let cachedPageLayout;

    function getXML() {
      let xml = ''
      if (self.LayoutContext) {
        let { data } = self.LayoutContext.getToolsData();
        xml = buildXml(data)
      }
      return xml
    }

    page.setEventHandler({
      ['add:arr:common'](e) {
        let { parts, partName, selfpath, process } = e
        // console.log('add:events', e, model)
        parts[partName].arrAppend(selfpath)
      },
      ['call:save'](e) {
        if (self.LayoutContext) {
          self.LayoutContext.save()
        }
      },
      ['get:xml'](e) {
        getXML()
      },
      ['model:update:all'](e) {
        // let { model, key, newVal, config } = e

        let { model, key, newVal, config } = e
        cachedDeepEditorModel = toRaw(model)
        // console.log(key, model, self.currentEditDep)
        if (config.process === page.store.model.editor_step) {
          self.currentEditDep.data = toRaw(newVal)
          self.currentEditDep.str_data = ZY.JSON5.stringify(toRaw(newVal))
          // console.log(newVal, self.currentEditDep)
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

        ctx.emit('mode:update:all', e)
      },
      // ['model:update'](e) {
      //   let { model, key, newVal, config } = e
      //   // console.log(key, model, config, self.currentEditDep)
      //   if (config.process === page.store.model.editor_step) {
      //     self.currentEditDep.data = model
      //     if (self.currentEditDep.type === 'form') {
      //       try {
      //         self.currentEditDep.content = buildFormDepContent(
      //             model.parts,
      //             model,
      //         )
      //         // 设置Layout里dep的content 手动注入
      //         self.LayoutContext.setDep(self.currentEditDep.id, {
      //           content: self.currentEditDep.content
      //         })
      //       } catch (e) {
      //         console.error(e)
      //       }
      //     }
      //   }
      // }
    })


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
          console.log(partName, partConfig, self.currentEditDep)
          if (self.currentEditDep.data) {
            let keys = ZY.lodash.keys(self.currentEditDep.data)
            if (keys.length > 0) {
              ret.updateData(partName,  self.currentEditDep.data)
            } else {
              // console.log('partConfig', partConfig)
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

    async function onSaveLayout({origin, currentData}) {
      // if (cachedPageControlModel) {
      //   await page.dispatchRoot('SetStoreEvents', cachedPageControlModel)
      // }
      cachedPageLayout = ZY.JSON5.parse(ZY.JSON5.stringify(origin))
      ctx.emit('save-layout', {
        cachedPageLayout,
        currentData,
      })
      // console.log('currentData', origin, cachedPageControlModel)
      return '';
    }

    function getToolsData() {
      return self.LayoutContext.getToolsData()
    }

    function importToolsData(data) {
      return  page.ctx.LayoutContext.importToolsData(data)
    }

    function saveCache2Storage(data) {
      return  page.ctx.LayoutContext.saveCache2Storage(data)
    }

    function clearLayoutStorage(data) {
      return  page.ctx.LayoutContext.clearStorage(data)
    }


    function onFires(name, e) {
      ctx.emit(name, e)
    }

    function save() {
      if (self.LayoutContext) {
        self.LayoutContext.save()
      }
    }

    function onDrawerClose(currentEditItem) {
      // console.log('onDrawerClose', cachedDeepEditorModel, currentEditItem)
      if (cachedDeepEditorModel) {
      //
      //   currentEditItem.data = ZY.JSON5.stringify(cachedDeepEditorModel)
      }
    }

    return {
      EVENT_NAMES,
      getXML,
      onFires,
      importToolsData,
      onDrawerClose,
      saveCache2Storage,
      onSaveLayout,
      getToolsData,
      clearLayoutStorage,
      loadStepByContent,
      store: page.store,
      save,
      page,
      allDef: page.defMap,
    }
  }
})
</script>
