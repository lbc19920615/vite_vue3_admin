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
    <div>
      <render-layout :map="currentLayoutMap"
                     :id="rootId"
                     :handleNext="handleNext"
                     :page="page"
      >
        <template #form_after="scope">
          <CusSubmitButton
              :scope="scope"
              class="el-col search-form__button">搜索</CusSubmitButton>
        </template>
      </render-layout>
      <el-row type="flex" style="flex-wrap: nowrap;">
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
<!--          {{currentEditDep ? currentEditDep.content : ''}}-->
          <template v-if="renderFormDesigner">
<!--            <search-demo1 v-if="currentEditDep.type === 'row'"-->
<!--                          @init="onInitDemo1" :modelValue="currentEditDep"-->
<!--                          @model:update="onUpdateModelValue"-->
<!--            >-->
<!--              <template v-slot:key1__array__before="{items, index}">-->
<!--                <header>{{index}}</header>-->
<!--              </template>-->
<!--            </search-demo1>-->
<!--            <search-demo2 v-if="currentEditDep.type === 'column'"-->
<!--                          @init="onInitDemo1" :modelValue="currentEditDep"-->
<!--                          @model:update="onUpdateModelValue"-->
<!--            >-->
<!--              <template v-slot:key1__array__before="{items, index}">-->
<!--                <header>{{index}}</header>-->
<!--              </template>-->
<!--            </search-demo2>-->
            <HttpComponent
                :defs="allDef"
                :is="store.model.editor_step"
            >
              <template #form>form</template>

            </HttpComponent>
<!--            <form-prop-editor v-if="currentEditDep.type === 'form'"-->
<!--                          @init="onInitDemo1" :modelValue="currentEditDep"-->
<!--                @model:update="onUpdateModelValue"-->
<!--            >-->
<!--            </form-prop-editor>-->
          </template>
        </div>
      </el-row>
    </div>
    <!--    <table-a></table-a>-->
  </div>
</template>

<script>
import {defineAsyncComponent, defineComponent, nextTick, onMounted} from "vue";
import GridRow from "@/views/about/components/grid-row.vue";
import RenderLayout from "@/views/about/components/render-layout.vue";
import PlumbLayout from "@/views/about/components/PlumbLayout.vue";
import JsonCodeEditor from "@/components/CodeEditor/JsonCodeEditor.vue";

let formDesignerMixin = {
  components: {
    ['search-demo1']: defineAsyncComponent(() => {
      return import("__remote/getscript?src=formDesigner/index.twigvue&config_id=layoutDesigner.json5")
    }),
    ['form-prop-editor']: defineAsyncComponent(() => {
      return import("__remote/getscript?src=formDesigner/index.twigvue&config_id=layoutForm.json5")
    }),
    ['search-demo2']: defineAsyncComponent(() => {
      return import("__remote/getscript?src=formDesigner/index.twigvue&config_id=layoutColumn.json5")
    })
  },
  data() {
    return {
      searchDemo1Ref: null
    }
  },
  methods: {
    onInitDemo1(context) {
      this.searchDemo1Ref = context
      // console.log( this.currentEditDep )
      context.setModel(this.currentEditDep)
    },
    onUpdateModelValue(e) {
      // console.log('onUpdateModelValue', key, value)
      let key = 'content'
      if (key && e[key]) {
        this.currentEditDep[key] = e[key]
      }
      console.log('onUpdateModelValue', e,  this.currentEditDep)
    }
  }
}

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
      console.log('onEditDep', dep)
      this.renderFormLoading = true
      this.renderFormDesigner = false
      this.currentEditDep = dep
      if (dep.editor) {

        let currentHtc = await this.loadStepByContent(dep.editor, 'editor_step')
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
      currentLinks: [],
      currentLayoutMap: {},
    }
  },
  methods: {
    onPlumbLayoutInit(self) {
      self.deps = [
        {
          id: 'i1',
          type: 'column',
          config: {
            version: 'v1',
            closure: false
          },
          items: [
            {
              id: 'i1-0',
              h: 700
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
        },
        {
          id: 'i2',
          type: 'row',
          config: {
            version: 'v1',
            closure: false
          },
          items: [
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
          ]
        },
        {
          id: 'i4',
          type: 'events',
          sub: 'form',
          config: {
            version: 'v1',
            closure: false
          },
          items: [
            {
              id: 'i4-0',
              name: 'submit'
            },
          ]
        },
        {
          id: 'i5',
          type: 'table',
          config: {
            version: 'v1',
            closure: false
          },
          template: 'comtablescr.twig',
          content: JSON.stringify({
            tableDef: [
              {
                label: '日期',
                prop: 'date',
                width: 100
              },
              {
                label: '姓名', prop: 'name'
              },
              {
                label: '邮编', prop: 'zip'
              }
            ]
          }, null, 2),
          items: [
          ]
        },
        {
          id: 'i3',
          type: 'form',
          config: {
            version: 'v1',
            closure: true
          },
          editor: `
export default {
  name: 'form-editor',
  init: {
    def: {
      constants: {
      },
      parts: [
        {
          type: "form",
          name: "form2",
          serviceTpl: {
            def: {},
            args: {
              src: "bservice.twig"
            }
          },
          def: {
            type: 'object',
            ui: {
              attrs: [
                ['label-width', '100px']
              ],
            },
            properties: {
              name: {
                type: 'string',
                ui: {
                  label: '名称'
                },
              },
              content: {
                type: 'string',
                ui: {
                  label: '代码',
                  widgetConfig: {
                    type: "textarea",
                    rows: 10
                  }
                }
              },
            }
          },
          computed: {
            doubled: "MODEL('name', '') + ',s'"
          }
        },
      ],
    },
    args: {
      src: 'comformscr.twig'
    }
  }
}
          `,

          content: ZY.JSON5.stringify( {
            name: 'process-step1',
            slots: `
      <template #form>sdsdsds</template>sdsdsdssdsdsdssdsdsds
`,
            init: {
              def: {
                constants: {
                },
                parts: [
                  {
                    type: "form",
                    name: "form2",
                    serviceTpl: {
                      def: {},
                      args: {
                        src: "bservice.twig"
                      }
                    },
                    def: {
                      type: 'object',
                      ui: {
                        attrs: [
                          ['label-width', '100px']
                        ],
                      },
                      properties: {
                        name: {
                          type: 'string',
                          ui: {
                            label: '名称'
                          },
                        },
                        content: {
                          type: 'string',
                          ui: {
                            label: '代码',
                            widgetConfig: {
                              type: "textarea",
                              rows: 10
                            }
                          }
                        },
                      }
                    },
                    computed: {
                      doubled: "MODEL('name', '') + ',s'"
                    }
                  },
                ],
              },
              args: {
                src: 'comformscr.twig'
              }
            }
          }),
          items: [
          ]
        }
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
    }
  }
}

import HttpComponent from "@/components/HttpComponent.vue";
import {defineAutoStoreControl} from "@/hooks/autoVue";
import {usePage} from "@/mixins/framework";
import AutoHttpCom from "@/components/AutoHttpCom.vue";

let httpMixin = {
  components: {
    HttpComponent
  }
}

export default defineComponent({
  mixins: [
    formDesignerMixin,
    plumbLayoutMixin,
    httpMixin,
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
    AutoHttpCom,
    JsonCodeEditor,
    PlumbLayout,
    RenderLayout,
    GridRow,
    // 'tableA': globalThis.loadComponent('tabledef.vue', '&config_id=s1212121222sss1212121')
  },
  setup() {
    let page = usePage()
    let allDef = new Map()
    let storeControl;

    storeControl = defineAutoStoreControl({
      service: 'serviceB',
      data: {
        type: 'object',
        properties: {
          editor_step: {
            type: String,
          },
        }
      },
      filters: {
        showCom: "ZY_NOT(MODEL('reload'))",
      }
    })


    page.setEventHandler({
      ['submit:form'](e) {
        let { scope, parts } = e
        let model = parts[scope.name].getModel()
        console.log('submit:form',e, model)
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
      // allDef.set(config.name, config)
      let ret = {
        updateData() {
          page.setPartModel( config.name,'form2',
              {
                name: 'namssds',
                content: 'hello world'
              }
          )
        }
      };

      page.setDef(config, function ({done}) {
        // console.log('sdsdsds')
        ret.updateData()
        done()
      })


      await nextTick()
      storeControl.set({
        [varName]: config.name
      })

      return ret;
    }

    // onMounted(async () => {
    //   await loadStep()
    // })




    return {
      loadStepByContent,
      store: storeControl.store,
      page,
      filter: storeControl.filter,
      allDef: page.allDef,
    }
  }
})
</script>
