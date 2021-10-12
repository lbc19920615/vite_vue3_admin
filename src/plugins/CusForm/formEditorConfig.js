import {baseConfig} from "@/plugins/z-frame/hooks/form";

let formDef = {
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
        // widgetConfig: {
        //   disabled: true
        // }
      },
      hidden: true,
    },
    parts: {
      type: 'array',
      ui: {
        label: "部分"
      },
      items: {
        type: "object",
        properties: {
          type: {
            type: 'string',
            ui: {
              label: '类型',
              widget: 'CusSelect',
              widgetConfig: {
                enums: "ROOT_STATE('tools.partOptions', [])",
              },
              events: {
              }
            },
          },
          name: {
            type: 'string',
            ui: {
              label: '名称',
            },
          },
          props: {
            type: 'string',
            ui: {
              label: '属性',
              widget: 'CusProps',
              widgetConfig: {
              }
            }
          },
          computed2: {
            type: 'string',
            ui: {
              label: '计算属性',
              widget: 'CusComputed',
              widgetConfig: {
                style: {
                  height: "350px",
                },
                // enums: 'MODEL("name")'
              }
            }
          },
          ui2: {
              type: 'string',
              ui: {
                widget: 'CusUI',
                label: 'UI编辑',
              }
          },
          computed: {
            type: 'string',
            ui: {
              label: '计算属性',
              styles: [
                ['height', 0],
                ['overflow', 'hidden'],
              ],
              // widget: 'JsonCodeEditor',
              widgetConfig: {
                style: {
                  height: "200px",
                }
              }
            }
          },
          defaultVal: {
            type: 'string',
            ui: {
              label: '默认值',
              // widget: 'JsonCodeEditor',
              widget: 'CodeJsEditor',
              widgetConfig: {
                style: {
                  height: "200px",
                }
              }
            }
          },
          ui: {
            type: 'string',
            reflect: 'ui2',
            reflectTpl: 'A.parseUIObj($VAL)',
            ui: {
              // attrs: [
              //   ['style', 'height: 0; overflow: hidden']
              // ],
              styles: [
                ['height', 0],
                ['overflow', 'hidden'],
              ],
              label: 'UI',
              // widget: 'JsonCodeEditor',
              widgetConfig: {
                type: 'textarea',
                disabled: true,
              }
            }
          },
          properties: {
            type: 'string',
            reflect: 'props',
            reflectTpl: `A.getProps($VAL)`,
            ui: {
              attrs: [
                // ['style', 'height: 0; overflow: hidden']
              ],
              styles: [
                ['height', 0],
                ['overflow', 'hidden'],
              ],
              widgetConfig: {
                type: 'textarea',
                disabled: true,
              }
            }
          },
        }
      }
    },
  }
}

let computed = {}

let _config = baseConfig({
  defaultVal: {
    form2: {
      name: ZY.nid(),
      computed: '{}',
      parts: [
        {
          type: 'form',
          name: 'form_' + ZY.rid(6),
          ui: '{}',
          props: '{links: [], deps: [], posMap: []}',
          properties: '{}',
          defaultVal: '{}',
        }
      ]
    }
  },
  computed,
  def: formDef,
});

export default _config
