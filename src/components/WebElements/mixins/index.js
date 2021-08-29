import {nextTick} from "vue";

export let elementMixin = {
    mounted() {
        nextTick(() => {
            this.$emit('inited', {
                ctx: this
            })
        })
    },
}