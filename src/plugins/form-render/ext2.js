import CodeMirror from "@/plugins/CodeMirrorEditor/CodeMirror.vue";
import CodeJsEditor from '@/components/CodeEditor/CodeJsEditor.vue'
import CusStyle from "@/plugins/form-render/components/CusStyle.vue";

export function registerExt2() {
  CustomVueComponent.registerOnce(CusStyle)
  CustomVueComponent.registerOnce(CodeMirror, 'CodeMirror')
  CustomVueComponent.registerOnce(CodeJsEditor)
}
