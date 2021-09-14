import * as constVars from "@/plugins/form-render/const";

let obj = {}
for (let [key, value] of Object.entries(constVars)) {
  obj['constVars_' + key] = value
}

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
