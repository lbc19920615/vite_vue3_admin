export function createEchartTooltip() {
  return {
    type: 'object',
    ui: {
      label: 'tooltip'
    },
    properties: {
      trigger: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#tooltip.trigger'
      },
    }
  }
}
