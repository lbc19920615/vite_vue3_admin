<style lang="scss">
@import "./PlumbLayout/index.scss";

$tag: "async-plumb-layout";
$sel: "." + $tag;

#{$sel} {
  @include init-plumb-layout();
}
</style>

<template>
  <div  class="async-plumb-layout auto-init-layout">
<!--    {{deps}}-->
    <el-button @click="save">保存</el-button>
    <el-button @click="addDep('array')">添加Array</el-button>
    <el-button @click="addDep('object')">添加Object</el-button>

    <div ref="container" class="container">
      <div :id="dep.id" class="abs section"
           v-for="(dep,depIndex) in deps"
           :key="dep.id">
        <el-popconfirm
            title="这是一段内容确定删除吗？"
            @confirm="deleteDep(dep)"
        >
          <template #reference>
            <el-button  size="small"  type="danger"><i class="el-icon-remove" ></i></el-button>
          </template>
        </el-popconfirm>

        <div class="item header" :data-pid="dep.id"
             :id="dep.id + '-top'">
          <el-space>
            <div>type: {{dep.type}}</div>
            <div>id: {{dep.id}}</div>
          </el-space>
        </div>

        <template v-if="!dep.config.closure">
<!--          <p style="margin: 10px 0;">items</p>-->
          <template v-for="(item, index) in dep.items" :key="item.id">
            <div :id="item.id" :data-pid="dep.id" class="item content-item">
              <div>
                <el-input v-if="dep.type !== 'array'" v-model="item.key" placeholder="请填写key"></el-input>
                <div v-else>{{item.key}}</div>
              </div>
              <template v-if="dep.type === 'array'">
<!--                <button @click="deleteItem(dep, item, index)"><i class="el-icon-remove" ></i></button>-->
              </template>
              <template v-else>
                <el-button size="small" @click="editDep(dep, item)"><i class="el-icon-edit" ></i></el-button>
              </template>
            </div>
          </template>
          <el-button size="small" v-if="dep.type === 'object'"
                     @click="appendItem(dep)"><i class="el-icon-plus"></i></el-button>
        </template>
        <div v-show="dep.data" style="height: 150px; overflow: auto;">{{dep.data}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {jsPlumb} from 'jsplumb'
import * as NodeDefMap from "@/plugins/ComEditor/nodes";
import {createPlumbConfig} from "@/plugins/PlumbLayout/utils";
import {plumbLayoutMixn} from "@/plugins/PlumbLayout/mixin";


let actionMixins = {
  methods: {
    /**
     * getVisibleConnections
     */
    getVisibleConnections() {
      let allConnections = this.instance.getConnections({

      });
      let ret = []
      ret = allConnections.filter(v => {
        return v.target && v.source
      })
      return ret
    },
    /**
     * getLinkRealtions
     */
    getLinkRealtions() {
      let allVisibleConnections = this.getVisibleConnections()
      let ret = []
      ret = allVisibleConnections.map(v => {
        return {
          toPID: v.target.dataset.pid,
          fromPID: v.source.dataset.pid,
          from: v.sourceId,
          to: v.targetId
        }
      })
      // console.log(ret)
      return ret
    }
  }
}

export default {
  name: "AsyncPlumbLayout",
  mixins: [
    plumbLayoutMixn,
    actionMixins,
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
  mounted() {
    let self = this

    self.config = createPlumbConfig(self)

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
      // console.log('async layout init', deps)
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
    insEventLinks(links = []) {
      let instance = this.instance
      links.forEach(link => {
        let endPoints1 = instance.getEndpoints(link.from)
        let endPoints2 = instance.getEndpoints(link.to)
        // console.log(endPoints1, endPoints2)
        instance.connect({
          source: endPoints1[0],
          target: endPoints2[0]
        })
      })
    },
    insComLinks(links = []) {
      let instance = this.instance
      links.forEach(link => {
        let endPoints1 = instance.getEndpoints(link.from)
        let endPoints2 = instance.getEndpoints(link.to)
        // console.log(endPoints1, endPoints2)
        instance.connect({
          source: endPoints1[1],
          target: endPoints2[0]
        })
      })
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
    /**
     * uninsDep
     * @param dep
     */
    uninsDep(dep) {
      let depId = dep.id
      let instance = this.instance
      let ids = [
        depId + '-top'
      ]

      ids.forEach(id => {
        if (document.getElementById(id)) {
          let points = this.pointsMap[depId]
          console.log(points, depId, this.pointsMap)
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
      })
      // console.log('this.deps', index, this.deps)
    },
    /**
     * appendDep
     * @param def {{}} required
     */
    appendDep(def = {}) {
      let id = 'i' + '-' + ZY.rid()
      let dep = {
        id: id,
        items: [
        ],
        config: {
          version: 'v1',
          closure: false
        },
        ...def
      }
      if (this.handleDep) {
        this.handleDep(dep)
      }
      this.deps.push(dep)
      this.$nextTick(() => {
        this.insDep(id, this.instance, dep.items)
      })
    },
    /**
     * editDep
     * @param dep {{}}
     */
    editDep(dep, item) {
      this.$emit('edit-dep', {
        dep, item
      })
    },
    addDep(type) {
      let id = 'i' + ZY.rid(3)
      let items = []
      let dep = NodeDefMap.create(type, {
        id,
        items: items
      })
      this.deps.push(dep)
      this.$nextTick(() => {
        this.insDep(id, this.instance, dep.items)
      })
    },
    /**
     * save
     */
    save() {
      let links = this.getLinkRealtions()

      let eventLinks = []

      eventLinks = links.filter(v => {
        let from = v.from
        return from.endsWith('-evt')
      })

      let comLinks = []
      let notCanLinks = [
          'evt',
          'fun'
      ]
      comLinks = links.filter(v => {
        let from = v.from
        let isMatched = notCanLinks.some(v => {
          return from.endsWith(v)
        })
        // console.log('v', isMatched)
        return v.to.endsWith('top') && !isMatched
      })
      let ret = {
        deps: this.deps,
        eventLinks: eventLinks,
        links: comLinks,
      }

      // console.log('links', comLinks, eventLinks)

      this.$emit('save-data', ret)
    }
  }
}
</script>
