<style lang="scss" scoped>
.vue-grid-row {
  display: flex;
}

.vue-row-item {
  //display: inline-flex;
}

$cls: "vue-grid-row-tools";
.vue-grid-row-tools {
  position: relative;

  //&:hover {
  //  .#{$cls}__action {
  //    display: block;
  //  }
  //}

  .#{$cls}__action {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 11111;
    transform: translate(-100%, 0);

    display: none;
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
<!--  <div class="vue-grid-row-tools">-->
<!--    <div ref="row" class="vue-row-items" v-if="showEdit">-->
<!--      <div class="vue-row-item__tools" v-for="(item, index) in rowvItems"-->
<!--           :style="{width: item.style ? item.style.width : '', height: 'auto'}" >-->
<!--        <unit-input v-model="rowv2[index].w" @update:modelValue="changeItem"></unit-input>-->
<!--&lt;!&ndash;        <button class="grid-column-handle"><i class="el-icon-rank"></i></button>&ndash;&gt;-->
<!--      </div>-->
<!--    </div>-->
    <div  class="vue-grid-row" v-bind="getAttrs('attrs')" :style="getAttrs('styles')" ><div
        class="vue-row-item" v-for="(item, index) in rowv2"
                                   :style="item.style" >
      <slot v-bind="{item, index}"></slot>
    </div></div>
<!--    <div class="vue-grid-row-tools__action"><button-->
<!--        @click="enableEdit"><i class="el-icon-edit"></i></button></div>-->
<!--  </div>-->
</template>

<script>
import UnitInput from "@/components/UnitInput.vue";
import GridRow from "@/views/about/mixins/GridRow";
import GridRowControl from "@/views/about/mixins/GridRowControl";
import {commonRenderMixin} from "@/views/about/mixins/CommonRender";

export default {
  name: "grid-row",
  mixins: [
    GridRowControl,
    GridRow,
    commonRenderMixin
  ],
  components: {UnitInput},
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
            this.rowvItems = JSON.parse(JSON.stringify( this.rowv2 ))
          })
        })
      },
      immediate: true
    }
  },
  methods: {
    resetTools() {
      if (Array.isArray(this.rowv2) && this.rowv2.length > 0) {
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
                // this.showEdit = true
              }
            }
        )
      } else {
        this.rowvItems = []
      }
    },
    parseNum(v) {
      return parseInt(v)
    },
    changeItem(item) {
      console.log('change', item)
      this.init().then(() => {
        this.rowvItems = JSON.parse(JSON.stringify(this.rowv2))
      })
    },
    removeItem(index) {
      console.log(index)
      this.rowv2.splice(index, 1)
      this.init().then(() => {
        this.rowvItems = JSON.parse(JSON.stringify( this.rowv2 ))
        // console.log(  this.rowvItems)
      })
    },
    addItem() {
      this.rowv2.push({
        w: '1fr',
        h: '50%',
        style: {
          width: ''
        }
      })
      this.init().then(() => {
        this.rowvItems = JSON.parse(JSON.stringify( this.rowv2 ))
        // console.log(  this.rowvItems)
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
      this.calcWidth(this.rowv2)
      this.calcHeight(this.rowv2)
      return Promise.resolve()
    },
  }
}
</script>

<style scoped>

</style>
