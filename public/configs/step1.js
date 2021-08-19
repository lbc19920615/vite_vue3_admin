export default {
  name: 'process-step1',
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
                  label: '姓名',
                  column: 'auto',
                },
              },
              controls: {
                type: 'string',
                ui: {
                  hidden: "lt(LENGTH(MODEL('name', '')), 1)",
                  column: 'auto',
                },
                debug: "LENGTH(MODEL('name', ''))"
              },
              select1: {
                type: 'string',
                ui: {
                  label: '请假类型',
                  column: 'auto',
                  widget: 'CusSelect',
                  widgetConfig: {
                    enums: "ROOT_STATE('sapp.constants.types', [])",
                  },
                  events: {
                    'change': 'cus_select:change'
                  }
                },
              },
              linkName: {
                type: 'string',
                computedProp: 'doubled',
                ui: {
                  column: 'auto',
                }
              },
              startTime: {
                type: 'string',
                ui: {
                  label: '开始时间',
                  column: 'auto',
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
                  column: 'auto',
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
                  column: 'auto',
                },
                rules: {
                  type: 'number',
                }
              },
            }
          },
          service: 'serviceA',
          computed: {
            doubled: "MODEL('name', '') + ',s'",
            // selectedOption: "find(ROOT_STATE('sapp.constants.types', []), ['value', MODEL('select1', '')])",
            // fullRange: "filter([MODEL('startTime', ''), MODEL('endTime', '')])",
            hours: "ZY_floor(ZY_hour_between_2_date(MODEL('startTime', ''), MODEL('endTime', '')), 1)"
          }
        },
        {
          type: "table",
          name: "table",
          service: 'serviceD',
          def: {
            type: 'object',
            ui: {
              attrs: [
                ['label-width', '100px']
              ],
            },
            properties: {
              page: {
                type: 'number',
                ui: {
                },
                rules: {
                  type: 'number',
                }
              },
              limit: {
                type: 'number',
                ui: {
                },
                rules: {
                  type: 'number',
                }
              },
              total: {
                type: 'number',
                ui: {
                },
                rules: {
                  type: 'number',
                }
              },
              records: {
                type: "array",
                items: {
                  type: 'object',
                  properties: {
                    level1Name1: {
                      type: 'string',
                      ui: {
                        label: "level1"
                      }
                    },
                    level1Name2: {
                      type: 'string',
                      ui: {
                        label: "level2"
                      }
                    },
                    level1Name3: {
                      type: 'string',
                      ui: {
                        label: "level3"
                      }
                    },
                  }
                }
              },
            }
          }
        }
      ],
    },
    args: {
      src: 'comformscr.twig'
    }
  }
}
