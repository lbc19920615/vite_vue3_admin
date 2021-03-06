import {createAbleProp} from "@/plugins/z-frame/CusBaseEditor";

export default {
    name: 'process-step1',
    defaultVal: {
        form2: {
            type: '',
            ui: {
                type: '',
                label: '',
                // widget: '',
                widgetConfig: '{}',
                form_item: {

                }
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
                                    inputStyle: 'width: 350px',
                                    enums: "ROOT_STATE('tools.propTypes', [])",
                                    mode: 'select',
                                },
                                events: {
                                }
                            },
                        },
                        sub_type: {
                            type: 'string',
                            ui: {
                                label: '子类型',
                                // widget: 'CusSelect',
                                widget: 'CusSuggest',
                                widgetConfig: {
                                    inputStyle: 'width: 350px',
                                    enums: "ROOT_GETTERS('subTypes', [MODEL('type', '')])",
                                    mode: 'select',
                                },
                                events: {
                                }
                            },
                        },
                        computedProp: {
                            type: 'string',
                            ui: {
                                label: '计算属性',
                                widget: 'CusSuggest',
                                widgetConfig: {
                                    // mode: 'select',
                                    inputStyle: 'width: 350px',
                                    enums: "ROOT_GETTERS('dOptions', ['DEEP_COMPUTED_OPTIONS_TEMP'])",
                                },
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
                        wrap_start: {
                            type: 'string',
                            wrap_start: '<el-row>',
                            ui: {
                                styles:[
                                  ['flex', 1]
                                ],
                                label: '前置标签'
                            }
                        },
                        wrap_end: {
                            type: 'string',
                            wrap_end: '</el-row>',
                            ui: {
                                styles:[
                                    ['flex', 1]
                                ],
                                label: '后置标签'
                            }
                        },
                        tag: {
                            type: 'string',
                            ui: {
                                label: '标签'
                            }
                        },
                        ui: {
                            type: 'object',
                            ui: {
                              label: "UI"
                            },
                            properties: {
                                label: {
                                    type: 'string',
                                    ui: {
                                        label: '标题'
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
                                styles: {
                                    type: 'string',
                                    computedProp: 'ui2_styles',
                                    ui: {
                                        styles: [
                                            ['height', 0],
                                            ['overflow', 'hidden'],
                                        ],
                                        widgetConfig: {
                                            type: 'textarea',
                                            disabled: true
                                            // style: {height: '200px'}
                                        }
                                    },
                                    rules: {
                                        type: 'any'
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
                                            style: {
                                                height: '150px'
                                            }
                                        }
                                    },
                                },
                                widgetFormat: {
                                    type: 'string',
                                    ui: {
                                        label: 'widget格式化'
                                    }
                                },
                                attrs2: {
                                    type: 'array',
                                    ui: {
                                        label: 'PROP属性',
                                    },
                                    items: {
                                        type: 'object',
                                        properties: {
                                            label: {
                                                type: 'string',
                                            },
                                            value: {
                                                type: 'string',
                                            }
                                        }
                                    }
                                },
                                attrs: {
                                    type: 'string',
                                    ui: {
                                        styles: [
                                            ['height', 0],
                                            ['overflow', 'hidden'],
                                        ],
                                        widgetConfig: {
                                            type: 'textarea',
                                            disabled: true
                                        }
                                    },
                                    computedProp: 'attrs_com',
                                    rules: {
                                        type: 'any'
                                    }
                                },
                                form_item: {
                                    type: 'object',
                                    ui: {
                                        label: "form元素属性"
                                    },
                                    properties: {
                                        name: {
                                            type: 'string',
                                            ui: {
                                                label: '标题'
                                            }
                                        },
                                        required: createAbleProp({
                                            label: '必要'
                                        })
                                    }
                                }
                            }
                        },
                        ui2: {
                            type: 'string',
                            ui: {
                                label: '样式配置',
                                widget: 'CusStyle'
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
                                label: '验证规则',
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
                                label: '校验规则',
                            },
                            items: {
                                type: "object",
                                properties: {
                                    value: {
                                        type: 'string',
                                        ui: {
                                            form_item: {
                                                labelWidth: '70px'
                                            },
                                            // attrs: [
                                            //     ['label-width', '70px']
                                            // ],
                                            label: ' ',
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
                    ui2_styles: `A.get_ui2_styles(MODEL('ui2'))`,
                    attrs_com: `A.parseOptions2Entries(MODEL("ui.attrs2"))`
                }
            }]
        }, args: {src: 'comformscr2.twig'}
    }
}
