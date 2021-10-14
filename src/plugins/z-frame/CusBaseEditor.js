import * as constVars from "@/plugins/form-render/const";

export function createBaseCusEnumsCONFIG() {
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
            ...constVarsKeys
          ],
          insFun: [
            'ROOT_GETTERS',
            'MODEL',
            'ROOT_STATE',
          ]
        }
      }
    },
  }
  return ret
}
