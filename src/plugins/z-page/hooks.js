import {reactive, ref, toRaw} from "vue";


export function useRenderControl() {

    // let currentLayoutMap = reactive({})
    // let currentLinks = reactive([])
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
    function detectLayout() {
        if (interval1) {
            interval1.stop()
        }
        detectChange()
        interval1 = new ZY.Interval(detectChange, 6000);
        interval1.start()
    }

    let detectEventChangeContext = {}
    async function detectEventChange() {
        let currentData = await ZY_EXT.store.getItem('play-events-model')
        // console.log(currentData.uuid)
        // console.log(interval)
        // console.log('changed')
        let oldVal = toRaw(state.events)
        let newVal = currentData.events
        // console.log(ZY.compareObj(oldVal, newVal))
        let equals = ZY.compareObj(oldVal, newVal)
        if (!equals) {
            state.pageModel = currentData
            if (currentData && Array.isArray(currentData.events)) {
                state.events = currentData.events
            }
            // console.log('sdsdsdsdsdsdsdsds', currentData.events)
            if (detectEventChangeContext.cb) {
                detectEventChangeContext.cb(currentData.events,  {state, currentData})
            }
        }
    }

    let interval2
    function detectEvent(cb) {
        detectEventChangeContext.cb = cb
        if (interval2) {
            interval2.stop()
        }
        detectEventChange()
        interval2 = new ZY.Interval(detectEventChange, 6000);
        interval2.start()
    }

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
