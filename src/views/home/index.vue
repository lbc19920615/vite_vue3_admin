<template>
  <al-markdown></al-markdown>

  home {{count}}
  <button class="bg-green-300" @click="increment">increment</button>
</template>

<script lang="ts">
import { computed } from "vue";
import { useStore } from 'vuex'
import AlMarkdown from "../../components/AlMarkdown.vue";

export default {
  components: {AlMarkdown},
  setup(props) {
    const store = useStore()
    let count = computed(() => store.state.count)
    return {
      count,
      increment: () => store.commit('increment'),
    }
  },
}
</script>
