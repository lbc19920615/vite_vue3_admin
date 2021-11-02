export function createEchartToolbox() {
  return {
    type: 'object',
    ui: {
      label: 'toolbox'
    },
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
