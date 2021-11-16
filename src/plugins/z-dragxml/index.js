import './index.scss'
import ZDragInput from "@/plugins/z-dragxml/components/ZDragInput.vue";
import ZDragTextarea from "@/plugins/z-dragxml/components/ZDragTextarea.vue";
import ZDragRadio from "@/plugins/z-dragxml/components/ZDragRadio.vue";
import ZDragCheckbox from "@/plugins/z-dragxml/components/ZDragCheckbox.vue";
import ZDragInputNumber from "@/plugins/z-dragxml/components/ZDragInputNumber.vue";
import ZDragSelect from "@/plugins/z-dragxml/components/ZDragSelect.vue";
import ZDragDateTimePicker from "@/plugins/z-dragxml/components/ZDragDateTimePicker.vue";
import ZDragSlider from "@/plugins/z-dragxml/components/ZDragSlider.vue";
import ZDragRate from "@/plugins/z-dragxml/components/ZDragRate.vue";
import ZDragGrid from "@/plugins/z-dragxml/components/ZDragGrid.vue";
import ZDragSubForm from "@/plugins/z-dragxml/components/ZDragSubForm.vue";

export function install(app) {
  CustomVueComponent.app = app
  CustomVueComponent.register(ZDragTextarea)
  CustomVueComponent.register(ZDragSubForm)
  CustomVueComponent.register(ZDragRadio)
  CustomVueComponent.register(ZDragRate)
  CustomVueComponent.register(ZDragSlider)
  CustomVueComponent.register(ZDragDateTimePicker)
  CustomVueComponent.register(ZDragCheckbox)
  CustomVueComponent.register(ZDragInputNumber)
  CustomVueComponent.register(ZDragGrid)
  CustomVueComponent.register(ZDragSelect)
  CustomVueComponent.register(ZDragInput)
}
