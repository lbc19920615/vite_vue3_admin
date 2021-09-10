<style lang="scss">
@import "../../../components/PlumbLayout/index.scss";

$tag: "plumb-layout";
$sel: "." + $tag;

#{$sel} {
  @include init-plumb-layout();
}
</style>

<template>
  <div  class="plumb-layout" :id="comId">
<!--    <el-button @click="save">保存</el-button>-->
<!--    <el-button @click="getLinkRealtions">get connect</el-button>-->
    <el-button @click="toggleGroupDialog(true)">添加组</el-button>

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
</template>

<script>
import {jsPlumb} from 'jsplumb'
import {groupManagerMixin} from "./PlumbLayout/groupDialog";
import {createFromJSON5} from "@/plugins/ComEditor/nodes";
import {plumbActionMixins, plumbLayoutMixn} from "@/plugins/PlumbLayout/mixin";
import {createPlumbConfig} from "@/plugins/PlumbLayout/utils";

export default {
  name: "PlumbLayout",
  mixins: [
    plumbLayoutMixn,
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
      ]
    }
  },
  watch: {
    deps: {
      async handler(newVal) {

      },
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
    // getLinks() {
    //   let links = this.getLinkRealtions()
    //
    //   let eventLinks = []
    //
    //   eventLinks = links.filter(v => {
    //     let from = v.from
    //     return from.endsWith('-evt')
    //   })
    //
    //   let comLinks = []
    //   let notCanLinks = [
    //     'evt',
    //     'fun'
    //   ]
    //   comLinks = links.filter(v => {
    //     let from = v.from
    //     let isMatched = notCanLinks.some(v => {
    //       return from.endsWith(v)
    //     })
    //     // console.log('v', isMatched)
    //     return v.to.endsWith('top') && !isMatched
    //   })
    //   return {
    //     eventLinks,
    //     comLinks,
    //   }
    // },
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
