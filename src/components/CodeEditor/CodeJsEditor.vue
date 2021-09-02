<template>
  <CodeMirror
            v-if="inited"
              ref="editorRef"
              v-model="content"
              @update:modelValue="editorChange"
              :height="styleObj.height"
              :mode="mode"
            theme="vscode-dark"
  />
</template>

<script>
export default {
  name: 'CodeJsEditor',
  components: {
  },
  emits: ['update:value', 'init'],
  props: {
    modelValue: String,
    ui: null,
    editorRef: null,
    // mode: {
    //   type: String,
    //   default: 'text/javascript'
    // },
  },
  data() {
    let lock = new ZY.Lock(/* optional lock name, should be unique */)
    let widgetConfigStyle = ZY.lodash.get(this, 'ui.widgetConfig.style')
    let mode = ZY.lodash.get(this, 'ui.widgetConfig.mode', 'text/javascript')
    return {
      content: '',
      lock,
      inited: false,
      mode,
      styleObj: {
        ...widgetConfigStyle
      }
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        // console.log('modelValue sdsdsdsdsds', this.$refs.editorRef, this.lock.isLocked, newVal)
        if (!this.lock.isLocked) {
          this.content = newVal
          this.$nextTick(() => {
            if (!this.inited) {
              this.inited = true
            } else {
              this.$refs.editorRef.setModel(newVal)
            }
          })
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
        this.$emit('fchange', e);
      }, 1000)
    }
  }
}
</script>
