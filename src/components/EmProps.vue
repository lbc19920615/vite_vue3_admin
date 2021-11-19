<template>
  <div class="em-props">
    <div v-for="([key, value]) in state.map">
<!--      {{value}}-->
      <template v-if="value.binds && value.binds.label">
        {{value.binds.label}}
      </template>
    </div>
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
      map: new Map()
    })
    provide('EmProps', {
      register(key, value) {
        state.map.set(key, value)
      }
    })
    return {
      state
    }
  }
}
</script>
