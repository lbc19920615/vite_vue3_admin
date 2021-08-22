<template>
<div>
  {{store.model}}
  <el-row type="flex">
    <AsyncPlumbLayout
        style="flex: 1"
        @init="onPlumbLayoutInit"
        :root-id="rootId"
        :handleAppend="handleAppend"
        :handle-dep="handleDep"
        @edit-dep="onEditDep"
    ></AsyncPlumbLayout>
    <div style="width: 600px">
      <template v-if="renderFormDesigner && currentEditDep">
        {{currentEditItem}}
<!--        {{currentEditItem}}-->
        <template v-if="currentEditDep.type === 'object'">
          <HttpComponent
              :defs="allDef"
              :is="store.model.editor_step"
          >
            <template #form_array_before="scope">
              <h3>{{scope.index}}</h3>
            </template>
          </HttpComponent>
        </template>
      </template>
    </div>
  </el-row>
</div>
</template>

<script>
import AsyncPlumbLayout from "@/components/AsyncPlumbLayout.vue";
import {formEditorConfig, rowEditorConfig} from "@/views/about/editorConfig";
import {getCurrentInstance, nextTick} from "vue";
import {usePage} from "@/mixins/framework";

let depManagerMixin = {
  data() {
    return {
      renderFormLoading: false,
      renderFormDesigner: false,
      currentEditDep: null,
      currentEditItem: null,
    }
  },
  methods: {
    async onEditDep({dep, item}) {
      this.renderFormLoading = true
      this.renderFormDesigner = false
      this.currentEditDep = dep
      this.currentEditItem = item
      console.log('onEditDep', dep, item)
      if (dep.editor) {
        await this.loadStepByContent('editor_step', item)
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
        {
          id: 'i111',
          type: 'array',
          config: {
            version: 'v1',
            closure: false
          },
          editor: `editor`,
          name: '',
          items: [
            {
              id: 'i111-0',
              data: '',
            },
            {
              id: 'i111-1',
              data: '',
            },
            {
              id: 'i111-2',
              data: '',
            }
          ]
        },
        {
          id: 'i333',
          type: 'object',
          config: {
            version: 'v1',
            closure: false
          },
          editor: `editor`,
          content: '',
          items: [
            {
              id: 'i333-0',
              data: '',
            },
            {
              id: 'i333-1',
              data: '',
            },
          ],
          data: {
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
        }
      ]
      self.$nextTick(() => {
        self.insDeps(self.deps)
        setTimeout(() => {
          self.insComLinks(
              [
                {
                  "toPID": "i333",
                  "fromPID": "i111",
                  "from": "i111-0",
                  "to": "i333-top"
                },
              ]
          )
        }, 300)
      })
    },
    handleDep(dep) {
      console.log('handleDep', dep)
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
      console.log('onGetData', deps, links)
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
      setTimeout(() => {
        this.showCurrent = true
      }, 500)
    }
  }
}

export default {
  name: "DeepPropEditor",
  components: {AsyncPlumbLayout},
  mixins: [
    plumbLayoutMixin,
    depManagerMixin
  ],
  data() {
    return {
      rootId: 'i111',
    }
  },
  setup() {
    let self = getCurrentInstance().ctx
    let page = usePage({
      data: {
        editor_step: {
          type: String,
        },
      },
      filters: {
        showCom: "ZY_NOT(MODEL('reload'))",
      },
      defaultVal: {
        editor_step: '',
      }
    })

    page.setEventHandler({
      ['model:update'](e) {
        let { model, key, newVal, config } = e
        let oldVal = ZY.lodash.get(self.currentEditItem.data, key)
        if (oldVal !== newVal) {
          self.currentEditItem.data = ZY.JSON5.stringify(model)
        }
        // console.log( self.currentEditItem.data)
      }

    })

    async function loadStepByContent( varName = '', item) {
      let [,res] = await ZY.awaitTo(
          import('./DeepPropEditor/DeepEditorConfig')
      )
      const config = res.default
      config.name = ZY.nid()

      page.setDef(config, function ({done}) {
        let cached = null
        if (item.data) {
          cached = ZY.JSON5.parse(item.data)
        }


        for (let [partName, data] of Object.entries(config.defaultVal)) {
          let defaultObj = ZY.JSON5.parse(ZY.JSON5.stringify(data))
           page.setPartModel( config.name, partName,
               cached ? cached : defaultObj
           )
        }
        done()
      })
      await nextTick()
      page.storeControl.set({
        [varName]: config.name
      })
    }

    return {
      loadStepByContent,
      store: page.storeControl.store,
      filter: page.storeControl.filter,
      allDef: page.allDef,
    }
  }
}
</script>

<style scoped>

</style>