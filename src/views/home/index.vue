<template>
  <div>
    <div>{{model}}</div>
    <el-form ref="form" :model="model" label-width="80px">
      <async-cm-field v-model="model.a" prop="a" label="sds" type="string"></async-cm-field>
    </el-form>
  </div>
  <AboutView></AboutView>
</template>

<script lang="ts">
import {computed, getCurrentInstance, inject, reactive} from "vue";
import { useStore } from "vuex";

export default {
  components: {
    'AsyncCmField': globalThis.loadComponent('fieldset.vue'),
    AboutView: globalThis.loadComponent('container.vue')
  },
  setup() {
    // const app = getCurrentInstance()
    // console.log('home', app.appContext.config.globalProperties)
    const globalStore = inject('globalStore')
    // console.log(globalStore.num)
    globalStore.setNum(1)

    const store = useStore();
    const model = reactive({
      a:1
    })
    return {
      model,
      increment: () => store.commit("increment"),
    };
  },
};
</script>
