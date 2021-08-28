import {reactive, ref} from "vue";


export function useRenderControl(id = '') {

    // let currentLayoutMap = reactive({})
    // let currentLinks = reactive([])
    let state = reactive({
        rootId: id ?? '',
        currentLayoutMap: {},
        currentLinks: [],
        uuid: '',
        refresh: false
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

    let interval

    function detect() {
        if (interval) {
            interval.stop()
        }
        detectChange()
       interval = new ZY.Interval(detectChange, 10000);
        interval.start()
    }

    return {
        setLayout,
        state,
        // currentLayoutMap: state.currentLayoutMap,
        detect,
        // currentLinks: state.currentLinks,
        handleNext
    }
}