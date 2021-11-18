import {baseConfig} from "@/plugins/z-frame/hooks/form";

let formDef = {
    type: 'object',
    ui: {
        attrs: [
            // ['label-width', '100px']
        ],
    },
    properties: {
        props: {
            type: 'array',
            ui: {
                conAttrs: [
                  [
                    'style',
                      'display: flex;'
                  ]
                ]
            },
            items: {
                type: "object",
                properties: {
                    name: {
                        type: 'string',
                        ui: {
                            label: '名称',
                            class: ['z-props__name']
                        }
                    },
                    value: {
                        type: 'string',
                        ui: {
                            label: '值',
                            class: ['z-props__value']
                        }
                    },
                }
            }
        },
    }
}

let computed = {}

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

export default _config
