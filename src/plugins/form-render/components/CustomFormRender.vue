<script lang="jsx">
import {defineComponent, h, onMounted, watch, reactive, resolveComponent, ref} from "vue";

export default defineComponent({
  // template: '#' + templateId,
  name: "CustomFormRender",
  props: {
    ui: {
      type: Object,
      default() {
        return {}
      }
    },
    modelValue: null
  },
  setup(props, {emit}) {
    let { widget, widgetConfig } = props.ui
    const widgetInstance = ref()
    const widgetDef = resolveComponent(widget)
    // onMounted(() => {
    //   console.log('widgetDef', props)
    // })
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
      console.log('custom render onChange', e, widgetInstance)
      emit('update:modelValue', e)
    }

    function onChange(e) {
      console.log('onChange', e)
    }

    return () => (<widgetDef ui={props.ui} ref={widgetInstance}  onChange={onChange} onUpdate:modelValue={onUpdateModelValue}
                             modelValue={obj.value} config={widgetConfig}></widgetDef>)
  }
})
</script>

