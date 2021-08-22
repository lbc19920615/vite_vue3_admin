let p = {
    type: 'object',
    properties: {
        def: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                },
            }
        },
        // parts: {
        //     type: 'array',
        //     items: {
        //         type: "object",
        //         properties: {
        //             uis: {
        //                 type: 'string',
        //                 ui: {
        //                     label: 'UI',
        //                     widget: 'JsonCodeEditor',
        //                     widgetConfig: {
        //                         style: {
        //                             height: "100px",
        //                         }
        //                     }
        //                 }
        //             },
        //             props: {
        //                 type: 'string',
        //                 ui: {
        //                     label: 'SCHEMA',
        //                     widget: 'JsonCodeEditor',
        //                     widgetConfig: {
        //                         style: {
        //                             height: "500px",
        //                         }
        //                     }
        //                 }
        //             },
        //         }
        //     }
        // },
        ui_type: {type: 'string', ui: {label: 'ui.type'}},
        ui_label: {type: 'string', ui: {label: 'ui.label'}},
        ui_widget: {type: 'string', ui: {label: 'ui.widget'}},
        ui_widgetConfig: {
            type: 'string',
            ui: {label: 'ui.widgetConfig', widget: 'JsonCodeEditor', widgetConfig: {style: {}}}
        },
        rules: {type: 'string', ui: {widget: 'JsonCodeEditor', widgetConfig: {style: {height: '200px'}}}}
    }
}

function renderForm(p, basePath, configPath) {
    let context = {
        tpl: ''
    }
    function render(p, key, context, level, basePath, configPath ) {
        if (p.type === 'object') {
            context.tpl = context.tpl + `
<el-row class="level_${level} object"
v-if="${basePath}"
>`
            for (let [key, value] of Object.entries(p.properties)) {
                render(value, key, context, level + 1,
                    `${basePath}['${key}']`, `${configPath}.properties['${key}']`)
            }
            context.tpl = context.tpl + `
</el-row>`
        } else if (p.type === 'array') {
            let itemKey = 'item' + level
            let indexKey = 'index' + level
            context.tpl = context.tpl + `
<el-row class="level_${level} array">
<template v-for="(${itemKey}, ${indexKey}) in ${basePath}" >`
            if (p.items.type === 'object') {
                for (let [key, value] of Object.entries(p.items.properties)) {
                    render(value, key, context, level + 1,
                        `${basePath}[${indexKey}]['${key}']`, `${configPath}.items.properties['${key}']`)
                }
                // render(p.items, context, level + 1)
            }
            context.tpl = context.tpl + `
</template>
</el-row>`
        } else {
            console.log(p, key)
            context.tpl = context.tpl + `
<el-col class="level_${level} prop"
>`
            context.tpl = context.tpl +
                `
<cm-field
v-model="${basePath}"
label="${key}" prop="${key}"
form-path="${basePath}"
type="${p.type}"
:ui="${configPath}.ui"
:rules="${configPath}.rules"
>
</cm-field>`
            context.tpl = context.tpl + `
</el-col>`
        }
    }

    render(p, '', context, 1, basePath, configPath)
    return context.tpl
}



import fs from 'fs'
import beautify from 'js-beautify'
let html = beautify.html

let tpl = renderForm(p, '{{ modelKey }}', '{{ partConfigKey }}')

// console.log(context.tpl)
fs.writeFileSync('./tests/test.html', html(tpl))