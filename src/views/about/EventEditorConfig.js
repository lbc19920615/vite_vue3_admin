export default {
    name: 'event-handler',
    defaultVal: {
        form2: {
            // obj: {
            //     events: [
            //         {}
            //     ]
            // },
            events: [
                // {}
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
                        // obj: {
                        //     type: 'object',
                        //     properties: {
                        //         events: {
                        //             type: 'array',
                        //             items: {
                        //                 type: 'object',
                        //                 properties: {
                        //                     name: {
                        //                         type: 'string'
                        //                     },
                        //                     code: {
                        //                         type: 'string',
                        //                         ui: {
                        //                             widgetConfig: {
                        //                                 type: 'textarea'
                        //                             }
                        //                         }
                        //                     },
                        //                     prop1: {
                        //                         type: 'string',
                        //                         reflect: 'name',
                        //                         reflectTpl: `L.defaultTo($VAL, '') + 's'`,
                        //                         // computedProp: 'doubled',
                        //                         // computedTpl: `$VAL + 's'`
                        //                         // reflect: `CUR('code')`
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }
                        // },
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
                                    },
                                    prop1: {
                                        type: 'string',
                                        reflect: 'name',
                                        reflectTpl: `L.defaultTo($VAL, '') + 's'`,
                                        // reflect: `CUR('code')`
                                    }
                                }
                            }
                        }
                    }
                },
                computed: {doubled: "MODEL('events[0].name', '')"}
            }]
        }, args: {src: 'comformscr2.twig'}
    }
}
