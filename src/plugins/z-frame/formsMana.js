import {toRaw} from "vue";

export class FormsMana {
  static formsMap = new Map();
  static STORAGE_KEY = 'form-mana-key';
  static async setStorage(v = null) {
    let self = this
    if (Array.isArray(v)) {
      v.forEach((item) => {
        // formsMap[item.name] = item.value
        self.formsMap.set(item.name, item.value)
      })
    }
    return ZY_EXT.store.setItem(self.STORAGE_KEY, {
      date: Date.now(),
      version: ZY.rid(),
      data: formsMap
    })
  }
  static async saveCache2File(cached = null, {fileName = ZY.rid(6)} = {}) {
    let self = this
    if (!cached) {
      // cached = this.getOptions()
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
  static async loadFile() {
    let self = this
    let text = ''
    const blob = await ZY_EXT.FS.fileOpen({
      mimeTypes: ['text/*'],
    });
    if (blob) {
      text = await blob.text()
      try {
        let obj = ZY.JSON5.parse(text)
        let {data } = obj
        if (Array.isArray(data)) {
          await self.setStorage(data)
          return data;
        }
      } catch (e) {
        //
      }
    }
  }
  static getOptions() {
    let self = this
    let v = []
    self.formsMap.forEach((value, key) => {
      v.push({
        label: key,
        value
      })
    })
    return v
  }
  static async init() {
    let self = this
    let cached = await ZY_EXT.store.getItem(self.STORAGE_KEY)
    if (cached) {
      let { data = new Map() } = cached
      // formsMap = cached
      data.forEach((item, key) => {
        // console.log(item, key)
        self.formsMap.set(key, item)
      })
    }
  }
}

export function useFormsMana() {
  return FormsMana;
}

export function install(app = {config: {globalProperties: {}}}) {
  app.config.globalProperties.$FormsMana = FormsMana

  FormsMana.init()

  globalThis._APP_FormsMana = FormsMana
}
