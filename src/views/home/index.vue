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
import { inject, reactive, watch} from "vue";
import { useStore } from "vuex";
import { useDocumentVisibility } from 'vue-use-web';

export default {
  components: {
    'AsyncCmField': globalThis.loadComponent('fieldset.vue'),
    AboutView: globalThis.loadComponent('container.vue')
  },
  setup() {
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
