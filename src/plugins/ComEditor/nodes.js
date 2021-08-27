import {formEditorConfig, rowEditorConfig} from "./editorConfig";

class V1Node {
  id;
  type;
  name = '';
  content = '';
  editor = '';
  items = [];
  data = null;
  config = {
    version: 'v1',
    closure: false
  }
  constructor(id) {
    this.id = id
  }
}

class ClosureNode extends V1Node {
  constructor(...args) {
    super(...args);
    this.config.closure = true
  }
}

class LayoutNode extends V1Node {
  constructor(id, items) {
    super(id, items);
    this.editor =`
${rowEditorConfig({
      form2: {}
    })}`
    this.items = items
  }
}

export class ColumnNode extends LayoutNode {
  constructor(id, items) {
    super(id, items);
    this.type = 'column'
  }
}

export class RowNode extends LayoutNode {
  constructor(id, items) {
    super(id, items);
    this.type = 'row'
  }
}

export class FormNode extends ClosureNode {


  constructor(id, data, defaultVal = {}) {
    super(id);
    this.type = 'form'
    this.editor = `
${formEditorConfig({
      form2: {
        name: ZY.nid(),
        parts: [
          {
            uis: '{}',
            properties: '{}',
          }
        ]
      }
    })}`
    this.data = data
  }

}

let formNode = new FormNode('i3',
  {
  name: 'form1',
  parts: [
    {
      uis: ZY.JSON5.stringify(
        {
          attrs: [
            [
              'label-width',
              '100px',
            ],
          ],
        }
        , null, 2),
      properties: ZY.JSON5.stringify(
        {
          parts: {
            type: 'array',
            items: {
              type: "object",
              properties: {
                key: {
                  type: 'string',
                  ui: {
                  }
                },
                ui_type: {
                  type: 'string',
                  ui: {
                  }
                },
                ui_label: {
                  type: 'string',
                  ui: {
                  }
                },
                ui_widget: {
                  type: 'string',
                  ui: {
                  }
                },
                ui_widgetConfig: {
                  type: 'string',
                  ui: {
                    widget: 'CodeJsEditor',
                    widgetConfig: {
                      style: {
                        // height: "200px",
                      }
                    }
                  }
                },
                rules: {
                  type: 'string',
                  ui: {
                    widget: 'JsonCodeEditor',
                    widgetConfig: {
                      style: {
                        height: "200px",
                      }
                    }
                  }
                }
              }
            }
          },
        }
        , null, 2),
    }
  ]
}
)
console.log(formNode)
