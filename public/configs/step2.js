export default {
  name: 'process-step2',
  init: {
    def: {
      constants: {
      },
      parts: [
        {
          type: "form",
          service: 'serviceC',
          def: {
            type: 'object',
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
          }
        }
      ],
    },
    args: {
      src: 'comformscr.twig'
    }
  }
}
