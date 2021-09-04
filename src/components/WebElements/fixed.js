import {defineCustomElement, nextTick, inject} from 'vue'

import comStyle from './fixed.scss'
import {elementMixin} from "@/components/WebElements/mixins";


const MyVueElement = defineCustomElement({
    template: `
 <template>     {{selected}}</template>
<slot></slot>
    `,
    styles: [
        comStyle,
    ],
    mixins: [
        elementMixin
    ],
    props: {
        selected: String
    },
    data() {
        return {
            className: '',
            reload: false,
            slotcon: null
        }
    },
    watch: {
    },

})

customElements.define('my-fixed', MyVueElement)

export default MyVueElement