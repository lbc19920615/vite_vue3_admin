export default {
    name: 'process-step1',
    defaultVal: {
        form2: {
            ui: {
                type: '',
                label: '',
                widget: '',
                widgetConfig: '{}',
            },
            rules: '{}'
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
                        ui: {
                            type: 'object',
                            properties: {
                                type: {
                                    type: 'string',
                                    ui: {
                                        label: 'ui.type'
                                    }
                                },
                                label: {
                                    type: 'string',
                                    ui: {
                                        label: 'ui.label'
                                    }
                                },
                                widget: {
                                    type: 'string',
                                    ui: {
                                        label: 'ui.widget'
                                    }
                                },
                                widgetConfig: {
                                    type: 'string',
                                    ui: {
                                        label: 'ui.widgetConfig',
                                        widget: 'JsonCodeEditor', widgetConfig: {style: {}}
                                    }
                                },
                            }
                        },
                        rules: {
                            type: 'string',
                            ui: {
                                widget: 'JsonCodeEditor', widgetConfig: {style: {height: '200px'}}
                            }
                        }
                    }
                },
                computed: {doubled: "MODEL('name', '') + ',s'"}
            }]
        }, args: {src: 'comformscr2.twig'}
    }
}