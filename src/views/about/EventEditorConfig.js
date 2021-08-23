export default {
    name: 'event-handler',
    defaultVal: {
        form2: {
            events: [
                {
                    name: '111',
                    code: '111',
                }
            ]
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
                        events: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string'
                                    },
                                    code: {
                                        type: 'string',
                                        ui: {
                                            widgetConfig: {
                                                type: 'textarea'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                computed: {doubled: "MODEL('name', '') + ',s'"}
            }]
        }, args: {src: 'comformscr2.twig'}
    }
}
