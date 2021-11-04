import {createDataProps} from "@/plugins/z-frame/components/ZEchartsEasy/configs/common/data";
import {
  QuickBoolean,
  QuickColor,
  QuickEnums,
  QuickFloat,
  QuickNumber,
  QuickOneOrMany,
  QuickTextarea
} from "@/hooks/props";
import {
  createAlignProps, createBorderExt1Props, createBorderProps,
  createShadowProps,
  createSizeProps,
  createTextStyleCommonProps
} from "@/plugins/z-frame/components/ZEchartsEasy/configs/common";
import deepMerge from 'deepmerge'

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
        type: deepMerge(
          QuickEnums(
            [
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
          ),
          {
            noticeIframe: 'https://echarts.apache.org/zh/option.html#xAxis.type',
            ui: {
              label: '坐标轴类型',
            }
          }
        ),
        colorBy: QuickEnums([
          ['series', 'series'],
          ['data', 'data'],
        ]),
        xAxisIndex: QuickNumber(),
        yAxisIndex: QuickNumber(),
        polarIndex: QuickNumber(),
        symbol: QuickTextarea(),
        symbolSize: QuickNumber(),
        symbolRotate: QuickNumber(),
        symbolKeepAspect: QuickBoolean(),
        symbolOffset: QuickOneOrMany(),
        showSymbol: QuickBoolean(),
        legendHoverLink: QuickBoolean(),
        stack: {
          type: 'string',
        },
        radius: {
          type: 'string',
        },
        cursor: {
          type: 'string',
        },
        step: QuickBoolean(),
        label: {
          type: 'object',
          properties: {
            show: QuickBoolean(),
            position: QuickOneOrMany(),
            distance: QuickNumber(),
            rotate: QuickNumber(),
            offset: QuickOneOrMany('number'),
            ...createTextStyleCommonProps(),
            padding: QuickOneOrMany('number')
          }
        },
        endLabel: {
          type: 'object',
          properties: {
            show: QuickBoolean(),
            position: QuickOneOrMany(),
            distance: QuickNumber(),
            rotate: QuickNumber(),
            offset: QuickOneOrMany('number'),
            ...createTextStyleCommonProps(),
            padding: QuickOneOrMany('number')
          }
        },
        labelLine: {
          type: 'object',
          properties: {
            show: QuickBoolean(),
            showAbove: QuickBoolean(),
            length2: QuickNumber(),
            smooth: QuickBoolean(),
            minTurnAngle: QuickNumber(),
            lineStyle: {
              color: QuickColor(),
              width: QuickNumber(),
              type: QuickEnums([
                ['solid', 'solid'],
                ['dashed', 'dashed'],
                ['dotted', 'dotted'],
              ]),
              cap: QuickEnums([
                ['butt', 'butt'],
                ['round', 'round'],
                ['square', 'square'],
              ]),
              join: QuickEnums([
                ['bevel', 'bevel'],
                ['round', 'round'],
                ['miter', 'miter'],
              ]),
              miterLimit: QuickNumber(),
              ...createShadowProps(),
              opacity: QuickFloat(),
            }
          }
        },
        labelLayout: {
          type: 'object',
          properties: {
            moveOverlap: {
              type: 'string'
            },
            x: {
              type: 'string'
            },
            y: {
              type: 'string'
            },
            dx: QuickNumber(),
            dy: QuickNumber(),
            rotate: QuickNumber(),
            ...createSizeProps(),
            ...createAlignProps(),
            fontSize: QuickNumber(),
            draggable: QuickBoolean(),
          }
        },
        // data
        data: createDataProps(),
        itemStyle: {
          type: 'object',
          properties: {
            color: QuickColor(),
            ...createBorderProps(),
            ...createBorderExt1Props('border'),
            ...createShadowProps(),
            opacity: QuickFloat(),
          }
        },
        lineStyle: {
          type: 'object',
          properties: {
            color: QuickColor(),
            width: QuickNumber(),
            type: QuickEnums(
              [
                {
                  label: 'solid',
                  value: 'solid',
                },
                {
                  label: 'dashed',
                  value: 'dashed',
                },
                {
                  label: 'dotted',
                  value: 'dotted',
                },
                ]
            ),
            ...createBorderExt1Props(),
            ...createShadowProps(),
            opacity: QuickFloat(),
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
            },
            origin: QuickEnums(
              [
                {
                  label: 'auto',
                  value: 'auto',
                },
                {
                  label: 'start',
                  value: 'start',
                },
                {
                  label: 'end',
                  value: 'end',
                },
              ]
            ),
            ...createShadowProps(),
            opacity: QuickFloat(),
          }
        }
      }
    }
  }
}
