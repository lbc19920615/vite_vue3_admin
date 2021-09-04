import {defineCustomElement, nextTick, inject} from 'vue'

import comStyle from './fixed.scss'
import {elementMixin} from "@/components/WebElements/mixins";


const MyVueElement = defineCustomElement({
    template: `
 <template>     {{selected}}</template>
<div class="host" :class="{'is-open': open}">
<div class="action">
  <button class="toggle" @click="toggle" type="button">toggle</button>
</div>
<div class="content"><slot></slot></div>
</div>
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
            open: false
        }
    },
    watch: {
    },
    methods: {
        toggle() {
            this.open = !this.open
        }
    }
})

customElements.define('my-fixed', MyVueElement)

export default MyVueElement