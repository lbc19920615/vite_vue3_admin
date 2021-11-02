export function createSuggestSelectWidget(enums = []) {
  return {
    widget: 'CusSuggest',
    widgetConfig: {
      mode: 'select',
      suggest: enums
    }
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
