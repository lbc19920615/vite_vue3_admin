<template>
  <el-link type="primary" v-bind="$attrs" @click="open">
    <slot></slot>
  </el-link>
</template>

<script>
import {reactive} from "vue";

export default {
  name: 'ZWindow',
  props: {
    url: String,
    target: {
      type: String,
      default: 'ZWindow'
    }
  },
  watch: {
    url(newVal) {
      console.log('url change', newVal)
    }
  },
  data() {
    return {
      address: this.url
    }
  },
  methods: {
   open() {
     console.log(this.address)
     let url = this.address
     let manager = ZY.BOM.createWindowManager({
       url: url, target:  this.target
     })
     let ClientRect = this.$el.getBoundingClientRect();
     // console.log(ClientRect)
      manager.open({
        left: ClientRect.left,
        top: ClientRect.top
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
