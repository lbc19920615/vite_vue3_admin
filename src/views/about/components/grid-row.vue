<style lang="scss" scoped>
.vue-grid-row {
  display: flex;
}

.vue-row-item {
  display: inline-flex;
}

$cls: "vue-grid-row-tools";
.vue-grid-row-tools {
  position: relative;

  &:hover {
    .#{$cls}__action {
      display: block;
    }
  }

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
  <div class="vue-grid-row-tools">
    <div class="vue-row-items" v-show="showEdit">
      <div class="vue-row-item__tools" v-for="(item, index) in rowv2"
           :style="{width: item.style ? item.style.width : '', height: 'auto'}" >
        <unit-input v-model="item.w" @change="changeItem"></unit-input>
      </div>
    </div>
    <div ref="row" class="vue-grid-row"><div
        class="vue-row-item" v-for="(item, index) in rowv2"
                                   :style="item.style" >{{item.w}}</div></div>
    <div class="vue-grid-row-tools__action"><button
        @click="addItem"><i class="el-icon-plus"></i></button><button
        @click="enableEdit"><i class="el-icon-edit"></i></button></div>
  </div>
</template>

<script>
import UnitInput from "@/components/UnitInput.vue";
import GridRow from "@/views/about/mixins/GridRow";
import GridRowControl from "@/views/about/mixins/GridRowControl";

export default {
  name: "grid-row",
  mixins: [
    GridRowControl,
    GridRow,
  ],
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
        if (!v.style) {
          v.style = {
            width: ''
          }
        }
      })
      this.calcWidth(this.rowv2)
      this.calcHeight(this.rowv2)
      this.resetSortable(this.rowv2)
    },
  }
}
</script>

<style scoped>

</style>
