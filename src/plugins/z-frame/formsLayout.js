import {createStaticFormCls} from "./BaseForm.js";

export class FormsLayout extends createStaticFormCls() {
  static STORAGE_KEY = 'form-layout_';
  constructor() {
    super();
  }
}

