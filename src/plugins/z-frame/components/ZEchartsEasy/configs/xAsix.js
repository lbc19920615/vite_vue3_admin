import {createSuggestSelectWidget} from "@/plugins/z-frame/components/ZEchartsEasy/configs/common";
import {QuickBoolean, QuickEnums, QuickNumber} from "@/hooks/props";

export function createEchartXAxis() {
  return {
    type: 'object',
    ui: {
      label: 'X轴'
    },
    properties: {
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
      boundaryGap: {
        type: 'boolean',
        rules: {
          type: 'boolean'
        }
      },
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
