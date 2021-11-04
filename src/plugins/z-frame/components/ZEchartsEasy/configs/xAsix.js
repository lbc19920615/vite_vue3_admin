import {
  createAlignProps,
  createBorderProps,
  createFontCommonProps, createShadowProps, createSizeProps,
  createSuggestSelectWidget, createTextBorderProps, createTextShadowProps
} from "@/plugins/z-frame/components/ZEchartsEasy/configs/common";
import {QuickBoolean, QuickColor, QuickEnums, QuickNumber, QuickTextarea} from "@/hooks/props";
import deepMerge from 'deepmerge'

export function createEchartXAxis() {
  return {
    type: 'object',
    ui: {
      label: 'X轴'
    },
    wrap: 'xy-tab-content',
    wrapAttrs: [
      ['label','xAxis']
    ],
    properties: {
      type: deepMerge(
        QuickEnums(
          [
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
        ),
        {
          noticeIframe: 'https://echarts.apache.org/zh/option.html#xAxis.type',
          ui: {
            label: '坐标轴类型',
          }
        }
      ),
      name: {
        type: 'string',
        ui: {
          label: '坐标轴名称'
        }
      },
      show: {
        type: 'boolean',
        rules: {
          type: 'any'
        }
      },
      position: {
        type: 'string',
        ui: {
          ...createSuggestSelectWidget([
            {
              label: 'top',
              value: 'top',
            },
            {
              label: 'bottom',
              value: 'bottom',
            }
          ])
        }
      },
      offset: QuickNumber(),
      realtimeSort: QuickBoolean(),
      sortSeriesIndex: QuickNumber(),
      nameLocation: QuickEnums(
        [
          ['start', 'start'],
          ['middle', 'middle'],
          ['end', 'end'],
        ]
      ),
      nameTextStyle: {
        type: 'object',
        properties: {
          ...createFontCommonProps(),
          ...createAlignProps(),
          lineHeight: QuickNumber(),
          backgroundColor: QuickColor(),
          ...createBorderProps(),
          padding: {
            type: 'string',
            ui: {
              widget: 'CusOneOrMany',
              widgetConfig: {
                type: 'number'
              }
            },
            rules: {
              type: 'any'
            }
          },
          ...createShadowProps(),
          ...createSizeProps(),
          ...createTextBorderProps(),
          ...createTextShadowProps(),
          overflow: QuickEnums([
            {
              label: '截断',
              value: 'truncate',
            },
            {
              label: '换行',
              value: 'break',
            },
            {
              label: 'breakAll',
              value: 'breakAll',
            },
          ]),
        }
      },
      nameGap: QuickNumber(),
      nameRotate: QuickNumber(),
      inverse: QuickBoolean(),
      min: QuickTextarea(),
      max:  QuickTextarea(),
      scale: QuickBoolean(),
      splitNumber: QuickNumber(),
      minInterval: QuickNumber(),
      maxInterval: QuickNumber(),
      interval: QuickNumber(),
      logBase: QuickNumber(),
      silent: QuickBoolean(),
      axisLabel: {
        type: 'object',
        properties: {
          show: QuickBoolean(),
          inside: QuickBoolean(),
          rotate: QuickNumber(),
          margin: QuickNumber(),
          formatter: QuickTextarea(),
          showMinLabel: QuickBoolean(),
          showMaxLabel: QuickBoolean(),
          hideOverlap: QuickBoolean(),
          ...createFontCommonProps(),
          ...createAlignProps(),
          lineHeight: QuickNumber(),
          backgroundColor: QuickColor(),
          ...createBorderProps(),
          ...createShadowProps(),
          ...createSizeProps(),
          ...createTextBorderProps(),
          ...createTextShadowProps(),
        }
      },
      zlevel: QuickNumber(),
      boundaryGap: QuickBoolean(),
      data: {
        type: 'array',
        // tag: 'my-vue-tab',
        // con_tag: 'my-vue-tab-pane',
        tag: 'el-scrollbar',
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
