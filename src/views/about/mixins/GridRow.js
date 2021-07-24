import Sortable from "sortablejs";

export default {
  methods: {
    _parseItems(prop = '', rows = []) {
      let frItems = rows.filter( v => {
        return v[prop] && v[prop].endsWith && v[prop].endsWith('fr')
      })
      let otherItems = rows.filter(v => {
        return !frItems.includes(v)
      })

      let frLength = frItems.map(v => parseInt(v[prop])).reduce((a, b) => a + b, 0)

      let otherTotal = otherItems.map(v  => parseInt(v[prop])).reduce((a, b) => a + b, 0)

      return {
        frItems, otherItems, frLength, otherTotal
      }
    },
    calcWidth(rows = []) {
      let { frItems, otherItems, frLength, otherTotal } = this._parseItems('w', rows)

      frItems.forEach(frItem => {
        let numberW = parseInt(frItem.w)
        frItem.style.width = `calc((100% - ${otherTotal}px) / ${frLength} * ${numberW})`
      })

      otherItems.forEach(otherItem => {
        otherItem.style.width = otherItem.w + 'px'
      })
    },
    calcHeight(rows = []) {
      let { frItems, otherItems, frLength, otherTotal } = this._parseItems('h', rows)



      frItems.forEach(frItem => {
        let numberW = parseInt(frItem.h)
        frItem.style.height = `calc((100% - ${otherTotal}px) / ${frLength} * ${numberW})`
      })

      otherItems.forEach(otherItem => {
        otherItem.style.height = otherItem.h + 'px'
      })
    },
    resetSortable(rowv2 = [], sortableEle = this.$refs.row) {
      let self = this
      let row = JSON.parse(JSON.stringify( rowv2))

      // console.log('row', row, this.$el)
      new Sortable(sortableEle, {
        onEnd: function (/**Event*/evt) {
          const { oldIndex, newIndex } = evt
          // console.log('evt', oldIndex, newIndex)
          let oldItem = row[oldIndex]
          row.splice(oldIndex, 1)
          row.splice(newIndex, 0, oldItem)
          rowv2 = row
          // console.log('rowv2', rowv2)
        }
      })
    },
    resetSortableV2(rowv2 = [], {sortableEle = this.$refs.row, option = {}, onEnd = () => {}} = {}) {
      let self = this
      let row = rowv2

      // console.log('row', row, this.$el)
      new Sortable(sortableEle, {
        ...option,
        onEnd: function (/**Event*/evt) {
          const { oldIndex, newIndex } = evt
          // console.log('evt', oldIndex, newIndex)
          let oldItem = row[oldIndex]
          row.splice(oldIndex, 1)
          row.splice(newIndex, 0, oldItem)
          // rowv2 = row
          // console.log('rowv2', rowv2)
          if (onEnd) {
            onEnd.bind(self)(row)
          }
        }
      })
    },
  }
}
