import {loadComponent, fetchVueComponent} from "@/hooks/remote";
import {VARS_PAGE_MODEL_NAME} from "@/vars";
// import showCss from '@/views/about/show.scss';

function createPage() {
  return {
    default: {
      def: {
        constants: {},
      },
      args: {
        src: 'zpage.twig'
      },
    }
  }
}

export async function loadPage(name, storeName = VARS_PAGE_MODEL_NAME) {
  return await loadComponent( async () => {
    let currentData = await ZY_EXT.store.getItem(storeName)
    // console.log(currentData)
    // let res = await globalThis.importScripts('./configs/page1.js')
    let res = createPage()
    let script = res.default ?? {}
    script.def = Object.assign({}, currentData, script.def)
    // console.log(script)
    return fetchVueComponent(
      script
    )
  }, name, {
    handleScript(script) {
      // console.log('script', script)

      script = `
const { buildFormDep } = globalThis.ZPageBuild;       
const { extendControl2Page, useAppPageControl, useControl, extendCommonArrEventHandler } = globalThis.Framework;   
const { useRenderControl, useGlobalEasy } = globalThis.ZPageHooks; 
` + script

      return script
    },
    styles: [
      // showCss
    ]
  })
}
