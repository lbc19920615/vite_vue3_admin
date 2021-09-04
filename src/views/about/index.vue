

<template>
  <div class="page-search" v-if="page.inited">

<!--    <button @click="page.callEvent('random:tab')">时空</button>-->
<!--    <CustomElement is="my-tab" name="tab" :selected="store.model.selected">-->
<!--      <CustomElement is="my-tab-panel" :params="{slot: 'tab-panel-1', selected: store.model.selected === 'tab-panel-1'}">tab1</CustomElement>-->
<!--      <CustomElement is="my-tab-panel" :params="{slot: 'tab-panel-2', selected: store.model.selected === 'tab-panel-2'}">tab2</CustomElement>-->
<!--    </CustomElement>-->

<!--    {{store.model}}-->
<!--    {{store.computedModel}}-->
<!--    <DeepPropEditor v-model:deps="store.model.deps" v-model:links="store.model.links"></DeepPropEditor>-->


<!--    <CusForm></CusForm>-->
    <CustomElement is="my-vue-dialog" name="dialog"
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
          :debug="true"
      >
        <template #array_before="scope">
<!--          {{scope}}-->
          <el-col>
            <el-space  align="middle">
              <h3>{{ scope.selfpath }}</h3>
              <template v-if="scope.key === 'layoutSlotArr'">
                <el-button size="small" @click="page.callEvent('add:arr:common', scope)">添加{{ scope.key }}</el-button>
              </template>
              <template v-if="scope.key === 'events'">
                <el-button size="small" @click="page.callEvent('add:events', scope)">添加{{ scope.key }}</el-button>
              </template>
              <template v-if="scope.key === 'forms'">
                <el-button size="small" @click="page.callEvent(`add:${scope.key}`, scope)">添加{{ scope.key }}</el-button>
                <el-button size="small" @click="page.callEvent(`save:${scope.key}`, scope)">保存{{ scope.key }}</el-button>
                <el-button size="small" @click="page.callEvent(`save:${scope.key}:file`, scope)">保存{{ scope.key }}到本地</el-button>
                <el-button size="small" @click="page.callEvent(`open:${scope.key}`, scope)">打开{{ scope.key }}</el-button>
              </template>
            </el-space>
          </el-col>
        </template>
        <template #array_item_after="scope">
          <!--                 {{scope}}-->
          <el-button type="danger" size="small" @click="page.callEvent('remove:events', scope)">删除{{ scope.key }}</el-button>
        </template>
        <template #form_before="scope">
          <el-space wrap>
            <el-button type="primary" @click="page.callEvent('call:save', scope)">保存</el-button>
            <el-button type="primary" @click="page.callEvent('call:save:file', scope)">保存文件</el-button>
            <template v-if="showCurrent">
              <el-link href="/show" target="_blank">打开预览</el-link>
            </template>
          </el-space>
        </template>
      </HttpComponent>
    </template>

    <template v-if="page.inited">
<!--      <div>-->
<!--        {{store.model}}-->
<!--      </div>-->
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
            v-model="renderFormDesigner" destroy-on-close>
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



let tabDep = NodeDefMap.def('tab', 'i6', [
  {
    id: 'i6-0',
    label: 'label1',
    name: 'name1',
  },
  {
    id: 'i6-1',
    label: 'label2',
    name: 'name2',
  },
  {
    id: 'i6-2',
    label: 'label3',
    name: 'name3',
  }
])

let modalDep = NodeDefMap.def('modal', 'i7', [
])

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
        new NodeDefMap.ColumnNode('i1',
          [
            {
              id: 'i1-0',
              h: 800
            },
            {
              id: 'i1-1',
              h: 120
            },
            {
              id: 'i1-2',
              h: 120
            }
          ]
        ),
        new NodeDefMap.RowNode('i2', [
          {
            id: 'i2-0',
            w: '1fr',
            h: 50,
          },
          {
            id: 'i2-1',
            w: '1fr',
            h: 50,
          },
          {
            id: 'i2-2',
            w: '1fr',
            h: 50,
          }
        ]),
        tabDep,
        modalDep,
        new NodeDefMap.FormNode('i3',
          {
            name: 'form1',
            parts: [
              {
                type: 'form',
                name: 'form2',
                ui: ZY.JSON5.stringify(
                    {
                      attrs: [
                        [
                          'label-width',
                          '100px',
                        ],
                      ],
                    }
                    , null, 2),
                defaultVal: ZY.JSON5.stringify({
                  parts: [
                    {
                      key: '',
                      ui_type: '',
                      ui_label: '',
                      ui_widgetConfig: '{}',
                      rules: '{}'
                    }
                  ]
                } , null, 2),
                properties: ZY.JSON5.stringify(
                    {
                      parts: {
                        type: 'array',
                        items: {
                          type: "object",
                          properties: {
                            key: {
                              type: 'string',
                              ui: {
                              }
                            },
                            ui_type: {
                              type: 'string',
                              ui: {
                              }
                            },
                            ui_label: {
                              type: 'string',
                              ui: {
                              }
                            },
                            ui_widget: {
                              type: 'string',
                              ui: {
                              }
                            },
                            ui_widgetConfig: {
                              type: 'string',
                              ui: {
                                widget: 'CodeJsEditor',
                                widgetConfig: {
                                  style: {
                                    // height: "200px",
                                  }
                                }
                              }
                            },
                            rules: {
                              type: 'string',
                              ui: {
                                widget: 'CodeJsEditor',
                                widgetConfig: {
                                  style: {
                                    height: "200px",
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                    }
                    , null, 2),
              }
            ]
          }
        )
      ]
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
      // console.log('newItem', dep)
      // if (dep.type === 'column') {
      //   newItem.h = 120
      // }
      // if (dep.type === 'row') {
      //   newItem.w = '1fr'
      //   newItem.h = 50
      // }
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
      await ZY_EXT.store.setItem('current-data', {
        uuid: ZY.nid(),
        currentLayoutMap,
        currentLinks,
      })

      await ZY.sleep(500)
      this.showCurrent = true
    }
  }
}

import {extendControl2Page, useControl, useAppPageControl} from "@/mixins/framework";
import AutoHttpCom from "@/components/AutoHttpCom.vue";
import AsyncPlumbLayout from "@/components/AsyncPlumbLayout.vue";
import DeepPropEditor from "@/views/about/components/DeepPropEditor.vue";
import {buildFormDepContent} from "@/views/about/build";
import CustomElement from "@/components/CustomElement.vue";
import CusForm from "@/components/CustomForm/CusForm.vue";
import {useFormsMana} from "@/plugins/z-frame/formsMana";
import FormsManaSelect from "@/plugins/z-frame/components/FormsManaSelect.vue";

export default defineComponent({
  mixins: [
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
      storeControl.set({
        links: [
          {
            "toPID": "i222",
            "fromPID": "i111",
            "from": "i111-0",
            "to": "i222-top"
          },
          {
            "toPID": "i333",
            "fromPID": "i222",
            "from": "i222-0",
            "to": "i333-top"
          },
        ],
        deps: [
            NodeDefMap.create('object', {
              id: 'i111',
              items: [
                {
                  id: 'i111-0',
                  key: 'parts',
                  data: '',
                },
                {
                  id: 'i111-1',
                  key: 'other',
                  data: '',
                },
              ]
            }),
          NodeDefMap.create('array', {
            id: 'i222',
            items: [
              {
                id: 'i222-0',
                key: 'items',
                data: '',
              },
            ]
          }),
          NodeDefMap.create('object', {
            id: 'i333',
            items: [
              {
                id: 'i333-0',
                key: 'name1',
                data: '',
              },
              {
                id: 'i333-1',
                key: 'name2',
                data: '',
              },
            ]
          }),
        ],
      })
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
      }
    }
    let computed = {
      ['curss']: `A.getDeeps(MODEL('links'),MODEL('deps'))`
    }
    let page = useControl({properties, computed}, {
      onInited,
      extendContext: {
        // getDeeps(v1, v2) {
        //   // console.log('v1', v1, v2)
        //   return getDeepConfigFromLinksAndDeps(v1, v2)
        // }
      }
    })
    page = extendControl2Page(page)
    page = useAppPageControl(page)


    let formsMana = useFormsMana();

    let currentFromDialog = null

    page.setEventHandler({
      ['add:arr:common'](e) {
        let { parts, partName, selfpath, process } = e
        // console.log('add:events', e, model)
        parts[partName].arrAppend(selfpath)
      },
      ['call:save'](e) {
        if (page.ctx.LayoutContext) {
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
        // console.log(obj)
        ZY_EXT.saveObjAsJson5File({
          data: obj,
          date: Date.now()
        }, 'forms_' + ZY.rid(6))
      },
      ['random:tab'](e) {
        let index = ZY.lodash.random(1,2)
        page.setData({
          selected: 'tab-panel-' + index
        })
      },
      ['add:part'](e) {
        let { parts, partName, selfpath, process } = e
        // console.log('add:events', e, model)
        parts[partName].arrAppend(selfpath)
      },
      ['add:forms'](e) {
        let { parts, partName, selfpath, process } = e
        // console.log('add:events', e)
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
        console.log(appendData)
        parts[partName].arrAppend(selfpath, appendData)
        await ZY.sleep(300)
        // lastsds.name = value.label
        // lastsds.value = obj
        page.webComponentRef.toggleDialog('dialog');
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
      ['save:forms:file'](e) {
        let {parts, partName} = e
        let model = parts[partName].getModel()
        let forms = toRaw(
            ZY.lodash.get(model, 'forms')
        )
        ZY_EXT.saveObjAsJson5File({
          data: forms,
          date: Date.now()
        }, 'forms_' + ZY.rid(6))
      },
      ['open:forms'](e) {
        currentFromDialog = e
        page.refsManager.runCom('form-mana-select', 'load')
        page.webComponentRef.toggleDialog('dialog');
      },
      ['add:events'](e) {
        let { parts, partName, selfpath, process } = e
        // console.log('add:events', e, model)
        parts[partName].arrAppend(selfpath)
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
        // if (scope.process === page.store.model.textarea_step) {
        //   // console.log('sddddddddddddd');
        //   page.dispatchRoot('SetStoreEvents', model)
        // }
      },
      ['model:update:all'](e) {
        let { model, key, newVal, config } = e
        if (config.process === page.store.model.textarea_step) {
          // console.log('sdsdsdsdsdsdsds', model)
          page.dispatchRoot('SetStoreEvents', model)
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
            page.setPartModel(config.name, 'form2', eventModel)
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

    return {
      loadStepByContent,
      store: page.store,
      page,
      allDef: page.defMap,
    }
  }
})
</script>
