import {loadComponent, fetchVueComponent} from "@/hooks/remote";
import {VARS_PAGE_MODEL_NAME} from "@/vars";
import {parseComponent} from "vue-sfc-parser";
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

export async function loadPage(comName, storeName = VARS_PAGE_MODEL_NAME, tplID = 'apptpl') {
  return await loadComponent(
      async () => {
      let currentData = await ZY_EXT.store.getItem(storeName)
      // console.log(currentData)
      // let res = await globalThis.importScripts('./configs/page1.js')
      // let res = createPage()
      // let script = res.default ?? {}
      // script.def = Object.assign({}, currentData, script.def)
      // // console.log(script)
      // return fetchVueComponent(
      //   script
      // )
        return new Promise(resolve => {

            let pageTemplate = document.getElementById(tplID).innerHTML
            let t = Twig.twig({
                id: tplID,
                data: pageTemplate,
                allowInlineIncludes: true
            });
            let tpl = t.render({
                CONFIG: currentData
            })
            // console.log(tpl)
            setTimeout(() => {
                resolve(parseComponent(tpl))
            }, 30)
        })
    },
    comName,
    {
      handleScript(script) {
        // console.log('script', script)

        script = `
  globalThis.PAGE_STORE_NAME = '${storeName}';
  const { buildFormDep } = globalThis.ZPageBuild;
  const { extendControl2Page, useAppPageControl, useControl, extendCommonArrEventHandler } = globalThis.Framework;
  const { useRenderControl, useGlobalEasy } = globalThis.ZPageHooks;
  ` + script

        return script
      },
      styles: [
        // showCss
      ]
    }
  )
}
