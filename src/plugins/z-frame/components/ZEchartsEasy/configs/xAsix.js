export function createEchartXAxis() {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        ui: {
          label: '坐标轴名称'
        }
      },
      type: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#xAxis.type',
        ui: {
          label: '坐标轴类型',
          widget: 'CusSuggest',
          widgetConfig: {
            suggest: [
              {
                label: 'value',
                value: 'value',
              },
              {
                label: 'category',
                value: 'category',
              },
              {
                label: 'time',
                value: 'time',
              },
              {
                label: 'log',
                value: 'log',
              }
            ]
          }
        }
      },
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
