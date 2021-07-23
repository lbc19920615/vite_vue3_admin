<style lang="scss">
.vue-grid-row {
  display: flex;
}

.vue-row-item {
  display: inline-flex;
}


.vue-grid-row-tools {
  position: relative;
  &__action {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 11111;
    transform: translate(-100%, 100%);
  }

  .vue-row-items {
    //position: relative;
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    transform: translateY(-100%);
    width: 100%;
  }

  .vue-row-item {
    position: relative;
  }

  .vue-row-item__tools {
    display: inline-flex;
  }
}
</style>

<template>
  <div class="vue-grid-row-tools">
    <div class="vue-row-items">
      <div class="vue-row-item__tools"   v-for="(item, index) in rowv2"
           :style="{width: item.style ? item.style.width : '', height: 'auto'}" >
        <unit-input v-model="item.w" @change="changeItem"></unit-input>
      </div>
    </div>
    <div ref="row" class="vue-grid-row"><div
        class="vue-row-item" v-for="(item, index) in rowv2"
                                   :style="item.style" >{{item.w}}</div></div>
    <div class="vue-grid-row-tools__action"><button @click="addItem">+</button></div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import UnitInput from "@/components/UnitInput.vue";

export default {
  name: "grid-row",
  components: {UnitInput},
  data() {
    return {
      rowv2: [
      ],
    }
  },
  props: {
    layout: {
      type: Array,
      default: []
    }
  },
  watch: {
    layout: {
      handler(newVal) {
        this.rowv2 = newVal
        this.$nextTick(() => {
          this.init()
        })
      },
      immediate: true
    }
  },
  methods: {
    parseNum(v) {
      return parseInt(v)
    },
    changW(e) {
      console.log('changW', e)
    },
    changeItem(item) {
      this.init()
    },
    addItem() {
      this.rowv2.push({
        w: '1fr',
        wAsNumber: 11,
        h: '50%',
        style: {
          width: ''
        }
      })
      this.init()
    },
    init() {
      this.rowv2.forEach(v => {
        v.style = {
          width: ''
        }
      })
      this.calcWidth()
      this.calcHeight()
      this.resetSortable()
    },
    resetSortable() {
      let self = this
      let row = JSON.parse(JSON.stringify( self.rowv2))

      // console.log('row', row, this.$el)
      new Sortable(this.$refs.row, {
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
</script>

<style scoped>

</style>
