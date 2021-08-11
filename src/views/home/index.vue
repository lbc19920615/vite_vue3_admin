<template>
  <el-button type="primary" @click="reload">reload</el-button>
  <template v-if="showCom">
    <HttpComponent
        :is="storeA.componentStep"></HttpComponent>
  </template>
</template>

<script lang="jsx">
import {computed, reactive} from "vue";
import HttpComponent from "../../components/HttpComponent.vue";

export default {
  components: {
    HttpComponent,
    AboutView: globalThis.loadComponent('container.vue'),
  },
  setup() {
    let storeA = reactive({
      componentStep: 'container',
      reload: false
    })
    let showCom = computed(() => {
      return !storeA.reload
    })
    function render() {
      return (<div>222232323232</div>)
    }
    function reload() {
      storeA.reload = true
      setTimeout(() => {
        storeA.reload = false
      }, 1000)
    }

    return {
      storeA,
      showCom,
      render,
      reload,
    };
  },
};
</script>
