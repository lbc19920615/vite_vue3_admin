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
    },
    currentPlayGround: {}
  }),
  mutations: {
    SET_COUNT: (state, v) => {
      state.count = v
      // console.log('state', state, v)
    },
    SET_PLAY: (state, v) => {
      state.currentPlayGround = v
      localStorage.setItem('current_playground', v)
    }
  },
  actions: {
    ToggleSideBar: ({ rootState }) => {
      console.log(rootState)
    },
    SetStoreAppCount: ({commit, state, rootState}, payload) => {
      commit('SET_COUNT', payload)
    },
    SetStoreData: ({commit}, payload) => {
      commit('SET_PLAY', payload)
    }
  }
}

export default store
