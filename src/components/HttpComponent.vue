<template><custom-render v-if="ui.widget" :render="render" :ui="ui"></custom-render></template>

<script lang="jsx">
import {defineComponent, watch, reactive} from "vue";
import {fetchComponent} from "../hooks/remote.js";
import PubSub from 'pubsub-js'
import { FETCH_COMPONENT_READY} from "../utils/event-types.js";
import CustomRender from "./CustomRender.vue";
import { v4 } from 'uuid'
import {log} from "../utils/logger";

export default defineComponent({
  name: "HttpComponent",
  components: {CustomRender},
  props: {
    is: {
      type: String,
      required: true
    },
    slotContent: null,
    defs: {
      type: Map,
      default() {
        return new Map();
      }
    },
    comPrefix: {
      type: String,
      default: 'http-com-'
    }
  },
  setup(props, ctx) {
    let ui = reactive({
      widget: ''
    })

    let comName = ''
    watch(() => props.is, (newVal) => {
      comName = props.comPrefix + v4()
      let config = props.defs.get(props.is)
      // console.log('fetchComponent', props.is, config)
      log(['fetchComponent', props.is, config])

      if (config && config.init) {
        fetchComponent(comName, config.init)
      }
    }, {
      immediate: true
    })

    PubSub.subscribe(FETCH_COMPONENT_READY, (msg, {
      sfc,
      comDef
    } = {}) => {
      // console.log(msg, sfc, comDef)
      ui.widget = comName
      ctx.emit('fetched')
    })

    return {
      ui,
      render: props.slotContent ? props.slotContent : () => {}
    }
  }
})
</script>

