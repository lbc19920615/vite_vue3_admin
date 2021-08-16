import { createStore } from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import storeApp from './modules/storeApp'
import getters from './getters'
import createPersistedPlugin from './plugins/createPersistedPlugin.js'
const persistedPlugin = createPersistedPlugin()


const store = createStore({
  modules: {
    app,
    permission,
    storeApp,
  },
  getters,
  plugins: [persistedPlugin],
})

export default store
