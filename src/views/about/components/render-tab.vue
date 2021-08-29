<style lang="scss" scoped>

</style>

<template>
  <el-tabs class="render-tab" v-model="current">
    <el-tab-pane :label="item.label" :name="item.name"  v-for="(item, index) in rowv2">
      <slot v-bind="{item, index}"></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import GridRow from "@/views/about/mixins/GridRow";
import GridRowControl from "@/views/about/mixins/GridRowControl";

export default {
  name: "render-tab",
  mixins: [
    GridRowControl,
    GridRow,
  ],
  components: {},
  data() {
    return {
      rowv2: [
      ],
      current: ''
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
        // console.log('newVal', newVal)
        this.rowv2 = newVal
        this.current = newVal[0].name
        this.$nextTick(() => {
          this.init().then(() => {
          })
        })
      },
      immediate: true
    }
  },
  methods: {
    init() {
      if (Array.isArray(this.rowv2)) {
        this.rowv2.forEach(v => {
          // if (!v.style) {
          //   v.style = {
          //     width: ''
          //   }
          // }
        })
      }
      return Promise.resolve()
    },
  }
}
</script>

<style scoped>

</style>
