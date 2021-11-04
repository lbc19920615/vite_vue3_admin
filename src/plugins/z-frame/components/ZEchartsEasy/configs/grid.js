export function createEchartGrid() {
  return {
    type: 'object',
    ui: {
      label: 'grid',
    },
    wrap: 'xy-tab-content',
    wrapAttrs: [
      ['label','grid']
    ],
    properties: {
      left: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#grid'
      },
      right: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#grid'
      },
      bottom: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#grid'
      },
      containLabel: {
        type: 'boolean',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#grid',
        rules: {
          type: 'any'
        }
      },
    }
  }
}
