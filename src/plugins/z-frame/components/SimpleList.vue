<template>
  <div class="simple-list">
<!--    {{state}}-->
    <z-cell-item class="a-space-mb-15">
      <el-input :readonly="selectOnly"
                v-model="state.search" @input="handleSearch"></el-input>
    </z-cell-item>
    <div class="simple-list-con"
         :style="conStyle"
         :class="conClass">
      <z-table border stripe
               :actions="state.actions"
               :actionProps="actionProps"
               :column="state.column"
               :showAcion="showAcion"
               :data="state.dataTable"></z-table>
    </div>
  </div>
</template>

<script>
import {reactive, toRaw, watch} from 'vue'
import {useArrHandler} from "../hooks/index";
import ZTable from '@/plugins/z-table/FreeTable/table.vue'

export default {
  name: 'SimpleList',
  props: {
    suggest: Array,
    column: Array,
    actionProps: {
      type: Object,
      default() {
        return {width: '100px'}
      }
    },
    showAcion: {
      type: Boolean,
      default: true
    },
    conClass: String,
    conStyle: String,
    selectOnly: Boolean
  },
  components: {
    ZTable
  },
  setup(props, ctx) {
    // console.log(props)
    let column = [
      { label: '标题', prop: 'label' },
      { label: '值', prop: 'value' },
    ]

    let customColumn = []
    if (Array.isArray(props.column)) {
      // customColumn = [].concat(column)
      props.column.forEach(item => {
        let _item = item
        if (_item.prop) {
          let finded = column.find(v => v.prop === item.prop)
          if (finded) {
            _item = Object.assign(finded, item)
          }
        }
        customColumn.push(toRaw(_item))
      })
      column.forEach(item => {
        let finded = customColumn.find(v => v.prop === item.prop)
        if (!finded) {
          customColumn.push(toRaw(item))
        }
      })
    } else {
      customColumn = column
    }

    // console.log(customColumn)
    //
    const actions = [
      {
        label: '选中',
        on: {
          click(scope) {
            select(scope)
          }
        },
        attrs: {},
      }
    ]

    let state = reactive({
      suggest: props.suggest ?? [],
      search: '',
      actions,
      column: customColumn,
      dataTable: []
    })

    let handler = useArrHandler(state,'suggest')

    function search(options = [], v) {
      return handler.search(
          function (o) {
            // console.log(o)
            // return true
            let keys = Object.keys(o)
            // console.log(keys)
            let flag = false
            keys.forEach(key => {
              if (o[key] && o[key].includes) {

                let lowerKey = o[key].toLowerCase()
                if (lowerKey.includes(v.toLowerCase())) {
                  flag = true
                }


              }
            })
            return flag
            // return o.value.includes(v) || o.label.includes(v)
          }
      ) ?? []
    }

    // let  dataTable = computed(() => {
    //   // console.log(state.suggest, state.search)
    //   return search(toRaw(state.suggest), state.search) ?? []
    // })

    function select(scope) {
      state.value = scope.row.value
      ctx.emit('select-item', state.value)
      ctx.emit('select', toRaw(scope.row))
    }

    watch(() => props.suggest, (newval) => {
      // console.log('sdsdsdsdsdsds', toRaw(newval))
      state.suggest = toRaw(newval)
      handleSearch()
    }, {
      immediate: true
    })

    function handleSearch() {
      state.dataTable = search(toRaw(state.suggest), state.search) ?? []
    }


    return {
      // dataTable,
      search,
      handleSearch,
      state,
      select
    }
  }
}
</script>
