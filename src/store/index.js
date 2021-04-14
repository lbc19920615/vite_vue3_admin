import { createStore } from 'vuex'
import app from './modules/app'
import permission from "./modules/permission";

const store = createStore({
  modules: {
    app,
    permission,
  },
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

export default store
