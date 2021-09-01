import {baseConfig} from "@/plugins/ComEditor/editorConfig";

export let tabEditorConfig = function (defaultVal = {}) {
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
                items: {
                    type: 'array',
                    "items": {
                        "type": "object",
                        "properties": {
                            id: {
                                type: 'string',
                                ui: {
                                    label: 'ID',
                                    widgetConfig: {
                                        readonly: true
                                    }
                                },
                            },
                            label: {
                                type: 'string',
                                ui: {
                                },
                            },
                            name: {
                                type: 'string',
                                ui: {
                                },
                            },
                        }
                    }
                },
            }
        }, {
            doubled: "MODEL('name', '') + ',s'"
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


    class TabNode extends V1Node {
        constructor(id, items) {
            super(id, items);
            this.type = 'tab';
            this.editor = tabEditorConfig({
                form2: {
                }
            })
            this.items = items
        }
    }

    let ret = {
        name: 'TabNode',
        type: 'tab',
        cls: TabNode,
        desc: 'Tab',
        group: 'UI',
        fromJSON5(obj) {
            return new TabNode(obj.id, obj.items)
        }
    }

    return ret
}
