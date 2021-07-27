import CustomFormRender from './components/CustomFormRender.vue'
import UnitInput from "@/components/UnitInput.vue";

const plugin = {
    install(app) {
        app.component(CustomFormRender.name, CustomFormRender)
        app.component(UnitInput.name, UnitInput)
    }
};

export default plugin
