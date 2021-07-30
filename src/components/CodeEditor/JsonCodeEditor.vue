<style scoped>
.editor {
  height: 300px;
}
</style>

<template>
  <div class="editor" ref="dom"></div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import * as monaco from 'monaco-editor';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    if (label === 'json') {
      return new JsonWorker();
    }
    return new EditorWorker();
  },
};


const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const dom = ref();

let instance;



let _lock = false
// watch(() => props.modelValue, (newval) => {
//   console.log('props.modelValue', newval)
//
//
// })

function insertText(newval) {
  var line = instance.getPosition();
  var range = new monaco.Range(line.lineNumber, 1, line.lineNumber, 1);
  var id = { major: 1, minor: 1 };
  var op = {range: range, text: newval};
  instance.executeEdits("my-source", [op]);
}

function handlePropChange(newval) {
  if (!_lock) {
    // jsonModel.setValue(newval)
    _lock = true

    // jsonModel.setValue(newval)
    // instance.setValue(newval)
    insertText(newval)

    setTimeout(() => {
      _lock = false
    }, 1000)
  }
}

defineExpose({
  handlePropChange
})

onMounted(() => {
  const jsonModel = monaco.editor.createModel(
      props.modelValue,
      'json',
      // monaco.Uri.parse('{}')
  );


  instance = monaco.editor.create(dom.value, {
    model: jsonModel,
    tabSize: 2,
    automaticLayout: true,
    scrollBeyondLastLine: false,
  });

  // instance.onDidFocusEditorText(() => {
  //   console.log('onFocus')
  //   _lock = true
  // })
  //
  // instance.onDidBlurEditorText(() => {
  //   setTimeout(() => {
  //     _lock = false
  //   }, 1000)
  // })

  instance.onDidChangeModelContent(() => {
    console.log('onDidChangeModelContent _lock', _lock)
    // if (!_lock) {
      const value = instance.getValue();

      if (emit) {
        emit('update:modelValue', value);
      }
    // }
  });

  window.addEventListener('resize', function () {
    if (instance &&   instance.layout()) {
      instance.layout()
    }
  })
});
</script>


