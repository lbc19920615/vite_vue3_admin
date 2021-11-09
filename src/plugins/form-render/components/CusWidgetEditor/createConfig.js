import {baseConfig} from "@/plugins/z-frame/hooks/form";


export function createCusWidgetEditorConfig(formDef = {}, computed = {}, defaultVal = {}) {
    let _config = baseConfig({
        defaultVal: {
            form2: {
                ...defaultVal
            }
        },
        computed,
        def: formDef,
    });
    return _config
}
