import {defineCustomElement, nextTick, inject} from 'vue'

import comStyle from './tab.scss'
import {elementMixin} from "@/components/WebElements/mixins";


const MyVueElement = defineCustomElement({
    template: `
 <template>     {{selected}}</template>
<div class="my-tab" :class="className">
<!--  <div style="display: flex">-->
<!--    <div v-for="tab in tabs">{{tab.name}}</div>-->
<!--  </div>-->
<!--  <template v-if="reload">-->
<!--    <slot :ref="slotcon" :name="className"></slot>-->
<!--  </template>-->
</div>
    `,
    styles: [
        comStyle,
    ],
    mixins: [
      elementMixin
    ],
    props: {
        // selected: String
    },
    data() {
        return {
            className: '',
            reload: false,
            slotcon: null,
            tabs: {}
        }
    },
    watch: {
        selected: {
            handler(v) {

            },
            immediate: true
        }
    },
    methods: {
        setSelected(v) {
            this.reload = false
            // console.log('name', v)
            this.className = v
            this.$nextTick(() => {
                this.reload = true
            })
        },
        registerTabPanel(tabContext) {
            // let {label, name} = tabContext
            // this.tabs[name] = {
            //     label,
            //     name
            // }
        }
    }
})

customElements.define('my-tab', MyVueElement)

export default MyVueElement