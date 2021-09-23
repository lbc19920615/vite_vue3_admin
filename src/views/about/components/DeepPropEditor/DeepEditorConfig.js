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
                        reflect: {
                            type: 'string',
                            ui: {
                                label: '反射',
                                widgetConfig: {
                                    disabled: true
                                }
                            },
                            // rules: {
                            //     type: 'boolean'
                            // }
                            reflect: 'reflectTpl',
                            reflectTpl: "$VAL ? 'true': 'false'"
                        },
                        reflectTpl: {
                            type: 'string',
                            ui: {
                                label: '反射模板'
                            }
                        },
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
                                widget: {
                                    type: 'string',
                                    ui: {
                                        label: 'widget',
                                        widgetConfig: {
                                            disabled: true,
                                        }
                                    },
                                    // computedProp: 'swidget',
                                    // reflect: 'widget2',
                                    // reflectTpl: 'A.getWidgetEditor($VAL, "widget")'
                                },
                                widgetConfig: {
                                    type: 'string',
                                    ui: {
                                        label: 'widgetConfig',
                                        // widget: 'CodeJsEditor',
                                        // widget: 'JsonCodeEditor',
                                        widgetConfig: {
                                            type: 'textarea',
                                            disabled: true,
                                            style: {}
                                        }
                                    },
                                    // computedProp: 'swidget_config',
                                },
                            }
                        },
                        rules: {
                            type: 'string',
                            hidden: true,
                            ui: {
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
                    swidget: `A.getWidgetEditor(MODEL('ui.widget2'), 'widget')`,
                    swidget_config: `A.getWidgetExt(A.getWidgetEditor(MODEL('ui.widget2'), 'widgetConfig'), MODEL('ui.widgetExt'))`
                }
            }]
        }, args: {src: 'comformscr2.twig'}
    }
}
