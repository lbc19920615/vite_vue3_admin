<template>
  home {{ count }}
  <button class="bg-green-300" @click="increment">increment</button>
</template>

<script lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    let count = computed(() => store.state.count);
    return {
      count,
      increment: () => store.commit("increment"),
    };
  },
};
</script>
