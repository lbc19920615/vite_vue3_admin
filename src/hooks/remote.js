import { fetchContentV3,  } from '@expose/main.js'
import {parseComponent} from "vue-sfc-parser";

let templateSfc = function (sfc) {
    if (sfc.template) {
        return sfc.template.content
    }
    return ''
}

/**
 * fetchTwigComponent
 * @param comName
 * @param def
 * @param args
 * @param onReady
 * @returns {Promise<void>}
 */
export async function fetchTwigComponent(comName = '', {def, args } = {}) {
    try {
        // console.log('this.formDef', this.formDef)
        let data = new FormData()
        data.append('source', JSON.stringify(def))
        let tpl = await fetchContentV3(data, args)
        let sfc = parseComponent(tpl)
        const templateId = comName + '-tpl';
        let res = await ZY.importJsStr(sfc.script.content)
        globalThis.initTemplate(templateId, globalThis, {
            html: `${templateSfc(sfc)}`,
        });
        return {
            script: res,
            sfc,
            name: comName,
        }
    } catch (e) {
        console.error(e)
    } finally {
    //
    }
}

/**
 * fetchComponent
 * @param comName
 * @param cb
 * @returns {Promise<void>}
 */
export async function fetchComponent(comName = '', {def, args, onReady } = {}) {
    try {
        // console.log('this.formDef', this.formDef)
        let data = new FormData()
        data.append('source', JSON.stringify(def))
        let tpl = await fetchContentV3(data, args)
        let sfc = parseComponent(tpl)
        const templateId = comName + '-tpl';
        const objectURL = URL.createObjectURL(
            new Blob([sfc.script.content],
                { type: 'text/javascript' })
        );
        globalThis.importScripts(objectURL).then(res => {
            globalThis.initTemplate(templateId, globalThis, {
                html: `${templateSfc(sfc)}`,
            });

            let comDef = globalThis.app.component(comName, {
                template: '#' + templateId,
                ...res.default
            })
            setTimeout(() => {
                // console.log('publish', sfc)
                // PubSub.publish(FETCH_COMPONENT_READY, {
                //     sfc,
                //     name: comName,
                //     comDef
                // })
                if (onReady) {
                    onReady({
                        sfc,
                        name: comName,
                        comDef
                    })
                }
            }, 30)
        })
    } catch (e) {
        console.error(e)
    } finally {
    //
    }
}
