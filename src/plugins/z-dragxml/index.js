import './index.scss'
import ZDragInput from "@/plugins/z-dragxml/components/ZDragInput.vue";
import ZDragTextarea from "@/plugins/z-dragxml/components/ZDragTextarea.vue";
import ZDragRadio from "@/plugins/z-dragxml/components/ZDragRadio.vue";
import ZDragCheckbox from "@/plugins/z-dragxml/components/ZDragCheckbox.vue";
import ZDragSubForm from "@/plugins/z-dragxml/components/ZDragSubForm.vue";

export function install(app) {
  CustomVueComponent.app = app
  CustomVueComponent.register(ZDragTextarea)
  CustomVueComponent.register(ZDragSubForm)
  CustomVueComponent.register(ZDragRadio)
  CustomVueComponent.register(ZDragCheckbox)
  CustomVueComponent.register(ZDragInput)
}
