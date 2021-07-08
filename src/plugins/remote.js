export function install (app) {
  globalThis.loadTemplate('cm-field-tpl', globalThis, {
    path: 'template-field'
  }).then(({html}) => {
    // console.log('html', html)
    app.component('cm-field', {
      template: html,
      props: {
        prop: String,
        label: String,
        type: String,
        formPath: String,
        modelValue: null
      },
      setup(props, {emit}) {
        const { ref } = Vue
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
}