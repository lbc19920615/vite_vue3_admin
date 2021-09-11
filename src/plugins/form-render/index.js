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
import CusPropsEditor from "@/plugins/form-render/components/CusPropsEditor.vue";
import ZPagination from "@/plugins/z-table/components/ZPagination.vue";

// import VantDateTimePicker from "@/components/CustomVant/VantDateTimePicker.vue";

import jsxCom from '@/components/jsxcom.vue'
import CodeJsEditor from '@/components/CodeEditor/CodeJsEditor.vue'
import HttpComponent from '@/components/HttpComponent.vue'
// import AceJsEditor from '@/components/CodeEditor/AceJsEditor.vue'
import RenderLayout from '@/views/about/components/render-layout.vue'



const plugin = {
    install(app) {
        CustomVueComponent.app = app
        CustomVueComponent.register(RenderLayout)

        import('@/components/CodeEditor/JsonCodeEditor.vue').then(res => {
            let JsonCodeEditor = res.default
            CustomVueComponent.register(JsonCodeEditor,'JsonCodeEditor')
        })

        CustomVueComponent.register(CustomFormRender)
        CustomVueComponent.register(UnitInput)
        CustomVueComponent.register(CusDateTimePicker)
        CustomVueComponent.register(CusSelect)
        CustomVueComponent.register(CusProps)
        CustomVueComponent.register(CusForm)
        CustomVueComponent.register(CusSuggest)
        CustomVueComponent.register(CusPropsEditor)
        CustomVueComponent.register(CodeJsEditor)
        CustomVueComponent.register(CodeJsEditor)
        CustomVueComponent.register(MyVueTab)
        CustomVueComponent.register(MyVueTabPane)
        CustomVueComponent.register(ZPagination)
        // CustomVueComponent.register(VantDateTimePicker.name, VantDateTimePicker)
        // CustomVueComponent.register(AceJsEditor.name, AceJsEditor)

        CustomVueComponent.register(CusSubmitButton)
        CustomVueComponent.register(jsxCom)
        CustomVueComponent.register(HttpComponent)
    }
};

export default plugin
