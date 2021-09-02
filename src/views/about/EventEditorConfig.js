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
                                    disabled: true,
                                    type: 'textarea'
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
                                                ]
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
                                                ]
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
                    doubled: "MODEL('events[0].name', '')",
                    layoutSlotArrComputed: "A.slotArrToStr(MODEL('layoutSlotArr'))"
                }
            }]
        }, args: {src: 'comformscr2.twig'}
    }
}
