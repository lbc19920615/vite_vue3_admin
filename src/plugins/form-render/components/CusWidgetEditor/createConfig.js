import {baseConfig} from "@/plugins/z-frame/hooks/form";


export function createCusWidgetEditorConfig(formDef = {}, computed = {}) {
    let _config = baseConfig({
        defaultVal: {
            form2: {
                props: [
                ]
            }
        },
        computed,
        def: formDef,
    });
    return _config
}
