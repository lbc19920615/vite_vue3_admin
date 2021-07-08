<template>
  home {{ count }}
  <button class="bg-green-300" @click="increment">increment</button>
  <div>
    <div>{{model}}</div>
    <el-form ref="form" :model="model" label-width="80px">
      <async-cm-field v-model="model.a" prop="a" label="sds" type="string"></async-cm-field>
    </el-form>
  </div>
  <AboutView></AboutView>
</template>

<script lang="ts">
import { computed, reactive } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    'AsyncCmField': globalThis.loadComponent('fieldset.vue'),
    AboutView: globalThis.loadComponent('container.vue')
  },
  setup() {
    const store = useStore();
    let count = computed(() => store.state.demoModule.count);
    const model = reactive({
      a:1
    })
    return {
      count,
      model,
      increment: () => store.commit("increment"),
    };
  },
};
</script>
