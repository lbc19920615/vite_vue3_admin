import {onMounted, watch, toRaw, reactive} from "vue";

/**
 *
 * @param model
 * @param key
 * @returns {{search: (function(...[*]): *), update: update, del: del}}
 */
export function useArrHandler(model, key) {
  function del(index) {
    let refVar = model[key]
    refVar.splice(index, 1)
  }
  function update(index, obj = {}) {
    let refVar = model[key]
    if (refVar[index]) {
      let target = refVar[index]
      for (let k in obj) {
        target[k] = obj[k]
      }
    }
  }
  function search(fun) {
    let refVar = model[key]
    // console.log(refVar)
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
  function setShowed() {
    state.showed = false
    setTimeout(() => {
      state.showed = true
    }, timeout)
  }
  return [
    state,
    setShowed
  ]
}
