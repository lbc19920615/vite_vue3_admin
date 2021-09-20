import CusLayoutEditor from "@/plugins/form-render/components/CusLayoutEditor.vue";
import CodeJsEditor from '@/components/CodeEditor/CodeJsEditor.vue'
import CusPropsEditor from "@/plugins/form-render/components/CusPropsEditor.vue";
import CusFormAttr from "@/plugins/form-render/components/CusFormAttr.vue";
import CusUI from "@/plugins/form-render/components/CusUI.vue";
import CusWidgetEditor from "@/plugins/form-render/components/CusWidgetEditor.vue";
import CusFormRules from "@/plugins/form-render/components/CusFormRules.vue";
import CusComEvents from "@/plugins/form-render/components/CusComEvents.vue";
import CusXmlShower from "@/plugins/form-render/components/CusXmlShower.vue";
import CusInsert from "@/plugins/form-render/components/CusInsert.vue";

CustomVueComponent.register(CusFormRules)
CustomVueComponent.register(CusComEvents)
CustomVueComponent.register(CusUI)
CustomVueComponent.register(CodeJsEditor)
CustomVueComponent.register(CusWidgetEditor)
CustomVueComponent.register(CusInsert)
CustomVueComponent.register(CusLayoutEditor)
CustomVueComponent.register(CusFormAttr)
CustomVueComponent.register(CusPropsEditor)
CustomVueComponent.register(CusXmlShower)
