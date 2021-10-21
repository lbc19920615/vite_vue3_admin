export function createbooleanWithClearableProp({label}) {
  return  {
    type: 'boolean',
    ui: {
      label: label,
      widgetConfig:  {
        ext: 'booleanWithClearable'
      },
    },
    rules: {
      type: 'any'
    }
  }
}
