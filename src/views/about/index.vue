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

    <jsx-com></jsx-com>
    <table-a></table-a>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import { defineComponent } from "vue";
import JsxCom from "@/components/jsxcom.vue";

let rowMixin = {
  data() {
    return {
      rowv2: [
        {
          w: 240,
          h: 210
        },
        {
          w: '1fr',
          h: 210
        },
        {
          w: '1fr',
          h: 210
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
    this.calcHeight()
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
    _parseItems(prop) {
      let rows = this.rowv2
      let frItems = rows.filter( v => {
        return v[prop] && v[prop].endsWith && v[prop].endsWith('fr')
      })
      let otherItems = rows.filter(v => {
        return !frItems.includes(v)
      })

      let frLength = frItems.map(v => parseInt(v[prop])).reduce((a, b) => a + b, 0)

      let otherTotal = otherItems.map(v  => parseInt(v[prop])).reduce((a, b) => a + b, 0)

      return {
        frItems, otherItems, frLength, otherTotal
      }
    },

    calcWidth() {
      let { frItems, otherItems, frLength, otherTotal } = this._parseItems('w')

      frItems.forEach(frItem => {
        let numberW = parseInt(frItem.w)
        frItem.style.width = `calc((100% - ${otherTotal}px) / ${frLength} * ${numberW})`
      })

      otherItems.forEach(otherItem => {
        otherItem.style.width = otherItem.w + 'px'
      })
    },

    calcHeight() {
      let { otherItems } = this._parseItems('h')

      otherItems.forEach(otherItem => {
        otherItem.style.height = otherItem.h + 'px'
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
    JsxCom,
    'tableA': globalThis.loadComponent('tabledef.vue', '&config_id=s1212121222sss1212121')
  }
})
</script>
