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

        // widget: 'CusInput',
        widgetConfig: {
          // disabled: true
          // style: 'width: 30vw'
        }
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
              styles: [
                ['height', 0],
                ['overflow', 'hidden'],
              ],
              widgetConfig: {
                enums: "ROOT_STATE('tools.partOptions', [])",
              },
              events: {
              }
            },
          },
          drag_props: {
            type: 'string',
            ui: {
              label: '属性',
              // hiddenLabel: true,
              // form_item: {
              //   labelWidth: '0px',
              // },
              widget: 'CusDragXml',
              widgetConfig: {
                // flat: true
                hiddenAction: true
              }
            }
          },
          ui2: {
            type: 'string',
            ui: {
              widget: 'CusUI',
              label: 'UI编辑',
              widgetConfig: {
                propsV2: true
              }
            }
          },
          slots: {
            type: 'array',
            ui: {
              label: '片段',
              showAddBtn: true,
            },
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  ui: {
                    label: '片段名',
                    widget: 'CusSuggest',
                    widgetConfig: {
                      useLabelTip: 'labelTip',
                      mode: 'select',
                      enums: "ROOT_STATE('tools.slotTypes', [])",
                      listStyle: 'height: 300px; overflow: auto;'
                    }
                  }
                },
                layouts: {
                  type: 'string',
                  tag: 'div',
                  ui: {
                    label: '片段XML',
                    widget: 'CusLayoutEditor',
                    widgetConfig: {
                      // suffix: 'slayout',
                      mode: 'xml',
                      weapp: true,
                      dragLib: 'base'
                    }
                  }
                },
                value: {
                  type: 'string',
                  reflect: 'layouts',
                  reflectOptions: {
                    v2: true
                  },
                  reflectTpl: `A.buildAllXml($VAL)`,
                  ui: {
                    styles: [
                      ['height', 0],
                      ['overflow', 'hidden'],
                    ],
                    widget: 'CusXmlShower',
                    widgetConfig: {
                      type: 'textarea',
                      disabled: true,
                    }
                  }
                },
                // value2: {
                //   type: 'string',
                //   reflect: 'layouts',
                //   reflectOptions: {
                //     v2: true
                //   },
                //   reflectTpl: `A.buildWeappXML($VAL)`,
                //   ui: {
                //     styles: [
                //       // ['height', 0],
                //       // ['overflow', 'hidden'],
                //     ],
                //     widget: 'CusXmlShower',
                //     widgetConfig: {
                //       type: 'textarea',
                //       disabled: true,
                //     }
                //   }
                // },
              }
            }
          },
          computed2: {
            type: 'string',
            ui: {
              label: '计算属性',
              styles: [
                ['height', 0],
                ['overflow', 'hidden'],
              ],
              widget: 'CusComputed',
              widgetConfig: {
                style: {
                  height: "350px",
                  overflow: 'auto'
                },
                // enums: 'MODEL("name")'
              }
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
              styles: [
                ['height', 0],
                ['overflow', 'hidden'],
              ],
              // widget: 'CodeJsEditor',
              widgetConfig: {
                style: {
                  height: "200px",
                }
              }
            }
          },
          name: {
            type: 'string',
            ui: {
              label: '名称',
              styles: [
                ['height', 0],
                ['overflow', 'hidden'],
              ],
              widgetConfig: {
                readonly: true
              }
            },
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
            reflect: 'drag_props',
            reflectTpl: `A.getDragProps($VAL)`,
            ui: {
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
          metas: {
            type: 'string',
            reflect: 'drag_props',
            reflectTpl: `A.getDragMetas($VAL)`,
            ui: {
              // styles: [
              //   ['height', 0],
              //   ['overflow', 'hidden'],
              // ],
              widgetConfig: {
                type: 'textarea',
                disabled: true,
              }
            }
          },
          drag_cached: {
            type: 'string',
            reflect: 'drag_props',
            reflectTpl: `A.getDragDatas($VAL)`,
            ui: {
              // styles: [
              //   ['height', 0],
              //   ['overflow', 'hidden'],
              // ],
              widgetConfig: {
                type: 'textarea',
                disabled: true,
              }
            }
          },
          // properties: {
          //   type: 'string',
          //   reflect: 'props',
          //   reflectTpl: `A.getProps($VAL)`,
          //   ui: {
          //     attrs: [
          //       // ['style', 'height: 0; overflow: hidden']
          //     ],
          //     styles: [
          //       ['height', 0],
          //       ['overflow', 'hidden'],
          //     ],
          //     widgetConfig: {
          //       type: 'textarea',
          //       disabled: true,
          //     }
          //   }
          // },
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
          // defaultVal: '{}',
          slots: []
        }
      ]
    }
  },
  computed,
  def: formDef,
});

export default _config
