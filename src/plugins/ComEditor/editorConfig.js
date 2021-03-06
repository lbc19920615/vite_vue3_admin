export let baseConfig = function (def = {}, computed = {}, {defaultVal = {}} = {}) {
    let defStr = ZY.JSON5.stringify(def)
    let computedStr = ZY.JSON5.stringify(computed)
    return `
    export default {
  name: 'form-editor',
  defaultVal: ${ZY.JSON5.stringify(defaultVal)},
  init: {
    def: {
      constants: {
      },
      parts: [
        {
          type: "form",
          name: "form2",
          serviceTpl: {
            def: {},
            args: {
              src: "bservice.twig"
            }
          },
          def: ${defStr},
          computed: ${computedStr}
        },
      ],
    },
    args: {
      src: 'comformscr2.twig'
    }
  }
}
    `
}

export let createEditorConfig = function ( { properties = {}, computed = {} } = {}, defaultVal = {}) {
    return baseConfig({
        type: 'object',
        ui: {
            attrs: [
                ['label-width', '100px']
            ],
        },
        properties: {
            ...properties
        },
    }, {
        ...computed
    },{
        defaultVal: defaultVal
    })
}

export let formEditorConfig = function (defaultVal = {}) {
    return baseConfig( {
        type: 'object',
        ui: {
            attrs: [
                ['label-width', '100px']
            ],
        },
        properties: {
            name: {
                type: 'string',
                ui: {
                    label: '名称',
                },
            },
            // parts: {
            //     type: 'array',
            //     items: {
            //         type: "object",
            //         properties: {
            //             type: {
            //                 type: 'string',
            //                 ui: {
            //                     label: '类型',
            //                     widget: 'CusSelect',
            //                     widgetConfig: {
            //                         enums: "ROOT_STATE('tools.partOptions', [])",
            //                     },
            //                     events: {
            //                     }
            //                 },
            //             },
            //             name: {
            //                 type: 'string',
            //             },
            //             ui: {
            //                 type: 'string',
            //                 ui: {
            //                     label: 'UI',
            //                     widget: 'JsonCodeEditor',
            //                     widgetConfig: {
            //                         style: {
            //                             height: "100px",
            //                         }
            //                     }
            //                 }
            //             },
            //             props: {
            //                 type: 'string',
            //                 ui: {
            //                     widget: 'CusProps',
            //                     widgetConfig: {
            //                     }
            //                 }
            //             },
            //             properties2: {
            //                 type: 'string',
            //                 reflect: 'props',
            //                 reflectTpl: `A.getProps($VAL)`,
            //                 ui: {
            //                     widgetConfig: {
            //                         type: 'textarea'
            //                     }
            //                 }
            //             },
            //             properties: {
            //                 type: 'string',
            //                 ui: {
            //                     label: 'SCHEMA',
            //                     widget: 'JsonCodeEditor',
            //                     widgetConfig: {
            //                         style: {
            //                             height: "500px",
            //                         }
            //                     }
            //                 }
            //             },
            //             defaultVal: {
            //                 type: 'string',
            //                 ui: {
            //                     label: 'DEFAULT',
            //                     widget: 'JsonCodeEditor',
            //                     widgetConfig: {
            //                         style: {
            //                             height: "200px",
            //                         }
            //                     }
            //                 }
            //             },
            //         }
            //     }
            // },
        }
    }, {
        // ['cur_deep_props']: `A.getProps(MODEL('parts[0].props'))`,
        doubled: "MODEL('name', '') + ',s'"
    }, {
        defaultVal
    })
}

export let rowEditorConfig = function (defaultVal = {}) {
    return baseConfig( {
        type: 'object',
        ui: {
            attrs: [
                ['label-width', '100px']
            ],
        },
        properties: {
            // name: {
            //     type: 'string',
            //     ui: {
            //         label: '名称'
            //     },
            // },
            attrs: {
              type: 'object',
                ui: {
                    label: '属性'
                },
                properties:  {
                    name: {
                        type: 'string',
                        ui: {
                            label: '名称'
                        },
                    },
                    styles: {
                        type: 'string',
                        computedProp: 'ui2_styles',
                        ui: {
                            styles: [
                                // ['height', 0],
                                // ['overflow', 'hidden'],
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
                    ui2: {
                        type: 'string',
                        ui: {
                            label: '样式配置',
                            widget: 'CusStyle',
                            widgetConfig: {
                                mounted: true
                            }
                        }
                    },
                    attrs: {
                        type: 'string',
                        ui: {
                            label: '属性配置',
                            widget: 'CusAttr',
                            widgetConfig: {
                                mounted: true
                            }
                        }
                    },
                }
            },
            items: {
                type: 'array',
                ui: {
                    label: '子元素'
                },
                "items": {
                    "type": "object",
                    "properties": {
                        id: {
                            type: 'string',
                            ui: {
                                label: 'ID',
                                styles: [
                                    ['height', 0],
                                    ['overflow', 'hidden'],
                                ],
                            },
                        },
                        w: {
                            type: 'string',
                            ui: {
                                label: '长度',
                                widget: 'unit-input',
                            },
                            rules: {
                                type: 'any'
                            }
                        },
                        h: {
                            type: 'string',
                            ui: {
                                label: '高度',
                                widget: 'unit-input',
                            },
                            rules: {
                                type: 'any'
                            }
                        },
                    }
                }
            },
        }
    }, {
        doubled: "MODEL('name', '') + ',s'",
        ui2_styles: `A.get_ui2_styles(MODEL('attrs.ui2'))`,
    },
        {
            defaultVal: defaultVal
        }
    )
}
