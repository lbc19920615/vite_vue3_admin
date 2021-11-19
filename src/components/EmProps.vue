<template>
  <div class="em-props">
    <el-row style="align-items: center">
      <div v-for="([key, value]) in state.map"
           >
        <!--      {{value}}-->
        <template v-if="value.binds && value.binds.label">
          <el-button size="small" class="a-space-mr-10"
                     @click="toggleShow(value, key)">{{value.binds.label}}</el-button>
        </template>
      </div>
    </el-row>
    <div>
      <slot ></slot>
    </div>
  </div>
</template>

<script>
import {reactive, provide, h} from "vue";

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
      },
      notityClose(key) {
        state.current.active = false
      }
    })
    function toggleShow(value, key) {
      value.render = function () {
        return h('div', {}, 'sdsdsd')
      }
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
