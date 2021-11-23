import * as constVars from "@/plugins/form-render/const";

let obj = {}
let objDoc = []
for (let [key, value] of Object.entries(constVars)) {
  let label = 'constVars_' + key
  obj[label] = value
  objDoc.push(
    {
      label: label,
      value: function () {
        return  `### ${label}
<json-viewer>
${JSON.stringify(value)}
</json-viewer>   
`
      }
    }
  )
}

let COM_FORM_COMMON_EVAL_FUNS_docs = []
for (let [key, value] of Object.entries(globalThis.COM_FORM_COMMON_EVAL_FUNS)) {
  COM_FORM_COMMON_EVAL_FUNS_docs.push({
    label: key,
    value: function () {
      // console.log(ZY.getHereDoc(value).trim())
return ZY.getHereDoc(value).trim()
    }
  })
}

// console.log(COM_FORM_COMMON_EVAL_FUNS_docs)

// <!-- beforebegin -->
// <p>
//   <!-- afterbegin -->
//   foo
//   <!-- beforeend -->
// </p>
// <!-- afterend -->
let pos_arr = ['beforebegin', 'afterbegin', 'beforeend', 'afterend', 'prev', 'after', 'before', 'next']
let pos_notice = ['在$VAL元素前', '在$VAL元素后', '在$VAL元素内部前', '在$VAL元素内部后', '在$VAL元素前', '在$VAL元素后', '在$VAL元素内部前', '在$VAL元素内部后']

let objArr = pos_arr.map((v, index) => {
  return {
    label: 'Object ' + v,
    value: 'object_' + v,
    labelTip: pos_notice[index].replace('$VAL', '对象')
  }
})

let arrArr = pos_arr.map((v, index) => {
  return {
    label: 'Array ' + v,
    value: 'array_' + v,
    labelTip: pos_notice[index].replace('$VAL', '数组外层')
  }
})

let arrConArr = pos_arr.map((v, index) => {
  return {
    label: 'Array 内部' + v,
    value: 'array_con_' + v,
    labelTip: pos_notice[index].replace('$VAL', '数组内层')
  }
})

let propArr = pos_arr.map((v, index) => {
  return {
    label: 'Prop 内部' + v,
    value: 'prop_' + v,
    labelTip: pos_notice[index].replace('$VAL', '属性')
  }
})

// console.log(objArr)

const slotTypes = [
  {
    label: 'Form After',
    value: 'form_afterend',
    labelTip: '表单后面',
  },
  {
    label: 'Object Prev',
    value: 'object_beforebegin',
    labelTip: '对象前面',
  },
  ...objArr,
  ...arrArr,
  ...arrConArr,
  ...propArr
]


globalThis.ToolsDocs =  [
  ...objDoc,
  ...COM_FORM_COMMON_EVAL_FUNS_docs,
  {
    label: 'MODEL',
    value: `### MODEL
是一个用于获取当前表单 数据的方法

@param path {string} 路径

@param defaultVal {null} 默认值
`
  },
  {
    label: 'ROOT_STATE',
    value: `### ROOT_STATE
是一个用于获取app 底层状态的方法

@param path {string} 路径

@param defaultVal {null} 默认值
`
  },
  {
    label: 'ROOT_GETTERS',
    value: `### ROOT_GETTERS
是一个用于获取app 底层状态的方法

@param name {string} vuex.getters 名

@param params {any[]} 参数
`
  },
]


let dynimcalOptions = new Map()

globalThis._set_dynimcalOptions = function (name, value) {
  if (typeof name !== undefined) {
    dynimcalOptions.set(name, value)
  }
}

globalThis._get_dynimcalOptions = function () {
  return dynimcalOptions
}

const store = {
  // namespaced: true,
  state: () => ({
    toolDocs: ToolsDocs,
    partOptions: [
      {
        label: 'form 表单',
        value: 'form',
      },
      {
        label: 'table 表格',
        value: 'table',
      },
      {
        label: 'form2 移动',
        value: 'form2',
      },
      // {
      //   label: 'aform',
      //   value: 'aform',
      // },
    ],
    propTypes: [
      {
        label: '字符串',
        value: 'string',
      },
      {
        label: '数字',
        value: 'number',
      },
      {
        label: '布尔',
        value: 'boolean',
      },
    ],
    slotTypes,
    // constVars: constVars,
    ...obj,
    // processSteps,
    // eventSuggests,
  }),
  getters: {
    options (state) {
      return (name = 'name') => {
        return [
          {
            label: name + '1',
            value: name + '1',
          },
          {
            label: name + '2',
            value: name + '2',
          }
        ]
      }
    },
    dOptions (state) {
      return (name = '') => {
        // console.log('dOptions', name)
        let ret = dynimcalOptions.get(name)
        if (Array.isArray(ret)) {
          return ret
        }
        return []
      }
    },
    subTypes() {
      return (type = '') => {
        // console.log('dOptions', name)
        if (type === 'number') {
          return [
            {
              label: '整数',
              value: 'integer',
            },
            {
              label: '小数',
              value: 'float',
            }
          ]
        }
        else if (type === 'string') {
          return [
            {
              label: '日期(datetime)',
              value: 'datetime',
            },
            {
              label: '时间(time)',
              value: 'time',
            },
            {
              label: '日期(date)',
              value: 'date',
            },
            {
              label: '年(year)',
              value: 'year',
            },
          ]
        }
        else {
          return  []
        }
      }
    }
  },
  actions: {
    ToggleSideBar: ({ rootState }) => {
      console.log(rootState)
    },
    setDynamicOptions: ({rootState}, payload) => {
      // console.log(payload)
      dynimcalOptions.set(payload[0], payload[1])
    }
  }
}

export default store
