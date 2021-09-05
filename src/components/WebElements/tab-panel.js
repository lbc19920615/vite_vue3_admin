import {defineCustomElement, nextTick, inject} from 'vue'
import comStyle from "@/components/WebElements/tab.scss";
import {elementMixin} from "@/components/WebElements/mixins";

const MyVueElement = defineCustomElement({
    template: `
<div class="my-tab-panel" :class="className"><slot></slot></div>    
    `,
    styles: [
        comStyle
    ],
    mixins: [
        elementMixin
    ],
    props: {
       name: String,
       label: String,
    },
    data() {
        return {
            className: ''
        }
    },
    watch: {
        name: {
            handler(v) {
                // console.log('name', v)
                this.className = v
            },
            immediate: true
        }
    },
    mounted() {
        nextTick(() => {
            // console.log(this)
            if (this.$parent && this.$parent.registerTabPanel) {
                this.$parent.registerTabPanel(this)
            }
        })
    }
})

customElements.define('my-tab-panel', MyVueElement)

export default MyVueElement