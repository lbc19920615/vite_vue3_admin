<template>
  <div>
<!--    {{state}}-->
    <el-form-item>
      <el-input v-model="state.search" @input="handleSearch"></el-input>
    </el-form-item>
    <div class="simple-list-con" :class="conClass">
      <z-table border stripe
               :actions="state.actions"
               :actionProps="actionProps"
               :column="state.column"
               :data="state.dataTable"></z-table>
    </div>
  </div>
</template>

<script>
import {computed, reactive, toRaw, watch} from 'vue'
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
    conClass: String
  },
  components: {
    ZTable
  },
  setup(props, ctx) {
    // console.log(props)
    let column = [
      { label: 'Label', prop: 'label' },
      { label: 'Value', prop: 'value' },
    ]

    let customColumn = []
    if (Array.isArray(props.column)) {
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
              if (o[key] && o[key].includes && o[key].includes(v)) {
                flag = true
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
