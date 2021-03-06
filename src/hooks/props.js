import deepMerge from 'deepmerge'

function createSuggestSelectWidget(enums = []) {
  let suggest = enums.map(v => {
    if (Array.isArray(v)) {
      // console.log(v)
      if (v.length > 1) {
        return {
          label: v[0],
          value: v[1]
        }
      }
      return {
        label: v[0],
        value: v[0]
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

export function setPROPS(...args) {
  return deepMerge(
    ...args
  )
}

/**
 *
 * @returns {{rules: {type: string}, type: string}}
 * @constructor
 */
export function QuickNumber() {
  return {
    type: 'number',
    rules: {
      type: 'any'
    }
  }
}

/**
 *
 * @returns {{rules: {type: string}, type: string}}
 * @constructor
 */
export function QuickBoolean() {
  return {
    type: 'boolean',
    rules: {
      type: 'any'
    }
  }
}

/**
 *
 * @param label
 * @returns {{ui: {label: string, widgetConfig: {ext: string}}, rules: {type: string}, type: string}}
 * @constructor
 */
export function QuickBooleanWithNull(label = '') {
  return {
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

/**
 * QuickEnums
 * @param enums
 * @param type
 * @returns {{ui: {widget: string, widgetConfig: {mode: string, suggest: ({label: *, value: *}|*)[]}}, type: string}}
 * @constructor
 */
export function QuickEnums(enums = [], {type = 'string'} = {}) {
  return {
    type,
    ui: {
      ...createSuggestSelectWidget(enums)
    }
  }
}

/**
 * 颜色选择快捷
 * @returns {{ui: {widget: string, widgetConfig: {}}, type: string}}
 * @constructor
 */
export function QuickColor() {
  return  {
    type: 'string',
    ui: {
      widget: 'CusColorPicker',
      widgetConfig: {}
    }
  }
}

/**
 *
 * @returns {{rules: {type: string}, type: string}}
 * @constructor
 */
export function QuickTextarea() {
  return {
    type: 'string',
    ui: {
      widgetConfig: {
        type: 'textarea'
      }
    }
  }
}

export function QuickOneOrMany(type = 'string') {
  return {
    type: 'string',
    ui: {
      widget: 'CusOneOrMany',
      widgetConfig: {
        type: type
      }
    },
    rules: {
      type: 'any'
    }
  }
}

export function QuickFloat(precision = 2) {
  return {
    type: 'number',
    ui: {
      widget: 'CusInputNumber',
      widgetConfig: {
        precision: precision
      }
    },
    rules: {
      type: 'any'
    }
  }
}

