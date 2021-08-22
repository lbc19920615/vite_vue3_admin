<template>
<!--  <v-ace-editor-->
<!--      v-model:value="content"-->
<!--      @init="editorInit"-->
<!--      @update:value="editorChange"-->
<!--      lang="javascript"-->
<!--      theme="chrome"-->
<!--      :style="styleObj" />-->
  <CodeMirror v-model="content"
              @update:modelValue="editorChange"
              :height="styleObj.height"
              mode="text/javascript" />
</template>

<script>
export default {
  name: 'CodeJsEditor',
  components: {
  },
  emits: ['update:value', 'init'],
  props: {
    modelValue: String,
    ui: null
  },
  data() {
    let lock = new ZY.Lock(/* optional lock name, should be unique */)
    let widgetConfigStyle = ZY.lodash.get(this, 'ui.widgetConfig.style')
    return {
      content: '',
      lock,
      styleObj: {
        ...widgetConfigStyle
      }
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        if (!this.lock.isLocked) {
          this.content = newVal
        }
      },
      immediate: true
    }
  },
  methods: {
    editorChange: function (e) {
      // console.log('editorChange', e)
      this.lock.lock( () => {
        this.$emit('update:modelValue', e)
      }, 1000)
    }
  }
}
</script>