<style lang="scss">
.z-opt-man-item {
  border: 1px solid #c0c4cc;
  padding: 20px;

  .drag-handle {
    cursor: move;
  }
}
.z-opt-man-group {
  .z-cell-item__label {
    --z-cell-item-label-width: max-content;
    font-weight: bold;
  }
}
</style>

<template>
 <z-easy-modal title="枚举值管理" @opened="onOpened">
   <template #button-content>枚举值管理</template>
   <div class="z-opt-man-group">
<!--         {{state}}-->
     <el-row align="middle"  class="z-opt-man-group__header a-space-mb-10">
       <!--      <el-button type="primary" @click="loadFile">加载</el-button>-->
       <el-button size="small" type="primary" @click="save">保存</el-button>
       <el-button size="small" type="primary" @click="exportFile">导出到本地</el-button>
       <el-space class="a-space-ml-10">
         <div>过滤name</div>
         <el-input v-model="state.search"></el-input>
       </el-space>
     </el-row>
     <el-scrollbar height="50vh" class="a-space-mb-10">
       <div class="z-opt-man-item a-space-mb-10" v-for="option in filterOptions(state.options)">
         <!--      {{option}}-->
         <el-row class="z-opt-man-item__label a-space-mb-10">
           <z-cell-item label="name">
             <el-input v-model="option.name"></el-input>
           </z-cell-item>
         </el-row>
         <draggable
             class="z-opt-man-item__options"
             v-model="option.arr"
             item-key="id"
             tag="el-row"
             style="align-items: flex-start; flex-wrap: wrap;"
             handle=".drag-handle"
         >
           <template #item="{element}">
             <el-col class="list-group-item z-opt-man-item__option a-space-mb-10"
                     :span="24">
               <el-row :gutter="20" align="middle">
                 <el-col :span="10">
                   <el-input v-model="element.data.label"></el-input>
                 </el-col>
                 <el-col :span="10">
                   <el-input v-model="element.data.value"></el-input>
                 </el-col>
                 <el-col :span="4">
                  <el-space>
                    <div class="drag-handle"><el-icon size="30"><Rank></Rank></el-icon></div>
                    <el-popconfirm title="确定删除吗？" @confirm="deleteItem(option.arr, element.id)">
                      <template #reference>
                        <el-button type="danger" size="small"><el-icon><Remove></Remove></el-icon></el-button>
                      </template>
                    </el-popconfirm>
                  </el-space>
                 </el-col>
               </el-row>
             </el-col>
           </template>
         </draggable>
         <div class="z-opt-man-item__actions">
           <el-button size="small" @click="appendOption(option)">
             <el-icon><Plus></Plus></el-icon>
           </el-button>
           <el-button size="small" @click="selectOption(option)">
             选择
           </el-button>
           <el-popconfirm title="确定删除吗？" @confirm="deleteItem(state.options, option.id)">
             <template #reference>
               <el-button type="danger" size="small"><el-icon><Remove></Remove></el-icon></el-button>
             </template>
           </el-popconfirm>
         </div>
       </div>
     </el-scrollbar>

     <div class="z-opt-man-group__actions">
       <el-button size="small" @click="appendGroup()">
         <el-icon><Plus></Plus></el-icon>
       </el-button>
     </div>
   </div>
 </z-easy-modal>
</template>
<script>
import ZEasyModal from "@/plugins/z-frame/components/ZEasyModal.vue";
import {createStaticFormCls} from "@/plugins/z-frame/BaseForm";
import draggable from 'vuedraggable'
import {onMounted, reactive, toRaw} from "vue";
import {Plus, Rank, Remove} from "@element-plus/icons";
import ZCellItem from "@/plugins/z-frame/components/ZCellItem.vue";

class FormsOptions extends createStaticFormCls() {
  static STORAGE_KEY = 'form-options-key';
  constructor() {
    super();
  }
}

export default {
  name: 'ZOptionsManager',
  components: {ZCellItem, ZEasyModal, draggable, Plus, Rank, Remove},
  setup(props, ctx) {
    let state = reactive({
      options: [
      ]
    })

    async function load() {
      await FormsOptions.init();
      await ZY.sleep(30)
      let options = FormsOptions.getOptions().map(v => {
        try {
          v.arr = ZY.JSON5.parse(v.value)
        } catch (e) {
          v.arr = []
        }
        return v
      })
      console.log(options)
      state.options = options
    }


    onMounted(() => {
    })

    let dialogContext = null
    function onOpened(context) {
      load()
      dialogContext = context
    }

    function hide() {
      dialogContext.hide()
    }

    function appendOption(option) {
      option.arr.push(
          {
            id: ZY.rid(),
            name: ZY.rid(),
            data: {
              label: '',
              value: '',
            },
          }
      )
    }

    function selectOption(option) {
      console.log(option)
      ctx.emit('select-item', toRaw(option))
      hide()
    }

    function appendGroup() {
      state.options.push({
        id: ZY.rid(),
        name: "",
        arr: []
      })
    }

    function deleteItem(options, id) {
      let findIndex = options.findIndex(v => {
        return v.id === id
      })
      if (findIndex > -1) {
        options.splice(findIndex, 1)
      }
    }

    function getSavedOptions() {
      return toRaw(
          state.options.map(v => {
            v.value = ZY.JSON5.stringify(v.arr)
            return v
          })
      )
    }

    async function save() {
      FormsOptions.clear()
      await FormsOptions.setStorage(
          getSavedOptions()
      )
    }

    async function exportFile() {
      await FormsOptions.saveCache2File(
          getSavedOptions()
      )
    }

    function filterOptions(arr = []) {
      let search = state.search
      if (!search) {
        return arr
      }
      return arr.filter(v => {
        if (!v.name) {
          return true
        }
        return v.name.includes(search)
      })
    }

    return {
      appendOption,
      selectOption,
      save,
      appendGroup,
      deleteItem,
      exportFile,
      filterOptions,
      state,
      onOpened
    }
  }
}
</script>
