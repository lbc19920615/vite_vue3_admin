import {QuickBoolean, QuickColor, QuickEnums, QuickNumber, QuickOneOrMany, QuickTextarea} from "@/hooks/props";
import {
  createBorderProps,
  createFontCommonProps,
  createSizeProps, createTextBorderProps, createTextShadowProps, createTextStyleCommonProps
} from "@/plugins/z-frame/components/ZEchartsEasy/configs/common";

export function createEchartTooltip() {
  return {
    type: 'object',
    ui: {
      label: 'tooltip'
    },
    properties: {
      show: QuickBoolean(),
      trigger: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#tooltip.trigger'
      },
      showContent: QuickBoolean(),
      alwaysShowContent: QuickBoolean(),
      showDelay: QuickNumber(),
      hideDelay: QuickNumber(),
      enterable: QuickBoolean(),
      confine: QuickBoolean(),
      appendToBody: QuickBoolean(),
      className: {
        type: 'string'
      },
      transitionDuration: QuickNumber(),
      position: QuickOneOrMany(),
      backgroundColor: QuickColor(),
      ...createBorderProps(),
      padding: QuickOneOrMany(),
      textStyle: {
        type: 'object',
        properties: {
          ...createTextStyleCommonProps()
        }
      },
      extraCssText: QuickTextarea(),
      order: QuickEnums([
        ['seriesAsc', 'seriesAsc'],
        ['seriesDesc', 'seriesDesc'],
        ['valueAsc', 'valueAsc'],
        ['valueDesc', 'valueDesc'],
      ])
    }
  }
}
