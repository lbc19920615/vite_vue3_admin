import {loadComponent} from "@/hooks/remote";
import {VARS_PAGE_MODEL_NAME} from "@/vars";
import {parseComponent} from "vue-sfc-parser";
import {buildXml} from "@/plugins/z-frame/components/ZLayoutEditor/xml";

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
      let currentData = await ZY_EXT.store.getItem(storeName);
      let layoutDesign = currentData.layoutDesign
      // console.log(layoutDesign)
      let xml = buildXml({
        deps: Object.entries(layoutDesign.currentLayoutMap).map(v => v[1]),
        links: layoutDesign.currentLinks,
      }, {filterEle: false,
      extCtx: {
        resolveData({data, ele, id} = {}) {
          if (ele.type === 'row') {
            return {
              tagName: 'div',
              attrs: [
                {
                  name: 'def-id',
                  value: id
                }
              ]
            }
          }
          else if (ele.type === 'form') {
            // console.log(data)
            let partName = data?.partName ?? 'UNDEFINED'
            return {
              tagName: 'auto-http-com',
              attrs: [
                {
                  name: 'def-id',
                  value: id
                },
                {
                  name: ':page',
                  value: 'page'
                },
                {
                  name: ':def',
                  value: `getDef("${partName}")`
                },
                {
                  name: ':is',
                  value: `getObj(page.stepMap, "${partName}")`
                },
                {
                  name: ':slot-content',
                  value: 'innerSlots'
                }
              ]
            }
          }
          return {
          }
        }
      }
      })
        let render_tag = 'load_page__render_xml_' + ZY.camelNameToCls(ZY.rid(6)).replaceAll('-', '_');
        console.log(xml)
      // let res = await globalThis.importScripts('./configs/page1.js')
      // let res = createPage()
      // let script = res.default ?? {}
      // script.def = Object.assign({}, currentData, script.def)
      // // console.log(script)
      // return fetchVueComponent(
      //   script
      // )
        return new Promise(resolve => {

          let pageTemplate = document.getElementById(tplID).innerHTML;

          pageTemplate = pageTemplate.replaceAll(/load_page__render_xml__def_render_tag/g, render_tag)
          // console.log(pageTemplate)
          let t = Twig.twig({
            id: tplID,
            data: pageTemplate,
            allowInlineIncludes: true
          });

          let tpl = t.render({
            CONFIG: currentData,
            C_XML: xml,
            render_tag: render_tag
          })

          let deps = [
            // '/src/views/about/components/LayRow.vue'
          ]

          Promise.all(
            deps.map(v => {
              return  globalThis.importScripts(v)
            })
          ).then(res => {
            // console.log(res)
            // console.log(tpl)
            setTimeout(() => {
              resolve(parseComponent(tpl))
            }, 30)
          })

        })
    },
    comName,
    {
      handleScript(script) {
        // console.log('script', script)

        script = `
  globalThis.PAGE_STORE_NAME = '${storeName}';
  const { buildFormDep } = globalThis.ZPageBuild;
  const { extendControl2Page, useAppPageControl, useControl, extendCommonArrEventHandler } = globalThis.ZFramework;
  const { useRenderControl, useGlobalEasy, buildPageCommonMixin } = globalThis.ZPageHooks;
  ` + script

        return script
      },
      styles: [
        // showCss
      ]
    }
  )
}
