import CustomFormRender from './components/CustomFormRender.vue'
import UnitInput from "@/components/UnitInput.vue";
import CusDateTimePicker from "@/components/CustomForm/CusDateTimePicker.vue";
import CusSelect from "@/components/CustomForm/CusSelect.vue";
import CusSubmitButton from "@/components/CustomForm/CusSubmitButton.vue";

import VantDateTimePicker from "@/components/CustomVant/VantDateTimePicker.vue";

import jsxCom from '@/components/jsxcom.vue'
import HttpComponent from '@/components/HttpComponent.vue'

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


        app.component(CusSubmitButton.name, CusSubmitButton)
        app.component(jsxCom.name, jsxCom)
        app.component(HttpComponent.name, HttpComponent)
    }
};

export default plugin
