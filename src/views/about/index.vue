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
<!--          {{currentEditDep}}-->
          <template v-if="renderFormDesigner">
            <HttpComponent
                :defs="allDef"
                :is="store.model.editor_step"
            >
              <template #form_array_before="scope">
                <h3>{{scope.index}}</h3>
              </template>
              <template #form_after="scope">
                <CusSubmitButton
                    :scope="scope"
                    class="el-col z-submit-btn"></CusSubmitButton>
              </template>
            </HttpComponent>
          </template>
        </div>
      </el-row>
    </div>
    <!--    <table-a></table-a>-->
  </div>
</template>

<script>
import {defineAsyncComponent, defineComponent, nextTick, getCurrentInstance} from "vue";
import GridRow from "@/views/about/components/grid-row.vue";
import RenderLayout from "@/views/about/components/render-layout.vue";
import PlumbLayout from "@/views/about/components/PlumbLayout.vue";

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
      showCurrent: true,
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
          editor: `
${rowEditorConfig({
            form2: {}
          })}
          `,
          name: '',
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
          editor: `
${rowEditorConfig({
            form2: {}
          })}
          `,
          name: '',
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
//         {
//           id: 'i4',
//           type: 'events',
//           sub: 'form',
//           config: {
//             version: 'v1',
//             closure: false
//           },
//           editor: `
// ${formEditorConfig}
//           `,
//           items: [
//             {
//               id: 'i4-0',
//               name: 'submit'
//             },
//           ]
//         },
        // {
        //   id: 'i5',
        //   type: 'table',
        //   config: {
        //     version: 'v1',
        //     closure: false
        //   },
        //   template: 'comtablescr.twig',
        //   content: JSON.stringify({
        //     tableDef: [
        //       {
        //         label: '日期',
        //         prop: 'date',
        //         width: 100
        //       },
        //       {
        //         label: '姓名', prop: 'name'
        //       },
        //       {
        //         label: '邮编', prop: 'zip'
        //       }
        //     ]
        //   }, null, 2),
        //   items: [
        //   ]
        // },
        {
          id: 'i3',
          type: 'form',
          config: {
            version: 'v1',
            closure: true
          },
          editor: `
${formEditorConfig({
            form2: {}
          })}
          `,
          content: '',
          items: [
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
                    name: {
                      type: 'string',
                      ui: {
                        label: '名称',
                      },
                    },
                    content: {
                      type: 'string',
                      ui: {
                        label: '代码',
                        widgetConfig: {
                          type: 'textarea',
                          rows: 10,
                        },
                      },
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
      this.showCurrent = false
      setTimeout(() => {
        this.showCurrent = true
      }, 500)
    }
  }
}

import {usePage} from "@/mixins/framework";
import AutoHttpCom from "@/components/AutoHttpCom.vue";
import {formEditorConfig, rowEditorConfig} from "@/views/about/editorConfig";

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
    AutoHttpCom,
    // JsonCodeEditor,
    PlumbLayout,
    RenderLayout,
    // GridRow,
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
      }
    })

    page.setEventHandler({
      ['submit:form'](e) {
        let { scope, parts } = e
        let model = parts[scope.name].getModel()
        console.log('submit:form',e, model)
      },
      ['model:update'](e) {
        let { model, key, newVal, config } = e
        let oldVal = self.currentEditDep[key]
        if (oldVal !== newVal) {
          self.currentEditDep[key] = newVal
        }
        if (self.currentEditDep.type === 'form') {
          let contentTpl = function ({ui, properties} = {}) {
            let obj = {
              name: 'process-step1',
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
                        def: {
                          type: 'object',
                          ui,
                          properties
                        }
                      },
                      computed: {
                        doubled: "MODEL('name', '') + ',s'",
                      },
                    }
                  ]
                },
                args: {
                  src: 'comformscr.twig'
                }
              }
            }
            return ZY.JSON5.stringify(obj)
          }
          // console.log(model)
          self.currentEditDep.content = contentTpl(
              {
                ui: ZY.JSON5.parse(model.parts[0].uis),
                properties: ZY.JSON5.parse(model.parts[0].properties)
              }
          )
          console.log(self.currentEditDep.content )
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
      // allDef.set(config.name, config)
      let ret = {
        updateData(part, data) {
          page.setPartModel( config.name, part,
             data
          )
        }
      };

      page.setDef(config, function ({done}) {
        // console.log('sdsdsds', config, self)
        // ret.updateData()
        for (let [partName, depPath] of Object.entries(config.defaultVal)) {
          // console.log(partName, depPath)
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
      page.storeControl.set({
        [varName]: config.name
      })

      return ret;
    }


    return {
      loadStepByContent,
      store: page.storeControl.store,
      page,
      filter: page.storeControl.filter,
      allDef: page.allDef,
    }
  }
})
</script>
