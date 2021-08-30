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
