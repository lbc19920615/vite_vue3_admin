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
     let manager = ZY.BOM.createWindowManager({url: this.url})
     let ClientRect = this.$el.getBoundingClientRect();
     // console.log(ClientRect)
      manager.open({
        left: ClientRect.left, top: ClientRect.top
      })
    }
  },
  setup(props) {
    let state = reactive({

    })


    return {
      state,

    }
  }
}
</script>
