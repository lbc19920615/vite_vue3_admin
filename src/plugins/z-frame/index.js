import ZUpload from "@/plugins/z-frame/components/ZUpload.vue";
import CusUpload from "@/plugins/z-frame/components/CusUpload.vue";
import FormsEventSelect from "@/plugins/z-frame/components/FormsEventSelect.vue";
import SimpleList from "@/plugins/z-frame/components/SimpleList.vue";
import ZIframe from "@/plugins/z-frame/components/ZIframe.vue";

export function install(app) {
  CustomVueComponent.app = app
  CustomVueComponent.register(SimpleList)
  CustomVueComponent.register(ZIframe)
  CustomVueComponent.register(FormsEventSelect)
  CustomVueComponent.register(CusUpload)
  CustomVueComponent.register(ZUpload)
}
