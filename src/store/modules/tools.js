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
      }
    ]
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
