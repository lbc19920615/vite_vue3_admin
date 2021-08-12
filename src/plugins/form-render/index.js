import CustomFormRender from './components/CustomFormRender.vue'
import UnitInput from "@/components/UnitInput.vue";
import JsonCodeEditor from '@/components/CodeEditor/JsonCodeEditor.vue'
import CusDateTimePicker from "@/components/CustomForm/CusDateTimePicker.vue";

const plugin = {
    install(app) {
        app.component('JsonCodeEditor', JsonCodeEditor)
        app.component(CustomFormRender.name, CustomFormRender)
        app.component(UnitInput.name, UnitInput)
        app.component(CusDateTimePicker.name, CusDateTimePicker)
    }
};

export default plugin
