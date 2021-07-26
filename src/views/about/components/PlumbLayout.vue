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
    <el-button @click="save">save</el-button>
    <el-button @click="getLinkRealtions">get connect</el-button>
    <el-button @click="appendDep">appendDep</el-button>
    <div id="diagramContainer1" class="container">
      <div :id="dep.id" class="abs section"
           v-for="(dep,depIndex) in deps"
           :key="depIndex"
           >
        <div class="item header" :data-pid="dep.id"  :id="dep.id + '-top'">
          <div>
            <div>
              <button @click="editDep(dep)"><i class="el-icon-edit" ></i></button>
            </div>
            <div>type: {{dep.type}}</div>
            <div>id: {{dep.id}}</div>
          </div>
        </div>
        <template v-for="(item, index) in dep.items" :key="index">
          <div :id="item.id" :data-pid="dep.id" class="item content-item">{{item.id}}</div>
        </template>
        <el-button @click="appendItem(dep)"><i class="el-icon-plus"></i></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {jsPlumb} from 'jsplumb'
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "PlumbLayout",
  props: {
    rootId: String,
    handleAppend: {
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
        {
          id: 'i1',
          type: 'column',
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
          id: 'i3',
          type: 'row',
          items: [
            {
              id: 'i3-0',
              w: '1fr',
              h: 50,
            },
            {
              id: 'i3-1',
              w: '1fr',
              h: 50,
            },
            {
              id: 'i3-2',
              w: '1fr',
              h: 50,
            }
          ]
        }
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
      let instance = jsPlumb.getInstance({
        Container: 'diagramContainer1'
      })
      self.instance = instance
      self.insDeps(self.deps)
    })
  },
  methods: {
    insDeps(deps) {
      let self = this
      let instance = this.instance
      deps.forEach(dep => {
        self.insDep(dep.id, instance, dep.items)
      })
    },
    insDep(id, instance, items = []) {
      let self = this
      let config = this.config
      instance.addEndpoint(id + '-top' , {
        anchors: ['Top']
      }, config.baseStyle)
      instance.addEndpoint(id + '-top' , {
        anchors: ['Left']
      }, config.baseStyle)
      items.forEach(item => {
        self.renderItem(item)
      })
      instance.draggable(id, {
      })
    },
    appendDep() {
      let id = 'i4'
      let dep = {
        id: id,
        items: [
          {
            id: id + '-' + uuidv4()
          }
        ]
      }
      this.deps.push(dep)
      this.$nextTick(() => {
        this.insDep(id, this.instance, dep.items)
      })
    },
    editDep(dep) {
      this.$emit('edit-dep', dep)
    },
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
    appendItem(dep) {
      let opt = dep
      let newItem = {
        id: opt.id + '-' + uuidv4(),
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
    getVisibleConnections() {
      let allConnections = this.instance.getConnections({

      });
      let ret = []
      ret = allConnections.filter(v => {
        return v.target && v.source
      })
      return ret
    },
    save() {
      let links = this.getLinkRealtions()
      let ret = {
        deps: this.deps,
        links
      }
      this.$emit('save-data', ret)
    },
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
</script>
