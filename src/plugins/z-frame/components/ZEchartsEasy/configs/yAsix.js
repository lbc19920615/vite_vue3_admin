import {QuickBoolean, QuickColor, QuickEnums, QuickNumber, QuickTextarea} from "@/hooks/props";
import deepMerge from 'deepmerge'
import {
  createAlignProps,
  createBorderProps,
  createFontCommonProps, createShadowProps, createSizeProps, createTextBorderProps, createTextShadowProps
} from "@/plugins/z-frame/components/ZEchartsEasy/configs/common";

export function createEchartYAxis() {
  return {
    type: 'object',
    wrap: 'xy-tab-content',
    wrapAttrs: [
      ['label','yAxis']
    ],
    properties: {
      name: {
        type: 'string',
        ui: {
          label: '坐标轴名称'
        }
      },
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
          noticeIframe: 'https://echarts.apache.org/zh/option.html#yAxis.type',
          ui: {
            label: '坐标轴类型',
          }
        }
      ),
      show: QuickBoolean(),
      position: QuickEnums([
        {
          label: 'left',
          value: 'left',
        },
        {
          label: 'right',
          value: 'right',
        }
      ]),
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
      boundaryGap: QuickBoolean(),
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
