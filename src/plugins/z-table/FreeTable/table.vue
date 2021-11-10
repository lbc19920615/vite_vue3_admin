<style lang="scss">

</style>
<template>
  <div class="z-table">
<!--    {{data}}-->
    <el-table ref="elTable" :data="data" v-bind="$attrs" >
      <template v-for="item in tbColumns"   :key="item.prop">
        <el-table-column
          v-bind="item"
        >
          <template #default="scope">
<!--            <slot :name="item.prop" v-bind="scope"></slot>-->
            <template v-if="item.render">
              <FreeRender :scope="scope" :render="item.render"></FreeRender>
            </template>
            <template v-else>
              {{scope.row[scope.column.property]}}
            </template>
          </template>
        </el-table-column>

<!--        <free-column-->
<!--            v-bind="$attrs" :column="item" />-->
      </template>
      <el-table-column v-if="showAcion" v-bind="actionProps" label="ACTION">
        <template v-slot:default="scope">
          <el-button
              class="z-table__button"
              type="primary"
              size="small"
                     v-bind="action.attrs"
                     v-for="action in actions"
                     @click="runAction(scope, action, 'click')">{{action.label}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <template v-if="pagination">
      <pagination v-if="data.length > 0" v-bind="$attrs" v-on="$listeners" />
    </template>
  </div>
</template>

<script>
import FreeColumn from './columu.vue'
import Pagination from '../Pagination/index.vue'
import FreeRender from "@/plugins/z-table/FreeTable/render.vue";

export default {
  name: 'ZTable',
  components: {
    FreeRender,
    Pagination,
    FreeColumn
  },
  props: {
    data: Array,
    column: Array,
    actionProps: Object,
    actions: Array,
    columnsProps: Object,
    showAcion: {
      type: Boolean,
      default: true
    },
    pagination: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tbColumns() {
      const { column, columnsProps: props } = this

      return column.map(col => {
        const it = Object.assign({}, props, col)
        return it
      })
    }
  },
  methods: {
    runAction(scope, action, name) {
      if (action.on && action.on[name]) {
        action.on[name](scope)
      }
    }
  }
}
</script>
