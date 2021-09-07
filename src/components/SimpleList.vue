<template>
  <div>
<!--    {{state}}-->
    <el-form-item>
      <el-input v-model="state.search"></el-input>
    </el-form-item>
<!--    <el-table :data="dataTable">-->
<!--      <el-table-column  prop="label" label="LABEL"></el-table-column>-->
<!--      <el-table-column  prop="value" label="VALUE"></el-table-column>-->
<!--      <el-table-column  label="ACTION">-->
<!--        <template v-slot:default="scope">-->
<!--          <el-button size="small" @click="select(scope)">选中</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

    <z-table border stripe :actions="state.actions"
             :actionProps="actionProps"
             :column="state.column" :data="dataTable"></z-table>
  </div>
</template>

<script>
import {computed, reactive, toRaw, watch} from 'vue'
import {useArrHandler} from "@/views/home/hooks";
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
    }
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

    console.log(customColumn)
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
    })

    let handler = useArrHandler(state,'suggest')

    function search(options = [], v) {
      return handler.search(
          function (o) {
            return o.value.includes(v) || o.label.includes(v)
          }
      ) ?? []
    }

    let  dataTable = computed(() => {
      // console.log(state.suggest)
      return search(state.suggest, state.search) ?? []
    })

    function select(scope) {
      state.value = scope.row.value
      ctx.emit('select-item', state.value)
      ctx.emit('select', toRaw(scope.row))
    }

    watch(() => props.suggest, (newval) => {
      // console.log('sdsdsdsdsdsds', toRaw(newval))
      state.suggest = toRaw(newval)
    }, {
      immediate: true
    })


    return {
      dataTable,
      search,
      state,
      select
    }
  }
}
</script>
