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
                        name: {
                            type: 'string',
                            ui: {
                                label: '页面名称',
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
                        layoutSlotArr: {
                            type: 'array',
                            tag: 'my-vue-tab',
                            con_tag: 'my-vue-tab-pane',
                            wrap: 'section',
                            ui: {
                                label: 'Slot',
                                attrs: [
                                    ['scroll-control', 'page_slotArr'],
                                ],
                                conAttrs: [
                                    {
                                        prefixValue: '"片段"+',
                                        handler: ['c', 'return [":name", c.indexKey]']
                                    }
                                ],
                                conClass: [
                                    'a-space-mb-20'
                                ]
                            },
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        tag: 'div',
                                        ui: {
                                            label: '片段名',
                                            widget: 'CusSuggest',
                                            widgetConfig: {
                                                useLabelTip: 'labelTip',
                                                enums: "ROOT_STATE('tools.slotTypes', [])",
                                                listStyle: 'height: 300px; overflow: auto;'
                                            }
                                        }
                                    },
                                    // value2: {
                                    //     type: 'string',
                                    //     tag: 'div',
                                    //     ui: {
                                    //         widget: 'CodeJsEditor',
                                    //         widgetConfig: {
                                    //             mode: 'text/html'
                                    //         }
                                    //     }
                                    // },
                                    layouts: {
                                        type: 'string',
                                        tag: 'div',
                                        ui: {
                                            label: 'xml编辑',
                                            widget: 'CusLayoutEditor',
                                            widgetConfig: {
                                                suffix: 'slayout',
                                                mode: 'xml'
                                            }
                                        }
                                    },
                                    value: {
                                        type: 'string',
                                        reflect: 'layouts',
                                        reflectTpl: `A.buildXML($VAL)`,
                                        ui: {
                                            widget: 'CusXmlShower',
                                            widgetConfig: {
                                                type: 'textarea',
                                                disabled: true,
                                            }
                                        }
                                    },
                                    // propsCopy: {
                                    //     type: 'string',
                                    //     reflect: 'props',
                                    //     reflectTpl: `A.propsToJSON5($VAL, 'props')`,
                                    //     ui: {
                                    //        widgetConfig: {
                                    //            readonly: true
                                    //        }
                                    //     }
                                    // },
                                    // props: {
                                    //     type: 'string',
                                    //     ui: {
                                    //         widget: 'CusPropsEditor',
                                    //         widgetConfig: {
                                    //             valueConfig: {
                                    //               ui: {
                                    //                   widgetConfig: {
                                    //                       type: 'textarea'
                                    //                   }
                                    //               }
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                }
                            }
                        },
                        layoutSlots: {
                            type: 'string',
                            computedProp: 'layoutSlotArrComputed',
                            hidden: true,
                            ui: {
                                widgetConfig: {
                                    disabled: true,
                                    type: 'textarea'
                                }
                            }
                        },
                        forms: {
                            type: 'array',
                            tag: 'my-vue-tab',
                            con_tag: 'my-vue-tab-pane',
                            ui: {
                                label: '表单',
                                attrs: [
                                    ['scroll-control', 'page_forms'],
                                ],
                                conAttrs: [
                                    {
                                        prefixValue: '"表单"+',
                                        handler: ['c', 'return [":name", c.indexKey]']
                                    }
                                ],
                                class: [
                                ],
                                conClass: [
                                    'a-space-mb-20'
                                ]
                            },
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        tag: 'div',
                                        ui: {
                                            label: '表单名',
                                            widget: 'CusSuggest',
                                            widgetConfig: {
                                                enums: "ROOT_STATE('tools.constVars_processSteps', [])",
                                            }
                                        }
                                    },
                                    value: {
                                        type: 'string',
                                        tag: 'div',
                                        ui: {
                                            label: '表单值',
                                            widget: 'CusForm',
                                            widgetConfig: {
                                                enums: "ROOT_STATE('tools.propTypes', [])",
                                            },
                                        }
                                    },
                                }
                            }
                        },
                        events: {
                            type: 'array',
                            tag: 'my-vue-tab',
                            con_tag: 'my-vue-tab-pane',
                            ui: {
                              label: '事件',
                              attrs:
                                [
                                  ['scroll-control', 'page_events'],
                                  ['slotPrefix', 'event'],
                              ],
                              conAttrs: [
                                  // ['class', 'my-tab'],
                                  {
                                      prefixValue: '"事件"+',
                                      // prefixValue: 'valTpl("A.test("+',
                                      // suffixValue: ' +")" )',
                                      handler: ['c', 'return [":name", c.indexKey]']
                                  }
                              ],
                                conClass: [
                                    'a-space-mb-20'
                                ]
                            },
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        tag: 'div',
                                        ui: {
                                            label: '事件名',
                                            widget: 'CusSuggest',
                                            widgetConfig: {
                                                enums: "ROOT_STATE('tools.constVars_eventSuggests', [])",
                                            }
                                        }
                                    },
                                    code: {
                                        type: 'string',
                                        tag: 'div',
                                        ui: {
                                            label: '事件处理代码',
                                            widget: 'CodeJsEditor',
                                            widgetConfig: {

                                            }
                                        }
                                    },
                                    // prop1: {
                                    //     type: 'string',
                                    //     tag: 'div',
                                    //     reflect: 'name',
                                    //     reflectTpl: `L.defaultTo($VAL, '') + 's'`,
                                    //     widgetConfig: {
                                    //         readonly: true
                                    //     }
                                    //     // reflect: `CUR('code')`
                                    // }
                                }
                            }
                        },
                        props: {
                            type: 'string',
                            ui: {
                                label: '&nbsp;',
                                attrs: [
                                    ['scroll-control', 'page_props'],
                                ],
                                widget: 'CusProps',
                                widgetConfig: {
                                }
                            }
                        },
                        pageProperties: {
                            type: 'string',
                            hidden: true,
                            computedProp: 'pagePropertiesComp',
                            ui: {
                                widgetConfig: {
                                    type: 'textarea',
                                    disabled: true,
                                }
                            }
                        },
                        beforeScript: {
                            type: 'string',
                            hidden: true,
                            ui: {
                                // widget: 'CodeJsEditor',
                                widgetConfig: {
                                    type: 'textarea',
                                    // mode: 'text/html'
                                }
                            }
                        },
                        onInited: {
                            type: 'string',
                            ui: {
                                label: '&nbsp;',
                                attrs: [
                                    ['scroll-control', 'page_onInited'],
                                ],
                                widget: 'CodeJsEditor',
                                // widget: 'JsonCodeEditor',
                                widgetConfig: {
                                    enums: "ROOT_STATE('tools.constVars_processSteps', [])",
                                    style: {
                                        height: '300px'
                                    }
                                    // mode: 'text/html'
                                }
                            }
                        },
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
