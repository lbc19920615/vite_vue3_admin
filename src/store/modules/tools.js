import * as constVars from "@/plugins/form-render/const";

let obj = {}
for (let [key, value] of Object.entries(constVars)) {
  obj['constVars_' + key] = value
}

// <!-- beforebegin -->
// <p>
//   <!-- afterbegin -->
//   foo
//   <!-- beforeend -->
// </p>
// <!-- afterend -->
let pos_arr = ['beforebegin', 'afterbegin', 'beforeend', 'afterend']
let pos_notice = ['在$VAL元素前', '在$VAL元素后', '在$VAL元素内部前', '在$VAL元素内部后']

let objArr = pos_arr.map((v, index) => {
  return {
    label: 'Object ' + v,
    value: 'object_' + v,
    labelTip: pos_notice[index].replace('$VAL', '对象')
  }
})

console.log(objArr)

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
  ...objArr
]

const store = {
  // namespaced: true,
  state: () => ({
    partOptions: [
      {
        label: 'form',
        value: 'form',
      },
      {
        label: 'table',
        value: 'table',
      },
      {
        label: 'form2',
        value: 'form2',
      },
      {
        label: 'aform',
        value: 'aform',
      },
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
  mutations: {

  },
  actions: {
    ToggleSideBar: ({ rootState }) => {
      console.log(rootState)
    },
  }
}

export default store
