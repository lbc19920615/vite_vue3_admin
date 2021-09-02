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
                                                        label: '爱你',
                                                        value: 'sdsds',
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
                                    readonly: true,
                                    type: 'textarea'
                                }
                            }
                        },
                        props: {
                            type: 'string',
                            ui: {
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
                                    readonly: true,
                                }
                            }
                        },
                        beforeScript: {
                            type: 'string',
                            ui: {
                                widget: 'CodeJsEditor',
                                widgetConfig: {
                                    // mode: 'text/html'
                                }
                            }
                        },
                        onInited: {
                            type: 'string',
                            ui: {
                                widget: 'CodeJsEditor',
                                // widget: 'JsonCodeEditor',
                                widgetConfig: {
                                    style: {
                                        height: '300px'
                                    }
                                    // mode: 'text/html'
                                }
                            }
                        },
                        forms: {
                            type: 'array',
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
                                                        label: '爱你',
                                                        value: 'sdsds',
                                                    }
                                                ],
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
                                                        label: '爱你',
                                                        value: 'sdsds',
                                                    }
                                                ],
                                                enums: "ROOT_STATE('tools.eventSuggests', [])",
                                            }
                                        }
                                    },
                                    code: {
                                        type: 'string',
                                        ui: {
                                            widget: 'CodeJsEditor',
                                            widgetConfig: {

                                            }
                                        }
                                    },
                                    prop1: {
                                        type: 'string',
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
