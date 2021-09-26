<template>
  <el-dialog
      title="提示"
      v-model="dialogVisible"
      width="30%">
    <div><slot v-bind="{item: rowv2[0], index: 0}"></slot></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent} from 'vue';
export default defineComponent({
  name: "render-modal",
  mixins: [
  ],
  components: {},
  data() {
    return {
      rowv2: [
      ],
      dialogVisible: false,
      current: '',
    }
  },
  props: {
    layout: {
      type: Array,
      default: []
    },
    obj: {
      type: Object,
      default() {
        return {}
      }
    },
    page: null
  },
  watch: {
    layout: {
      handler(newVal) {
        // console.log('newVal', newVal)
        this.rowv2 = newVal
        this.current = newVal[0].name
        this.$nextTick(() => {
          this.init().then(() => {
          })
        })
      },
      immediate: true
    }
  },
  methods: {
    init() {
      if (Array.isArray(this.rowv2)) {
        this.rowv2.forEach(v => {
        })
      }
      // console.log('render modal', this.obj)
      let ref = ZY.lodash.get(this.obj, 'data.pageRef')
      this.page.modalManRef.register(this, ref)
      return Promise.resolve()
    },
    toggle(v) {
      this.dialogVisible = v
    }
  },
  beforeUnmount() {
    // console.log( this.obj.pageRef)
    this.page.modalManRef.destory( this.obj.pageRef)
  }
})
</script>

<style scoped>

</style>
