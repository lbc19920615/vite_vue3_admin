import {defineCustomElement, nextTick, inject} from 'vue'

import comStyle from './tab.scss'
import {elementMixin} from "@/components/WebElements/mixins";


const MyVueElement = defineCustomElement({
    template: `
 <template>     {{selected}}</template>
<div class="my-tab" :s-selected="selected" :class="className">
  <template v-if="reload">
    <slot :ref="slotcon" :name="className"></slot>
  </template>
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
            className: '',
            reload: false,
            slotcon: null
        }
    },
    watch: {
        selected: {
            handler(v) {
                this.reload = false
                // console.log('name', v)
                this.className = v
                this.$nextTick(() => {
                    this.reload = true
                })
            },
            immediate: true
        }
    },

})

customElements.define('my-tab', MyVueElement)

export default MyVueElement