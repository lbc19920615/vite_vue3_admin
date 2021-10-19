export default {
    name: 'event-handler',
    defaultVal: {
        form2: {
            // obj: {
            //     events: [
            //         {}
            //     ]
            // },
            // slots: 'sdsds',
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
                    tag: 'em-props',
                    ui: {
                        attrs: [['label-width', '150px']],
                        class: [
                        ]
                    },
                    properties: {
                        // template2: {
                        //     type: String,
                        //     ui: {
                        //         label: '模板',
                        //         widget: 'CusJsxEditor',
                        //         widgetConfig:  {
                        //         }
                        //     }
                        // },
                        name: {
                            type: 'string',
                            wrap: 'em-props-item',
                            ui: {
                                label: 'APP名称',
                                attrs: [
                                    ['scroll-control', 'page_name'],
                                ],
                                class: [
                                  'a-space-pt-20'
                                ],
                                widget: 'CusSuggest',
                                widgetConfig: {
                                    enums: "ROOT_STATE('tools.constVars_pageNames', [])",
                                }
                            }
                        },
                        routers: {
                            type: String,
                            ui: {
                                label: '路由',
                                widget: 'CusRoutesEditor',
                                widgetConfig:  {
                                }
                            }
                        },
                    }
                },
                computed: {
                }
            }]
        }, args: {src: 'comformscr2.twig'}
    }
}
