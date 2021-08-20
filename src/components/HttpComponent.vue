<template><custom-render v-if="ui.widget" :render="render" :ui="ui"></custom-render></template>

<script lang="jsx">
import {defineComponent, watch, reactive, provide, ref, getCurrentInstance} from "vue";
import {fetchComponent} from "@/hooks/remote.js";
import CustomRender from "./CustomRender.vue";
import { v4 } from 'uuid'
import {log} from "@/utils/logger";
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
    return {
      comManager: null
    }
  },
  created() {
    let comManager = createRefManager({
      eventHandler({type, e}) {
        // console.log('eventHandler', type, e)
      }
    })
    comManager.context = this
    this.comManager = comManager
    provide('comManager', comManager)
  },
  async setup(props, ctx) {
    let self = getCurrentInstance().ctx
    // console.log(self)
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
    let servicePartLink = {}

    async function handleIsChanged(newVal) {
      comName = props.comPrefix + v4()
      let config = props.defs.get(props.is)
      log(['fetchComponent', props.is, config])

      if (config) {
        if (config.init) {
          config.init.onReady = handler
          config.init.def.servicePartLink = servicePartLink
          let parts = config.init.def.parts
          let pArr = []
          if (Array.isArray(parts)) {
            parts.forEach(part => {
              if (part.service) {
                servicePartLink[part.name] = part.service
              }
              if (part.serviceTpl) {
               pArr.push(new Promise(async (resolve) => {
                 let res = await global.createServiceCom(part.serviceTpl)
                 // console.log(res, part)
                 part.service = res.name
                 servicePartLink[part.name] = res.name
                 resolve()
               }))
              }
            })
          }
          await Promise.allSettled(pArr)
          await fetchComponent(comName, config.init)
        }
      }
    }

    watch(() => props.is, handleIsChanged, {
      immediate: true
    })

    function sendEvent(name, args) {
      obj.emit(name, args)
    }

    let currentComUUID = ref('')
    function setCurrentChild(comUUID) {
      // console.log(comUUID)
      currentComUUID.value = comUUID
    }

    function getCurrentCom () {
      return self.comManager.find(currentComUUID)
    }

    let ret = {
      uuid: ZY.nid(),
      ui,
      servicePartLink,
      getCurrentCom,
      currentComUUID,
      setCurrentChild,
      render: render,
      sendEvent
    }

    console.log('http uuid', ret.uuid)

    useRefsManager(ret, [
      function (def) {
        obj  = def
        // PubSub.subscribe(FETCH_COMPONENT_READY, handler)
      },
      function () {
        // PubSub.unsubscribe(FETCH_COMPONENT_READY, handler)
      }
    ], {
      type: 'httpCom'
    })


    return ret
  }
})
</script>

