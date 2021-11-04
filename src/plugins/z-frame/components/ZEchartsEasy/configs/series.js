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
  createAlignProps, createAnimationProps,
  createBorderExt1Props,
  createBorderProps,
  createEndLabelPartProps,
  createItemStylePartProps, createLabelPartProps,
  createLineStylePartProps,
  createShadowProps,
  createSizeProps, createSymbolProps,
  createTextBorderProps,
  createTextShadowProps,
  createTextStyleCommonProps
} from "@/plugins/z-frame/components/ZEchartsEasy/configs/common";
import deepMerge from 'deepmerge'

export function createEchartSeries() {
  return {
    type: 'array',
    ui: {
      label: '系列',
    },
    wrap: 'xy-tab-content',
    wrapAttrs: [
      ['label','series']
    ],
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
        ...createSymbolProps(),
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
            ...createLabelPartProps(),
          }
        },
        endLabel: {
          type: 'object',
          properties: {
            ...createEndLabelPartProps(),
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
              type: 'object',
              properties: {
                ...createLineStylePartProps(),
              }
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
            ...createItemStylePartProps()
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
            color: QuickColor(),
            ...createShadowProps(),
            opacity: QuickFloat(),
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
          }
        },
        emphasis: {
          type: 'object',
          properties: {
            scale: QuickBoolean(),
            focus: QuickEnums(
              [
                ['none', 'none'],
                ['self', 'self'],
                ['series', 'series'],
              ]
            ),
            blurScope: QuickEnums(
              [
                ['coordinateSystem', 'coordinateSystem'],
                ['series', 'series'],
                ['global', 'global'],
              ]
            ),
            label: {
              type: 'object',
              properties: {
                show: QuickBoolean(),
                position: QuickOneOrMany(),
                distance: QuickNumber(),
                rotate: QuickNumber(),
                offset: QuickOneOrMany('number'),
                ...createTextStyleCommonProps(),
                ...createAlignProps(),
                ...createBorderProps(),
                ...createShadowProps(),
              }
            },
            itemStyle: {
              type: 'object',
              properties: {
                ...createItemStylePartProps()
              }
            },
            lineStyle: {
              type: 'object',
              properties: {
                ...createLineStylePartProps(),
              }
            },
            areaStyle: {
              type: 'object',
              properties: {
                color: QuickColor(),
                ...createShadowProps(),
                opacity: QuickFloat(),
              }
            },
            endLabel: {
              type: 'object',
              properties: {
                ...createEndLabelPartProps(),

              }
            },
          }
        },
        smoothMonotone: QuickEnums([
          ['x'], ['y']
        ]),
        sampling: QuickEnums([
          ['lttb'], ['average'],['max'], ['min'], ['sum'],
        ]),
        seriesLayoutBy : QuickEnums([
          ['column'], ['row']
        ]),
        datasetIndex: QuickNumber(),
        dataGroupId: {
          type: 'string'
        },
        markPoint: {
          type: 'object',
          properties: {
            ...createSymbolProps(),
            slient: QuickBoolean(),
            label: {
              type: 'object',
              properties: {
                ...createLabelPartProps(),
              }
            },
            itemStyle: {
              type: 'object',
              properties: {
                ...createItemStylePartProps()
              }
            },
            emphasis: {
              type: 'object',
              properties: {
                label: {
                  type: 'object',
                  properties: {
                    ...createLabelPartProps(),
                  }
                },
                itemStyle: {
                  type: 'object',
                  properties: {
                    ...createItemStylePartProps()
                  }
                },
              }
            },
            ...createAnimationProps()
          }
        },
        zlevel: QuickNumber(),
        slient: QuickBoolean(),
        ...createAnimationProps(),
      }
    }
  }
}
