import {baseConfig, rowEditorConfig} from "./editorConfig";

let plugins = new Map()
let clsDefs = new Map()

export function getClsDefs() {
  return Array.from(clsDefs)
}

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
  constructor(id, items, jsonlikeobj) {
    super(id, items);
    this.editor =`
${rowEditorConfig({
      form2: {
        attrs: {},
      }
    })}`
    // console.log(items, jsonlikeobj)
    this.items = items
    if (!this.data) {
      this.data = {
        items,
        attrs: {
        },
      }
    }
    let str_data = jsonlikeobj.str_data
    if (str_data) {

      try {
        let obj = ZY.JSON5.parse(str_data)
        if (obj.attrs) {
          this.data.attrs = obj.attrs
        }
      } catch (e) {
      console.log(e)
      }
    }
  }
}

export class ColumnNode extends LayoutNode {
  constructor(id, items, jsonlikeobj) {
    super(id, items, jsonlikeobj);
    this.type = 'column'
  }
}

export class RowNode extends LayoutNode {
  constructor(id, items, jsonlikeobj) {
    super(id, items, jsonlikeobj);
    this.type = 'row'
  }
}

let formEditorConfig = function () {
  return  baseConfig( {
    type: 'object',
    ui: {
      attrs: [
        ['label-width', '100px']
      ],
    },
    properties: {
      name: {
        type: 'string',
        ui: {
          label: '名称',
        },
      },
      partName: {
        type: 'string',
        ui: {
          label: '页面变量名',
        },
      },
    }
  }, {
    // ['cur_deep_props']: `A.getProps(MODEL('parts[0].props'))`,
    doubled: "MODEL('name', '') + ',s'"
  }, {
    defaultVal: {
      form2: {
        name: ZY.nid(),
        parts: [
          {
            ui: '{}',
            props: '{links: [], deps: []}',
            properties: '{}',
          }
        ]
      }
    }
  })
}

export class FormNode extends ClosureNode {
  constructor(id, data, defaultContent ) {
    super(id);
    this.type = 'form'
    this.typeLabel = '部分'
    this.editor = `${formEditorConfig()}`
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
  // console.log(clsDefs, type)
  if (clsDefs.has(type)) {
    let clsDef = clsDefs.get(type)
    if (clsDef && clsDef.cls) {
      return new clsDef.cls(...args)
    }
  }
}

export function handleItemAppend(newItem, dep) {
  let type = dep.type
  if (dep.type === 'column') {
    newItem.h = 120
  }
  else if (dep.type === 'row') {
    newItem.w = '1fr'
    newItem.h = 50
  }
  else {
    if (clsDefs.has(type)) {
      let clsDef = clsDefs.get(type)
      if (clsDef && clsDef.handleItemAppend) {
        clsDef.handleItemAppend(newItem, dep)
      }
    } else {
      console.log('hahahahahahahahahaha')
    }
  }
}

export function create(type, jsonlikeobj) {
  if (type === 'row') {
    return new RowNode(jsonlikeobj.id, jsonlikeobj.items, jsonlikeobj)
  }
  else if (type === 'column') {
    return new ColumnNode(jsonlikeobj.id, jsonlikeobj.items, jsonlikeobj)
  }
  else if (type === 'form')  {
    return new FormNode(jsonlikeobj.id, jsonlikeobj.data, jsonlikeobj.content, jsonlikeobj)
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
    return new RowNode(jsonlikeobj.id, jsonlikeobj.items, jsonlikeobj)
  }
  else if (jsonlikeobj.type === 'column') {
    return new ColumnNode(jsonlikeobj.id, jsonlikeobj.items, jsonlikeobj)
  }
  else if (jsonlikeobj.type === 'form')  {
    return new FormNode(jsonlikeobj.id, jsonlikeobj.data, jsonlikeobj.content, jsonlikeobj)
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

let editorConfig = new Map()

export function registerEditorConfig(name, value) {
  editorConfig.set(name, value)
}

export function getEditorConfig(name) {
  if (editorConfig.has(name)) {
    return editorConfig.get(name)
  }
  return null
}

globalThis.NODE_editorConfig = editorConfig

export function createItem(id, key, name = key) {
  return    {
    id: id + '-' + ZY.rid(6),
    name,
    key,
  }
}
