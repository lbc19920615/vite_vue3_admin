import ZUpload from "@/plugins/z-frame/components/ZUpload.vue";
import CusUpload from "@/plugins/z-frame/components/CusUpload.vue";

export function install(app) {
  CustomVueComponent.app = app
  CustomVueComponent.register(CusUpload)
  CustomVueComponent.register(ZUpload)
}
