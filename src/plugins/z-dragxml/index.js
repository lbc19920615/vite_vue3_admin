import './index.scss'
import ZDragInput from "@/plugins/z-dragxml/components/ZDragInput.vue";

export function install(app) {
  CustomVueComponent.app = app
  CustomVueComponent.register(ZDragInput)
}
