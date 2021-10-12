import {reactive,  toRaw} from "vue";
import {VARS_PAGE_MODEL_NAME} from "@/vars";
import {useRouter} from 'vue-router';
import {COMMAND, setCommandHandler, setMessageHandler} from "@/channel";

export function useGlobalEasy(page) {
    class G {
        static 设置步骤(...args) {
            if (args.length === 2) {
                工具.设置步骤({
                    [args[0]]: args[1]
                })
            }
        }
        static 数组添加(e) {
            let {parts, partName, selfpath} = e;
            parts[partName].arrAppend(selfpath, {

            })
        }
        static 数组删除(e) {
            let {parts, partName, fromPath, indexKey} = e;
            parts[partName].arrSplice(fromPath, indexKey);
        }
    }
    globalThis.G = G
}

export function useRenderControl() {
    let router = useRouter()
    let currentRoute = router.currentRoute
    let params = {}
    if (currentRoute && currentRoute.value) {
        params = currentRoute.value.params
    }
    console.log('useRenderControl route params', params)

    let state = reactive({
        rootId: '',
        currentLayoutMap: {},
        currentLinks: [],
        uuid: '',
        refresh: false,
        events: [],
        pageModel: {}
    })

    function handleNext(item) {
        let fromId = item.id
        let connections = state.currentLinks.filter(v => v.from === fromId)
        if (Array.isArray(connections)) {
            // return connection.toPID
            if (connections[0]) {
                // console.log('handleNext', fromId, connections[0].toPID)
                return connections[0].toPID
            }
            return ''
        }
        return ''
    }

    function setLayout(obj) {
        for (let key in obj) {
            state[key] = obj[key]
        }
        // console.log(state.currentLinks)
        if (state.currentLinks[0]) {
            state.rootId = state.currentLinks[0].fromPID ?? ''
        }
    }

    async function detectChange() {
        let currentData = await ZY_EXT.store.getItem('current-data')
        // console.log(currentData.uuid)
        // console.log(interval)
        if (currentData.uuid) {
            if (currentData.uuid !== state.uuid) {
                state.refresh = false
                // console.log('changed')
                setLayout(currentData)
                await ZY.sleep(30)
                state.refresh = true
            }
        }
    }

    let interval1
    function detectLayout(interval = true) {
        if (interval1) {
            interval1.stop()
        }
        detectChange()
        // setMessageHandler('detect layout', function (e) {
        //     let data = e.data ?? ''
        //     if (data === COMMAND.RELOAD) {
        //         detectChange(false)
        //     }
        // })
        // if (interval) {
        //     interval1 = new ZY.Interval(detectChange, 6000);
        //     interval1.start()
        // }
    }

    let detectEventChangeContext = {}
    async function detectEventChange(isFirst) {
        let currentData = await ZY_EXT.store.getItem(VARS_PAGE_MODEL_NAME)
        // console.log(currentData.uuid)
        // console.log(interval)
        // console.log('changed')
        let oldVal = toRaw(state)
        let newVal = currentData
        // console.log(ZY.compareObj(oldVal, newVal))
        let equals = ZY.compareObj(oldVal, newVal)
        if (!equals) {
            state.pageModel = currentData
            if (currentData && Array.isArray(currentData.events)) {
                state.events = currentData.events
            }
            // console.log('sdsdsdsdsdsdsdsds', currentData.events)
            if (detectEventChangeContext.cb) {
                detectEventChangeContext.cb(currentData.events,  {state, isFirst, currentData})
            }
        }
    }

    let interval2
    function detectEvent(cb, interval = true) {
        detectEventChangeContext.cb = cb
        if (interval2) {
            interval2.stop()
        }
        detectEventChange(true)
        // setMessageHandler('detect event', function (e) {
        //     let data = e.data ?? ''
        //     if (data === COMMAND.RELOAD) {
        //         detectEventChange(false)
        //     }
        // })
        // if (interval) {
        //     interval2 = new ZY.Interval(detectEventChange, 6000);
        //     interval2.start()
        // }
    }

    setCommandHandler(COMMAND.RELOAD, function (e) {
        console.log('RELOAD')
        detectEventChange(false)
        detectChange(false)
    })

    setCommandHandler(COMMAND.INSPECT, function (e) {
        // console.log(e)
        try {
            let olded = document.querySelector('.prop-selected')
            olded?.classList?.remove('prop-selected')
            let itemData = ZY.JSON5.parse(e.item.data)
            let dep_item = document.querySelector(`[tools_dep_item_id=${e.item.id}]`)
            if (dep_item) {

                dep_item.classList.toggle('prop-selected')
            }
        } catch (e) {
        //
        }
    })

    return {
        setLayout,
        state,
        detectEvent,
        // currentLayoutMap: state.currentLayoutMap,
        detectLayout,
        // currentLinks: state.currentLinks,
        handleNext
    }
}
