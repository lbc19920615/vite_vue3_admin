// import fieldContent from '@my-virtual-file:src=template-field.twig'
// import coma from "__remote/coma.js"
//
// console.log(coma)

export function install (app) {

  app.config.globalProperties.$defineComponent = function(name, {template = '', def = {}} = {}) {
    if (!app._instance.appContext.components[name]) {
      app.component(name, {
        template,
        ...def
      })
    }
  };

  import('@my-virtual-file:src=template-field.twig').then(res => {
    let templateId = 'cm-field-tpl'

    globalThis.initTemplate(templateId, globalThis, {
      html: res.default
    })

    app.component('cm-field', {
      template: '#' + templateId,
      props: {
        prop: String,
        label: String,
        type: String,
        formPath: String,
        modelValue: null
      },
      setup(props, {emit}) {
        const { ref, onMounted } = Vue
        // console.log(props.modelValue)
        onMounted(() => {
          value.value = props.modelValue
        })

        const value = ref(null)
        function onInput(e) {
          // console.log('onInput', props.modelValue, e)
          // console.log('value.value', value.value)
          emit('update:modelValue', value.value)
        }
        function onChange(e) {
          emit('update:modelValue', value.value)
        }
        return {
          onInput,
          value,
          onChange,
        }
      }
    })
  })

  // globalThis.loadTemplate('cm-field-tpl', globalThis, {
  //   path: 'template-field'
  // }).then(({html}) => {
  //   // console.log('html', html)
  // })
}
