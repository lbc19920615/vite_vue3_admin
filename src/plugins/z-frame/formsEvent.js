import {createStaticFormCls} from "./BaseForm.js";

export class FormsEvent extends createStaticFormCls() {
  static STORAGE_KEY = 'form-event-key';
  constructor() {
    super();
  }
}

globalThis._APP_FormsEvent = FormsEvent

export function useFormsEvent() {
  return FormsEvent;
}

export function install(app = {config: {globalProperties: {}}}) {
  app.config.globalProperties.$FormsEvent = FormsEvent

  // FormsEvent.init()

  globalThis._APP_FormsEvent = FormsEvent
}
