import {toRaw} from "vue";

const FORM_MANA_KEY = 'form-mana-key';

const formsMap = new Map();

export class FormsMana {
  static async setStorage(v = null) {
    if (Array.isArray(v)) {
      v.forEach((item) => {
        // formsMap[item.name] = item.value
        formsMap.set(item.name, item.value)
      })
    }
    return ZY_EXT.store.setItem(FORM_MANA_KEY, {
      date: Date.now(),
      version: ZY.rid(),
      data: formsMap
    })
  }
  static async saveCache2File(cached = null) {
    if (!cached) {
      cached = FormsMana.getOptions()
    }
    await ZY_EXT.saveObjAsJson5File({
      data: toRaw(cached),
      date: Date.now(),
      version: "v1",
    }, FORM_MANA_KEY + '_' + ZY.rid(6))
  }
  static async loadFile() {
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
          await FormsMana.setStorage(data)
          return data;
        }
      } catch (e) {
        //
      }
    }
  }
  static getOptions() {
    let v = []
    formsMap.forEach((value, key) => {
      v.push({
        label: key,
        value
      })
    })
    return v
  }
  static async init() {
    let cached = await ZY_EXT.store.getItem(FORM_MANA_KEY)
    if (cached) {
      let { data = new Map() } = cached
      // formsMap = cached
      data.forEach((item, key) => {
        // console.log(item, key)
        formsMap.set(key, item)
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
}
