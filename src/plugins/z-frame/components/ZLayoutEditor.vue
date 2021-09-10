
<template>
  <div class="page-search" v-if="page.inited">

    <template v-if="page.inited">
      <el-row class="a-space-mb-10"
              vs-if="controls">
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
            :handle-group="handleGroup"
            @save-data="onSaveData"
            @edit-dep="onEditDep"
        ></PlumbLayout>

        <el-drawer
            title="属性"
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
                    <el-divider></el-divider>
                  </template>
                  <template #array_before="scope">
                    <el-space align="middle">
                      <h3>{{ scope.key }}</h3>
                      <template v-if="scope.key !== 'items'">
                        <el-button type="primary" size="small"
                                   @click="page.callEvent('add:arr:common', scope)">添加{{ scope.key }}</el-button>
                      </template>
                    </el-space>
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
  extendControl2Page,
  useControl,
  // PageControlMixin,
} from "@/mixins/framework";
import {buildFormDepContent} from "./ZLayoutEditor/build";
import CustomElement from "@/components/CustomElement.vue";
import {buildXml} from "@/plugins/z-frame/components/ZLayoutEditor/xml";

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
      await this.$nextTick();
      await ZY.sleep(30)
      this.renderFormLoading = false
      this.renderFormDesigner = true
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
      // await ZY_EXT.store.setItem('current-data', currentData)

      // await ZY.sleep(500)


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

    let cachedPageLayout;

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
        if (self.LayoutContext) {


          let { data } = self.LayoutContext.getToolsData();
          buildXml(data)
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

    function save() {
      if (self.LayoutContext) {
        self.LayoutContext.save()
      }
    }

    return {
      onSaveLayout,
      loadStepByContent,
      store: page.store,
      save,
      page,
      allDef: page.defMap,
    }
  }
})
</script>
