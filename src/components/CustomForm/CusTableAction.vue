<template>
  <el-button type="primary" @click="submit"><slot>提交</slot></el-button>
</template>

<script>
import {RefsManagerMixin, slotComEventMixin} from "@/plugins/form-render/mixins";

export default {
  name: "CusTableAction",
  mixins: [
    RefsManagerMixin({
    }),
    slotComEventMixin()
  ],
  methods: {
    submit() {
      this.fireEvent('table:action')
    }
  }
}
</script>

<style scoped>

</style>
