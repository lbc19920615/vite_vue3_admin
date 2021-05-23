export default function createPersistedPlugin(options = { key: 'store' }) {
  return (store) => {
    let sessionStore = JSON.parse(sessionStorage.getItem(options.key))
    if (sessionStore) {
      store.replaceState(sessionStore)
    }
    sessionStore = null
    store.subscribe((mutation, state) => {
      sessionStorage.setItem(options.key, JSON.stringify(state))
    })
  }
}
