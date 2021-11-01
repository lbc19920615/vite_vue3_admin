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
        name: {
          type: 'string'
        },
        radius: {
          type: 'string'
        },
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
                {
                  label: '饼状图',
                  value: 'pie',
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
              noticeFun: [
                'options', `
                let pathArr = options.pathArr;
                let p = pathArr.slice(0,2);
                let m = options.getData(p);
                let type = m?.type ?? 'line' 
      
                return 'https://echarts.apache.org/zh/option.html#series-'+type+'.areaStyle.color'`
              ],
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
