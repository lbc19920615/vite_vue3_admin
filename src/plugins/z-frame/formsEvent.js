import {createStaticFormCls} from "./BaseForm.js";

export class FormsMana extends createStaticFormCls() {
  static STORAGE_KEY = 'form-event-key';
  constructor() {
    super();
  }
}

globalThis._APP_FormsEvent = FormsMana

export function useFormsMana() {
  return FormsMana;
}

export function install(app = {config: {globalProperties: {}}}) {
  app.config.globalProperties.$FormsMana = FormsMana

  // FormsMana.init()

  globalThis._APP_FormsMana = FormsMana
}
