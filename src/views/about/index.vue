<style lang="scss">
.vue-grid-item {
  background-color: #99a9bf;
  color: #ffffff;
}

.vue-row-item {
  display: inline-block;
}
</style>

<template>
  <div>
    <grid-layout
        :layout.sync="layout"
        :col-num="24"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
    >

      <grid-item v-for="item in layout"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i"
                 :min-w="item.minW"
      >
      </grid-item>
    </grid-layout>

    <div ref="gridrow" class="vue-grid-row"><div class="vue-grid-item vue-row-item" v-for="(item, index) in rowv2"
                       :style="item.style"           >{{item.w}}</div></div>
    <table-a></table-a>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import { defineComponent } from "vue";

let rowMixin = {
  data() {
    return {
      rowv2: [
        {
          w: 240
        },
        {
          w: '1fr'
        },
        {
          w: '1fr'
        }
      ],
    }
  },
  mounted() {
    this.rowv2.forEach(v => {
      v.style = {
        width: ''
      }
    })
    this.calcWidth()
    this.resetSortable()
  },
  methods: {
    resetSortable() {
      let self = this
      let row = JSON.parse(JSON.stringify( self.rowv2))
      new Sortable(this.$refs.gridrow, {
        onEnd: function (/**Event*/evt) {
          const { oldIndex, newIndex } = evt
          // console.log('evt', oldIndex, newIndex)
          let oldItem = row[oldIndex]
          row.splice(oldIndex, 1)
          row.splice(newIndex, 0, oldItem)
          self.rowv2 = row
        }
      })
    },
    calcWidth() {
      let len = this.rowv2.length
      let staticWidth = 0

      let frItems = this.rowv2.filter( v => {
        return v.w && v.w.endsWith && v.w.endsWith('fr')
      })

      let frLength = frItems.map(v => parseInt(v.w)).reduce((a, b) => a + b, 0)


      let otherItems = this.rowv2.filter(v => {
        return !frItems.includes(v)
      })

      let otherTotal = otherItems.map(v  => parseInt(v.w)).reduce((a, b) => a + b, 0)

      frItems.forEach(frItem => {
        let numberW = parseInt(frItem.w)
        frItem.style.width = `calc((100% - ${otherTotal}px) / ${frLength} * ${numberW})`
      })

      otherItems.forEach(otherItem => {
        otherItem.style.width = otherItem.w + 'px'
      })
    }
  }
}

export default defineComponent({
  mixins: [
    rowMixin
  ],
  data () {
    return {
      layout: [
        {"x":0,"y":0,"w":24,"h":2,"i":"0"},
        {"x":2,"y":0,"w":24,"h":4,"i":"1"},
      ]
    }
  },
  methods: {},
  components: {
    'tableA': globalThis.loadComponent('tabledef.vue', '&config_id=s1212121222sss1212121')
  }
})
</script>
