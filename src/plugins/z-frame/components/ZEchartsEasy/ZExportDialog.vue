<template>
  <div class="z-export-dialog">
    <el-button v-bind="buttonAttr" @click="toggleDialog">导出</el-button>

    <el-dialog title="导出选项" v-model="showDialog" width="450px" v-bind="modalAttr">
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
  name: 'ZExportDialog',
  props: {
    buttonAttr: {
      type: Object,
      default() {
        return {}
      }
    },
    modalAttr: {
      type: Object,
      default() {
        return {}
      }
    }
  },
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
      this.$emit('exported', {
        form: this.form,
        toggleDialog: this.toggleDialog
      })
    },
  }
}
</script>
