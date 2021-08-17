import CustomFormRender from './components/CustomFormRender.vue'
import UnitInput from "@/components/UnitInput.vue";
import CusDateTimePicker from "@/components/CustomForm/CusDateTimePicker.vue";
import CusSelect from "@/components/CustomForm/CusSelect.vue";

import VantDateTimePicker from "@/components/CustomVant/VantDateTimePicker.vue";

import jsxCom from '@/components/jsxcom.vue'

const plugin = {
    install(app) {
        import('@/components/CodeEditor/JsonCodeEditor.vue').then(res => {
            let JsonCodeEditor = res.default
            app.component('JsonCodeEditor', JsonCodeEditor)
        })

        app.component(CustomFormRender.name, CustomFormRender)
        app.component(UnitInput.name, UnitInput)
        app.component(CusDateTimePicker.name, CusDateTimePicker)
        app.component(CusSelect.name, CusSelect)
        app.component(VantDateTimePicker.name, VantDateTimePicker)

        app.component(jsxCom.name, jsxCom)
    }
};

export default plugin
