<style lang="scss">
@import "../../../components/PlumbLayout/index.scss";

$tag: "plumb-layout";
$sel: "." + $tag;

#{$sel} {
  @include init-plumb-layout() {
    border: none;
    --tools-height: 0px;
    --com-panel-width: initial;
    $panel-tra: width .5s ease;
    .tools {
      //height: var(--tools-height);
    }
    .com-panel {
      width: calc(var(--com-panel-width));

      transition: $panel-tra;
    }
    .container {
      position: relative;
      width: calc(100% - var(--com-panel-width));
      height: calc(var(--plumb-con-height) - var(--tools-height));
      border: 1px solid #eee;
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

    .element-panel {
      width: calc(var(--ele-panel-width));
    }

    &--panel-opened {
      .container {
        //background-color: #0d84ff;
        transition: $panel-tra;
      }
    }

    .list-group {
      min-height: 150px;
      border: 1px solid #eee;
    }

  }
}
</style>

<template>
  <div  class="plumb-layout" :id="comId" :class="classObj" :style="styleObj">
<!--    <el-button @click="save">保存</el-button>-->
<!--    <el-button @click="getLinkRealtions">get connect</el-button>-->
<!--    {{styleObj}}-->
    <el-dialog
        v-model="dialogVisible" title="组选择" width="80vw"
    :close-on-click-modal="false"
    >
      <el-row :gutter="20">
        <el-col :span="6"
                v-for="group in handleGroup(groups)"
               >
          <div>{{group.type}}</div>
          <div>{{group.desc}}</div>
          <div style="margin-bottom: 20px">
            <el-button type="primary"
                       @click="selectGroupTemplate(group)">选择</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>


    <div class="playground">
      <div class="com-panel">
        <div class="a-space-mb-10">
          <el-button size="small" @click="togglePanel">toggle</el-button>
        </div>
        <el-row align="middle" class="tools">
          <el-button size="small" @click="toggleGroupDialog(true)">添加组</el-button>
        </el-row>
        <div class="element-panel">
          <draggable
              class="dragArea list-group"
              v-model="myArray"
              group="people"
              @start="onDropStart"
              @end="onDropEnd"
              :group="{ name: 'people', pull: 'clone', put: false }"
              :sort="false"
              item-key="id">
            <template #item="{element}">
              <div>{{element.name}}</div>
            </template>
          </draggable>

          <draggable
              class="dragArea list-group"
              :list="list2"
              group="people"
          >
            <template #item="{element}">
              <div>{{element.name}}</div>
            </template>
          </draggable>
        </div>
      </div>
      <div :id="containerId" ref="container" class="container">
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
                          type="danger"><i class="el-icon-remove" ></i></el-button>
            </template>
          </el-popconfirm>
          <template v-if="dep.type === 'events'">

            <div class="item header" :data-pid="dep.id"
                 :id="dep.id + '-top'">
              <div>
                <div>
                  <el-button size="mini"
                             @click="editDep(dep)"><i class="el-icon-edit" ></i></el-button>
                </div>
                <div>type: {{dep.type}}</div>
                <div>type: {{dep.sub}}</div>
                <div>id: {{dep.id}}</div>
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
              <div class="a-space-mb-10">
                <el-space>
                  <div>type: {{dep.type}}</div>
                  <el-button size="mini" @click="editDep(dep)"><i class="el-icon-edit" ></i></el-button>
                </el-space>
                <div></div>
                <el-space>
                  <div>id: {{dep.id}}</div>
                </el-space>
                <div v-if="dep.data">part: {{dep.data.partName ?? ''}}</div>
              </div>
            </div>
            <!--          <div class="item content-item" :data-pid="dep.id"-->
            <!--               :id="dep.id + '-evt'"-->
            <!--          >events</div>-->
            <template v-if="!dep.config.closure">
              <!--            <h3 style="margin: 10px 0;">items</h3>-->
              <template v-for="(item, index) in dep.items" :key="index">
                <div :id="item.id" :data-pid="dep.id" class="item content-item">
                  <div>
                    <el-input :readonly="dep.keyReadonly" v-model="item.key" placeholder="请填写key"></el-input>
                  </div>
                  <template v-if="!dep.noToolsRemove">
                    <el-button size="mini" @click="deleteItem(dep, item, index)"><i class="el-icon-remove" ></i></el-button>
                  </template>
                </div>
              </template>
              <template v-if="!dep.noToolsAdd">
                <el-button size="mini"
                           @click="appendItem(dep)"><i class="el-icon-plus"></i></el-button>
              </template>
            </template>

          </template>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {jsPlumb} from 'jsplumb'
import {groupManagerMixin} from "./PlumbLayout/groupDialog";
import {createFromJSON5} from "@/plugins/ComEditor/nodes";
import {plumbActionMixins, plumbLayoutMixn} from "@/plugins/PlumbLayout/mixin";
import {createPlumbConfig} from "@/plugins/PlumbLayout/utils";
import draggable from 'vuedraggable'

let UIMixin = {
  components: {
    draggable
  },
  computed: {
    styleObj() {
      return {
        ['--ele-panel-width']: '320px',
        ['--com-panel-width']: this.panelOpend ? '320px' : '70px',
        ['--plumb-height']: '600px',
      }
    },
    classObj() {
      return {
        ['plumb-layout--panel-opened']: this.panelOpend
      }
    }
  },
  data() {
    return {
      panelOpend: true,
      myArray: [
        {
          name: 'sdsds1',
          value: 'sdsds1',
          id: ZY.rid(),
        },
        {
          name: 'sdsds2',
          value: 'sdsds2',
          id: ZY.rid(),
        },
      ],
      list2: [
        {
          name: 'sdsds3',
          value: 'sdsds2',
          id: ZY.rid(),
        },
      ],
      isDragging: false
    }
  },
  methods: {
    onDropStart(e) {
      // console.log('onDropEnd', e)
      this.isDragging = true
    },
    onDropEnd(e) {
      // console.log('onDropEnd', e)
      this.isDragging = false
    },
    togglePanel() {
      this.panelOpend = !this.panelOpend
    },
  }
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
      let config = this.config
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
        let endpoint = instance.addEndpoint(id , options, config.baseStyle)
        this.pointsMap[depId][id + suffix] = endpoint
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
