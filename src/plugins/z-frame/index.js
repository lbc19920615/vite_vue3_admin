import ZUpload from "@/plugins/z-frame/components/ZUpload.vue";
// import CusUpload from "@/plugins/z-frame/components/CusUpload.vue";
import FormsEventSelect from "@/plugins/z-frame/components/FormsEventSelect.vue";
import SimpleList from "@/plugins/z-frame/components/SimpleList.vue";
import ZCellItem from "@/plugins/z-frame/components/ZCellItem.vue";
// import ZIframe from "@/plugins/z-frame/components/ZIframe.vue";
import ZFilterList from "@/plugins/z-frame/components/ZFilterList.vue";
// import ZText from "@/plugins/z-frame/components/ZText.vue";
import ZJumpScroll from "@/plugins/z-frame/components/ZJumpScroll.vue";
// import ZJumpScrollHolder from "@/plugins/z-frame/components/ZJumpScrollHolder.vue";
import ZWindow from "@/plugins/z-frame/components/ZWindow.vue";
import ZProps from "@/plugins/z-frame/components/ZProps.vue";


export function install(app) {
  CustomVueComponent.app = app
  CustomVueComponent.register(SimpleList)
  // CustomVueComponent.register(ZIframe)
  CustomVueComponent.register(ZProps)
  // CustomVueComponent.register(ZText)
  CustomVueComponent.register(ZWindow)
  CustomVueComponent.register(ZJumpScroll)
  CustomVueComponent.register(ZFilterList)
  // CustomVueComponent.register(ZJumpScrollHolder)
  CustomVueComponent.register(ZCellItem)
  CustomVueComponent.register(FormsEventSelect)
  // CustomVueComponent.register(CusUpload)
  CustomVueComponent.register(ZUpload)
}
