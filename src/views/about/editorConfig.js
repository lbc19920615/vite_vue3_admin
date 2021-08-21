let baseConfig = function (def = {}, computed = {}, {defaultVal = {}} = {}) {
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
      src: 'comformscr.twig'
    }
  }
}
    `
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
                    label: '名称'
                },
            },
            parts: {
                type: 'array',
                items: {
                    type: "object",
                    properties: {
                        uis: {
                            type: 'string',
                            ui: {
                                label: 'UI',
                                widget: 'JsonCodeEditor',
                                widgetConfig: {
                                    type: "textarea",
                                    rows: 10
                                }
                            }
                        },
                        properties: {
                            type: 'string',
                            ui: {
                                label: 'SCHEMA',
                                widget: 'JsonCodeEditor',
                                widgetConfig: {
                                    type: "textarea",
                                    rows: 10
                                }
                            }
                        },
                    }
                }
            },
        }
    }, {
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
            name: {
                type: 'string',
                ui: {
                    label: '名称'
                },
            },
            items: {
                type: 'array',
                "items": {
                    "type": "object",
                    "properties": {
                        id: {
                            type: 'string',
                            ui: {
                                label: 'ID'
                            },
                        },
                        w: {
                            type: 'string',
                            ui: {
                                label: 'WIDTH'
                            },
                        },
                        h: {
                            type: 'string',
                            ui: {
                                label: 'HEIGHT'
                            },
                        },
                    }
                }
            },
        }
    }, {
        doubled: "MODEL('name', '') + ',s'"
    },
        {
            defaultVal: defaultVal
        }
    )
}