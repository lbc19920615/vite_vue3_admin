import {baseConfig} from "@/plugins/ComEditor/editorConfig";
import {registerEditorConfig} from "@/plugins/ComEditor/nodes";

const CUS_BASE_DEF = function (properties) {
    return {
        type: 'object',
        ui: {
            attrs: [
                ['label-width', '100px']
            ],
        },
        properties: {
            name: {
                type: 'string',
                hidden: true,
                ui: {
                    label: '名称'
                },
            },
            tagName: {
                type: 'string',
                ui: {
                    label: '标签名'
                },
            },
            editText: {
                type: 'string',
                ui: {
                    label: '文字',
                    widgetConfig: {
                        type: 'textarea'
                    }
                },
                computedProp: 'text'
            },
            ...properties,
            events: {
                type: 'array',
                ui: {
                    label: '事件'
                },
                items: {
                    type: "object",
                    properties: {
                        value: {
                            type: 'string',
                            ui: {
                                label: '事件',
                                widget: 'CusComEvents',
                                widgetConfig: {
                                }
                            },
                        },
                    }
                }
            },
            attrs: {
                type: 'array',
                ui: {
                    label: '属性'
                },
                "items": {
                    "type": "object",
                    "properties": {
                        name: {
                            type: 'string',
                            ui: {
                                widget: 'CusSuggest',
                                widgetConfig: {
                                    placement: 'top'
                                }
                            },
                        },
                        value: {
                            type: 'string',
                            ui: {
                            },
                        },
                    }
                }
            },

            textContent: {
                type: 'string',
                // hidden: true,
                ui: {
                    attrs: [
                        ['style', 'height: 0; overflow: hidden']
                    ],
                    label: 'text',
                    widgetConfig: {
                        type: 'textarea',
                        rows: 1,
                        disabled: true,
                    }
                },
                computedProp: 'computedEditText'
            },
        }
    }
}

export let EditorConfig = function ( { baseDefCreate, properties = {}, computed = {} } = {}, defaultVal = {}) {
    let baseDef = baseDefCreate(properties)
    return baseConfig( baseDef, {
          computedEditText: "MODEL('editText', '')",
          ...computed
        },
        {
            defaultVal: defaultVal
        }
    )
}

// globalThis.editorConfig = function () {
//     return EditorConfig({
//         form2: {
//         }
//     })
// }

registerEditorConfig('ele',  function (dep, options) {
    // console.log('eleNode buildConfig', dep, options)
    let ret = EditorConfig({
        baseDefCreate(properties) {
          let obj = CUS_BASE_DEF(properties);
          // console.log( obj.properties.events.items.properties.value.ui.widgetConfig)
            if (options.weapp) {
                obj.properties.events.items.properties.value.ui.widgetConfig.weapp = true
            }
          return obj
        },
        properties: {
            beforeAttrs: {
                type: 'string',
                // hidden: true,
                computedProp: 'computedProp1',
                ui: {
                    widgetConfig: {
                        type: 'textarea',
                        rows: 1,
                        disabled: true,
                    }
                },
            },
            attrsMap: {
                type: 'string',
                // hidden: true,
                computedProp: 'computedProp2',
                ui: {
                    widgetConfig: {
                        type: 'textarea',
                        rows: 1,
                        disabled: true,
                    }
                },
            },
            // inputEdit: {
            //     type: 'string',
            //     ui: {
            //         label: '表单属性',
            //         widget: 'CusFormAttr',
            //         widgetConfig: {
            //         }
            //     },
            // },
            // rules: {
            //     type: 'array',
            //     ui: {
            //         label: '校验'
            //     },
            //     items: {
            //         type: "object",
            //         properties: {
            //             value: {
            //                 type: 'string',
            //                 ui: {
            //                     widget: 'CusFormRules',
            //                     widgetConfig: {
            //                     }
            //                 },
            //             },
            //         }
            //     }
            // }
        },
        computed: {
            computedProp1: "A.calcBeforeAttrs(MODEL('inputEdit', ''), MODEL('rules', []), MODEL('events', []) )",
            computedProp2: "A.calcAttrsMap(MODEL('inputEdit', ''), MODEL('rules', []), MODEL('events', []) )"
        },
    },{
        form2: {
        }
    })
    // console.log(ret)
    return ret;
})

export function install({
    V1Node,
                            LayoutNode,
                            ClosureNode
                        }) {


    class EleNode extends V1Node {
        constructor(id, items, obj) {
            super(id, items);
            this.type = 'ele';
            this.editor = '';
            this.editorTpl = ['ele']
            this.lib = obj.lib
            if ( ZY.lodash.isEmpty(obj.items)) {
                this.items = [
                    {
                        id: id + '-0',
                        name: 'default',
                        key: 'default',
                    },
                ]
            } else {
                this.items = obj.items.map((v, index) => {
                    v.id = id + '-' + index
                    return v
                })
            }
            this.data = obj.data
        }
    }

    let ret = {
        name: 'EleNode',
        type: 'ele',
        cls: EleNode,
        desc: 'Element',
        group: 'UI',
        fromJSON5(obj) {
            return new EleNode(obj.id, obj.items, obj)
        }
    }

    return ret
}
