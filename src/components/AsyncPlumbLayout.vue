<style lang="scss" scoped>
$tag: "async-plumb-layout";
$sel: "." + $tag;

#{$sel} {
  width: 900px;
  height: 600px;
  border: 1px solid #eee;
  .item {
    min-height: 50px;
    width: 100%;
    border-bottom: 1px solid #999;
    &:last-child {
      border-bottom-color: transparent;
    }
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content-item {
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .container {
    position: absolute;
  }
  .abs {
    position: absolute;
  }
  .section {
    border: 1px solid #7272ff;
    background-color: #ffffff;
    z-index: 0;
    width: 200px;
  }

  @for $i from 1  through 10 {
    .section:nth-child(#{$i}) {
      $index: $i - 1;
      left: 100px * $index;
      top: 100px * $index;
    }
  }
}
</style>

<template>
  <div  class="async-plumb-layout">
<!--    {{deps}}-->
    <el-button @click="save">保存</el-button>
    <el-button @click="addDep('array')">添加Array</el-button>
    <el-button @click="addDep('object')">添加Object</el-button>

    <div ref="container" class="container">
      <div :id="dep.id" class="abs section"
           v-for="(dep,depIndex) in deps"
           :key="depIndex">


        <div class="item header" :data-pid="dep.id"
             :id="dep.id + '-top'">
          <div>
<!--            <div>-->
<!--              <button @click="editDep(dep)"><i class="el-icon-edit" ></i></button>-->
<!--            </div>-->
            <div>type: {{dep.type}}</div>
            <div>id: {{dep.id}}</div>
          </div>
        </div>
<!--        <div class="item content-item" :data-pid="dep.id"-->
<!--             :id="dep.id + '-evt'"-->
<!--        >events</div>-->
        <template v-if="!dep.config.closure">
          <h3 style="margin: 10px 0;">items</h3>
          <template v-for="(item, index) in dep.items" :key="item.id">
            <div :id="item.id" :data-pid="dep.id" class="item content-item">
              <div>
                <el-input v-if="dep.type !== 'array'" v-model="item.key" placeholder="placeholder"></el-input>
                <div v-else>{{item.key}}</div>
              </div>
              <template v-if="dep.type === 'array'">
<!--                <button @click="deleteItem(dep, item, index)"><i class="el-icon-remove" ></i></button>-->
              </template>
              <template v-else>
                <button @click="editDep(dep, item)"><i class="el-icon-edit" ></i></button>
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
// import {v4 as uuidv4} from 'uuid';
import * as NodeDefMap from "@/plugins/ComEditor/nodes";

let itemsManagerMixin = {
  methods: {
    /**
     * deleteItem
     * @param dep
     * @param item
     * @param index
     */
    deleteItem(dep, item, index) {
      this.removeItem(item)
      dep.items.splice(index,1)
      this.$nextTick(() => {
        this.instance.repaintEverything()
      })
    },
    /**
     * deleteItem
     * @param item
     */
    removeItem(item) {
      let instance = this.instance
      instance.removeAllEndpoints(item.id)
    },
    /**
     * renderItem
     * @param item
     */
    renderItem(item) {
      let instance = this.instance
      let config = this.config
      instance.addEndpoint(item.id , {
        anchors: ['Left']
      }, config.baseStyle)
      instance.addEndpoint(item.id , {
        anchors: ['Right']
      }, config.baseStyle)
    },
    /**
     * appendItem
     * @param dep
     */
    appendItem(dep) {
      let opt = dep
      let newItem = {
        id: opt.id + '-' + ZY.rid(3),
        data: '',
        key: ''
      }
      if (this.handleAppend) {
        this.handleAppend(newItem, dep)
      }
      opt.items.push(newItem)
      this.$nextTick(() => {
        this.renderItem(newItem)
        this.instance.repaintEverything()
      })
    },
  }
}

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
    actionMixins,
    itemsManagerMixin,
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
      instance: null,
      config: {},
      deps: [
      ]
    }
  },
  mounted() {
    let self = this
    let config = {}
    config.connectorPaintStyle = {
      lineWidth: 1,
      stroke: '#4caf50',
      // joinstyle: 'round',
      fill: 'pink',
      outlineColor: '',
      outlineWidth: ''
    }

    // 鼠标悬浮在连接线上的样式
    config.connectorHoverStyle = {
      lineWidth: 2,
      stroke: 'red',
      outlineWidth: 10,
      outlineColor: ''
    }

    config.baseStyle = {
      endpoint: ['Dot', {
        radius: 8,
        fill: '#ff5722'
      }], // 端点的形状
      ConnectorStyle: config.connectorPaintStyle, // 连接线的颜色，大小样式
      ConnectorHoverStyle: config.connectorHoverStyle,
      paintStyle: {
        fill: '#4caf50',
        radius: 6
        // lineWidth: 0
      }, // 端点的颜色样式
      hoverPaintStyle: {
        fill: 'red',
        Stroke: 'red'
      },
      isSource: true, // 是否可以拖动（作为连线起点）
      connector: ['Straight', {
        gap: 0,
        cornerRadius: 5,
        alwaysRespectStubs: true
      }], // 连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
      isTarget: true, // 是否可以放置（连线终点）
      maxConnections: -1, // 设置连接点最多可以连接几条线
      connectorOverlays: [
        ['Arrow', {
          width: 10,
          length: 10,
          location: 1
        }],
        ['Label', {
          label: '<button class="delete-node-btn">X</button>',
          cssClass: '',
          labelStyle: {
            color: 'red'
          },
          events: {
            click: function (labelOverlay, originalEvent) {
              // console.log('click on label overlay for :', labelOverlay.component)
              // console.log(labelOverlay)
              // console.log(originalEvent)
              // jsPlumb.deleteConnection(labelOverlay.component)
              if (labelOverlay.component.isDetachAllowed()) {
                // console.log('isDetachAllowed', self.instance)
                self.instance.deleteConnection(labelOverlay.component)
                // jsPlumb.repaint()
              }
            }
          }
        }]
      ]
    }

    self.config = config

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
    addEndpoint(id, options) {
      let self = this
      let config = this.config
      let instance = self.instance
      if (document.getElementById(id)) {
        instance.addEndpoint(id , options, config.baseStyle)
      }
    },
    /**
     * insDep
     */
    insDep(id, instance, items = []) {
      let self = this
      let config = this.config
      // self.addEndpoint(id + '-top' , {
      //   anchors: ['Top']
      // }, config.baseStyle)
      self.addEndpoint(id + '-top' , {
        anchors: ['Left']
      }, config.baseStyle)
      self.addEndpoint(id + '-evt' , {
        anchors: ['Right']
      }, config.baseStyle)
      // instance.addEndpoint(id + '-fun' , {
      //   anchors: ['Right']
      // }, config.baseStyle)
      items.forEach(item => {
        self.renderItem(item)
      })
      instance.draggable(id, {
      })
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
