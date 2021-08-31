<template>
<div class="deep-editor">
  <div style="opacity: 0; font-size: 0;">{{store.model}}</div>
<!--  {{deps}}-->
  <el-row type="flex">
    <AsyncPlumbLayout
        @init="onPlumbLayoutInit"
        :root-id="rootId"
        :handleAppend="handleAppend"
        :handle-dep="handleDep"
        @edit-dep="onEditDep"
        @save-data="onSaveDep"
    ></AsyncPlumbLayout>


    <el-drawer
        title="编辑"
        size="600px"
        v-model="renderFormDesigner" destroy-on-close>
      <template #default>
        <div  v-if="renderFormDesigner && currentEditDep">
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
        </div>
      </template>
    </el-drawer>
  </el-row>
</div>
</template>

<script>
import AsyncPlumbLayout from "@/components/AsyncPlumbLayout.vue";
import {getCurrentInstance, nextTick, toRaw} from "vue";
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
      await this.loadStepByContent('editor_step', item)
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
      jsonObj: {},
      layoutContext: null,
      currentLayoutMap: {},
    }
  },
  props: {
    deps: {
      type: Array
    },
    links: {
      type: Array
    }
  },
  watch: {
    deps: {
      handler(newVal) {
        // console.log('deps watch', newVal)
        this.initLayout(this.layoutContext, newVal)
      },
      immediate: true
    }
  },
  methods: {
    initLayout(layoutContext, deps) {
      let comc = this
      let self = layoutContext
      let links = this.links ?? []
      // console.log('initLayout', self)
      if (self) {
        // self.deps = deps
        self.init({deps})
        self.$nextTick(() => {
          self.insDeps(deps)
          setTimeout(() => {
            self.insComLinks(
                comc.links
            )
          }, 300)
        })
      }
    },
    onPlumbLayoutInit(self) {
      this.layoutContext = self
      // console.log('layoutContext', this.layoutContext)
      if (Array.isArray(this.deps) && this.deps.length > 0) {
        this.initLayout(this.layoutContext, this.deps)
      }
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
    onSaveDep({deps, links = []}) {
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
      // this.jsonObj = deepObj.root.properties
      // console.log(deepObj)
      // this.showCurrent = false
      // setTimeout(() => {
      //   this.showCurrent = true
      // }, 500)
      this.$emit('update:deps', toRaw(deps))
      this.$emit('update:links', toRaw(links))
      this.$emit('change')
    }
  }
}

export default {
  name: "DeepPropEditor",
  components: {AsyncPlumbLayout},
  props: {
    serviceName: String,
  },
  mixins: [
    plumbLayoutMixin,
    depManagerMixin
  ],
  data() {
    return {
      rootId: 'i111',
    }
  },
  setup(props) {
    let self = getCurrentInstance().ctx
    // console.log('serviceName', props.serviceName)
    // let { $SERVICE_ID } = await globalThis.createServiceCom()
    // let serviceName = globalThis.createServiceComSync()
    let serviceName = props.serviceName
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
      },
      serviceName,
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

<style lang="scss">
.deep-editor {
   .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
