<style lang="scss" scoped>
$tag: "plumb-layout";
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
  <div  class="plumb-layout">
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

    <div id="diagramContainer1" class="container">
      <div :id="dep.id" class="abs section"
           v-for="(dep,depIndex) in deps"
           :key="depIndex"
           >

        <template v-if="dep.type === 'events'">

          <div class="item header" :data-pid="dep.id"
               :id="dep.id + '-top'">
            <div>
              <div>
                <button @click="editDep(dep)"><i class="el-icon-edit" ></i></button>
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
            <div>
              <div>
                <button @click="editDep(dep)"><i class="el-icon-edit" ></i></button>
              </div>
              <div>type: {{dep.type}}</div>
              <div>id: {{dep.id}}</div>
            </div>
          </div>
<!--          <div class="item content-item" :data-pid="dep.id"-->
<!--               :id="dep.id + '-evt'"-->
<!--          >events</div>-->
          <template v-if="!dep.config.closure">
            <h3 style="margin: 10px 0;">items</h3>
            <template v-for="(item, index) in dep.items" :key="index">
              <div :id="item.id" :data-pid="dep.id" class="item content-item">
                <div>{{item.id}}</div>
                <button @click="deleteItem(dep, item, index)"><i class="el-icon-remove" ></i></button>
              </div>
            </template>
            <el-button size="small"
                       @click="appendItem(dep)"><i class="el-icon-plus"></i></el-button>
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
    async appendItem(dep) {
      let opt = dep
      let newItem = {
        id: opt.id + '-' + ZY.rid(12),
      }
      if (this.handleAppend) {
        this.handleAppend(newItem, dep)
      }
      opt.items.push(newItem)
      await this.$nextTick()
      this.renderItem(newItem)
      this.instance.repaintEverything()
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
  name: "PlumbLayout",
  mixins: [
    groupManagerMixin,
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
        Container: 'diagramContainer1'
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
      let cached = await ZY_EXT.store.getItem('play-deps') ?? defaultDeps
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
      let cached = await ZY_EXT.store.getItem('play-links') ?? {
        eventLinks: [],
        comLinks: [],
      }
      // console.log('cached', cached)
      if (cached) {
        if (cached.eventLinks) {
          this.insEventLinks(cached.eventLinks)
        }
        if (cached.comLinks) {
          this.insComLinks(cached.comLinks)
        }
      }
      return deps
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
      // self.addEndpoint(id + '-evt' , {
      //   anchors: ['Right']
      // }, config.baseStyle)
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
     * @param dep {{}} required
     */
    async appendDep(dep) {
      // let id = 'i' + '-' + uuidv4()
      // let dep = {
      //   id: id,
      //   items: [
      //   ],
      //   config: {
      //     version: 'v1',
      //     closure: false
      //   },
      //   ...def
      // }
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
    getLinks() {
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
      return {
        eventLinks,
        comLinks,
      }
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
      let links = this.getLinks()
      let ret = {
        deps: this.deps,
        eventLinks: links.eventLinks,
        links: links.comLinks,
      }
      ZY_EXT.store.setItem('play-deps', ZY.JSON5.parse(ZY.JSON5.stringify(this.deps)))
      ZY_EXT.store.setItem('play-links', ZY.JSON5.parse(ZY.JSON5.stringify(links)))

      // console.log('links')

      this.$emit('save-data', ret)
    }
  }
}
</script>
