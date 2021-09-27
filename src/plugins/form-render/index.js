import CustomFormRender from './components/CustomFormRender.vue'
import UnitInput from "@/components/UnitInput.vue";
import CusDateTimePicker from "@/components/CustomForm/CusDateTimePicker.vue";
import CusSelect from "@/components/CustomForm/CusSelect.vue";
import CusRadio from "@/components/CustomForm/CusRadio.vue";
import CusCheckbox from "@/components/CustomForm/CusCheckbox.vue"
import CusRate from "@/components/CustomForm/CusRate.vue";
import CusSlider from "@/components/CustomForm/CusSlider.vue";
import CusSwitch from "@/components/CustomForm/CusSwitch.vue";
import CusProps from "@/components/CustomForm/CusProps.vue";
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
        CustomVueComponent.register(CusSelect)
        CustomVueComponent.register(CusProps)
        CustomVueComponent.register(CusForm)
        CustomVueComponent.register(CusSuggest)
        CustomVueComponent.register(CusRadio)
        CustomVueComponent.register(CusCheckbox)
        CustomVueComponent.register(CusRate)
        CustomVueComponent.register(CusSlider)
        CustomVueComponent.register(CusSwitch)

        CustomVueComponent.register(MyVueTab)
        CustomVueComponent.register(MyVueTabPane)
        CustomVueComponent.register(ZPagination)


        CustomVueComponent.register(CusSubmitButton)
        CustomVueComponent.register(jsxCom)
        CustomVueComponent.register(HttpComponent)
    }
};

export default plugin
