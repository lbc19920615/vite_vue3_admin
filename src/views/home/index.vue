<template>
  <AboutView></AboutView>
  <HttpComponent
                 :is="storeA.componentStep"></HttpComponent>
</template>

<script lang="jsx">
import {reactive} from "vue";
import HttpComponent from "../../components/HttpComponent.vue";

export default {
  components: {
    HttpComponent,
    AboutView: globalThis.loadComponent('container.vue'),
  },
  setup() {
    let storeA = reactive({
      componentStep: 'container'
    })
    function render() {
      return (<div>222232323232</div>)
    }

    return {
      storeA,
      render,
    };
  },
};
</script>
