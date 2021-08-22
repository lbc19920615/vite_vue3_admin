<template>
  <v-ace-editor
      v-model:value="content"
      @init="editorInit"
      @update:value="editorChange"
      lang="javascript"
      theme="chrome"
      :style="styleObj" />
</template>

<script>
import { VAceEditor } from 'vue3-ace-editor';
// import 'brace/ext/language_tools' //language extension prerequsite...
import 'brace/mode/html'
import 'brace/mode/javascript'    //language
import 'brace/mode/less'
import 'brace/theme/chrome'
import 'brace/snippets/javascript' //snippet

export default {
  name: 'AceJsEditor',
  components: {
    VAceEditor
  },
  emits: ['update:value', 'init'],
  props: {
    modelValue: String,
    ui: null
  },
  data() {
    let lock = new ZY.Lock(/* optional lock name, should be unique */)
    let widgetConfigStyle = ZY.lodash.get(this, 'ui.widgetConfig.style')
    console.log(this)
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
    editorInit: function (editor) {
      console.log('editorInit', editor)
      import('./AceEditor/ext')
    },
    editorChange: function (e) {
      console.log('editorChange', e)
      this.lock.lock( () => {
        this.$emit('update:modelValue', e)
      }, 1000)
    }
  }
}
</script>