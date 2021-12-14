import CodeMirror from "@/plugins/CodeMirrorEditor/CodeMirror.vue";
import CodeJsEditor from '@/components/CodeEditor/CodeJsEditor.vue'
import CusStyle from "@/plugins/form-render/components/CusStyle.vue";

CustomVueComponent.register(CusStyle)
CustomVueComponent.register(CodeMirror, 'CodeMirror')
CustomVueComponent.register(CodeJsEditor)
