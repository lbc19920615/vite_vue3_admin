const store = {
  // namespaced: true,
  state: () => ({
    services: new Map(),
    count: 111,
    constants: {
      types: [
        {
          label: '事假',
          value: 'sds1212121sds'
        },
        {
          label: '病假',
          value: 'sds121212ds'
        },
        {
          label: '调休',
          value: '12121212ssd'
        }
      ]
    }
  }),
  mutations: {
    SET_COUNT: (state, v) => {
      state.count = v
      // console.log('state', state, v)
    }
  },
  actions: {
    ToggleSideBar: ({ rootState }) => {
      console.log(rootState)
    },
    SetStoreAppCount: ({commit, state, rootState}, payload) => {
      commit('SET_COUNT', payload)
    }
  }
}

export default store
