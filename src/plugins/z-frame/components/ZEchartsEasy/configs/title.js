import {
  createFontCommonProps,
  createSuggestSelectWidget, createTextBorderProps, createTextShadowProps
} from "@/plugins/z-frame/components/ZEchartsEasy/configs/common";

export function createEchartTitle() {
  return {
    type: 'object',
    ui: {
      label: 'title'
    },
    properties: {
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
      text: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#title.text'
      },
      link: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#title.link'
      },
      left: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#title.left'
      },
      textAlign: {
        type: 'string',
        ui: {
          ...createSuggestSelectWidget(
            [
              {
                label: 'auto',
                value: 'auto',
              },
              {
                label: 'left',
                value: 'left',
              },
              {
                label: 'right',
                value: 'right',
              },
              {
                label: 'center',
                value: 'center',
              },
            ]
          )
        }
      },
      textVerticalAlign: {
        type: 'string',
        ui: {
          ...createSuggestSelectWidget(
            [
              {
                label: 'auto',
                value: 'auto',
              },
              {
                label: 'top',
                value: 'top',
              },
              {
                label: 'bottom',
                value: 'bottom',
              },
              {
                label: 'middle',
                value: 'middle',
              },
            ]
          )
        }
      },
      itemGap: {
        type: 'number',
        rules: {
          type: 'any'
        }
      },
      textStyle: {
        type: 'object',
        properties: {
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
          width: {
            type: 'number',
            rules: {
              type: 'any'
            }
          },
          height: {
            type: 'number',
            rules: {
              type: 'any'
            }
          },
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
      },
      subtext: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#title'
      },
      sublink: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#title'
      },
      subtextStyle: {
        type: 'object',
        properties: {
          ...createFontCommonProps(),
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
                    label: 'center',
                    value: 'center',
                  },
                  {
                    label: 'right',
                    value: 'right',
                  },
                ]
              )
            }
          },
          verticalAlign: {
            type: 'string',
            ui: {
              ...createSuggestSelectWidget(
                [
                  {
                    label: 'top',
                    value: 'top',
                  },
                  {
                    label: 'middle',
                    value: 'middle',
                  },
                  {
                    label: 'bottom',
                    value: 'bottom',
                  },
                ]
              )
            }
          },
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
          width: {
            type: 'number',
            rules: {
              type: 'any'
            }
          },
          height: {
            type: 'number',
            rules: {
              type: 'any'
            }
          },
          ...createTextBorderProps(),
          ...createTextShadowProps(),
        }
      }
    }
  }
}
