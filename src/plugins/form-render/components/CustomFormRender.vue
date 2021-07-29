<script lang="jsx">
import {defineComponent, h, onMounted, watch, reactive, resolveComponent} from "vue";

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
    const widgetDef = resolveComponent(widget)
    // onMounted(() => {
    //   console.log('widgetDef', props)
    // })
    const obj = reactive({
      value: props.modelValue
    })

    watch(() => props.modelValue, (newVal) => {
      // console.log('custom', newVal)
      obj.value = newVal
    }, { immediate: true })

    function onUpdateModelValue(e) {
      console.log('custom render onChange', e)
      emit('update:modelValue', e)
    }

    function onChange(e) {
      console.log('onChange', e)
    }

    return () => (<widgetDef ui={props.ui}  onChange={onChange} onUpdate:modelValue={onUpdateModelValue}
                             modelValue={obj.value} config={widgetConfig}></widgetDef>)
  }
})
</script>

