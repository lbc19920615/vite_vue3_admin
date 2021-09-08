import ZUpload from "@/plugins/z-frame/components/ZUpload.vue";
import CusUpload from "@/plugins/z-frame/components/CusUpload.vue";
import FormsEventSelect from "@/plugins/z-frame/components/FormsEventSelect.vue";
import SimpleList from "@/plugins/z-frame/components/SimpleList.vue";

export function install(app) {
  CustomVueComponent.app = app
  CustomVueComponent.register(SimpleList)
  CustomVueComponent.register(FormsEventSelect)
  CustomVueComponent.register(CusUpload)
  CustomVueComponent.register(ZUpload)
}