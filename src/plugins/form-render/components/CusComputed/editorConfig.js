import {baseConfig} from "@/plugins/z-frame/hooks/form";

let codes = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
]

codes = codes.concat(
  codes.map(v => {
    return v.toUpperCase()
  })
)

let formDef = {
  type: 'object',
  ui: {
    attrs: [
      ['label-width', '100px']
    ],
  },
  properties: {
    parts: {
      type: 'array',
      ui: {
        label: "部分"
      },
      items: {
        type: "object",
        properties: {
          name: {
            type: 'string',
            ui: {
              label: 'NAME',
            },
          },
          value: {
            type: 'string',
            ui: {
              label: '值',
              widget: 'CusInsert',
              widgetConfig: {
                insText: [
                  ',',
                  '\'',
                  ...codes,
                  '(',
                  ')'
                ],
                insFun: [
                  'MODEL'
                ]
              }
            },
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
          name: 'form_' + ZY.rid(6),
        }
      ]
    }
  },
  computed,
  def: formDef,
});

export default _config
