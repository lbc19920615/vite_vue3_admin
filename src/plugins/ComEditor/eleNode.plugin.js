import {baseConfig} from "@/plugins/ComEditor/editorConfig";

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
                            readonly: true,
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
                attrs: {
                    type: 'array',
                    "items": {
                        "type": "object",
                        "properties": {
                            name: {
                                type: 'string',
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
          computedEditText: "MODEL('editText', '')"
        },
        {
            defaultVal: defaultVal
        }
    )
}

export function install({
    V1Node,
                            LayoutNode,
                            ClosureNode
                        }) {


    class EleNode extends V1Node {
        constructor(id, items, obj) {
            super(id, items);
            this.type = 'ele';
            this.editor = EditorConfig({
                form2: {
                }
            })
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
