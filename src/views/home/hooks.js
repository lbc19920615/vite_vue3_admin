import {onMounted, watch, toRaw, reactive} from "vue";

/**
 *
 * @param refVar
 * @returns {{search: (function(...[*]): *), update: update, del: del}}
 */
export function useArrHandler(refVar) {
  function del(index) {
    refVar.splice(index, 1)
  }
  function update(index, obj = {}) {
    if (refVar[index]) {
      let target = refVar[index]
      for (let k in obj) {
        target[k] = obj[k]
      }
    }
  }
  function search(fun) {
    let obj = toRaw(refVar)
    return ZY.lodash.filter(obj, fun)
  }
  return {
    del,
    search,
    update
  }
}

/**
 *
 * @param refVar
 * @param storageName
 */
export function storeVar(refVar, storageName) {
  if (Array.isArray(refVar)) {
    onMounted(() => {
      let todosCache = localStorage.getItem(storageName)
      if (todosCache) {
        let arr = JSON.parse(todosCache)
        arr.forEach(item => {
          refVar.push(item)
        })
      }
    })
    watch(refVar, (newVal) => {
      // console.log('isShow', newVal)
      localStorage.setItem(storageName, JSON.stringify(newVal))
    })
  }
}

export function useReloadMan({timeout} = {}) {
  let state = reactive({
    showed: false
  })
  function setShowed(v) {
    state.showed = false
    setTimeout(() => {
      state.showed = true
      console.log('sdsdsdsds')
    }, timeout)
  }
  return [
    state,
    setShowed
  ]
}
