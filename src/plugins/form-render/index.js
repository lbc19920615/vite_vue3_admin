import CustomFormRender from './components/CustomFormRender.vue'
import UnitInput from "@/components/UnitInput.vue";
import CusDateTimePicker from "@/components/CustomForm/CusDateTimePicker.vue";
import CusSelect from "@/components/CustomForm/CusSelect.vue";
import CusProps from "@/components/CustomForm/CusProps.vue";
import CusForm from "@/components/CustomForm/CusForm.vue";
import CusSuggest from "@/components/CustomForm/CusSuggest.vue";
import CusSubmitButton from "@/components/CustomForm/CusSubmitButton.vue";
import MyVueTab from "@/components/MyVueTab.vue";
import MyVueTabPane from "@/components/MyVueTabPane.vue";
import ZPagination from "@/plugins/z-table/components/ZPagination.vue";

// import VantDateTimePicker from "@/components/CustomVant/VantDateTimePicker.vue";

import jsxCom from '@/components/jsxcom.vue'
import CodeJsEditor from '@/components/CodeEditor/CodeJsEditor.vue'
import HttpComponent from '@/components/HttpComponent.vue'
// import AceJsEditor from '@/components/CodeEditor/AceJsEditor.vue'
import RenderLayout from '@/views/about/components/render-layout.vue'

const plugin = {
    install(app) {
        app.component(RenderLayout.name, RenderLayout)

        import('@/components/CodeEditor/JsonCodeEditor.vue').then(res => {
            let JsonCodeEditor = res.default
            app.component('JsonCodeEditor', JsonCodeEditor)
        })

        app.component(CustomFormRender.name, CustomFormRender)
        app.component(UnitInput.name, UnitInput)
        app.component(CusDateTimePicker.name, CusDateTimePicker)
        app.component(CusSelect.name, CusSelect)
        app.component(CusProps.name, CusProps)
        app.component(CusForm.name, CusForm)
        app.component(CusSuggest.name, CusSuggest)
        app.component(CodeJsEditor.name, CodeJsEditor)
        app.component(CodeJsEditor.name, CodeJsEditor)
        app.component(MyVueTab.name, MyVueTab)
        app.component(MyVueTabPane.name, MyVueTabPane)
        app.component(ZPagination.name, ZPagination)
        // app.component(VantDateTimePicker.name, VantDateTimePicker)
        // app.component(AceJsEditor.name, AceJsEditor)

        app.component(CusSubmitButton.name, CusSubmitButton)
        app.component(jsxCom.name, jsxCom)
        app.component(HttpComponent.name, HttpComponent)
    }
};

export default plugin
