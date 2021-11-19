<template>
  <div class="em-props">
    <el-space style="align-items: center">
      <div v-for="([key, value]) in state.map"
           >
        <!--      {{value}}-->
        <template v-if="value.binds && value.binds.label">
          <el-button size="small"
                     @click="toggleShow(value, key)">{{value.binds.label}}</el-button>
        </template>
      </div>
    </el-space>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {reactive, provide} from "vue";

export default {
  name: 'EmProps',
  setup() {
    let state = reactive({
      map: new Map(),
      current: null
    })
    provide('EmProps', {
      register(key, value) {
        state.map.set(key, value)
      }
    })
    function toggleShow(value, key) {
      if (state.current) {
        state.current.active = false
      }
      state.current = value
      value.active = true
    }
    return {
      state,
      toggleShow
    }
  }
}
</script>
