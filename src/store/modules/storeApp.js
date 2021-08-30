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
      // localStorage.setItem('current_playground', v)
    },
    SET_EVENTS: (state, v) => {
      // state.currentPlayGround = v
      // localStorage.setItem('current_playground', v)

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
    },
    SetStoreEvents: ({commit}, payload) => {
      let JSON5 = ZY.JSON5
      let cloned = JSON5.parse(JSON5.stringify(payload))
      ZY_EXT.store.setItem('play-events-model', cloned)
      // commit('SET_EVENTS', payload)
    },
    GetStoreEvents: async () => {
      return ZY_EXT.store.getItem('play-events-model')
    }
  },
  getters: {

  }
}

export default store
