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
    value: 'form_after',
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

]



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
        label: 'string',
        value: 'string',
      },
      {
        label: 'number',
        value: 'number',
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
    }
  },
  actions: {
    ToggleSideBar: ({ rootState }) => {
      console.log(rootState)
    },
  }
}

export default store
