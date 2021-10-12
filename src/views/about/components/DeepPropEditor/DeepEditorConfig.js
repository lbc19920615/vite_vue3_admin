export default {
    name: 'process-step1',
    defaultVal: {
        form2: {
            type: '',
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
                        // test: {
                        //   type: 'string',
                        //   hidden: true
                        // },
                        type: {
                            type: 'string',
                            ui: {
                                label: '类型',
                                // widget: 'CusSelect',
                                widget: 'CusSuggest',
                                widgetConfig: {
                                    enums: "ROOT_STATE('tools.propTypes', [])",
                                },
                                events: {
                                }
                            },
                        },
                        computedProp: {
                            type: 'string',
                            ui: {
                                label: '计算属性',
                            }
                        },
                        reflect: {
                            type: 'string',
                            ui: {
                                label: '反射',
                                widgetConfig: {
                                    // disabled: true
                                }
                            },
                        },
                        reflectTpl: {
                            type: 'string',
                            ui: {
                                label: '反射模板'
                            }
                        },
                        ui2: {
                            type: 'string',
                            ui: {
                                label: 'UI配置',

                                widget: 'CusStyle'
                            }
                        },
                        // ui2: {
                        //     type: 'string',
                        //     ui: {
                        //         widget: 'CusUI',
                        //         label: 'UI编辑',
                        //     }
                        // },
                        // ui_ext: {
                        //     type: 'string',
                        //     reflect: 'ui2',
                        //     reflectTpl: 'A.parseUIObj($VAL)',
                        //     ui: {
                        //         // styles: [
                        //         //     ['height', 0],
                        //         //     ['overflow', 'hidden'],
                        //         // ],
                        //         label: 'UI',
                        //         widgetConfig: {
                        //             type: 'textarea',
                        //             disabled: true,
                        //         }
                        //     }
                        // },
                        ui: {
                            type: 'object',
                            ui: {
                              label: "UI"
                            },
                            properties: {
                                widgetFormat: {
                                    type: 'string',
                                    ui: {
                                        label: 'widget格式化'
                                    }
                                },
                                label: {
                                    type: 'string',
                                    ui: {
                                        label: 'LABEL'
                                    }
                                },
                                widget2: {
                                    type: 'string',
                                    ui: {
                                        label: '组件配置',
                                        widget: 'CusWidgetEditor',
                                        widgetConfig: {
                                            enums: "[]",
                                        }
                                    }
                                },
                                widgetExt: {
                                    type: 'string',
                                    ui: {
                                        label: 'EXT配置',
                                        widget: 'CodeJsEditor',
                                        // widget: 'JsonCodeEditor',
                                        widgetConfig: {
                                            // disabled: true,
                                            style: {}
                                        }
                                    },
                                },
                                styles: {
                                    type: 'string',
                                    computedProp: 'ui2_styles',
                                    ui: {
                                        widgetConfig: {
                                            type: 'textarea',
                                            disabled: true
                                            // style: {height: '200px'}
                                        }
                                    },
                                    rules: {
                                        type: 'any'
                                    }
                                }
                            }
                        },
                        rules: {
                            type: 'string',
                            // hidden: true,
                            computedProp: 'srules',
                            ui: {
                                attrs: [
                                    ['style', 'height: 0; overflow: hidden']
                                ],
                                label: 'RULES',
                                // widget: 'JsonCodeEditor',
                                // widget: 'CodeJsEditor',
                                widgetConfig: {
                                    type: 'textarea',
                                    disabled: true
                                    // style: {height: '200px'}
                                }
                            }
                        },
                        rulesArr: {
                            type: 'array',
                            ui: {
                                label: '校验规则'
                            },
                            items: {
                                type: "object",
                                properties: {
                                    value: {
                                        type: 'string',
                                        ui: {
                                            widget: 'CusFormRules',
                                            widgetConfig: {
                                            }
                                        },
                                    },
                                }
                            }
                        }
                    }
                },
                computed: {
                    // doubled: "MODEL('name', '') + ',s'",
                    srules: `A.getRulesFromRulesArr(MODEL('rulesArr'))`,
                    ui2_styles: `A.get_ui2_styles(MODEL('ui2'))`
                }
            }]
        }, args: {src: 'comformscr2.twig'}
    }
}
