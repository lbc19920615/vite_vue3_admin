import CusLayoutEditor from "@/plugins/form-render/components/CusLayoutEditor.vue";
import CodeJsEditor from '@/components/CodeEditor/CodeJsEditor.vue'
import CusPropsEditor from "@/plugins/form-render/components/CusPropsEditor.vue";
import CusFormAttr from "@/plugins/form-render/components/CusFormAttr.vue";

CustomVueComponent.register(CodeJsEditor)
CustomVueComponent.register(CusLayoutEditor)
CustomVueComponent.register(CusFormAttr)
CustomVueComponent.register(CusPropsEditor)
