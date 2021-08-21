import {inject} from "vue";
import {provideRefManager} from "@/hooks/ref";
import mitt from "mitt";

export let PageControl = {
  created() {
    let pageManager = inject('pageManager')
    // console.log(pageManager, this.$router.currentRoute); // path is /post

    pageManager.register(this, this.$router.currentRoute.value.fullPath)
    // console.log('pageManager', pageManager.getCurrentPage())
  },
}

export let usePage  = function () {
  let httpComContext = {}
  let allDef = new Map()
  let events = new Map()

  let refsManager = provideRefManager({
    async eventHandler({type, e}) {
      if (type === 'http-component:com:mounted') {
        let name = e.httpComponentContext.is
        httpComContext[name] = e.httpComponentContext
        // console.log(name)
        if (events.has(name)) {
          events.get(name)({
            done() {
              events.delete(name)
            }
          })
        }
      }
    }
  })
  function setPartModel(stepName, partName, model) {
    console.log('httpComContext', stepName, partName)
    return httpComContext[stepName].runPart(partName, 'setModel',
        model
    )
  }
  function setDef(config, fun) {
    allDef.set(config.name, config)
    events.set(config.name, fun)
    // events[name] = new Function('options', `fun()`)
  }
  return {
    allDef,
    // addListener,
    setDef,
    setPartModel,
    httpComContext,
    refsManager
  }
}