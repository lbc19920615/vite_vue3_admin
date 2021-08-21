<style scoped>
.editor {
  height: 300px;
}
</style>

<template>
  <div class="editor" ref="dom"></div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import * as monaco from 'monaco-editor';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: true,
});

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    // console.log('getWorker', workerId, label)
    if (label === 'json') {
      return new JsonWorker();
    }
    if (label === 'typescript') {
      return new TsWorker();
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


function insertText(newval) {
  let editor = instance
  let selection = editor.getSelection();
  let range = new monaco.Range(selection.startLineNumber, selection.startColumn,
      selection.endLineNumber, selection.endColumn);
  // let line = instance.getPosition();
  // let range = new monaco.Range(line.lineNumber, 1, line.lineNumber, 1);
  let id = { major: 1, minor: 1 };
  let op = {range: range, text: newval, forceMoveMarkers: true};
  editor.executeEdits("my-source", [op]);
}

function handlePropChange(newval) {
  if (!_lock) {
    // jsonModel.setValue(newval)
    _lock = true

    // jsonModel.setValue(newval)
    // instance.setValue(newval)
    insertText(newval)
    instance.focus()

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
      'typescript',
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
    // console.log('onDidChangeModelContent _lock', _lock)
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


