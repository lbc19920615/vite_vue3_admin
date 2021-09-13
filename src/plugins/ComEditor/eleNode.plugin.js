import {baseConfig} from "@/plugins/ComEditor/editorConfig";
import {registerEditorConfig} from "@/plugins/ComEditor/nodes";

export let EditorConfig = function (defaultVal = {}) {
    return baseConfig( {
            type: 'object',
            ui: {
                attrs: [
                    ['label-width', '100px']
                ],
            },
            properties: {
                name: {
                    type: 'string',
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
                textContent: {
                    type: 'string',
                    ui: {
                        label: 'text',
                        widgetConfig: {
                            type: 'textarea',
                            rows: 1,
                            disabled: true,
                        }
                    },
                    computedProp: 'computedEditText'
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
                prop1: {
                    type: 'string',
                    computedProp: 'computedProp1',
                    ui: {
                        widgetConfig: {
                            type: 'textarea',
                            rows: 1,
                            disabled: true,
                        }
                    },
                    // reflect: 'inputEdit',
                    // reflectTpl: 'A.getInputEdit($M, $VAL, $R)'
                },
                inputEdit: {
                    type: 'string',
                    ui: {
                        label: 'INPUT',
                        widget: 'CusFormAttr',
                        widgetConfig: {
                        }
                    },
                },
                attrs: {
                    type: 'array',
                    "items": {
                        "type": "object",
                        "properties": {
                            name: {
                                type: 'string',
                                ui: {
                                    widget: 'CusSuggest',
                                    widgetConfig: {
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
            }
        }, {
          computedEditText: "MODEL('editText', '')",
          computedProp1: "A.getInputEdit(MODEL('inputEdit', ''))"
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

registerEditorConfig('ele',  function (dep) {
    console.log('eleNode buildConfig', dep)
    return EditorConfig({
        form2: {
        }
    })
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
            if ( ZY.lodash.isEmpty(obj.items)) {
                this.items = [
                    {
                        id: id + '-0',
                        name: 'default',
                        key: 'default',
                    },
                ]
            } else {
                this.items = obj.items
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
