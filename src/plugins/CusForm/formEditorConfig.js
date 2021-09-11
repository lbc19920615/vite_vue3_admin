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
      },
    },
    parts: {
      type: 'array',
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
          },
          ui: {
            type: 'string',
            ui: {
              label: 'UI',
              widget: 'JsonCodeEditor',
              widgetConfig: {
                style: {
                  height: "100px",
                }
              }
            }
          },
          props: {
            type: 'string',
            ui: {
              widget: 'CusProps',
              widgetConfig: {
              }
            }
          },
          properties: {
            type: 'string',
            reflect: 'props',
            reflectTpl: `A.getProps($VAL)`,
            ui: {
              widgetConfig: {
                type: 'textarea',
                readonly: true,
              }
            }
          },
          defaultVal: {
            type: 'string',
            ui: {
              label: 'DEFAULT',
              widget: 'JsonCodeEditor',
              widgetConfig: {
                style: {
                  height: "200px",
                }
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
      parts: [
        {
          type: 'form',
          name: 'form_' + ZY.rid(6),
          ui: '{}',
          props: '{links: [], deps: []}',
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
