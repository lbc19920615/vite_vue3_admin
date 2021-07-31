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
      ></render-layout>
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
          {{currentEditDep}}
          <template v-if="renderFormDesigner">
            <!--          {{currentEditDep.type}}-->
            <search-demo1 v-if="currentEditDep.type === 'row'"
                          @init="onInitDemo1" :modelValue="currentEditDep"
                          @model:update="onUpdateModelValue"
            >
              <template v-slot:key1__array__before="{items, index}">
                <header>{{index}}</header>
              </template>
            </search-demo1>
            <search-demo2 v-if="currentEditDep.type === 'column'"
                          @init="onInitDemo1" :modelValue="currentEditDep"
                          @model:update="onUpdateModelValue"
            >
              <template v-slot:key1__array__before="{items, index}">
                <header>{{index}}</header>
              </template>
            </search-demo2>
            <form-prop-editor v-if="currentEditDep.type === 'form'"
                          @init="onInitDemo1" :modelValue="currentEditDep"
                @model:update="onUpdateModelValue"
            >
            </form-prop-editor>
          </template>
        </div>
      </el-row>
    </div>
    <!--    <table-a></table-a>-->
  </div>
</template>

<script>
import {defineAsyncComponent, defineComponent} from "vue";
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
      console.log( this.currentEditDep )
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
    onEditDep(dep) {
      // console.log('onEditDep', dep)
      this.renderFormLoading = true
      this.renderFormDesigner = false
      this.currentEditDep = dep
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
              h: 120
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
          template: 'comformscr.twig',
          content: JSON.stringify({
            row: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  ui: {}
                },
              }
            }
          }, null, 2),
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
                {
                  "toPID": "i5",
                  "fromPID": "i1",
                  "from": "i1-1",
                  "to": "i5-top"
                }
              ]
          )
          self.insEventLinks([
            {
              "toPID": "i4",
              "fromPID": "i3",
              "from": "i3-evt",
              "to": "i4-0"
            }
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

export default defineComponent({
  mixins: [
    formDesignerMixin,
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
  methods: {},
  components: {
    JsonCodeEditor,
    PlumbLayout,
    RenderLayout,
    GridRow,
    // 'tableA': globalThis.loadComponent('tabledef.vue', '&config_id=s1212121222sss1212121')
  }
})
</script>
