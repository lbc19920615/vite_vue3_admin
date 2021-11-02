import {
  createBorderProps, createFontCommonProps,
  createShadowProps,
  createSuggestSelectWidget, createTextBorderProps, createTextShadowProps
} from "@/plugins/z-frame/components/ZEchartsEasy/configs/common";

export function createEchartLegend() {
  return {
    type: 'object',
    ui: {
      label: 'legend'
    },
    properties: {
      orient: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#legend.orient',
        ui: {
          ...createSuggestSelectWidget([
            {
              label: 'horizontal',
              value: 'horizontal',
            },
            {
              label: 'vertical',
              value: 'vertical',
            },
          ])
        }
      },
      left: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#legend.left'
      },
      top: {
        type: 'string',
      },
      right: {
        type: 'string',
      },
      bottom: {
        type: 'string',
      },
      show: {
        type: 'boolean',
        rules: {
          type: 'any'
        }
      },
      zlevel: {
        type: 'number',
        rules: {
          type: 'any'
        }
      },
      align: {
        type: 'string',
        ui: {
          ...createSuggestSelectWidget(
            [
              {
                label: 'left',
                value: 'left',
              },
              {
                label: 'auto',
                value: 'auto',
              },
              {
                label: 'right',
                value: 'right',
              },
            ]
          )
        }
      },
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
      itemGap: {
        type: 'number',
        rules: {
          type: 'any'
        }
      },
      itemWidth: {
        type: 'number',
        rules: {
          type: 'any'
        }
      },
      itemHeight: {
        type: 'number',
        rules: {
          type: 'any'
        }
      },
      itemStyle: {
        type: 'object',
        properties: {
          color: {
            type: 'string',
            ui: {
              widget: 'CusColorPicker',
              widgetConfig: {}
            }
          },
          ...createBorderProps(),
          ...createShadowProps(),
          opacity: {
            type: 'number',
            ui: {
              widget: 'CusInputNumber',
              widgetConfig: {
                precision: 2
              }
            },
            rules: {
              type: 'any'
            }
          },
        }
      }
    },
    lineStyle: {
      type: 'object',
      properties: {
        color: {
          type: 'string',
          ui: {
            widget: 'CusColorPicker',
            widgetConfig: {}
          }
        },
        width: {
          type: 'number',
          rules: {
            type: 'any'
          }
        },
        type: {
          type: 'string',
          ui: {
            ...createSuggestSelectWidget(
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
            )
          }
        },
        ...createShadowProps(),
        opacity: {
          type: 'number',
          ui: {
            widget: 'CusInputNumber',
            widgetConfig: {
              precision: 2
            }
          },
          rules: {
            type: 'any'
          }
        },
      }
    },
    textStyle: {
      type: 'object',
      properties: {
        color: {
          type: 'string',
          ui: {
            widget: 'CusColorPicker',
            widgetConfig: {}
          }
        },
        ...createFontCommonProps(),
        lineHeight: {
          type: 'number',
          ui: {
            widget: 'CusInputNumber',
            widgetConfig: {
              precision: 2
            }
          },
          rules: {
            type: 'any'
          }
        },
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
        ...createTextBorderProps(),
        ...createTextShadowProps(),
        overflow: {
          type: 'string',
          ui: {
            ...createSuggestSelectWidget(
              [
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
              ]
            )
          }
        },
      },
    }
  }
}
