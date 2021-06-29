<template>
  <al-markdown></al-markdown>

  <component-a></component-a>
  <component-b></component-b>

  <div>
    <h3>demoss</h3>
    <router-link to="/about">about</router-link>
  </div>

  <div>
    <h3>TODO APP</h3>
    home {{count}}
    <button class="bg-green-300" @click="increment">increment</button>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useStore } from 'vuex'
import AlMarkdown from "../../components/AlMarkdown.vue";
import ComponentA from "../../components/componentA.vue";
import ComponentB from "../../components/componentB.vue";

export default {
  components: {ComponentB, ComponentA, AlMarkdown},
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
