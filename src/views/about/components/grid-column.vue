<style lang="scss" scoped>
.vue-grid-column {
  display: flex;
  flex-direction: column;
}

.vue-column-item {
  //display: inline-flex;
}

.vue-grid-column-tools {
  position: relative;

  &:hover {
    .vue-grid-column-tools__action {
      display: block;
    }
  }

  &__action {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 11111;
    transform: translate(0, 0);
    display: none;
  }

  .vue-column-items {
    //position: relative;

    position: absolute;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    //width: 100%;
    minWidth: 20px;
    z-index: 111111;
  }

  .vue-column-item {
    position: relative;
  }

  .vue-column-item__tools {
    display: inline-flex;
  }

  .vue-grid-column-item-tool {
    &:hover {
      opacity: .3;
      cursor: pointer;
    }
  }
}
</style>

<template>
  <div class="vue-grid-column-tools">
<!--    {{rowvItems}}-->
    <div ref="row" class="vue-grid-column vue-column-items" v-if="showEdit">
      <vue-resizable  :active="['b']"  class="vue-column-item vue-grid-column-item-tool"
                      :height="item.h ? item.h : 1"
                      @resize:end="onResizeEnd(item, index, $event)"
                      v-for="(item, index) in rowvItems">
     {{item.h}} <button class="grid-column-handle"><i class="el-icon-rank"></i></button>
      </vue-resizable>
    </div>
    <div class="vue-grid-column">
      <div  :active="['b']"  class="vue-column-item"
                      :style="item.style"  v-for="(item, index) in rowv2">
        {{item}}
      </div>
    </div>
    <div class="vue-grid-column-tools__action"><button
        @click="addItem"><i class="el-icon-plus"></i></button><button
        @click="enableEdit"><i class="el-icon-edit"></i></button></div>
  </div>
</template>

<script>
import UnitInput from "@/components/UnitInput.vue";
import GridRow from "@/views/about/mixins/GridRow";
import VueResizable from 'vue-resizable'
import GridRowControl from "@/views/about/mixins/GridRowControl";


export default {
  name: "grid-column",
  mixins: [
    GridRowControl,
    GridRow
  ],
  components: {UnitInput, VueResizable},
  data() {
    return {
      rowv2: [
      ],
      rowvItems: []
    }
  },
  props: {
    layout: {
      type: Array,
      default: []
    }
  },
  watch: {
    showEdit(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.resetTools()
        })
      }
    },
    layout: {
      handler(newVal) {
        this.rowv2 = newVal
        this.$nextTick(() => {
          this.init().then(() => {
            this.rowvItems = JSON.parse(JSON.stringify(newVal))
          })
        })
      },
      immediate: true
    }
  },
  methods: {
    resetTools() {
      this.resetSortableV2(this.rowv2,
          {
            option: {
              handle: '.grid-column-handle'
            },
            onEnd(newVal) {
              // console.log('newVal', newVal, JSON.parse(JSON.stringify(newVal)))
              this.showEdit = false
              this.rowvItems = JSON.parse(JSON.stringify(newVal))
              this.$nextTick(() => {
                this.showEdit = true
              })
            }
          }
      )
    },
    onResizeEnd(item, index,  v) {
      this.rowv2[index].h = v.height
      item.h = v.height
      // console.log(this.rowv2)
      this.$nextTick(() => {
        this.init()
      })
    },
    parseNum(v) {
      return parseInt(v)
    },
    addItem() {
      this.rowv2.push({
        style: {
          height: '',
        },
        h: 100
      })
      this.$nextTick(() => {
        this.init().then(() => {
          this.rowvItems = JSON.parse(JSON.stringify(this.rowv2))
        })
      })
    },
    init() {
      this.rowv2.forEach(v => {
        if (!v.style) {
          v.style = {
            width: ''
          }
        }
      })
      // this.calcWidth(this.rowv2)
      this.calcHeight(this.rowv2)
      return Promise.resolve()
    },
  }
}
</script>

<style scoped>

</style>
