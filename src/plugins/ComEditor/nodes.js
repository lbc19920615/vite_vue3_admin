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
  constructor(id, data, defaultContent ) {
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
    if (defaultContent) {
      this.content = defaultContent
    }
  }
}

export function createFromJSON5(type, jsonlikeobj) {
  if (jsonlikeobj.type === 'row') {
    return new RowNode(jsonlikeobj.id, jsonlikeobj.items)
  }
  else if (jsonlikeobj.type === 'column') {
    return new ColumnNode(jsonlikeobj.id, jsonlikeobj.items)
  }
  else if (jsonlikeobj.type === 'form')  {
    return new FormNode(jsonlikeobj.id, jsonlikeobj.data, jsonlikeobj.content)
  }
  else {
    console.log('hahahahaha')
  }
}
