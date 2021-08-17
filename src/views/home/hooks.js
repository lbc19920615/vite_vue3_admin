import {onMounted, watch} from "vue";

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
  function search(...args) {
    return ZY.lodash.filter(refVar, ...args)
  }
  return {
    del,
    search,
    update
  }
}

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
