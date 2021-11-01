export function createEchartGrid() {
  return {
    type: 'object',
    ui: {
      label: 'grid'
    },
    properties: {
      left: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#grid'
      },
    }
  }
}
