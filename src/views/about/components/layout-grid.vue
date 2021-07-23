<template><grid-layout
      :layout.sync="layout"
      :col-num="24"
      :row-height="1"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[0, 0]"
      :use-css-transforms="true"
  ><grid-item v-for="item in layout"
               :x="item.x"
               :y="item.y"
               :w="item.w"
               :h="item.h"
               :i="item.i"
               :key="item.i"
               :min-w="item.minW"
    ><slot v-bind="item"></slot></grid-item></grid-layout></template>

<script>
export default {
  name: 'LayoutGrid',
  props: {
    layout: {
      type: Array,
      default: []
    }
  }
}
</script>
