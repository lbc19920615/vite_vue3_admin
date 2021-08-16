const storeApp = {
  namespaced: true,
  state: {
    services: new Map()
  },
  mutations: {
  },
  actions: {
    ToggleSideBar: ({ rootState }) => {
      console.log(rootState)
    },
  }
}

export default storeApp
