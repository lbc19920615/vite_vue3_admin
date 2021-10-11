<template>
  <el-link type="primary" v-bind="$attrs" @click="open">
    <slot></slot>
  </el-link>
</template>

<script>
import {getCurrentInstance, reactive} from "vue";

export default {
  props: {
    url: String
  },
  methods: {
   open() {

     let ClientRect = this.$el.getBoundingClientRect();
     console.log(ClientRect)
      this.manager.open({
        left: ClientRect.left, top: ClientRect.top
      })
    }
  },
  setup(props) {
    let state = reactive({

    })
    let manager = ZY.BOM.createWindowManager({url: props.url})

    return {
      state,
      manager,
    }
  }
}
</script>
