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
    <div  class="vue-grid-row"
          v-bind="getAttrs('attrs')" :style="getAttrs('styles')" ><div
        class="vue-row-item" v-for="(item, index) in rowv2"
                                   :style="item.style" >
      <slot v-bind="{item, index}"></slot>
    </div></div>
</template>

<script>
import UnitInput from "@/components/UnitInput.vue";
import GridRow from "@/views/about/mixins/GridRow";
import {commonRenderMixin} from "@/views/about/mixins/CommonRender";

export default {
  name: "LayRow",
  mixins: [
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
    parseNum(v) {
      return parseInt(v)
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
