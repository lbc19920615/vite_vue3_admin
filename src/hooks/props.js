function createSuggestSelectWidget(enums = []) {
  let suggest = enums.map(v => {
    if (Array.isArray(v)) {
      return {
        label: v.label,
        value: v.value
      }
    }
    return v
  })
  return {
    widget: 'CusSuggest',
    widgetConfig: {
      mode: 'select',
      suggest: suggest
    }
  }
}

export function QuickNumber() {
  return {
    type: 'number',
    rules: {
      type: 'any'
    }
  }
}

export function QuickBoolean() {
  return {
    type: 'boolean',
    rules: {
      type: 'any'
    }
  }
}

export function QuickEnums(enums = [], {type = 'string'} = {}) {
  return {
    type,
    ui: {
      ...createSuggestSelectWidget(enums)
    }
  }
}
