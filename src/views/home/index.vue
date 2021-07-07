<template>
  home {{ count }}
  <button class="bg-green-300" @click="increment">increment</button>
  <AboutView></AboutView>
</template>

<script lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    AboutView: globalThis.loadComponent('container.vue')
  },
  setup() {
    const store = useStore();
    let count = computed(() => store.state.demoModule.count);
    return {
      count,
      increment: () => store.commit("increment"),
    };
  },
};
</script>
