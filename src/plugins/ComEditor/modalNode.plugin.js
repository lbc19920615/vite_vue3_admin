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
                pageRef: {
                    type: 'string',
                    ui: {
                        // label: '弹框名'
                    },
                },
                pageVars: {
                    type: 'array',
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: 'string',
                                ui: {
                                },
                            },
                            value: {
                                type: 'string',
                                ui: {
                                },
                            },
                        }
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
        constructor(id, obj) {
            super(id);
            this.type = 'modal';
            this.keyReadonly = true
            this.editor = tabEditorConfig({
                form2: {
                }
            })
            // console.log('obj.items', obj)
            let data = obj.data ?? {}
            this.pageVars = data.pageVars ?? []
            this.pageRef = data.pageRef ?? ''
            if ( ZY.lodash.isEmpty(obj.items)) {
                this.items = [
                    {
                        id: id + '-0',
                        name: 'default',
                        key: 'default',
                    },
                    {
                        id: id + '-1',
                        name: 'footer',
                        key: 'footer',
                    },
                ]
            } else {
                this.items = obj.items
            }
        }
    }

    let ret = {
        name: 'ModalNode',
        type: 'modal',
        desc: 'Modal',
        group: 'UI',
        cls: ModalNode,
        fromJSON5(obj) {
            return new ModalNode(obj.id, obj)
        },
        handleItemAppend(newItem, dep) {
            // console.log('sdsdsdsds')
            return newItem
        },
    }

    return ret
}
