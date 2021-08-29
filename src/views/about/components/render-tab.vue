<style lang="scss" scoped>

</style>

<template>
  <div class="render-tab" v-for="(item, index) in rowv2">
    <slot v-bind="{item, index}"></slot>
  </div>
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
    }
  },
  props: {
  },
  watch: {
  },
  methods: {
    init() {
      this.rowv2.forEach(v => {
        // if (!v.style) {
        //   v.style = {
        //     width: ''
        //   }
        // }
      })
      return Promise.resolve()
    },
  }
}
</script>

<style scoped>

</style>
