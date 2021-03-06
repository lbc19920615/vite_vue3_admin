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
    currentPlayGround: {},
    pageStoreName: 'play-events-model'
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
    SetStore: ({commit, state}, payload) => {
      if (payload && payload.storeName) {
        let pageStoreName = payload.storeName
        let JSON5 = ZY.JSON5
        let cloned = JSON5.parse(JSON5.stringify(payload.model))
        ZY_EXT.store.setItem(pageStoreName, cloned)
      }
      // commit('SET_EVENTS', payload)
    },
    SetStoreLocal: ({commit, state}, payload) => {
      let {pageStoreName} = state
      let storePrefix = pageStoreName
      if (payload.storeName) {
        storePrefix = payload.storeName
      }
      if (payload.data) {
        let JSON5 = ZY.JSON5
        let cloned = JSON5.parse(JSON5.stringify(payload.data))
        ZY_EXT.store.setItem(storePrefix, cloned)
        ZY_EXT.store.setItem(pageStoreName, cloned)
      }
      // commit('SET_EVENTS', payload)
    },
    SetStoreEvents: ({commit, state}, payload) => {
      let {pageStoreName} = state
      let JSON5 = ZY.JSON5
      let cloned = JSON5.parse(JSON5.stringify(payload))
      ZY_EXT.store.setItem(pageStoreName, cloned)
      // commit('SET_EVENTS', payload)
    },
    GetStoreEvents: async ({state}, payload) => {
      let {pageStoreName} = state
      if (payload && payload.storeName) {
        return ZY_EXT.store.getItem(payload.storeName)
      }
      return ZY_EXT.store.getItem(pageStoreName)
    }
  },
  getters: {

  }
}

export default store
