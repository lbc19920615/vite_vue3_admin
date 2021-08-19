export default {
  name: 'process-step2',
  init: {
    def: {
      constants: {
      },
      parts: [
        {
          type: "form",
          name: "form",
          def: {
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
                  // column: 'auto',
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
                },
                rules: {
                  type: 'number',
                }
              },
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
          service: 'serviceA',
          computed: {
            doubled: "MODEL('name', '') + ',s'",
            hours: "ZY_floor(ZY_hour_between_2_date(MODEL('startTime', ''), MODEL('endTime', '')), 1)"
          }
        },
      ],
    },
    args: {
      src: 'comformscr.twig'
    }
  }
}
