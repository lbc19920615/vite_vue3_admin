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
  emits: [
    'fchange',
    'change',
    'update:modelValue'
  ],
  setup(props, {emit}) {
    let { widget, widgetConfig } = props.ui
    const widgetInstance = ref()
    const widgetDef = resolveComponent(widget)

    // console.log('context', props.context)

    const obj = reactive({
      value: props.modelValue
    })

    let lock = new ZY.Lock()
    let lockTime = 1000

    // let insertOnce = false

    watch(() => props.modelValue, (newVal) => {
      // console.log('custom', newVal, widgetInstance)
      obj.value = newVal
      if (!lock.isLocked) {
        // if (widgetInstance && widgetInstance.value) {
        //   // console.log('widgetInstance', widgetInstance.value.handlePropChange)
        //   if (widgetInstance.value.handlePropChange) {
        //     insertOnce = true
        //     widgetInstance.value.handlePropChange(newVal)
        //     setTimeout(() => {
        //       insertOnce = false
        //     }, 30)
        //   }
        // }
        lock.lock(() => {
          if (widgetInstance && widgetInstance.value) {
            // console.log('widgetInstance', widgetInstance.value.handlePropChange)
            if (widgetInstance.value.handlePropChange) {
              widgetInstance.value.handlePropChange(newVal)
            }
          }
        }, lockTime)
      }
    }, { immediate: true })

    function onUpdateModelValue(e) {
      // console.log('custom render onChange', e, widgetInstance)
      emit('update:modelValue', e)
    }

    function onFchange(e) {
      // console.log('fchange', e)
      emit('fchange', e)
    }

    function onValueChange(e) {
      emit('update:modelValue', e)
      emit('change', e)
    }

    return () => (<widgetDef ui={props.ui} props={props} context={props.context} rules={props.rules} ref={widgetInstance} onFchange={onFchange} onValuechange={onValueChange} onUpdate:modelValue={onUpdateModelValue}  modelValue={obj.value} config={widgetConfig}></widgetDef>)
  }
})
</script>

