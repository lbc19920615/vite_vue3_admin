<template>
  <div class="z-jump-scroll">
    <div>
<!--      {{state.selected}}-->
<!--      {{cmap}}-->
      <el-select v-model="state.selected" filterable @change="onSelectedChange">
        <el-option v-for="(item, key) in cmap"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
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
      items: [],
      selected: null
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
      if (!Array.isArray(state.items)) {
        return []
      }
      return state.items.map(v => {
        return {
          label: v[0],
          value: v[0]
        }
      })
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

    function onSelectedChange(v) {
      let dom = document.getElementById(v)
      if (dom) {
        dom.scrollIntoView(true)
        console.log(dom)
      }
    }

    provide('ZJumpScrollContext', ret)
    return {
      state,
      keys,
      onSelectedChange,
      cmap
    }
  }
}
</script>
