import {baseConfig} from "@/plugins/z-frame/hooks/form";


export function createCusWidgetEditorConfig(formDef = {}, computed = {}) {
    let _config = baseConfig({
        defaultVal: {
            form2: {
                props: [
                    // {
                    //     name: 'form_' + ZY.rid(6),
                    //     value: ''
                    // }
                ]
            }
        },
        computed,
        def: formDef,
    });
    return _config
}
