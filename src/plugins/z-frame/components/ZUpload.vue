<style scoped>
</style>
<template>
  <div class="upload">
    <el-upload
        :action="action"
        :data="data"
        @before-upload="handleBeforeUpload"
        v-on:on-progress="handlePreview"
        v-on:on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :show-file-list="false"
    >
      <el-button v-if="flag" slot="trigger" type="primary">Choose File</el-button>
      <el-button :type="buttonType" :loading="loading">{{buttonTxt}}<i class="el-icon-upload el-icon--right"></i></el-button>
    </el-upload>
  </div>
</template>
<script>
import { ElMessage } from 'element-plus'

export default {
  name: 'ZUpload',
  props: {
    buttonTxt: {
      type: String,
      default: "Upload"
    },
    flag: {
      type:Boolean,
      default:false
    },
    action: {
      type: String,
      required: true
    },
    buttonType: {
      type: String,
      default: "primary"
    },
    data: null,
    fileSize: null, // 文件大小限制，单位为K
    uploadId: null,
    name: null,
    onSuccess: Function,
    onProgress: Function,
    beforeUpload: Function,
    fileType: null // 文件类型限制用|分隔 如png|jpg|jpeg|gif
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    handleBeforeUpload(file) {
      const fileName = file.name;
      const ext = fileName
          .substring(fileName.lastIndexOf(".") + 1)
          .toLowerCase();
      if (Array.isArray(this.fileType)) {
        // 限制文件格式
        if (this.fileType.indexOf(ext) < 0) {
          ElMessage.error("文件类型不合法，请上传" + this.fileType);
          return false;
        }
      }
      if (this.fileSize) {
        // 限制文件大小，单位为k
        if (file.size / 1024 > this.fileSize) {
          ElMessage.error("文件大小限制为" + this.fileSize + "k");
          return false;
        }
      }
      this.loading = true; // 开启上传中状态
      if (this.beforeUpload) {
        const arg = [].slice.call(arguments);
        if (this.uploadId) {
          arg.push(this.uploadId);
        }
        this.beforeUpload.apply(this, arg);
      }
    },
    handlePreview(){
      this.$emit('on-progress');
    },
    handleUploadSuccess() {
      this.loading = false; // 关闭上传中状态
      if (this.onSuccess) {
        const arg = [].slice.call(arguments);
        if (this.uploadId) {
          arg.push(this.uploadId);
        }
        this.onSuccess.apply(this, arg);
      }
    },
    handleUploadError() {
      this.loading = false; // 关闭上传中状态
      ElMessage.error("上传失败");
    }
  }
};
</script>
