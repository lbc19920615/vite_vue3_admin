<script lang="jsx">
import {defineComponent, watch, reactive, resolveComponent, ref} from "vue";

export default defineComponent({
  name: "CustomFormRender",
  props: {
    ui: {
      type: Object,
      default() {
        return {}
      }
    },
    props: {
      type: Object,
      default() {
        return {}
      }
    },
    context: null,
    rules: null,
    modelValue: null
  },
  setup(props, {emit}) {
    let { widget, widgetConfig } = props.ui
    const widgetInstance = ref()
    const widgetDef = resolveComponent(widget)

    // console.log('context', props.context)

    const obj = reactive({
      value: props.modelValue
    })

    let insertOnce = false

    watch(() => props.modelValue, (newVal) => {
      // console.log('custom', newVal, widgetInstance)
      obj.value = newVal
      if (!insertOnce) {
        if (widgetInstance && widgetInstance.value) {
          // console.log('widgetInstance', widgetInstance.value.handlePropChange)
          if (widgetInstance.value.handlePropChange) {
            insertOnce = true
            widgetInstance.value.handlePropChange(newVal)
          }
        }
      }
    }, { immediate: true })

    function onUpdateModelValue(e) {
      // console.log('custom render onChange', e, widgetInstance)
      emit('update:modelValue', e)
    }

    function onValueChange(e) {
      emit('update:modelValue', e)
      emit('change', e)
    }

    return () => (<widgetDef ui={props.ui} props={props} context={props.context} rules={props.rules} ref={widgetInstance} onValuechange={onValueChange} onUpdate:modelValue={onUpdateModelValue}  modelValue={obj.value} config={widgetConfig}></widgetDef>)
  }
})
</script>

