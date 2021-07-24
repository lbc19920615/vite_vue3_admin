<style lang="scss">
$tag: "plumb-layout";
$sel: "." + $tag;

#{$sel} {
  width: 600px;
  height: 300px;
  border: 1px solid #eee;
  .item {
    height: 100px;
    width: 100%;
    border: 1px solid blue;
  }
.container {
  width: 100px;
  position: absolute;
}
  .abs {
    position: absolute;
  }
}
</style>

<template>
  <div  class="plumb-layout">
    <div id="diagramContainer1" class="container">
      <div id="i1-0"  class="abs" style="width: 100%">
        <div id="i1" class="item">i1</div>
        <div id="i2" class="item">i2</div>
        <div id="i3" class="item">i3</div>
      </div>

      <div id="i1-1" class="item abs">i1-1</div>
      <div id="i1-2" class="item abs">i1-2</div>
    </div>
  </div>
</template>

<script>
import {jsPlumb} from 'jsplumb'

export default {
  name: "PlumbLayout",
  components: { },
  data() {
    return {
      instance: null,
    }
  },
  mounted() {
    let self = this

    var config = {}
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
      ]
    }

    function ins1() {
      var instance = jsPlumb.getInstance({
        Container: 'diagramContainer1'
      })

      instance.addEndpoint('i1', {
        anchors: ['Right']
      }, config.baseStyle)

      instance.addEndpoint('i2', {
        anchor: 'Right'
      }, config.baseStyle)

      instance.addEndpoint('i3', {
        anchors: ['Right']
      }, config.baseStyle)


      instance.addEndpoint('i1-1', {
        anchors: ['Left']
      }, config.baseStyle)

      instance.addEndpoint('i1-2', {
        anchors: ['Left']
      }, config.baseStyle)

      instance.draggable('i1-0')
      instance.draggable('i1-1')
      instance.draggable('i1-2')
    }

    // function ins2() {
    //   var instance = jsPlumb.getInstance({
    //     Container: 'diagramContainer2'
    //   })
    //
    //   instance.addEndpoint('i1-1', {
    //     anchors: ['Left']
    //   }, config.baseStyle)
    //
    //
    //   instance.draggable('diagramContainer2')
    // }

    jsPlumb.ready(function () {
      ins1()
    })
  },
  methods: {
   drawConnections(instance) {

    },
  }
}
</script>
