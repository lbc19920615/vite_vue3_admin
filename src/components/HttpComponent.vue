<template><custom-render v-if="ui.widget" :render="render" :ui="ui"></custom-render></template>

<script lang="jsx">
import {defineComponent, watch, reactive} from "vue";
import {fetchComponent} from "../hooks/remote.js";
import PubSub from 'pubsub-js'
import { FETCH_COMPONENT_READY} from "../utils/event-types.js";
import CustomRender from "./CustomRender.vue";

export default defineComponent({
  name: "HttpComponent",
  components: {CustomRender},
  props: {
    is: {
      type: String,
      required: true
    },
    slotContent: null
  },
  setup(props, ctx) {
    let ui = reactive({
      widget: ''
    })

    let comName = ''
    watch(() => props.is, (newVal) => {
      comName = 'test-' + Date.now()
      fetchComponent(comName, {
        def: {
          row: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                ui: {}
              },
            }
          }
        },
        args: {
          src: 'comformscr.twig'
        }
      })
    }, {
      immediate: true
    })

    PubSub.subscribe(FETCH_COMPONENT_READY, (msg, {
      sfc,
      comDef
    } = {}) => {
      // console.log(msg, sfc, comDef)
      ui.widget = comName
    })

    return {
      ui,
      render: props.slotContent ? props.slotContent : () => {}
    }
  }
})
</script>

