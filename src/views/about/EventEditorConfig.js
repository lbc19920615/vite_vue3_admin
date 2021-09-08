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
                    ui: {attrs: [['label-width', '150px']]},
                    properties: {
                        name: {
                            type: 'string',
                            ui: {
                                attrs: [
                                    ['scroll-control', 'page_name'],
                                ],
                                widget: 'CusSuggest',
                                widgetConfig: {
                                    suggest: [
                                        {
                                            label: '爱你',
                                            value: 'sdsds',
                                        }
                                    ]
                                }
                            }
                        },
                        layoutSlotArr: {
                            type: 'array',
                            tag: 'my-vue-tab',
                            con_tag: 'my-vue-tab-pane',
                            ui: {
                                attrs: [
                                    ['scroll-control', 'page_slotArr'],
                                ],
                                conAttrs: [
                                    {
                                        prefixValue: '"slot"+',
                                        handler: ['c', 'return [":name", c.indexKey]']
                                    }
                                ],
                            },
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        ui: {
                                            widget: 'CusSuggest',
                                            widgetConfig: {
                                                suggest: [
                                                    {
                                                        label: 'Form After',
                                                        value: 'form_after',
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    value: {
                                        type: 'string',
                                        ui: {
                                            widget: 'CodeJsEditor',
                                            widgetConfig: {
                                                mode: 'text/html'
                                            }
                                        }
                                    },
                                }
                            }
                        },
                        layoutSlots: {
                            type: 'string',
                            computedProp: 'layoutSlotArrComputed',
                            ui: {
                                widgetConfig: {
                                    disabled: true,
                                    type: 'textarea'
                                }
                            }
                        },
                        props: {
                            type: 'string',
                            ui: {
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
                                attrs: [
                                    ['scroll-control', 'page_onInited'],
                                ],
                                widget: 'CodeJsEditor',
                                // widget: 'JsonCodeEditor',
                                widgetConfig: {
                                    enums: "ROOT_STATE('tools.constVars.processSteps', [])",
                                    style: {
                                        height: '300px'
                                    }
                                    // mode: 'text/html'
                                }
                            }
                        },
                        forms: {
                            type: 'array',
                            ui: {
                                attrs: [
                                    ['scroll-control', 'page_forms'],
                                ],
                                class: [
                                    // 'a-space-mb-20'
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
                                        ui: {
                                            widget: 'CusSuggest',
                                            widgetConfig: {
                                                enums: "ROOT_STATE('tools.constVars.processSteps', [])",
                                            }
                                        }
                                    },
                                    value: {
                                        type: 'string',
                                        ui: {
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
                              attrs: [
                                  ['scroll-control', 'page_events'],
                                  ['slotPrefix', 'event'],
                              ],
                              conAttrs: [
                                  // ['class', 'my-tab'],
                                  {
                                      prefixValue: '"event"+',
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
                                            widget: 'CusSuggest',
                                            widgetConfig: {
                                                enums: "ROOT_STATE('tools.constVars.eventSuggests', [])",
                                            }
                                        }
                                    },
                                    code: {
                                        type: 'string',
                                        tag: 'div',
                                        ui: {
                                            widget: 'CodeJsEditor',
                                            widgetConfig: {

                                            }
                                        }
                                    },
                                    prop1: {
                                        type: 'string',
                                        tag: 'div',
                                        reflect: 'name',
                                        reflectTpl: `L.defaultTo($VAL, '') + 's'`,
                                        widgetConfig: {
                                            readonly: true
                                        }
                                        // reflect: `CUR('code')`
                                    }
                                }
                            }
                        }
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
