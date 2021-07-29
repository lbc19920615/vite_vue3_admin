import Sortable from "sortablejs";
function isNumber(v) {
  if(typeof v === 'number') {
    return true
  }
  return /^\d+$/.test(v);
}

function calTotal(items, prop) {
  return items.map(v  => parseInt(v[prop])).reduce((a, b) => a + b, 0)
}

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
      let { frItems, otherItems, frLength } = this._parseItems('w', rows)

      let numberItems = rows.filter(v => {
        return isNumber(v.w)
      })

      let str = ''

      let stringItems = otherItems.filter(v => {
        return !numberItems.includes(v)
      })

      if (stringItems.length > 0) {
        str = stringItems.map(v => v.w).join(' - ')
      }

      if (str) {
        str = ' - ' + str
      }

      console.log('stringItems', stringItems, str)

      let otherTotal = calTotal(numberItems, 'w')

      frItems.forEach(frItem => {
        let numberW = parseInt(frItem.w)
        frItem.style.width = `calc((100% - ${otherTotal}px${str})/ ${frLength} * ${numberW})`
      })

      otherItems.forEach(otherItem => {
        let unit = undefined
        if (isNumber(otherItem.w)) {
          unit = otherItem.w + 'px'
        } else {
          unit = otherItem.w
        }
        otherItem.style.width = unit
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
