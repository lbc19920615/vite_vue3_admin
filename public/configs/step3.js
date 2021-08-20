export default {
  name: 'process-step3',
  init: {
    def: {
      constants: {
      },
      parts: [
        {
          type: "form",
          name: "form",
          serviceTpl: {
            def: {},
            args: {
              src: "bservice.twig"
            }
          },
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
                }
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
              },
              prop1: {
                type: 'string',
                ui: {
                  widgetConfig: {
                    type: "textarea",
                    rows: 3
                  }
                }
              },
              prop2: {
                type: 'string',
                ui: {
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
          }
        }
      ],
    },
    args: {
      src: 'comformscr.twig'
    }
  }
}
