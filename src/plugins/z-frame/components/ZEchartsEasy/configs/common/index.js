import {QuickEnums, QuickNumber} from "@/hooks/props";

export function createSuggestSelectWidget(enums = []) {
  return {
    widget: 'CusSuggest',
    widgetConfig: {
      mode: 'select',
      suggest: enums
    }
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
