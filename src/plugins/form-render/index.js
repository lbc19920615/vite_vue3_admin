import CustomFormRender from './components/CustomFormRender.vue'
import UnitInput from "@/components/UnitInput.vue";
import JsonCodeEditor from '@/components/CodeEditor/JsonCodeEditor.vue'
import CusDateTimePicker from "@/components/CustomForm/CusDateTimePicker.vue";
import CusSelect from "@/components/CustomForm/CusSelect.vue";

import VantDateTimePicker from "@/components/CustomVant/VantDateTimePicker.vue";

const plugin = {
    install(app) {
        app.component('JsonCodeEditor', JsonCodeEditor)
        app.component(CustomFormRender.name, CustomFormRender)
        app.component(UnitInput.name, UnitInput)
        app.component(CusDateTimePicker.name, CusDateTimePicker)
        app.component(CusSelect.name, CusSelect)
        app.component(VantDateTimePicker.name, VantDateTimePicker)
    }
};

export default plugin
