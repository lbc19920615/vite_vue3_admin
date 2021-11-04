import './index.scss'
import ZDragInput from "@/plugins/z-dragxml/components/ZDragInput.vue";
import ZDragTextarea from "@/plugins/z-dragxml/components/ZDragTextarea.vue";

export function install(app) {
  CustomVueComponent.app = app
  CustomVueComponent.register(ZDragTextarea)
  CustomVueComponent.register(ZDragInput)
}
