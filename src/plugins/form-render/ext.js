import CusLayoutEditor from "@/plugins/form-render/components/CusLayoutEditor.vue";



// import CusPropsEditor from "@/plugins/form-render/components/CusPropsEditor.vue";
import CusFormAttr from "@/plugins/form-render/components/CusFormAttr.vue";
import CusUI from "@/plugins/form-render/components/CusUI.vue";
import CusWidgetEditor from "@/plugins/form-render/components/CusWidgetEditor.vue";
import CusFormRules from "@/plugins/form-render/components/CusFormRules.vue";
import CusComEvents from "@/plugins/form-render/components/CusComEvents.vue";
import CusJsxEditor from "@/plugins/form-render/components/CusJsxEditor.vue";
import CusComputed from "@/plugins/form-render/components/CusComputed.vue";
import CusOptManager from "@/plugins/form-render/components/CusOptManager.vue";
import CusAttr from "@/plugins/form-render/components/CusAttr.vue";
import CusInsert from "@/plugins/form-render/components/CusInsert.vue";
import CusProps from "@/components/CustomForm/CusProps.vue";
import CusForm from "@/components/CustomForm/CusForm.vue";
import CusDragXml from "@/components/CustomForm/CusDragXml.vue";

CustomVueComponent.register(CusProps)
CustomVueComponent.register(CusForm)
CustomVueComponent.register(CusDragXml)
CustomVueComponent.register(CusFormRules)
CustomVueComponent.register(CusComEvents)
CustomVueComponent.register(CusUI)
CustomVueComponent.register(CusWidgetEditor)
CustomVueComponent.register(CusOptManager)
CustomVueComponent.register(CusJsxEditor)
CustomVueComponent.register(CusInsert)
CustomVueComponent.register(CusLayoutEditor)
CustomVueComponent.register(CusAttr)
CustomVueComponent.register(CusFormAttr)
CustomVueComponent.register(CusComputed)

import * as ZDragPlugin from "@/plugins/z-dragxml/index";
CustomVueComponent.app.use(ZDragPlugin);

import('@/plugins/form-render/components/CusXmlShower.vue').then(res => {
  CustomVueComponent.register(res.default)
})
