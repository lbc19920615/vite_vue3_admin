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
                                    label: 'ID'
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


    class ModalNode extends V1Node {
        constructor(id, items) {
            super(id, items);
            this.type = 'modal';
            this.editor = tabEditorConfig({
                form2: {
                }
            })
            this.items = items
        }
    }

    let ret = {
        name: 'ModalNode',
        type: 'modal',
        desc: 'Modal',
        group: 'UI',
        cls: ModalNode,
        fromJSON5(obj) {
            return new ModalNode(obj.id, obj.items)
        }
    }

    return ret
}
