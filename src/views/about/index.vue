<style lang="scss">
.vue-grid-item {
  color: #ffffff;
}

@function random-rgb($opacity: 1) {
  @return rgb(random(255), random(255), random(255), $opacity)
}

@mixin random-bgr($opacity: 1){
  background: random-rgb($opacity);
}

@for $i from 0 through 10 {
  .render-layout-level-#{$i} {
    width: 100%;
    .vue-column-item {
      @include random-bgr();
      &:nth-child(2n+1) {
        @include random-bgr(.5);
      }
    }
    .vue-row-item {
      @include random-bgr();
      &:nth-child(2n+1) {
        @include random-bgr(.5);
      }
    }
  }
}

</style>

<template>
  <div class="page-search">
    <template v-if="store.model.textarea_step">
      <HttpComponent
          :defs="allDef"
          :is="store.model.textarea_step"
      >
        <template #array_before="scope">
          <el-col>
            <el-row class="u-sizeFull" justify="space-between" align="middle">
              <h3>{{ scope.selfpath }}</h3>
              <el-button @click="page.callEvent('add:event', scope)">添加{{ scope.key }}</el-button>
            </el-row>
          </el-col>
        </template>
        <template #array_item_after="scope">
          <!--                 {{scope}}-->
          <el-button @click="page.callEvent('remove:event', scope)">删除{{ scope.key }}</el-button>
        </template>
        <template #form_after="scope">
          <CusSubmitButton
              :scope="scope"
              class="el-col z-submit-btn"></CusSubmitButton>
        </template>
      </HttpComponent>
    </template>

    <template v-if="page.inited">
      <div>
        {{store.model}}
      </div>
      <div>
        <div v-if="showCurrent">
          <render-layout :map="currentLayoutMap"
                         :id="rootId"
                         :handleNext="handleNext"
                         :page="page"
          >
            <template #form_after="scope">
              <CusSubmitButton
                  :scope="scope"
                  class="el-col z-submit-btn"></CusSubmitButton>
            </template>
          </render-layout>
        </div>
        <el-row style="flex-wrap: nowrap;">
          <PlumbLayout
              style="flex: 1"
              @init="onPlumbLayoutInit"
              :root-id="rootId"
              :handleAppend="handleAppend"
              :handle-dep="handleDep"
              @save-data="onGetData"
              @edit-dep="onEditDep"
          ></PlumbLayout>

          <div style="width: 600px" v-loading="renderFormLoading">
            <template v-if="renderFormDesigner">
              <HttpComponent
                  :defs="allDef"
                  :is="store.model.editor_step"
              >
                <template #form_array_before="scope">
                  <h3>{{ scope.index }}</h3>
                </template>
              </HttpComponent>
            </template>
          </div>
        </el-row>
      </div>
    </template>

  </div>
</template>

<script>
import {defineComponent, nextTick, getCurrentInstance} from "vue";
import RenderLayout from "@/views/about/components/render-layout.vue";
import PlumbLayout from "@/views/about/components/PlumbLayout.vue";
import * as NodeDefMap from "@/views/about/nodes.js";

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
      showCurrent: true,
      currentLinks: [],
      currentLayoutMap: {},
    }
  },
  methods: {
    onPlumbLayoutInit(self) {
      self.deps = [
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
        new NodeDefMap.RowNode('i2,', [
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
        new NodeDefMap.FormNode('i3',
          {
            name: 'form1',
            parts: [
              {
                uis: ZY.JSON5.stringify(
                    {
                      attrs: [
                        [
                          'label-width',
                          '100px',
                        ],
                      ],
                    }
                    , null, 2),
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
                                widget: 'JsonCodeEditor',
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
      self.$nextTick(() => {
        self.insDeps(self.deps)
        setTimeout(() => {
          self.insComLinks(
              [
                {
                  "toPID": "i3",
                  "fromPID": "i1",
                  "from": "i1-0",
                  "to": "i3-top"
                },
                // {
                //   "toPID": "i5",
                //   "fromPID": "i1",
                //   "from": "i1-1",
                //   "to": "i5-top"
                // }
              ]
          )
          self.insEventLinks([
            // {
            //   "toPID": "i4",
            //   "fromPID": "i3",
            //   "from": "i3-evt",
            //   "to": "i4-0"
            // }
          ])
        }, 300)
      })
    },
    handleDep(dep) {
      // console.log('handleDep', dep)
      if (dep.type === 'form') {
        dep.content = ''
        dep.config.closure = true
      }
    },
    handleAppend(newItem, dep) {
      // console.log('newItem', dep)
      if (dep.type === 'column') {
        newItem.h = 120
      }
      if (dep.type === 'row') {
        newItem.w = '1fr'
        newItem.h = 50
      }
    },
    onGetData({deps, links = []}) {
      // console.log('onGetData', deps, links)
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
      this.currentLayoutMap = JSON.parse(JSON.stringify(map))
      this.currentLinks = JSON.parse(JSON.stringify(links))
      this.showCurrent = false
      console.log(
          this.currentLayoutMap
      )
      setTimeout(() => {
        this.showCurrent = true
      }, 500)
    }
  }
}

import {extendControl2Page, useControl, usePage, useAppPageControl} from "@/mixins/framework";
import AutoHttpCom from "@/components/AutoHttpCom.vue";
import {formEditorConfig, rowEditorConfig} from "@/views/about/editorConfig";
import AsyncPlumbLayout from "@/components/AsyncPlumbLayout.vue";
import DeepPropEditor from "@/views/about/components/DeepPropEditor.vue";
import AsyncComponent from "@/components/AsyncComponent.vue";

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
    AsyncComponent,
    DeepPropEditor,
    AsyncPlumbLayout,
    AutoHttpCom,
    PlumbLayout,
    RenderLayout,
  },
  setup() {
    let self = getCurrentInstance().ctx

    function onInited() {
      console.log('page inited')
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
      }
    }
    let computed = {}
    let page = useControl({properties, computed}, {
      onInited
    })
    page = extendControl2Page(page)
    page = useAppPageControl(page)

    page.setEventHandler({
      ['add:event'](e) {
        let { parts, partName, selfpath, process } = e
        // console.log('add:event', e, model)
        parts[partName].arrAppend(selfpath)
      },
      ['remove:event'](e) {
        // console.log('sdsdsdsdsdsds', e)
        let { parts, partName, fromPath, indexKey } = e
        parts[partName].appSplice(fromPath, indexKey)
      },
      ['submit:form'](e) {
        let { scope, parts } = e
        let model = parts[scope.name].getModel()
        console.log('submit:form',e, model)
      },
      ['model:update'](e) {
        let { model, key, newVal, config } = e
        // console.log(key, model, config, self.currentEditDep)
        if (config.process === page.store.model.editor_step) {
          console.log('sdsdsdsdsdsdsds', self.currentEditDep, model)
          self.currentEditDep.data = model
          if (self.currentEditDep.type === 'form') {
            let contentTpl = function ({ui, properties} = {}, defaultVal) {
              let obj = {
                name: 'process-step1',
                defaultVal: defaultVal,
                init: {
                  def: {
                    constants: {},
                    parts: [
                      {
                        type: "form",
                        name: "form2",
                        serviceTpl: {
                          def: {},
                          args: {
                            src: 'bservice.twig',
                          },
                        },
                        def: {
                          type: 'object',
                          ui,
                          properties
                        },
                        computed: {
                        },
                      }
                    ]
                  },
                  args: {
                    src: 'comformscr.twig'
                  }
                }
              }
              // console.log(obj)
              return ZY.JSON5.stringify(obj)
            }
            self.currentEditDep.content = contentTpl(
                {
                  ui: ZY.JSON5.parse(model.parts[0].uis),
                  properties: ZY.JSON5.parse(model.parts[0].properties)
                },
                {
                  form2: {
                    parts: [
                      {
                        key: '',
                        ui_type: '',
                        ui_label: '',
                        ui_widgetConfig: '{}',
                        rules: '{}'
                      }
                    ]
                  }
                }
            )
            // console.log(self.currentEditDep.content )
            localStorage.setItem('currentEditDepContent', self.currentEditDep.content)
          }
        }
      }
    })

    // page.commonLoadStepByContent(
    //     import('./EventEditorConfig'),
    //     'textarea_step',
    //     {
    //       onMounted(config) {
    //       }
    //     }
    // )


    // let page = usePage({
    //   data: {
    //     editor_step: {
    //       type: String,
    //     },
    //     code_str: {
    //       type: String,
    //     },
    //     textarea_step: {
    //       type: String
    //     }
    //   },
    //   filters: {
    //     showCom: "ZY_NOT(MODEL('reload'))",
    //   },
    //   defaultVal: {
    //     editor_step: '',
    //     code_str: '',
    //     textarea_step: '',
    //   }
    // })


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
        for (let [partName, depPath] of Object.entries(config.defaultVal)) {
          // console.log(self.currentEditDep, depPath, ZY.lodash.get( self.currentEditDep, depPath))
          if (self.currentEditDep.data) {
            ret.updateData(partName,  self.currentEditDep.data)
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
