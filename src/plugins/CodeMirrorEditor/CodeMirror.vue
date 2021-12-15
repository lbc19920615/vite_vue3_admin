<template>
  <textarea ref="editorRef" class="code-mirror" />
</template>

<script>

window.CodeMirrorLoaded = true
</script>
<script setup>
import {onMounted, ref, watch} from "vue";
import CodeMirrorLib from "codemirror/lib/codemirror";
import emmet from '@emmetio/codemirror-plugin/dist/extension.es';

// base style
import "codemirror/lib/codemirror.css";
// language
import "codemirror/mode/vue/vue.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/xml/xml.js";
// import "codemirror/mode/php/php.js";
// import "codemirror/mode/python/python.js";
// import "codemirror/mode/apl/apl.js";
// import "codemirror/mode/swift/swift.js";
// import "codemirror/mode/go/go.js";
// import "codemirror/mode/lua/lua.js";
// import "codemirror/mode/sql/sql";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
// theme css
import "codemirror/theme/base16-dark.css";
import "codemirror/theme/monokai.css";
// import "codemirror/theme/paraiso-light.css";
// import "codemirror/theme/ambiance.css";
// import "codemirror/theme/cobalt.css";
// import "codemirror/theme/base16-light.css";
// import "codemirror/theme/paraiso-dark.css";
// import "codemirror/theme/rubyblue.css";
// import "codemirror/theme/mbo.css";
// import "codemirror/theme/hopscotch.css";
// import "codemirror/theme/solarized.css";
// import "codemirror/theme/lesser-dark.css";
import "codemirror/addon/merge/merge.css";
import "./vscode-dark.css"
import "codemirror/addon/hint/sql-hint";
import "codemirror/addon/display/placeholder";
import "codemirror/addon/merge/merge.js";
// active-line.js
import "codemirror/addon/selection/active-line.js";
// styleSelectedText
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/search/searchcursor.js";
// hint
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/selection/active-line.js";
// highlightSelectionMatches
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";
// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/sublime.js";
// keyMap
import "codemirror/keymap/emacs.js";
// foldGutter
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";
// autoCloseTags
import "codemirror/addon/edit/closetag.js";
// closebrackets
import "codemirror/addon/edit/closebrackets.js";
import modeOption from "./modeOptions";
const CodeMirror = window.CodeMirror || CodeMirrorLib;
if (!CodeMirror.emmetBalance) {
  emmet(CodeMirror);
}
const props = defineProps({
  mode: {
    default: "text/x-sql",
    type: String,
    validator: (value) => {
      let modeArray = [
        "text/x-vue",
        "text/javascript",
        "text/css",
        "text/html",
        "text/x-httpd-php",
        "text/x-python",
        "text/apl",
        "text/x-swift",
        "text/x-go",
        "text/x-lua",
        "text/x-sql",
        "text/x-markdown",
      ];
      if (!modeArray.includes(value)) throw new Error("暂无该语法支持");
      return true;
    },
  },
  theme: {
    default: "vscode-dark",
    type: String,
    validator: (value) => {
      let themeArray = [
        "vscode-dark",
        "base16-dark",
        "monokai",
        // "paraiso-light",
        // "ambiance",
        // "cobalt",
        // "base16-light",
        // "paraiso-dark",
        // "rubyblue",
        // "mbo",
        // "hopscotch",
        // "solarized light",
        // "lesser-dark",
      ];
      if (!themeArray.includes(value)) throw new Error("暂无该样式");
      return true;
    },
  },
  options: Object,
  modelValue: String,
  table: Array,
  width: null,
  height: {
    type: [Number, String],
    default: 200,
  }
});
const emit = defineEmits();
// let editor = document.getElementById("editor");

/**
 * insertText
 * @param data {string}
 * @param nextLine {boolean}
 */
function insertText(data = '', {nextLine =  false} = {}) {
  var cm = codeEditor;
  // console.log(cm)
  var doc = cm.getDoc();
  var cursor = doc.getCursor(); // gets the line number in the cursor position
  var line = doc.getLine(cursor.line); // get the line contents
  var pos = {
    line: cursor.line
  };
  // console.log(line.length, typeof line)
  if (nextLine) {
    // check if the line is empty
    // add the data
    doc.replaceRange("\n" + data, pos);
  } else {
    // add a new line and the data
    doc.replaceRange(data, pos);
  }
}

function getValue(...args) {
  return codeEditor.getValue(...args)
}

defineExpose({
  setModel(newVal) {
    codeEditor.setValue(newVal)
  },
  insertText: insertText,
  getValue: getValue
})
let editorRef = ref(null)
let editor = null
let codeEditor = null;
const createMirror = () => {
  codeEditor = CodeMirror.fromTextArea(editor, {
    mode: props.mode,
    theme: props.theme,
    line: true,
    lineNumbers: true,
    lineWrapping: false,
    autoCloseBrackets: true,
    matchBrackets: true,
    extraKeys: {
      'Tab': 'emmetExpandAbbreviation',
      'Esc': 'emmetResetAbbreviation',
      'Enter': 'emmetInsertLineBreak',
      'Ctrl-E': 'emmetExpandAbbreviationAll',
      // 'Ctrl-Space': 'emmetCaptureAbbreviation',
      'Ctrl-Space': 'autocomplete',
      'Ctrl-.': 'emmetEnterAbbreviationMode',
      'Ctrl-W': 'emmetWrapWithAbbreviation',
      'Cmd-D': 'emmetBalance',
      'Ctrl-D': 'emmetBalanceInward',
      'Cmd-/': 'emmetToggleComment',
      'Cmd-Y': 'emmetEvaluateMath',
      'Ctrl-Left': 'emmetGoToPreviousEditPoint',
      'Ctrl-Right': 'emmetGoToNextEditPoint',
      'Ctrl-P': 'emmetGoToTagPair',
      'Ctrl-Up': 'emmetIncrementNumber1',
      'Alt-Up': 'emmetIncrementNumber01',
      'Ctrl-Alt-Up': 'emmetIncrementNumber10',
      'Ctrl-Down': 'emmetDecrementNumber1',
      'Alt-Down': 'emmetDecrementNumber01',
      'Ctrl-Alt-Down': 'emmetDecrementNumber10',
      'Ctrl-\'': 'emmetRemoveTag',
      'Shift-Ctrl-\'': 'emmetSplitJoinTag',
      'Shift-Ctrl-Right': 'emmetSelectNextItem',
      'Shift-Ctrl-Left': 'emmetSelectPreviousItem',
    },
    emmet: {
      markTagPairs: true,
      preview: ['markup'],
      config: {
        markup: {
          snippets: {
            'foo': 'ul.nav>li'
          }
        },
        stylesheet: {
          snippets: {
            'mySnippet': 'body {\n\t${0}\n}'
          }
        }
      }
    },
    ...modeOption[props.mode.split("/")[1]],
    ...props.options,
  });
  codeEditor.setSize(props.width, props.height);
  //赋值 SELECT * FROM s as a WHERE a.i
  codeEditor.setValue(props.modelValue ? props.modelValue : '');
  codeEditor.on("change", (code, change) => {
    //获取值
    emit("update:modelValue", code.getValue());
    // if (
    //     change.origin === "+input" &&
    //     change.text[0] !== ";" &&
    //     change.text[0].trim() !== "" &&
    //     change.text[1] !== ""
    // ) {
    //   codeEditor.showHint({
    //     completeSingle: false,
    //   });
    // }
  });
};
onMounted(() => {
  // editor = document.getElementById("editor");
  // editor.value = "";
  if (editorRef) {
    // console.log('editorRef', editorRef)
    if (editorRef.__v_isRef) {
      editor = editorRef.value
    } else {
      editor = editorRef
    }
    if (editor) {
      createMirror();
    } else {
      console.error('no editor', editorRef)
    }
  }
});
watch(
    props,
    (val) => {
      codeEditor.setOption("theme", val.theme);
      codeEditor.setOption("mode", val.mode);
    },
    { deep: true }
);
// watch(() => props.modelValue, (newVal) => {
//   // console.log('sddddddddddddddddddd', newVal)
//   if (codeEditor) {
//     codeEditor.setValue(newVal ?? '')
//   }
// }, {
//   immediate: true
// })
</script>

<style>
.code-mirror + .CodeMirror {
  /*width: 100%;*/
  /*height: 100%;*/
  line-height: 1.15;
  line-height: initial;
}
</style>
