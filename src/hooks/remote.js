import {fetchContentV3,} from '@expose/main.js'
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
export async function fetchTwigComponent(comName = '', {def, args, handleScript, styles = [] } = {}) {
    try {
        // console.log('this.formDef', this.formDef)
        let data = new FormData()
        data.append('source', JSON.stringify(def))
        let tpl = await fetchContentV3(data, args)
        let sfc = parseComponent(tpl)
        const templateId = comName + '-tpl';
        // console.log(sfc)
        let styleSheets = []
        if (Array.isArray(sfc.styles) && sfc.styles.length > 0) {
            styles = styles.concat(sfc.styles)
        }

        styles.forEach(styleObj => {
            let styleDom = document.createElement('style')
            styleDom.id = ZY.nid()
            styleDom.innerText = styleObj.content
            document.body.appendChild(styleDom)
            styleSheets.push(styleDom)
        })
        let scriptStr = sfc.script.content
        if (handleScript) {
            scriptStr = handleScript(scriptStr)
        }
        let res = await ZY.importJsStr(scriptStr)
        globalThis.initTemplate(templateId, globalThis, {
            html: `${templateSfc(sfc)}`,
        });
        return {
            script: res,
            sfc,
            templateId,
            name: comName,
        }
    } catch (e) {
        console.error(e)
    } finally {
    //
    }
}

function handleStyle(styles = []) {
    styles.forEach(styleObj => {
        let styleDom = document.createElement('style')
        styleDom.id = ZY.nid()
        styleDom.innerText = styleObj.content
        document.body.appendChild(styleDom)
    })
}

export async function fetchVueComponent({def, args}) {
    let data = new FormData()
    data.append('source', JSON.stringify(def))
    let tpl = await fetchContentV3(data, args)
    return parseComponent(tpl)
}

/**
 * loadComponent
 * @param comName
 * @param def
 * @param args
 * @param handleScript
 * @param styles
 * @returns {Promise<*>}
 */
export async function loadComponent(p, comName = '', {handleScript, handleTpl, styles = [] } = {}) {
    let [err, sfc] = await ZY.awaitTo(
        p()
    )
    if (err) {
        return Promise.reject(err)
    }
    if (Array.isArray(sfc.styles) && sfc.styles.length > 0) {
        styles = styles.concat(sfc.styles)
    }
    handleStyle(styles)
    let scriptStr = sfc.script.content
    if (handleScript) {
        scriptStr = handleScript(scriptStr)
    }
    let script = await ZY.importJsStr(scriptStr)
    let tpl = sfc.template.content
    if (handleTpl) {
        tpl = handleTpl(tpl)
    }
    console.log(tpl)
    return {
        name: comName,
        template: tpl,
        ...script.default
    }
}

/**
 * fetchComponent
 * @param comName
 * @param cb
 * @returns {Promise<void>}
 */
export async function fetchComponent(comName = '', options = {}) {
    let {def, args, onReady } = options
    // console.log('fetchComponent', comName, options)
    try {
        // console.log('this.formDef', this.formDef)
        // let data = new FormData()
        // data.append('source', JSON.stringify(def))
        // let tpl = await fetchContentV3(data, args)
        // let sfc = parseComponent(tpl)
        // const templateId = comName + '-tpl';
        // let res = await ZY.importJsStr(sfc.script.content)
        // globalThis.initTemplate(templateId, globalThis, {
        //     html: `${templateSfc(sfc)}`,
        // });
        let {script, sfc, templateId} = await fetchTwigComponent(comName, {def, args})
        let comDef = globalThis.app.component(comName, {
            template: '#' + templateId,
            ...script.default
        })
        setTimeout(() => {
            if (onReady) {
                onReady({
                    sfc,
                    name: comName,
                    comDef
                })
            }
        }, 30)
    } catch (e) {
        console.error(e)
    } finally {
    //
    }
}
