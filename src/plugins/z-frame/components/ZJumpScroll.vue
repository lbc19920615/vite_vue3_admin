<template>
  <div class="z-jump-scroll">
    <div>
<!--      {{state.items}}-->
    </div>
    <el-scrollbar height="60vh">
      <slot></slot>
    </el-scrollbar>
  </div>
</template>

<script>
import {computed, provide, reactive} from "vue";

export default {
  name: 'ZJumpScroll',
  props: {
    binds: null
  },
  setup(props) {
    // console.log(props.binds)
    let s_path = ZY.getObjPathFromPathArr(props.binds.pathArr)
    let state = reactive({
      items: []
    })
    let map = new Map()

    function reloadI() {
      state.items = []
      for (let item of map.entries()) {
        state.items.push(item)
      }
    }

    let ret = {
      map,
      register(id, value) {
        map.set(id, value)
        reloadI()
      },
      unRegister(id) {
        map.delete(id)
        reloadI()
      }
    }
    let cmap = computed(() => {
      return map
    })
    let keys = computed(() => {
      if (!Array.isArray(state.items)) {
        return []
      }
      return state.items.map(v => {
        return v[0]
      })
    })
    ret.cmap = cmap
    provide('ZJumpScrollContext', ret)
    return {
      state,
      keys,
      cmap
    }
  }
}
</script>
