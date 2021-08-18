<template>
  <el-button type="primary" @click="submit"><slot>提交</slot></el-button>
</template>

<script>
import {inject} from "vue";
import {RefsManagerMixin} from "@/plugins/form-render/mixins";

export default {
  name: "CusSubmitButton",
  mixins: [
    RefsManagerMixin({
    })
  ],
  data() {
    return {
      form: null
    }
  },
  created() {
    let curFormCon = inject('curFormCon')
    this.form = curFormCon
  },
  methods: {
    submit() {
      // console.log('RefInstance', this.form, this.RefInstance)
      this.RefInstance.emit('submit:form', {
        form: this.form
      })
    }
  }
}
</script>

<style scoped>

</style>
