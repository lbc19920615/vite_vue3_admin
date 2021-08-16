import globalVuexStore from "@/store/index";

export function initStoreApp(storeApp) {
  storeApp.use(globalVuexStore)
  storeApp.mount('#storeApp')
  return storeApp
}
