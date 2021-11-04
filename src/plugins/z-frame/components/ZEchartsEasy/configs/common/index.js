import {
  QuickBoolean,
  QuickColor,
  QuickEnums,
  QuickFloat,
  QuickNumber,
  QuickOneOrMany,
  QuickTextarea
} from "@/hooks/props";

export function createSuggestSelectWidget(enums = []) {
  return {
    widget: 'CusSuggest',
    widgetConfig: {
      mode: 'select',
      suggest: enums
    }
  }
}

function getExt1Name(prefix = '', v) {
  if (prefix) {
    return prefix + ZY.lodash.upperFirst('v')
  }
  return v
}

export function createBorderExt1Props(prefix = '') {
  return {
    [getExt1Name('cap')]: QuickEnums([
      ['butt', 'butt'],
      ['round', 'round'],
      ['square', 'square'],
    ]),
    [getExt1Name('join')]: QuickEnums([
      ['bevel', 'bevel'],
      ['round', 'round'],
      ['miter', 'miter'],
    ]),
    [getExt1Name('miterLimit')]: QuickNumber()
  }
}

export function createBorderProps() {
  return {
    borderColor: {
      type: 'string',
      ui: {
        widget: 'CusColorPicker',
        widgetConfig: {}
      }
    },
    borderWidth: {
      type: 'number',
      rules: {
        type: 'any'
      }
    },
    borderRadius: {
      type: 'string',
      ui: {
        widget: 'CusOneOrMany',
        widgetConfig: {
          type: 'number'
        }
      },
      rules: {
        type: 'any'
      }
    },
  }
}

export function createTextBorderProps() {
  return {
    textBorderColor: {
      type: 'string',
      ui: {
        widget: 'CusColorPicker',
        widgetConfig: {}
      }
    },
    textBorderWidth: {
      type: 'number',
      rules: {
        type: 'any'
      }
    },
    textBorderType: {
      type: 'string',
      ui: {
        ...createSuggestSelectWidget(
          [
            {
              label: 'solid',
              value: 'solid',
            },
            {
              label: 'dashed',
              value: 'dashed',
            },
            {
              label: 'dotted',
              value: 'dotted',
            },
          ]
        )
      }
    },
  }
}

export function createTextShadowProps() {
  return {
    textShadowColor: {
      type: 'string',
      ui: {
        widget: 'CusColorPicker',
        widgetConfig: {}
      }
    },
    textShadowBlur: {
      type: 'number',
      rules: {
        type: 'any'
      }
    },
    textShadowOffsetX: {
      type: 'number',
      rules: {
        type: 'any'
      }
    },
    textShadowOffsetY: {
      type: 'number',
      rules: {
        type: 'any'
      }
    },
  }
}

export function createSizeProps() {
  return {
    width: QuickNumber(),
    height: QuickNumber(),
  }
}

export function createShadowProps() {
  return {
    shadowColor: {
      type: 'string',
      ui: {
        widget: 'CusColorPicker',
        widgetConfig: {}
      }
    },
    shadowBlur: {
      type: 'number',
      rules: {
        type: 'any'
      }
    },
    shadowOffsetX: {
      type: 'number',
      rules: {
        type: 'any'
      }
    },
    shadowOffsetY: {
      type: 'number',
      rules: {
        type: 'any'
      }
    },
  }
}

export function createFontCommonProps() {
  let obj = {
    color: {
      type: 'string',
      ui: {
        widget: 'CusColorPicker',
        widgetConfig: {}
      }
    },
    fontStyle: {
      type: 'string',
      ui: {
        ...createSuggestSelectWidget(
          [
            {
              label: 'normal',
              value: 'normal',
            },
            {
              label: 'italic',
              value: 'italic',
            },
            {
              label: 'oblique',
              value: 'oblique',
            },
          ]
        )
      }
    },
    fontWeight: {
      type: 'string',
      ui: {
        ...createSuggestSelectWidget(
          [
            {
              label: 'normal',
              value: 'normal',
            },
            {
              label: 'bold',
              value: 'bold',
            },
            {
              label: 'bolder',
              value: 'bolder',
            },
            {
              label: 'lighter',
              value: 'lighter',
            },
          ]
        )
      }
    },
    fontFamily: {
      type: 'string',
    },
    fontSize: {
      type: 'number',
      rules: {
        type: 'any'
      }
    },
  }
  return obj
}

export function createTextStyleCommonProps() {
  return {
    ...createFontCommonProps(),
    lineHeight: QuickNumber(),
    ...createSizeProps(),
    ...createTextBorderProps(),
    ...createTextShadowProps(),
    overflow: QuickEnums([
      {
        label: '截断',
        value: 'truncate',
      },
      {
        label: '换行',
        value: 'break',
      },
      {
        label: 'breakAll',
        value: 'breakAll',
      },
    ]),
    lineOverflow: {
      type: 'string'
    }
  }
}


export function createAlignProps() {
  return {
    align: QuickEnums(
      [
        ['left', 'left'],
        ['center', 'center'],
        ['right', 'right'],
      ]
    ),
    verticalAlign: QuickEnums(
      [
        ['top', 'top'],
        ['middle', 'middle'],
        ['bottom', 'bottom'],
      ]
    ),
  }
}

export function createSymbolProps() {
  return {
    symbol: QuickTextarea(),
    symbolSize: QuickNumber(),
    symbolRotate: QuickNumber(),
    symbolKeepAspect: QuickBoolean(),
    symbolOffset: QuickOneOrMany(),
  }
}

export function createAnimationProps() {
  return {
    animation: QuickBoolean(),
    animationThreshold: QuickNumber(),
    animationDuration: QuickNumber(),
    animationEasing: {
      type: 'string'
    },
    animationDelay: QuickNumber(),
    animationDurationUpdate: QuickNumber(),
    animationEasingUpdate: {
      type: 'string'
    },
    animationDelayUpdate: QuickNumber(),
  }
}

/**
 * https://echarts.apache.org/zh/option.html#series-line.emphasis.itemStyle
 * @returns {{shadowOffsetX: {rules: {type: string}, type: string}, borderColor: {ui: {widget: string, widgetConfig: {}}, type: string}, shadowOffsetY: {rules: {type: string}, type: string}, color: {ui: {widget: string, widgetConfig: {}}, type: string}, borderRadius: {ui: {widget: string, widgetConfig: {type: string}}, rules: {type: string}, type: string}, shadowBlur: {rules: {type: string}, type: string}, borderWidth: {rules: {type: string}, type: string}, opacity: {ui: {widget: string, widgetConfig: {precision: number}}, rules: {type: string}, type: string}, shadowColor: {ui: {widget: string, widgetConfig: {}}, type: string}}}
 */
export function createItemStylePartProps() {
  return {
    color: QuickColor(),
    ...createBorderProps(),
    ...createShadowProps(),
    ...createBorderExt1Props('border'),
    opacity: QuickFloat(),
  }
}

/**
 * https://echarts.apache.org/zh/option.html#series-line.emphasis.lineStyle
 * @returns {{shadowOffsetX: {rules: {type: string}, type: string}, shadowOffsetY: {rules: {type: string}, type: string}, color: {ui: {widget: string, widgetConfig: {}}, type: string}, shadowBlur: {rules: {type: string}, type: string}, width: {rules: {type: string}, type: string}, type: {ui: {widget: string, widgetConfig: {mode: string, suggest: ({label: *, value: *}|*)[]}}, type: string}, opacity: {ui: {widget: string, widgetConfig: {precision: number}}, rules: {type: string}, type: string}, shadowColor: {ui: {widget: string, widgetConfig: {}}, type: string}}}
 */
export function createLineStylePartProps() {
  return {
    color: QuickColor(),
    width: QuickNumber(),
    type: QuickEnums([
      ['solid', 'solid'],
      ['dashed', 'dashed'],
      ['dotted', 'dotted'],
    ]),
    ...createBorderExt1Props(),
    ...createShadowProps(),
    opacity: QuickFloat(),
  }
}

/**
 * https://echarts.apache.org/zh/option.html#series-line.emphasis.endLabel
 * @returns {{rotate: {rules: {type: string}, type: string}, textBorderWidth: {rules: {type: string}, type: string}, padding: {ui: {widget: string, widgetConfig: {type: string}}, rules: {type: string}, type: string}, distance: {rules: {type: string}, type: string}, offset: {ui: {widget: string, widgetConfig: {type: string}}, rules: {type: string}, type: string}, color: {ui: {widget: string, widgetConfig: {}}, type: string}, show: {rules: {type: string}, type: string}, textShadowColor: {ui: {widget: string, widgetConfig: {}}, type: string}, fontStyle: {ui: {widget: string, widgetConfig: {mode: string, suggest: *[]}}, type: string}, lineOverflow: {type: string}, fontFamily: {type: string}, overflow: {ui: {widget: string, widgetConfig: {mode: string, suggest: ({label: *, value: *}|*)[]}}, type: string}, width: {rules: {type: string}, type: string}, fontSize: {rules: {type: string}, type: string}, lineHeight: {rules: {type: string}, type: string}, textShadowOffsetX: {rules: {type: string}, type: string}, position: {ui: {widget: string, widgetConfig: {type: string}}, rules: {type: string}, type: string}, textShadowOffsetY: {rules: {type: string}, type: string}, textBorderType: {ui: {widget: string, widgetConfig: {mode: string, suggest: *[]}}, type: string}, fontWeight: {ui: {widget: string, widgetConfig: {mode: string, suggest: *[]}}, type: string}, height: {rules: {type: string}, type: string}, textBorderColor: {ui: {widget: string, widgetConfig: {}}, type: string}, textShadowBlur: {rules: {type: string}, type: string}}}
 */
export function createEndLabelPartProps() {
  return {
    show: QuickBoolean(),
    position: QuickOneOrMany(),
    distance: QuickNumber(),
    rotate: QuickNumber(),
    offset: QuickOneOrMany('number'),
    ...createTextStyleCommonProps(),
    padding: QuickOneOrMany('number')
  }
}

/**
 * https://echarts.apache.org/zh/option.html#series-line.markPoint.label
 * @returns {{rotate: {rules: {type: string}, type: string}, textBorderWidth: {rules: {type: string}, type: string}, padding: {ui: {widget: string, widgetConfig: {type: string}}, rules: {type: string}, type: string}, distance: {rules: {type: string}, type: string}, offset: {ui: {widget: string, widgetConfig: {type: string}}, rules: {type: string}, type: string}, color: {ui: {widget: string, widgetConfig: {}}, type: string}, show: {rules: {type: string}, type: string}, textShadowColor: {ui: {widget: string, widgetConfig: {}}, type: string}, fontStyle: {ui: {widget: string, widgetConfig: {mode: string, suggest: *[]}}, type: string}, lineOverflow: {type: string}, fontFamily: {type: string}, overflow: {ui: {widget: string, widgetConfig: {mode: string, suggest: ({label: *, value: *}|*)[]}}, type: string}, width: {rules: {type: string}, type: string}, fontSize: {rules: {type: string}, type: string}, lineHeight: {rules: {type: string}, type: string}, textShadowOffsetX: {rules: {type: string}, type: string}, position: {ui: {widget: string, widgetConfig: {type: string}}, rules: {type: string}, type: string}, textShadowOffsetY: {rules: {type: string}, type: string}, textBorderType: {ui: {widget: string, widgetConfig: {mode: string, suggest: *[]}}, type: string}, fontWeight: {ui: {widget: string, widgetConfig: {mode: string, suggest: *[]}}, type: string}, height: {rules: {type: string}, type: string}, textBorderColor: {ui: {widget: string, widgetConfig: {}}, type: string}, textShadowBlur: {rules: {type: string}, type: string}}}
 */
export function createLabelPartProps() {
  return {
    show: QuickBoolean(),
    position: QuickOneOrMany(),
    distance: QuickNumber(),
    rotate: QuickNumber(),
    offset: QuickOneOrMany('number'),
    ...createTextStyleCommonProps(),
    padding: QuickOneOrMany('number')
  }
}
