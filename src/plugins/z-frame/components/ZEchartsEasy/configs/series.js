export function createEchartSeries() {
  return {
    type: 'array',
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
          tag: 'el-scrollbar',
          ui: {
            label: 'DATA',
            attrs: [
              [':height', '300'],
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
