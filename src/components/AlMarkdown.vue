<template>
  <article class="markdown-body" v-html="content"></article>
</template>

<script lang="ts">
import { ref } from "vue";
export default {
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const content = ref<string>('');
    //动态引入 异步加载
    import("../markdown/install.md").then((result) => {
      content.value = result.default;
    });
    return {
      content,
    };
  },
};
</script>
