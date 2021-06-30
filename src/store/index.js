import { createStore } from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import getters from './getters'
import createPersistedPlugin from './plugins/createPersistedPlugin.js'
const persistedPlugin = createPersistedPlugin()

const demoModule = {
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count = state.count + 1
    },
  },
}

const store = createStore({
  modules: {
    app,
    demoModule,
    permission,
  },
  getters,
  plugins: [persistedPlugin],
})

export default store
