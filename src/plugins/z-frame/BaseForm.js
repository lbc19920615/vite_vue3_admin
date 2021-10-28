import {toRaw} from "vue";

export function createStaticFormCls() {
  return class _BaseForm {
    static formsMap = new Map();
    static STORAGE_KEY = '';

    static async setStorage(v = null) {
      let self = this
      if (Array.isArray(v)) {
        v.forEach((item) => {
          // formsMap[item.name] = item.value
          self.formsMap.set(item.name, item.value)
        })
        console.log(self.formsMap)
      }
      return ZY_EXT.store.setItem(self.STORAGE_KEY, {
        date: Date.now(),
        version: ZY.rid(),
        data: self.formsMap
      })
    }

    static async saveCache2File(cached = null, {fileName = ZY.rid(6)} = {}) {
      let self = this
      if (!cached) {
        return Promise.reject(new Error('saveCache2File must has', {
          cause: new Error('saveCache2File')
        }))
      }
      await ZY_EXT.saveObjAsJson5File({
        data: toRaw(cached),
        date: Date.now(),
        version: "v1",
      }, self.STORAGE_KEY + '_' + fileName)
    }

    static async readFile() {
      let self = this

      let obj = await ZY_EXT.fileOpenJSON5()
      let {data} = obj
      return data
    }

    static async loadFile() {
      let self = this

      let obj = await ZY_EXT.fileOpenJSON5()
      // console.log('loadFile', obj)
      let { data } = obj
      if (Array.isArray(data)) {
        await self.setStorage(data)
        return data;
      }
    }

    static getOptions() {
      let self = this
      let v = []
      self.formsMap.forEach((value, key) => {
        v.push({
          label: key,
          name: key,
          value
        })
      })
      return v
    }

    static async init() {
      let self = this
      let cached = await ZY_EXT.store.getItem(self.STORAGE_KEY)
      if (cached) {
        let {data = new Map()} = cached
        // formsMap = cached
        // console.log(data)
        data.forEach((item, key) => {
          // console.log(item, key)
          self.formsMap.set(key, item)
        })
      }
    }
  }

}
