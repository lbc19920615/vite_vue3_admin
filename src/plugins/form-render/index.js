import CustomFormRender from './components/CustomFormRender.vue'
import UnitInput from "@/components/UnitInput.vue";
import JsonCodeEditor from '@/components/CodeEditor/JsonCodeEditor.vue'

const plugin = {
    install(app) {
        app.component('JsonCodeEditor', JsonCodeEditor)
        app.component(CustomFormRender.name, CustomFormRender)
        app.component(UnitInput.name, UnitInput)
    }
};

export default plugin
