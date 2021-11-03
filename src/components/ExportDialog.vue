<template>
  <div>
    <el-button @click="toggleDialog">导出</el-button>

    <el-dialog title="导出选项" v-model="showDialog" width="450px">
      <el-form v-model="form">
        <el-form-item label="文件名" prop="fileName">
          <el-input v-model="form.fileName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="button" @click="exportFile">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ExportDialog',
  data() {
    return {
      showDialog: false,
      form: {}
    }
  },
  methods: {
    toggleDialog() {
      this.showDialog = true
    },
    exportFile() {
      this.$emit('exported', this.form)
    },
  }
}
</script>
