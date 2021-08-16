import { createStore } from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import sapp from './modules/storeApp'
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
  },
  getters,
  plugins: [
    // vuexLocal.plugin
  ],
})

export default store
