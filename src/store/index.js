import { createStore } from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import sapp from './modules/storeApp'
import tools from './modules/tools'
import getters from './getters'
// import createPersistedPlugin from './plugins/createPersistedPlugin.js'
// const persistedPlugin = createPersistedPlugin()
import VuexPersistence from 'vuex-persist'

let vuexLocal = new VuexPersistence()

const store = createStore({
  modules: {
    app,
    permission,
    sapp,
    tools,
  },
  getters,
  plugins: [
    // vuexLocal.plugin
  ],
})

export default store
