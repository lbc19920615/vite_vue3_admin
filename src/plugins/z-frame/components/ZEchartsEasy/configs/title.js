export function createEchartTitle() {
  return {
    type: 'object',
    ui: {
      label: 'title'
    },
    properties: {
      text: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#title.text'
      },
      left: {
        type: 'string',
        noticeIframe: 'https://echarts.apache.org/zh/option.html#title.left'
      }
    }
  }
}
