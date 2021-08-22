export default {
    name: 'process-step1',
    defaultVal: {
        form2: {
            parts: [{
                ui_type: '',
                ui_label: '',
                ui_widgetConfig: '{}',
                rules: '{}'
            }]
        }
    },
    init: {
        def: {
            constants: {},
            parts: [{
                type: 'form',
                name: 'form2',
                serviceTpl: {def: {}, args: {src: 'bservice.twig'}},
                def: {
                    type: 'object',
                    ui: {attrs: [['label-width', '150px']]},
                    properties: {
                        parts: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    ui_type: {
                                        type: 'string',
                                        ui: {
                                            label: 'ui.type'
                                        }
                                    },
                                    ui_label: {
                                        type: 'string', ui: {
                                            label: 'ui.label'
                                        }
                                    },
                                    ui_widget: {
                                        type: 'string', ui: {
                                            label: 'ui.widget'
                                        }
                                    },
                                    ui_widgetConfig: {
                                        type: 'string',
                                        ui: {
                                            label: 'ui.widgetConfig',
                                            widget: 'JsonCodeEditor', widgetConfig: {style: {}}
                                        }
                                    },
                                    rules: {
                                        type: 'string',
                                        ui: {
                                            widget: 'JsonCodeEditor', widgetConfig: {style: {height: '200px'}}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                computed: {doubled: "MODEL('name', '') + ',s'"}
            }]
        }, args: {src: 'comformscr.twig'}
    }
}