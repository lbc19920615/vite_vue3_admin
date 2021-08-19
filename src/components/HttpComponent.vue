<template><custom-render v-if="ui.widget" :render="render" :ui="ui"></custom-render></template>

<script lang="jsx">
import {defineComponent, watch, reactive, provide} from "vue";
import {fetchComponent} from "../hooks/remote.js";
import CustomRender from "./CustomRender.vue";
import { v4 } from 'uuid'
import {log} from "../utils/logger";
import {createRefManager, useRefsManager} from "@/hooks/ref";

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
  data() {

  },
  created() {
    let comManager = createRefManager({
      eventHandler({type, e}) {
        // console.log('eventHandler', type, e)
      }
    })
    comManager.context = this
    provide('comManager', comManager)
  },
  setup(props, ctx) {


    let obj;

    function render() {
      let ret = []
      if (Object.keys(ctx.slots).length > 0) {
        ret = ctx.slots
      }
      return ret
    }

    let ui = reactive({
      widget: ''
    })

    function handler({
      sfc,
      comDef,
      name,
    } = {}) {
      // console.log(name === comName, sfc, comDef)
      // if (name === comName) {
        ui.widget = comName
        obj.emit('http-component:fetch:ready', props)
      // }
    }

    let comName = ''
    watch(() => props.is, (newVal) => {
      comName = props.comPrefix + v4()
      let config = props.defs.get(props.is)
      // console.log('fetchComponent', props.is, config)
      log(['fetchComponent', props.is, config])


      if (config && config.init) {
        config.init.onReady = handler
        fetchComponent(comName, config.init)
      }
    }, {
      // immediate: true
    })

    function sendEvent(name, args) {
      obj.emit(name, args)
    }

    let ret = {
      ui,
      render: render,
      sendEvent
    }


    useRefsManager(ret, [
      function (def) {
        obj  = def
        // PubSub.subscribe(FETCH_COMPONENT_READY, handler)
      },
      function () {
        // PubSub.unsubscribe(FETCH_COMPONENT_READY, handler)
      }
    ])


    return ret
  }
})
</script>

