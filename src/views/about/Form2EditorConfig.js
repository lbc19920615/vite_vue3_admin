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
                        // name: {
                        //     type: 'string',
                        //     wrap: 'em-props-item',
                        //     ui: {
                        //         label: '文件名称',
                        //         attrs: [
                        //             ['scroll-control', 'page_name'],
                        //         ],
                        //         class: [
                        //           'a-space-pt-20'
                        //         ],
                        //         widget: 'CusSuggest',
                        //         widgetConfig: {
                        //             enums: "ROOT_STATE('tools.constVars_pageNames', [])",
                        //         }
                        //     }
                        // },
                        name: {
                            type: 'string',
                            tag: 'div',
                            ui: {
                                label: '表单名',
                                form_item: {
                                    labelWidth: '100px',
                                },
                                styles: [
                                    ['width', '60vw']
                                ],
                                // widget: 'CusSuggest',
                                // widgetConfig: {
                                //     mode: 'select',
                                //     enums: "ROOT_STATE('tools.constVars_processSteps', [])",
                                // }
                            }
                        },
                        value: {
                            type: 'string',
                            tag: 'div',
                            ui: {
                                label: '表单值',
                                hiddenLabel: true,
                                form_item: {
                                    labelWidth: '0px',
                                },
                                widget: 'CusForm',
                                widgetConfig: {
                                    configUrl: '/src/plugins/CusForm/formEditorConfig3.js',
                                    enums: "ROOT_STATE('tools.propTypes', [])",
                                },
                            }
                        },
                        // forms: {
                        //     type: 'array',
                        //     tag: 'my-vue-tab',
                        //     con_tag: 'my-vue-tab-pane',
                        //     wrap: 'em-props-item',
                        //     ui: {
                        //         label: '表单',
                        //         attrs: [
                        //             ['scroll-control', 'page_forms'],
                        //         ],
                        //         conAttrs: [
                        //             {
                        //                 prefixValue: '"表单"+',
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
                        //                     label: '表单名',
                        //                     form_item: {
                        //                         labelWidth: '60px',
                        //                     },
                        //                     widget: 'CusSuggest',
                        //                     widgetConfig: {
                        //                         mode: 'select',
                        //                         enums: "ROOT_STATE('tools.constVars_processSteps', [])",
                        //                     }
                        //                 }
                        //             },
                        //             value: {
                        //                 type: 'string',
                        //                 tag: 'div',
                        //                 ui: {
                        //                     label: '表单值',
                        //                     form_item: {
                        //                         labelWidth: '60px',
                        //                     },
                        //                     widget: 'CusForm',
                        //                     widgetConfig: {
                        //                         configUrl: '/src/plugins/CusForm/formEditorConfig2.js',
                        //                         enums: "ROOT_STATE('tools.propTypes', [])",
                        //                     },
                        //                 }
                        //             },
                        //         }
                        //     }
                        // },
                        // layoutSlotArr: {
                        //     type: 'array',
                        //     tag: 'z-filter-list',
                        //     // con_tag: 'my-vue-tab-pane',
                        //     wrap: 'em-props-item',
                        //     EmHidden: true,
                        //     ui: {
                        //         label: '片段',
                        //         attrs: [
                        //             ['scroll-control', 'page_slotArr'],
                        //         ],
                        //         conAttrs: [
                        //             {
                        //                 prefixValue: '"片段"+',
                        //                 handler: ['c', 'return [":name", c.indexKey]']
                        //             }
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
                        //                     label: '片段名',
                        //                     widget: 'CusSuggest',
                        //                     widgetConfig: {
                        //                         useLabelTip: 'labelTip',
                        //                         mode: 'select',
                        //                         enums: "ROOT_STATE('tools.slotTypes', [])",
                        //                         listStyle: 'height: 300px; overflow: auto;'
                        //                     }
                        //                 }
                        //             },
                        //             // value2: {
                        //             //     type: 'string',
                        //             //     tag: 'div',
                        //             //     ui: {
                        //             //         widget: 'CodeJsEditor',
                        //             //         widgetConfig: {
                        //             //             mode: 'text/html'
                        //             //         }
                        //             //     }
                        //             // },
                        //             layouts: {
                        //                 type: 'string',
                        //                 tag: 'div',
                        //                 ui: {
                        //                     label: '片段XML',
                        //                     widget: 'CusLayoutEditor',
                        //                     widgetConfig: {
                        //                         suffix: 'slayout',
                        //                         mode: 'xml'
                        //                     }
                        //                 }
                        //             },
                        //             value: {
                        //                 type: 'string',
                        //                 reflect: 'layouts',
                        //                 reflectTpl: `A.buildXML($VAL)`,
                        //                 ui: {
                        //                     styles: [
                        //                         ['height', 0],
                        //                         ['overflow', 'hidden'],
                        //                     ],
                        //                     widget: 'CusXmlShower',
                        //                     widgetConfig: {
                        //                         type: 'textarea',
                        //                         disabled: true,
                        //                     }
                        //                 }
                        //             },
                        //         }
                        //     }
                        // },
                        //
                        // layoutSlots: {
                        //     type: 'string',
                        //     computedProp: 'layoutSlotArrComputed',
                        //     hidden: true,
                        //     ui: {
                        //         widgetConfig: {
                        //             disabled: true,
                        //             type: 'textarea'
                        //         }
                        //     }
                        // },
                        // events: {
                        //     type: 'array',
                        //     tag: 'z-filter-list',
                        //     wrap: 'em-props-item',
                        //     EmHidden: true,
                        //     ui: {
                        //       label: '事件',
                        //       attrs:
                        //         [
                        //           ['scroll-control', 'page_events'],
                        //           ['slotPrefix', 'event'],
                        //       ],
                        //       conAttrs: [
                        //           // ['class', 'my-tab'],
                        //           {
                        //               prefixValue: '"事件"+',
                        //               // prefixValue: 'valTpl("A.test("+',
                        //               // suffixValue: ' +")" )',
                        //               handler: ['c', 'return [":name", c.indexKey]']
                        //           }
                        //       ],
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
                        //                     label: '事件名',
                        //                     widget: 'CusSuggest',
                        //                     widgetConfig: {
                        //                         mode: 'select',
                        //                         enums: "ROOT_STATE('tools.constVars_eventSuggests', [])",
                        //                     }
                        //                 }
                        //             },
                        //             code: {
                        //                 type: 'string',
                        //                 tag: 'div',
                        //                 ui: {
                        //                     label: '事件处理代码',
                        //                     widget: 'CodeJsEditor',
                        //                     widgetConfig: {
                        //                         suggests: [
                        //                             {
                        //                                 label: '数组添加',
                        //                                 value: `G.数组添加(e)`
                        //                             }
                        //                         ]
                        //                     }
                        //                 }
                        //             },
                        //             code2: {
                        //                 type: 'string',
                        //                 ui: {
                        //                     label: '事件2',
                        //                     widget: 'CusCodeEditor',
                        //                     widgetConfig: {
                        //
                        //                     }
                        //                 }
                        //             }
                        //             // prop1: {
                        //             //     type: 'string',
                        //             //     tag: 'div',
                        //             //     reflect: 'name',
                        //             //     reflectTpl: `L.defaultTo($VAL, '') + 's'`,
                        //             //     widgetConfig: {
                        //             //         readonly: true
                        //             //     }
                        //             //     // reflect: `CUR('code')`
                        //             // }
                        //         }
                        //     }
                        // },
                        // props: {
                        //     type: 'string',
                        //     wrap: 'em-props-item',
                        //     ui: {
                        //         label: '',
                        //         form_item: {
                        //             labelWidth: '0px',
                        //         },
                        //         form_item_label: {
                        //             style: 'opacity: 0;'
                        //         },
                        //         attrs: [
                        //             ['scroll-control', 'page_props'],
                        //
                        //         ],
                        //         widget: 'CusProps',
                        //         widgetConfig: {
                        //         }
                        //     }
                        // },
                        // pageProperties: {
                        //     type: 'string',
                        //     hidden: true,
                        //     computedProp: 'pagePropertiesComp',
                        //     ui: {
                        //         widgetConfig: {
                        //             type: 'textarea',
                        //             disabled: true,
                        //         }
                        //     }
                        // },
                        // beforeScript: {
                        //     type: 'string',
                        //     hidden: true,
                        //     ui: {
                        //         // widget: 'CodeJsEditor',
                        //         widgetConfig: {
                        //             type: 'textarea',
                        //             // mode: 'text/html'
                        //         }
                        //     }
                        // },
                        // onInited: {
                        //     type: 'string',
                        //     wrap: 'em-props-item',
                        //     EmHidden: true,
                        //     ui: {
                        //         form_item: {
                        //             labelWidth: '0px',
                        //         },
                        //         form_item_label: {
                        //             style: 'opacity: 0;'
                        //         },
                        //         label: '当初始化',
                        //         attrs: [
                        //             ['scroll-control', 'page_onInited'],
                        //         ],
                        //         widget: 'CodeJsEditor',
                        //         // widget: 'JsonCodeEditor',
                        //         widgetConfig: {
                        //             enums: "ROOT_STATE('tools.constVars_processSteps', [])",
                        //             style: {
                        //                 height: '300px'
                        //             }
                        //             // mode: 'text/html'
                        //         }
                        //     }
                        // },
                    }
                },
                computed: {
                    pagePropertiesComp: "A.getBeforeScript(MODEL('props'))",
                    doubled: "MODEL('events[0].name', '')",
                    layoutSlotArrComputed: "A.slotArrToStr(MODEL('layoutSlotArr'))",
                    processes: `map(MODEL('events', []), v => v.name)`
                }
            }]
        }, args: {src: 'comformscr2.twig'}
    }
}
