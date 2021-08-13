import { fetchContentV3,  } from '@expose/main.js'
import {parseComponent} from "vue-sfc-parser";
import PubSub from 'pubsub-js'
import {FETCH_COMPONENT_READY} from "../utils/event-types.js";


/**
 * fetchComponent
 * @param comName
 * @param cb
 * @returns {Promise<void>}
 */
export async function fetchComponent(comName = '', {def, args } = {}) {
    try {
        // console.log('this.formDef', this.formDef)
        let data = new FormData()
        // console.log('Y.JSON5.stringify(def)', JSON.stringify(def))
        data.append('source', JSON.stringify(def))
        let tpl = await fetchContentV3(data, args)
        let sfc = parseComponent(tpl)
        const templateId = comName + '-tpl';
        globalThis.initTemplate(templateId, globalThis, {
            html: sfc.template.content,
        });
        const objectURL = URL.createObjectURL(
            new Blob([sfc.script.content],
                { type: 'text/javascript' })
        );
        globalThis.importScripts(objectURL).then(res => {
            let comDef = globalThis.app.component(comName, {
                template: '#' + templateId,
                ...res.default
            })
            setTimeout(() => {
                // console.log('publish', sfc)
                PubSub.publish(FETCH_COMPONENT_READY, {
                    sfc,
                    comDef
                })
            }, 300)
        })
    } catch (e) {
        console.error(e)
    }
}
