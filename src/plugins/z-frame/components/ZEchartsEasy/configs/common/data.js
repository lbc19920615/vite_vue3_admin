export function createDataProps() {
  return {
    type: 'array',
    tag: 'my-vue-tab',
    con_tag: 'my-vue-tab-pane',
    ui: {
      label: '数据',
      attrs: [
        [':height', '300'],
      ],
      class: [
        'a-space-mb-10'
      ],
      conAttrs: [
        {
          // prefixValue: '"数据"+',
          prefixValue: '"数据" + (handleAttrVal(',
          handler: ['c', 'return [":name", c.indexKey ]'],
          suffixValue: ') + 1)'
        }
      ],
      conClass: [
      ]
    },
    items: {
      type: 'object',
      properties: {
        value: {
          type: 'string',
          ui: {
            form_item: {
              ['label-width']: '90px'
            },
          }
        },
        name: {
          type: 'string',
          ui: {
            form_item: {
              ['label-width']: '90px'
            },
          }
        }
      }
    }
  }
}
