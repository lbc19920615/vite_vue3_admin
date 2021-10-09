<style>
.deep-editor .el-drawer__body {
  overflow: auto;
}
</style>

<template>
<div class="deep-editor">
  <div style="opacity: 0; font-size: 0; line-height: 0;">{{store.model}}</div>
<!--  {{deps}}-->
<!--  {{rootId}}-->
  <el-row type="flex">
    <el-button size="small" @click="dialogVisible = true">编辑</el-button>
    <el-dialog
        v-model="dialogVisible" title="" width="96vw"
    :before-close="onBeforeClose"
    >
      <AsyncPlumbLayout
          @init="onPlumbLayoutInit"
          :root-id="rootId"
          :handleAppend="handleAppend"
          :handle-dep="handleDep"
          @edit-dep="onEditDep"
          @save-data="onSaveDep"
          :style="{height}"
      >
        <template #actions="scope">
          <el-button size="mini"
                     style="padding: 6px  10px"
                     type="primary"
                     @click="inspect(scope)"><el-icon><Coffee></Coffee></el-icon></el-button>
        </template>
      </AsyncPlumbLayout>
    </el-dialog>


    <el-drawer
        title="属性"
        size="700px"
        v-model="renderFormDesigner"
        :lock-scroll="false"
        destroy-on-close
        @closed="onDrawerClose(currentEditItem, currentEditDep)"
    >
      <template #default>
        <div  v-if="renderFormDesigner && currentEditDep">
          <template v-if="currentEditDep.type === 'object'">
            <HttpComponent
                :defs="allDef"
                :is="store.model.editor_step"
                :debug="false"
            >
              <template #object_beforebegin="scope">
                <h3>{{getArrItemBeforeKey(scope)}}</h3>
              </template>
              <template #array_afterbegin="scope">
                <el-col>
                   <h3>{{ getArrItemBeforeKey(scope) }}</h3>
                  <el-button type="primary" size="small"
                             @click="page.callEvent(EVENT_NAMES.ARR_APPEND_COMMON, scope)">添加</el-button>
                </el-col>
              </template>
              <template #array_con_beforeend="scope">
                <el-col>
                  <el-button type="danger" size="small"
                             @click="page.callEvent(EVENT_NAMES.ARR_REMOVE_COMMON, scope)">删除</el-button>
                </el-col>
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
import {extendControl2Page, useControl, useAppPageControl, extendCommonArrEventHandler} from "@/mixins/framework";
import {Coffee} from "@element-plus/icons";
import {COMMAND, sendJSON5ChannelMessage} from "@/channel";

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
      // console.log('onEditDep', dep, item)
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
      dialogVisible: false,
      // dialogVisible: true,
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
    },
    posMap: {
      type: Object
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
    async initLayout(layoutContext, deps) {
      let comc = this
      let self = layoutContext
      let links = this.links ?? []
      let posMap = this.posMap ?? {}
      // console.log('initLayout', posMap)
      if (self) {
        // self.deps = deps
        self.insPosMap(posMap)
        await ZY.sleep(300);

        self.init({deps});
        await self.$nextTick();
        self.insDeps(deps);
        // setTimeout(() => {
        //   self.insComLinks(
        //       comc.links
        //   )
        // }, 300)
        await ZY.sleep(300);
        self.insComLinks(
            comc.links
        );
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
    onSaveDep({deps, links = [], posMap = {}}) {
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

      this.$emit('update:deps', toRaw(deps))
      this.$emit('update:links', toRaw(links))
      this.$emit('update:posMap', toRaw(posMap))
      this.$emit('change')
    }
  }
}

export default {
  name: "DeepPropEditor",
  components: {AsyncPlumbLayout, Coffee},
  props: {
    serviceName: String,
    height: {
      type: [Number, String],
      default: '900px'
    },
    rootId: {
      type: String,
      default: 'i0'
    }
  },
  mixins: [
    plumbLayoutMixin,
    depManagerMixin
  ],
  data() {
    return {
    }
  },
  setup(props) {
    let self = getCurrentInstance().ctx
    let page = useControl({
      properties: {
        editor_step: {
          type: String,
        },
      },
    }, {
      onInited() {

      }
    })
    page = extendControl2Page(page)
    let { EVENT_NAMES, onChange } = extendCommonArrEventHandler(page)

    let cachedDeepEditorModel = null
    page.setEventHandler({
      ['model:update'](e) {
        let { model, key, newVal, config } = e
        let oldVal = ZY.lodash.get(self.currentEditItem.data, key)
        if (oldVal !== newVal) {
          self.currentEditItem.data = ZY.JSON5.stringify(model)
        }
        // console.log('deep editor model:update', model)
        // console.log( self.currentEditItem.data)
      },
      ['model:update:all'](e) {
        let { model, key, newVal, config } = e
        // console.log('deep editor update', model)
        cachedDeepEditorModel = model
      }
    })

    let getPartForm2ModelContext = null
    let self_config = {}

    async function loadStepByContent( varName = '', item) {
      let [,res] = await ZY.awaitTo(
          import('./DeepPropEditor/DeepEditorConfig')
      )
      const config = res.default
      config.name = ZY.rid()

      self_config = config
      // console.log(self_config)

      page.setDef(config, function ({done}) {
        let cached = null
        if (item.data) {
          // console.log('sdsdsdsd', item, item.data)
          cached = ZY.JSON5.parse(item.data)
        }

        for (let [partName, data] of Object.entries(config.defaultVal)) {
          let defaultObj = ZY.JSON5.parse(ZY.JSON5.stringify(data))
           page.setPartModel( config.name, partName,
               cached ? cached : defaultObj
           )
        }

        getPartForm2ModelContext = function (partName, obj) {
          return page.getPartModel( config.name, 'form2')
        }

        done()
      })
      await nextTick();
      // console.log('onEditDep', page.store.model, varName, config)
      page.setData({
        [varName]: config.name
      })
    }

    function onBeforeClose(done) {
      self.layoutContext.save()
      // console.log('onBeforeClose', self.layoutContext)
      done()
    }

    function onDrawerClose(currentEditItem) {
      // console.log('onDrawerClose', cachedDeepEditorModel, currentEditItem)
      if (cachedDeepEditorModel) {

        currentEditItem.data = ZY.JSON5.stringify(cachedDeepEditorModel)
      }
    }

    function getArrItemBeforeKey(scope) {
      // let fieldContext = globalThis.cmFieldContext.get(props.field_uuid)
      // console.log(scope, self_config)

      let c = {
        config: self_config.init.def
      }

      let partCONFIG =  ZY.lodash.get(c, scope.configPath)

      // console.log(partCONFIG)

      let label = ZY.getStrFromObj(partCONFIG, 'ui.label', scope.key)

      return label
    }

    /**
     * 视察某个元素
     * @param dep
     * @param item
     */
    function inspect(e) {
      console.log('inspect', e)
      sendJSON5ChannelMessage({
        type: COMMAND.INSPECT,
        e
      })
    }

    return {
      loadStepByContent,
      onBeforeClose,
      onDrawerClose,
      inspect,
      store: page.store,
      filter: page.filter,
      EVENT_NAMES,
      allDef: page.defMap,
      getArrItemBeforeKey,
      page,
    }
  }
}
</script>

<style lang="scss">

</style>
