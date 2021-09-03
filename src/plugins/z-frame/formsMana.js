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
