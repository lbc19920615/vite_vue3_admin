import {createDataProps} from "@/plugins/z-frame/components/ZEchartsEasy/configs/common/data";

export function createEchartSeries() {
  return {
    type: 'array',
    ui: {
      label: '系列',
    },
    items: {
      type: 'object',
      properties: {
        // type
        type: {
          type: 'string',
          noticeIframe: 'https://echarts.apache.org/examples/zh/index.html',
          ui: {
            label: '系列类型',
            widget: 'CusSuggest',
            widgetConfig: {
              mode: 'select',
              suggest: [
                {
                  label: '折线图',
                  value: 'line',
                },
                {
                  label: '柱状图',
                  value: 'bar',
                },
              ]
            }
          }
        },
        // data
        data: createDataProps(),
        smooth: {
          type: 'boolean',
          rules: {
            type: 'any'
          }
        },
        areaStyle: {
          type: 'object',
          properties: {
            color: {
              type: 'string',
              ui: {
                widget: 'CusColorPicker',
                widgetConfig: {
                  showAlpha: true
                },
              }
            }
          }
        }
      }
    }
  }
}
