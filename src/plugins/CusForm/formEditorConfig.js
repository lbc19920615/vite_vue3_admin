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
              label: 'PART NAME',
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
              label: 'computed',
              widget: 'JsonCodeEditor',
              widgetConfig: {
                style: {
                  height: "350px",
                }
              }
            }
          },
          defaultVal: {
            type: 'string',
            ui: {
              label: '默认值',
              widget: 'JsonCodeEditor',
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
              label: 'UI',
              // widget: 'JsonCodeEditor',
              widgetConfig: {
                type: 'textarea',
                disabled: true,
                //   style: {
                //     // height: "100px",
                //   }
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
