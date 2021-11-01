export function createEchartLegend() {
  return {
    type: 'object',
    ui: {
      label: 'legend'
    },
    properties: {
      orient: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#legend.orient'
      },
      left: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#legend.left'
      }
    }
  }
}
