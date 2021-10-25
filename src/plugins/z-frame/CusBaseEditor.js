import * as constVars from "@/plugins/form-render/const";

export function createAbleProp({label}) {
  return  {
    type: Boolean,
    ui: {
      label: '是否' + label,
      widgetConfig:  {
        ext: 'booleanWithClearable'
      },
      notice: '是否可以' + label
    },
    rules: {
      type: 'any'
    }
  }
}

export function createBaseCusCONFIG() {
  let ret = {
    placeholder: {
      type: String,
      ui: {
        label: '占位提示',
      }
    }
  }
  return ret
}

export function createBaseCusEnumsCONFIG() {
  let app = getApp()
  let APP_FUNS = Object.keys(app).filter(v => v.startsWith('ENUMS'))
  // console.log(APP_FUNS)
  let constVarsKeys = Object.keys(constVars)
  // console.log('constVarsKeys', constVarsKeys)
  constVarsKeys = constVarsKeys.concat(
    constVarsKeys.map(v => {
      return 'constVars_' + v
    })
  )
  let ret = {
    enums: {
      type: String,
      ui: {
        label: '枚举',
        notice: '是否可以清除',
        styles: [
          ['height', 0],
          ['overflow', 'hidden'],
        ],
      },
      computedProp: 'enums_content'
    },
    enums2: {
      type: String,
      ui: {
        label: '枚举',
        notice: `枚举可以使用的方法
<xy-tips tips="some tips" >提示</xy-tips>`,
        widget: 'CusInsert',
        widgetConfig: {
          insVars: [
            'constVars',
            'tools',
            'A',
            ...constVarsKeys
          ],
          insFun: [
            'ROOT_GETTERS',
            'MODEL',
            ...APP_FUNS,
            'ROOT_STATE',
          ]
        }
      }
    },
  }
  return ret
}
