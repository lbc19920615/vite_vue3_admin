import mitt from "mitt";
import {inject, onBeforeUnmount, onMounted, onUnmounted, provide} from "vue";

export function createRefManager({eventHandler}) {
  let RefsManager = {
    Refs: new Map(),
  }
  RefsManager.register = function (context, uuid = ZY.nid()) {
    const emitter = mitt()
    emitter.on('*', (type, e) => {
      // console.log(type, e)
      if (eventHandler) {
        eventHandler({
          type,
          e
        })
      }
    })

    let obj = {
      uuid,
      context,
      destoryed: false,
      event: emitter
    }
    RefsManager.Refs.set(uuid, obj)
    return {
      uuid,
      emit: emitter.emit
    }
  }
  RefsManager.destory = function (uuid) {
    if ( RefsManager.Refs.has(uuid)) {
      let obj =  RefsManager.Refs.get(uuid)
      obj.destoryed = true
      RefsManager.Refs.set(uuid, obj)
    }
  }
  return RefsManager
}

export function provideRefManager( {name = 'RefsManager', eventHandler} = {}) {
  let RefsManager = createRefManager({eventHandler})
  provide(name, RefsManager)
}

export function useRefsManager(ret, [catchMOunted, catchUnMOunted] ) {
  let def = {}
  let RefsManager = inject('RefsManager')
  onMounted(() => {
    // console.log(RefsManager)
    def = RefsManager.register(ret)
    if (catchMOunted) {
      catchMOunted(def)
    }
  })
  onBeforeUnmount(() => {
    RefsManager.destory(def.uuid)
    if (catchUnMOunted) {
      catchUnMOunted()
    }
  })
}
