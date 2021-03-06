import './index.scss'
import ZDragInput from "@/plugins/z-dragxml/components/ZDragInput.vue";
import ZDragTextarea from "@/plugins/z-dragxml/components/ZDragTextarea.vue";
import ZDragRadio from "@/plugins/z-dragxml/components/ZDragRadio.vue";
import ZDragCheckbox from "@/plugins/z-dragxml/components/ZDragCheckbox.vue";
import ZDragInputNumber from "@/plugins/z-dragxml/components/ZDragInputNumber.vue";
import ZDragSelect from "@/plugins/z-dragxml/components/ZDragSelect.vue";
import ZDragDateTimePicker from "@/plugins/z-dragxml/components/ZDragDateTimePicker.vue";
import ZDragSlider from "@/plugins/z-dragxml/components/ZDragSlider.vue";
import ZDragTimePicker from "@/plugins/z-dragxml/components/ZDragTimePicker.vue";
import ZDragCascader from "@/plugins/z-dragxml/components/ZDragCascader.vue";
import ZDragRate from "@/plugins/z-dragxml/components/ZDragRate.vue";
import ZDragRichText from "@/plugins/z-dragxml/components/ZDragRichText.vue";
import ZDragUpload from "@/plugins/z-dragxml/components/ZDragUpload.vue";
import ZDragAddress from "@/plugins/z-dragxml/components/ZDragAddress.vue";
import ZDragGrid from "@/plugins/z-dragxml/components/ZDragGrid.vue";
import ZDragSubForm from "@/plugins/z-dragxml/components/ZDragSubForm.vue";
import ZDragCustom from "@/plugins/z-dragxml/components/ZDragCustom.vue";

export function install(app) {
  CustomVueComponent.app = app
  CustomVueComponent.register(ZDragTextarea)
  CustomVueComponent.register(ZDragSubForm)
  CustomVueComponent.register(ZDragRadio)
  CustomVueComponent.register(ZDragRate)
  CustomVueComponent.register(ZDragSlider)
  CustomVueComponent.register(ZDragTimePicker)
  CustomVueComponent.register(ZDragDateTimePicker)
  CustomVueComponent.register(ZDragCheckbox)
  CustomVueComponent.register(ZDragAddress)
  CustomVueComponent.register(ZDragUpload)
  CustomVueComponent.register(ZDragCustom)
  CustomVueComponent.register(ZDragRichText)
  CustomVueComponent.register(ZDragInputNumber)
  CustomVueComponent.register(ZDragGrid)
  CustomVueComponent.register(ZDragCascader)
  CustomVueComponent.register(ZDragSelect)
  CustomVueComponent.register(ZDragInput)
}
