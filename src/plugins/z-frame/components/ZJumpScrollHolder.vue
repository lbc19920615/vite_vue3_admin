<template>
  <div :id="id" class="z-jump-scroll-holder"></div>
</template>

<script>
import {inject, onBeforeUnmount, onMounted} from "vue";

export default {
  name: 'ZJumpScrollHolder',
  props: {
    id: String,
    binds: null
  },
  setup(props) {
    // console.log(props)
    let cid = ZY.rid()
    let s_path = ZY.getObjPathFromPathArr(props.binds.pathArr)
    let ret = {
      cid,
      s_path
    }
    let ZJumpScrollContext = inject('ZJumpScrollContext')
    // console.log(ZJumpScrollContext)
    onMounted(() => {
      if (ZJumpScrollContext) {
        ZJumpScrollContext.register(props.id, ret)
      }
    })
    onBeforeUnmount(() => {
      if (ZJumpScrollContext) {
        ZJumpScrollContext.unRegister(props.id)
      }
    })
    return ret
  }
}
</script>
