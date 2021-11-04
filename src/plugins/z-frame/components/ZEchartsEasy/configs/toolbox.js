export function createEchartToolbox() {
  return {
    type: 'object',
    ui: {
      label: 'toolbox'
    },
    wrap: 'xy-tab-content',
    wrapAttrs: [
      ['label','toolbox']
    ],
    properties: {
      feature: {
        type: 'object',
        properties: {
          saveAsImage: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }
}
