<style lang="scss">
@use "sass:math";
@import "../../../components/PlumbLayout/index.scss";

$tag: "plumb-layout";
$sel: "." + $tag;

#{$sel} {
  //--plumb-height: 600px;
  @include init-plumb-layout() {
    border: none;
    --tools-height: 0px;
    --com-panel-width: initial;
    $panel-tra: width .5s ease;
    .tools {
      //height: var(--tools-height);
      margin-bottom: 15px;
    }
    .com-panel {
      width: calc(var(--com-panel-width));

      transition: $panel-tra;
    }
    .container-con {
      position: relative;
      width: calc(100% - var(--com-panel-width));
      height: calc(var(--plumb-con-height) - var(--tools-height));
      border: 1px solid #eee;
      background-color: rgba(255,255,255,.7);
      //backdrop-filter: blur(2px);
    }

    .playground {
      display: flex;
      contain: layout;

      //@container (max-width: 700px){
      //  .playground {
      //    display: block;
      //    background-color: #0d84ff;
      //  }
      //}
    }

    .drag-put-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1111;
      background-color: rgba(255,255,255,.5);
      color: transparent;
      //background-color: #0d84ff;
      .list-group {
        height: 100%;
      }
    }

    .element-panel {
      width: calc(var(--ele-panel-width));
    }

    &--panel-opened {
      .container-con {
        //background-color: #0d84ff;
        transition: $panel-tra;
      }
    }


    $row-item-length: 2;
    $row-gutter-length: $row-item-length * 2;
    $row-gutter-deliver:  $row-item-length + 1;
    $element-list-item-g: 12px;
    $element-list-item-x: math.div($element-list-item-g *   $row-gutter-length, $row-gutter-deliver) ;
    $first-last-with: $element-list-item-g * $row-item-length - $element-list-item-x;
    .element-list-item {

      --element-list-item-h: 30px;
      height: var(--element-list-item-h);
      width: calc(100% - #{$element-list-item-g * 2} - 2px);
      //background-color: #0d84ff;
      //margin-top: 15px;
      margin-bottom: 15px;
      border: 1px solid #eeeeee;
      border-radius: 4px;
      font-size: 13px;
      line-height:  var(--element-list-item-h);
      box-sizing: border-box;
      padding: 0 10px;

      cursor: pointer;

    }

    .list-group-item {
      &:nth-child(2n+1) {
        .element-list-item {
          margin-left: $element-list-item-x;
        }
      }
      &:nth-child(2n) {
        .element-list-item {
          margin-left: $element-list-item-x - $first-last-with;
        }
      }

      &--hidden {
        display: none;
      }
    }

  }
}
</style>

<template>
  <div  class="plumb-layout" :id="comId" :class="classObj" :style="styleObj">
<!--    <el-button @click="save">保存</el-button>-->
<!--    <el-button @click="getLinkRealtions">get connect</el-button>-->
<!--    {{styleObj}}-->
<!--    {{buildedGroups}}-->
    <el-dialog
        v-model="dialogVisible" title="组选择" width="72vw"
    :close-on-click-modal="false"
    >
      <el-row :gutter="20">
        <el-col :span="6"
                v-for="group in buildedGroups"
               >
          <div class="a-space-mb-10">
            <el-space>
              <div>{{group.type}}</div>
              <div>{{group.desc}}</div>
            </el-space>
          </div>
          <div  class="a-space-mb-10" v-if="group.img">
            <el-image :src="group.img"></el-image>
          </div>
          <div class="a-space-mb-20">
            <el-button type="primary" size="small"
                       @click="selectGroupTemplate(group)">选择</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>


    <div class="playground">
      <div class="com-panel">
        <div class="a-space-mb-10">
          <el-button size="small" @click="togglePanel"
                   >
            <el-icon>
              <Fold></Fold>
            </el-icon>

          </el-button>
        </div>
        <el-row align="middle" class="tools plumb-layout__tools">
          <el-button size="small" class="add-group-btn"
                     @click="toggleGroupDialog(true)">添加组</el-button>
<!--          <el-button size="small" @click="insertEleGroup()">添加ele</el-button>-->
        </el-row>
        <div class="element-panel">
<!--          {{list1}}-->
          <div class="a-space-mb-20 a-space-ph-10">
            <el-input v-model="filterList1" placeholder="搜索"></el-input>
          </div>
          <div style="height: 450px; overflow: auto">
            <draggable
                class="dragArea list-group"
                v-model="list1"
                @start="onDropStart"
                @end="onDropEnd"
                :group="{ name: 'people', pull: 'clone', put: false }"
                :sort="false"
                :disabled="disableDrag"
                item-key="id"
                tag="el-row"
                style="align-items: flex-start; flex-wrap: wrap;"
            >
              <template #item="{element}">
                <el-col class="list-group-item"
                        :class="list1ItemCls(element)"
                        :span="12"><div
                    class="element-list-item">{{element.label ? element.label : element.name}}</div></el-col>
              </template>
            </draggable>
          </div>

        </div>
      </div>
      <div class="container-con">
        <div :id="containerId" ref="container"  class="container">
          <div :id="dep.id" class="abs section"
               :dep-name="dep.id"
               v-for="(dep,depIndex) in deps"
               :key="dep.id"
          >
            <el-popconfirm
                title="这是一段内容确定删除吗？"
                @confirm="deleteDep(dep)"
            >
              <template #reference>
                <el-button  size="mini"
                            type="danger">
                  <el-icon><Remove></Remove></el-icon>
                </el-button>
              </template>
            </el-popconfirm>
            <template v-if="dep.type === 'events'">

              <div class="item header" :data-pid="dep.id"
                   :id="dep.id + '-top'">
                <div>
                  <div>
                    <el-button size="mini"
                               @click="editDep(dep)">
                      <el-icon><Edit></Edit></el-icon>
                    </el-button>
                  </div>
                  <div>类型: {{dep.type}}</div>
                  <div>SUB: {{dep.sub}}</div>
                  <div>ID: {{dep.id}}</div>
                </div>
              </div>
              <template v-if="!dep.config.closure">
                <h3 style="margin: 10px 0;">items</h3>
                <template v-for="(item, index) in dep.items" :key="index">
                  <div :id="item.id" :data-pid="dep.id" class="item content-item">
                    <!--                <div>{{item.id}}</div>-->
                    <div>{{item.name}}</div>
                  </div>
                </template>
              </template>

            </template>

            <template v-else>

              <div class="item header" :data-pid="dep.id"
                   :id="dep.id + '-top'">
                <div class="a-space-mb-10  plumb-layout__header-desc">
                  <el-space>
                    <div>类型: {{dep.typeLabel ? dep.typeLabel : dep.type}}</div>
                    <el-button size="mini" @click="editDep(dep)">
                      <el-icon><Edit></Edit></el-icon>
                    </el-button>
                  </el-space>
                  <div></div>
<!--                  <el-space>-->
<!--                    <div>id: {{dep.id}}</div>-->
<!--                  </el-space>-->
                  <div v-if="dep.type === 'ele'">
                    <div v-if="dep.data && dep.data.tagName">标签名: {{dep.data.tagName}}</div>
                  </div>
                  <div v-if="dep.data && dep.data.partName">PART: {{dep.data.partName}}</div>
                </div>
              </div>
              <!--          <div class="item content-item" :data-pid="dep.id"-->
              <!--               :id="dep.id + '-evt'"-->
              <!--          >events</div>-->
              <template v-if="!dep.config.closure">
                <!--            <h3 style="margin: 10px 0;">items</h3>-->
                <template v-for="(item, index) in dep.items" :key="index">
                  <div :id="item.id" :data-pid="dep.id" class="item content-item">
                    <div class="a-space-mr-10 plumb-layout__item-action">
                      <el-input class="plumb-layout__item-input-key"
                                :readonly="dep.keyReadonly"
                                v-model="item.key" placeholder="请填写key"></el-input>
                      <slot name="item-action-beforeend" v-bind="{item, dep}"></slot>
                    </div>
                    <template v-if="!dep.noToolsRemove">
                      <el-button size="mini" @click="deleteItem(dep, item, index)">
                        <el-icon><Remove></Remove></el-icon>
                      </el-button>
                    </template>
                  </div>
                </template>
                <template v-if="!dep.noToolsAdd">
                  <el-button
                      class="plumb-layout__plus-btn"
                      size="mini"
                             @click="appendItem(dep)">
                    <el-icon><plus></plus></el-icon>
                  </el-button>
                </template>
                <slot name="plus-action" v-bind="{dep, renderRefresh}"></slot>
              </template>

            </template>

          </div>
        </div>
        <div class="drag-put-area" v-show="isDragging">
<!--          {{list2}}-->
          <draggable
              class="dragArea list-group"
              :list="list2"
              group="people"
              :sort="false"
              item-key="id"
              @change="onList2Change"
          >
            <template #item="{element}">
              <div>{{element.name}}</div>
            </template>
          </draggable>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
// import {jsPlumb} from 'jsplumb'
import {groupManagerMixin} from "./PlumbLayout/groupDialog";
import {createFromJSON5} from "@/plugins/ComEditor/nodes";
import {plumbActionMixins, plumbLayoutMixn} from "@/plugins/PlumbLayout/mixin";
import {createPlumbConfig} from "@/plugins/PlumbLayout/utils";
import draggable from 'vuedraggable'
import {toRaw} from "vue";
import {getXmlData} from "@/views/about/components/PlumbLayout/xmlData";
import {Edit, Fold, Plus, Remove} from '@element-plus/icons'

let UIMixin = {
  components: {
    draggable,
    Fold,
    Remove,
    Plus,
    Edit
  },
  computed: {
    styleObj() {
      return {
        ['--ele-panel-width']: '350px',
        ['--com-panel-width']: this.panelOpend ? '350px' : '70px',
        // ['--plumb-height']: '600px',
      }
    },
    classObj() {
      return {
        ['plumb-layout--panel-opened']: this.panelOpend
      }
    }
  },
  props: {
    openPanel: {
      type: Boolean,
      default: true
    },
    handleList1: null
  },
  data() {
    let list1 = this.handleList1 ? this.handleList1() : getXmlData()
    return {
      panelOpend: this.openPanel,
      list1: list1,
      list2: [
        // {
        //   name: 'sdsds3',
        //   value: 'sdsds2',
        //   id: ZY.rid(),
        // },
      ],
      isDragging: false,
      disableDrag: false,
      filterList1: ''
    }
  },
  methods: {
    onDropStart() {
      // console.log('onDropEnd', e)
      this.isDragging = true
      this.disableDrag = true
    },
    onDropEnd() {
      // console.log('onDropEnd', e)
      this.isDragging = false
    },
    togglePanel() {
      this.panelOpend = !this.panelOpend
    },
    async onList2Change(e) {
      // console.log('onList2Change', e)
      await this.$nextTick();
      let {added = {}} = e
      let elementRawData = toRaw(added.element.data)
      this.insertEleGroup({
        // tagName: elementRawData.tagName
        ...elementRawData
      }, added.element)
      this.disableDrag = false
      this.$emit('ele-drag-change')
    },
    list1ItemCls(element) {
      let filted = !element.name.includes(this.filterList1)
      return {
        ['list-group-item--hidden']: filted
      }
    }
  },
}

export default {
  name: "PlumbLayout",
  mixins: [
    plumbLayoutMixn,
      UIMixin,
    groupManagerMixin,
    plumbActionMixins,
  ],
  props: {
    rootId: String,
    handleAppend: {
      type: Function,
      default() {
        return function () {}
      }
    },
    handleDep: {
      type: Function,
      default() {
        return function () {}
      }
    },
    handleGroup: {
      type: Function,
      default() {
        return function () {}
      }
    }
  },
  data() {
    return {
      pointsMap: {},
      instance: null,
      config: {},
      deps: [
      ],

    }
  },
  watch: {
    // deps: {
    //   async handler(newVal) {
    //
    //   },
    // }
  },
  computed: {
    buildedGroups() {
      return this.handleGroup(this.groups)
    }
  },
  mounted() {
    let self = this

    self.config = createPlumbConfig(self);

    jsPlumb.ready(function () {
      self.instance = jsPlumb.getInstance({
        Container: self.$refs.container
      })
      self.$emit('init', self)
    })
  },
  methods: {

    /**
     * init
     */
    init({deps = []} = {}) {
      this.deps = deps
    },
    /**
     * insDeps
     */
    insDeps(deps) {
      let self = this
      let instance = this.instance
      deps.forEach(dep => {
        self.insDep(dep.id, instance, dep.items)
      })
    },
    async useDeps(defaultDeps = []) {
      let deps = []
      let cached = await ZY_EXT.store.getItem(this.storagePrefix + '-deps') ?? defaultDeps
      if (cached) {
        cached.forEach(item => {
          let dep = createFromJSON5(item.type, item)
          if (dep) {
            deps.push(dep)
          }
        })
      }
      // console.log('deps', deps)
      this.deps = deps
      return deps
    },
    async useLinks(defaultVal) {
      let deps = []
      let links = await ZY_EXT.store.getItem(this.storagePrefix + '-links')
      let cached = {
        eventLinks: [],
        links: links ?? [],
      }
      // console.log('cached', cached)
      if (cached) {
        if (cached.eventLinks) {
          this.insEventLinks(cached.eventLinks)
        }
        if (cached.links) {
          this.insComLinks(cached.links)
        }
      }
      return deps
    },
    insEventLinks(links = []) {
      let instance = this.instance
      if (Array.isArray(links)) {
        links.forEach(link => {
          let endPoints1 = instance.getEndpoints(link.from)
          let endPoints2 = instance.getEndpoints(link.to)
          // console.log(endPoints1, endPoints2)
          instance.connect({
            source: endPoints1[0],
            target: endPoints2[0]
          })
        })
      }
    },
    insComLinks(links = []) {
      let instance = this.instance
      if (Array.isArray(links)) {
        links.forEach(link => {
          let endPoints1 = instance.getEndpoints(link.from)
          let endPoints2 = instance.getEndpoints(link.to)
          // console.log(endPoints1, endPoints2)
          instance.connect({
            source: endPoints1[1],
            target: endPoints2[0]
          })
        })
      }
    },
    /**
     * insDep
     */
    insDep(id, instance, items = []) {
      let self = this
      // let config = this.config
      self.addEndpoint(id + '-top' , {
        anchors: ['Left']
      }, id)
      items.forEach(item => {
        self.renderItem(item, id)
      })
      self.makeDraggable(id, instance, items)
    },
    addEndpoint(id, options, depId, suffix = '') {
      if (!this.pointsMap[depId]) {
        this.pointsMap[depId] = {}
      }
      let self = this
      let config = this.config
      let instance = self.instance
      if (document.getElementById(id)) {
        this.pointsMap[depId][id + suffix] = instance.addEndpoint(id, options, config.baseStyle)
      }
      // console.log(id, depId, this.pointsMap)
    },
    // this.insDep(dep.id, this.instance, dep.items)
    uninsDep(dep) {
      let depId = dep.id
      let instance = this.instance
      let ids = [
        depId + '-top'
      ]

      ids.forEach(id => {
        if (document.getElementById(id)) {
          let points = this.pointsMap[depId]
          // console.log(points, depId, this.pointsMap)
          if (points) {
            for (let [key,point] of Object.entries(points)) {
              instance.deleteEndpoint(point)
            }
            delete this.pointsMap[depId]
          }
          // instance.deleteEndpoint(id)
        }
      })
    },
    deleteDep(dep) {
      let id = dep.id
      let index = this.deps.findIndex( v => v.id === id)
      if (index > -1) {
        // this.deps.splice(index, 1)
        this.uninsDep(dep)
        this.deps.splice(index, 1)
      }
      this.$nextTick(() => {
        this.instance.repaintEverything()
        this.$emit('delete-dep', {dep})
      })
      // console.log('this.deps', index, this.deps)
    },
    /**
     * appendDep
     * @param dep {{}} required
     */
    async appendDep(dep) {
      if (this.handleDep) {
        this.handleDep(dep)
      }
      this.deps.push(dep)
      await this.$nextTick()
      this.insDep(dep.id, this.instance, dep.items)
    },
    /**
     * editDep
     * @param dep {{}}
     */
    editDep(dep) {
      this.$emit('edit-dep', dep)
    },
    setDep(id, v) {
      let dep = this.deps.find(v => v.id === id)
      if (dep) {
        for (let k in v) {
          dep[k] = v[k]
        }
      }
    },


    /**
     * 快捷安装ele节点
     * @param defaultData
     * @param element
     */
    insertEleGroup(defaultData = null, element = {}) {
      let eleGroup = this.buildedGroups.find(v => v.type === 'ele')
      if (eleGroup) {
        let dep = this.buildDepFromGroup(eleGroup)
        // console.log(eleGroup, dep)
        dep.data = defaultData ?? {
          tagName: 'div'
        }
        dep.lib = element.lib
        // console.log('insertEleGroup', element)
        if (Array.isArray(element.items)) {
          dep.items = element.items
        }
        this.appendDep(
            dep
        )
      }
    },

    /**
     * save
     */
    save() {
      // let links = this.getLinks()
      // let ret = {
      //   deps: this.deps,
      //   eventLinks: links.eventLinks,
      //   links: links.comLinks,
      // }
      let ret = this.getToolsData()

      this.saveCache2Storage(ret)

      this.$emit('save-data', ret.data)
    }
  }
}
</script>
