<template>
  <el-button type="primary" @click="submit"><slot>提交</slot></el-button>
</template>

<script>
import {RefsManagerMixin, slotComEventMixin} from "@/plugins/form-render/mixins";

export default {
  name: "CusSubmitButton",
  mixins: [
    RefsManagerMixin({
    }),
    slotComEventMixin()
  ],
  methods: {
    submit() {
      this.fireEvent('submit:form')
    }
  }
}
</script>

<style scoped>

</style>
