<template>
<!--  <el-button type="primary" @click="submit"><slot>提交</slot></el-button>-->
  <SubmitButton type="primary"  @submit="submit"><slot>提交</slot></SubmitButton>
</template>

<script>
import {RefsManagerMixin, slotComEventMixin} from "@/plugins/form-render/mixins";
import SubmitButton from "@/components/SubmitButton.vue";

export default {
  name: "CusSubmitButton",
  components: {SubmitButton},
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
