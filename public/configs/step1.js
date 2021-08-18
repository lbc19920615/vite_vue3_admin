export default {
    name: 'process-step1',
    init: {
        def: {
            ui: {
                attrs: [
                    ['label-width', '100px']
                ],
            },
            service: 'serviceA',
            constants: {
                types: [
                    {
                        label: '事假',
                        value: 'sds1212121sds'
                    },
                    {
                        label: '病假',
                        value: 'sds121212ds'
                    }
                ]
            },
            row: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        ui: {
                            label: '姓名'
                        },
                        rules: {
                            "required": true,
                        }
                    },
                    controls: {
                        type: 'string',
                        ui: {
                            hidden: "lt(LENGTH(MODEL('name', '')), 1)",
                        },
                        debug: "LENGTH(MODEL('name', ''))"
                    },
                    select1: {
                        type: 'string',
                        ui: {
                            label: '请假类型',
                            widget: 'CusSelect',
                            widgetConfig: {
                                enums: "ROOT_STATE('sapp.constants.types', [])",
                            },
                            events: {
                                'change': 'cus_select:change'
                            }
                        },
                        rules: {
                            "required": true,
                        }
                    },
                    linkName: {
                        type: 'string',
                        computedProp: 'doubled',
                    },
                    level1: {
                        type: "array",
                        items: {
                            type: 'object',
                            properties: {
                                level1Name1: {
                                    type: 'string',
                                    ui: {}
                                },
                                level1Name2: {
                                    type: 'string',
                                    ui: {}
                                }
                            }
                        }
                    },
                    startTime: {
                        type: 'string',
                        ui: {
                            label: '开始时间',
                            widget: 'CusDateTimePicker',
                            widgetConfig: {
                                type: "datetime",
                                valueFormat: 'YYYY-MM-DD HH:mm:ss',
                            }
                        }
                    },
                    endTime: {
                        type: 'string',
                        ui: {
                            label: '结束时间',
                            widget: 'CusDateTimePicker',
                            widgetConfig: {
                                type: "datetime",
                                valueFormat: 'YYYY-MM-DD HH:mm:ss'
                            }
                        }
                    },
                    between: {
                        type: 'number',
                        computedProp: 'hours',
                        ui: {
                            label: '时长(小时)',
                        }
                    },
                    // vantTime: {
                    //   type: 'string',
                    //     ui: {
                    //     label: 'vant时间',
                    //       widget: 'VantDateTimePicker',
                    //       widgetConfig: {
                    //       drawer: {
                    //         direction: 'btt',
                    //           title: "我是标题"
                    //       },
                    //       picker: {
                    //         type: "year-month",
                    //           title: "选择年月"
                    //       }
                    //     }
                    //   }
                    // },
                    descripton: {
                        type: 'string',
                        ui: {
                            label: '请假事由',
                            widgetConfig: {
                                type: "textarea",
                                rows: 3
                            }
                        }
                    },
                }
            },
            computed: {
                doubled: "MODEL('name', '') + ',s'",
                selectedOption: "find(ROOT_STATE('sapp.constants.types', []), ['value', MODEL('select1', '')])",
                fullRange: "filter([MODEL('startTime', ''), MODEL('endTime', '')])",
                hours: "ZY_floor(ZY_hour_between_2_date(MODEL('startTime', ''), MODEL('endTime', '')), 1)"
            }
        },
        args: {
            src: 'comformscr.twig'
        }
    }
}
