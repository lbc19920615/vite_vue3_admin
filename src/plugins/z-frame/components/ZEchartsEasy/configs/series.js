export function createEchartSeries() {
  return {
    type: 'array',
    ui: {
      label: '系列'
    },
    items: {
      type: 'object',
      properties: {
        // type
        type: {
          type: 'string',
          ui: {
            label: '系列类型',
            widget: 'CusSuggest',
            widgetConfig: {
              suggest: [
                {
                  label: 'line',
                  value: 'line',
                },
              ]
            }
          }
        },
        // data
        data: {
          type: 'array',
          tag: 'my-vue-tab',
          con_tag: 'my-vue-tab-pane',
          ui: {
            label: '数据',
            attrs: [
              [':height', '300'],
            ],
            class: [
              'a-space-mb-10'
            ],
            conAttrs: [
              {
                prefixValue: '"数据"+',
                handler: ['c', 'return [":name", c.indexKey]']
              }
            ],
            conClass: [
            ]
          },
          items: {
            type: 'object',
            properties: {
              value: {
                type: 'string',
                ui: {
                  form_item: {
                    ['label-width']: '90px'
                  },
                }
              },
            }
          }
        }
      }
    }
  }
}
