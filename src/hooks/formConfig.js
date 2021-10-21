export function createbooleanWithClearableProp({label}) {
  return  {
    type: Boolean,
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
