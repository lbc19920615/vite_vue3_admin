import {formEditorConfig, rowEditorConfig} from "./editorConfig";

let plugins = new Map()
let clsDefs = new Map()

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
            props: '{links: [], deps: []}',
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


export function register (value) {
  if (value && value.install) {
    let plugin = value.install({
      V1Node,
      ClosureNode,
      LayoutNode
    })
    plugins.set(plugin.type, value)
    clsDefs.set(plugin.type, plugin)
  }
}

export function def(type, ...args) {
  // console.log(clsDefs, name)
  if (clsDefs.has(type)) {
    let clsDef = clsDefs.get(type)
    if (clsDef && clsDef.cls) {
      return new clsDef.cls(...args)
    }
  }
}


export function create(type, jsonlikeobj) {
  if (type === 'row') {
    return new RowNode(jsonlikeobj.id, jsonlikeobj.items)
  }
  else if (type === 'column') {
    return new ColumnNode(jsonlikeobj.id, jsonlikeobj.items)
  }
  else if (type === 'form')  {
    return new FormNode(jsonlikeobj.id, jsonlikeobj.data, jsonlikeobj.content)
  }
  else {
    if (clsDefs.has(type)) {
      let clsDef = clsDefs.get(type)
      if (clsDef && clsDef.fromJSON5) {
        return clsDef.fromJSON5(jsonlikeobj)
      }
    } else {
      console.log('hahahahahahahahahaha')
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
    if (clsDefs.has(jsonlikeobj.type)) {
      let name = jsonlikeobj.type
      let clsDef = clsDefs.get(name)
      if (clsDef && clsDef.fromJSON5) {
        return clsDef.fromJSON5(jsonlikeobj)
      }
    } else {
      console.log('hahahahahahahahahaha')
    }
  }
}
