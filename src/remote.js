import {loadComponent, fetchVueComponent} from "@/hooks/remote";
import showCss from '@/views/about/show.scss';

export async function loadPage(name) {
  return await loadComponent( async () => {
    let currentData = await ZY_EXT.store.getItem('play-events-model')
    // console.log(currentData)
    let res = await globalThis.importScripts('./configs/page1.js')
    let obj = Object.assign({}, {
      layoutSlots: currentData.layoutSlots
    }, res.default)
    return fetchVueComponent(
      obj
    )
  }, 'z-page-' + name, {
    handleScript(script) {
      // console.log('script', script)

      script = `
const { buildFormDep } = globalThis.ZPageBuild;       
const { extendControl2Page, useAppPageControl, useControl } = globalThis.Framework;   
const { useRenderControl } = globalThis.ZPageHooks; 
` + script

      return script
    },
    styles: [
      showCss
    ]
  })
}
