import CustomFormRender from './components/CustomFormRender.vue'
import UnitInput from "@/components/UnitInput.vue";
import CusDateTimePicker from "@/components/CustomForm/CusDateTimePicker.vue";
import CusTimePicker from "@/components/CustomForm/CusTimePicker.vue";
import CusSelect from "@/components/CustomForm/CusSelect.vue";
import CusRadio from "@/components/CustomForm/CusRadio.vue";
import CusCheckbox from "@/components/CustomForm/CusCheckbox.vue"
import CusRichText from "@/components/CustomForm/CusRichText.vue"
import CusRichEditor from "@/components/CustomForm/CusRichEditor.vue"
import CusCascader from "@/components/CustomForm/CusCascader.vue"
import CusRate from "@/components/CustomForm/CusRate.vue";
import CusSlider from "@/components/CustomForm/CusSlider.vue";
import CusStyleEditor from "@/components/CustomForm/CusStyleEditor.vue";
import CusColorPicker from "@/components/CustomForm/CusColorPicker.vue";
import CusInputNumber from "@/components/CustomForm/CusInputNumber.vue";
import CusInput from "@/components/CustomForm/CusInput.vue";
import CusAddress from "@/components/CustomForm/CusAddress.vue";
import CusSwitch from "@/components/CustomForm/CusSwitch.vue";
import CusOneOrMany from "@/components/CustomForm/CusOneOrMany.vue";
import CusProps from "@/components/CustomForm/CusProps.vue";
import CusUploader from "@/components/CustomForm/CusUploader.vue";
import CusDragXml from "@/components/CustomForm/CusDragXml.vue";
import CusForm from "@/components/CustomForm/CusForm.vue";
import CusSuggest from "@/components/CustomForm/CusSuggest.vue";
import CusSubmitButton from "@/components/CustomForm/CusSubmitButton.vue";
import MyVueTab from "@/components/MyVueTab.vue";
import MyVueTabPane from "@/components/MyVueTabPane.vue";

import ZPagination from "@/plugins/z-table/components/ZPagination.vue";


import jsxCom from '@/components/jsxcom.vue'

import HttpComponent from '@/components/HttpComponent.vue'
import RenderLayout from '@/views/about/components/render-layout.vue'

let cachedApp = null



const plugin = {
    install(app) {
        cachedApp = app
        CustomVueComponent.app = app
        CustomVueComponent.register(RenderLayout)


        CustomVueComponent.register(CustomFormRender)
        CustomVueComponent.register(UnitInput)
        CustomVueComponent.register(CusDateTimePicker)
        CustomVueComponent.register(CusTimePicker)
        CustomVueComponent.register(CusSelect)
        CustomVueComponent.register(CusProps)
        CustomVueComponent.register(CusForm)
        CustomVueComponent.register(CusSuggest)
        CustomVueComponent.register(CusRadio)
        CustomVueComponent.register(CusCheckbox)
        CustomVueComponent.register(CusColorPicker)
        CustomVueComponent.register(CusRate)
        CustomVueComponent.register(CusSlider)
        CustomVueComponent.register(CusRichText)
        CustomVueComponent.register(CusSwitch)
        CustomVueComponent.register(CusCascader)
        CustomVueComponent.register(CusInputNumber)
        CustomVueComponent.register(CusRichEditor)
        CustomVueComponent.register(CusInput)
        CustomVueComponent.register(CusDragXml)
        CustomVueComponent.register(CusOneOrMany)
        CustomVueComponent.register(CusUploader)
        CustomVueComponent.register(CusStyleEditor)

        CustomVueComponent.register(MyVueTab)
        CustomVueComponent.register(MyVueTabPane)
        CustomVueComponent.register(ZPagination)


        CustomVueComponent.register(CusSubmitButton)
        CustomVueComponent.register(jsxCom)
        CustomVueComponent.register(HttpComponent)
    }
};

export default plugin
