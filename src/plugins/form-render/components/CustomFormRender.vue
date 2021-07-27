<script lang="jsx">
import {defineComponent, h, onMounted, reactive, resolveComponent} from "vue";


const templateId = 'custom-form-tpl';
export default defineComponent({
  created() {
// eslint-disable-next-line no-undef
    globalThis.initTemplate(templateId, globalThis, {
      html: `<div>1111</div>`,
    });
  },
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
  setup(props) {
    let { widget, widgetConfig } = props.ui
    const widgetDef = resolveComponent(widget)
    // onMounted(() => {
    //   console.log('widgetDef', props)
    // })
    const obj = reactive({
      value: props.modelValue
    })
    
    return () => (<widgetDef modelValue={obj.value} config={widgetConfig}></widgetDef>)
  }
})
</script>

