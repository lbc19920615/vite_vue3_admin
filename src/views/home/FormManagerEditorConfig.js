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
                    ui: {
                        attrs: [['label-width', '150px']]
                    },
                    properties: {
                        args: {
                          type: 'object',
                            ui: {
                              label: '参数'
                            },
                            properties: {
                              name: {
                                  type: 'string',
                                  ui: {
                                      label: '文件名',
                                      attrs: [
                                          ['scroll-control', 'page_name'],
                                      ],
                                      class: [
                                          'a-space-pt-20'
                                      ],
                                      widget: 'CusSuggest',
                                      widgetConfig: {
                                          teleportTo: "#dialog_popover",
                                          enums: "ROOT_STATE('tools.constVars_pageNames', [])",
                                      }
                                  }
                              },
                              // template: {
                              //     type: 'string',
                              //     ui: {
                              //         attrs: [
                              //             ['scroll-control', 'page_name'],
                              //         ],
                              //         class: [
                              //             'a-space-pt-20'
                              //         ],
                              //         widget: 'CusSuggest',
                              //         widgetConfig: {
                              //             teleportTo: "#dialog_popover",
                              //             enums: "ROOT_STATE('tools.constVars_pageNames', [])",
                              //         }
                              //     }
                              // },
                          }
                        },
                        form: {
                            type: 'string',
                            tag: 'div',
                            ui: {
                                label: '表单',
                                widget: 'CusForm',
                                widgetConfig: {
                                    enums: "ROOT_STATE('tools.propTypes', [])",
                                    useDrag: false
                                },
                            }
                        },
                        // forms: {
                        //     type: 'array',
                        //     tag: 'my-vue-tab',
                        //     con_tag: 'my-vue-tab-pane',
                        //     ui: {
                        //         attrs: [
                        //             ['scroll-control', 'page_forms'],
                        //         ],
                        //         conAttrs: [
                        //             {
                        //                 prefixValue: '"form"+',
                        //                 handler: ['c', 'return [":name", c.indexKey]']
                        //             }
                        //         ],
                        //         class: [
                        //         ],
                        //         conClass: [
                        //             'a-space-mb-20'
                        //         ]
                        //     },
                        //     items: {
                        //         type: 'object',
                        //         properties: {
                        //             name: {
                        //                 type: 'string',
                        //                 tag: 'div',
                        //                 ui: {
                        //                     widget: 'CusSuggest',
                        //                     widgetConfig: {
                        //                         teleportTo: "#dialog_popover",
                        //                         enums: "ROOT_STATE('tools.constVars_processSteps', [])",
                        //                     }
                        //                 }
                        //             },
                        //             value: {
                        //                 type: 'string',
                        //                 tag: 'div',
                        //                 ui: {
                        //                     widget: 'CusForm',
                        //                     widgetConfig: {
                        //                         enums: "ROOT_STATE('tools.propTypes', [])",
                        //                     },
                        //                 }
                        //             },
                        //         }
                        //     }
                        // },
                    }
                },
                computed: {
                    doubled: "MODEL('events[0].name', '')",
                }
            }]
        }, args: {src: 'comformscr2.twig'}
    }
}
