<style lang="scss">
.z-drag-xml {
  //position: relative;
}

.custom-tree {
  :deep(.el-tree-node__content) {
    height: initial;
  }
  .el-tree-node__content {
    height: initial;
  }
}

.custom-tree-node {
  width: 100%;
  box-sizing: border-box;
  height: 36px;
}

[z-drag-start] {
  border-bottom: 1px dashed transparent;
  //&:hover {
  //  border-bottom-color: #0d84ff;
  //}
}
.form-first-item {
  height: 3px;
  padding: 1px;
  border: none;
  //pointer-events: none;
}
[current-to-move] {
   /*background-color: #0d84ff;*/
  border: 1px dashed transparent;
  /*border-bottom: 2px solid;*/
  /*border-bottom-color: #0d84ff;*/
  pointer-events: none;
  position: relative;
  > button {
    position: absolute;
    //transform: translate(-100%);
    left: 0;
    top: 0;
    pointer-events: all;
    font-size: 12px;
    z-index: 1111111;
  }
}
[current-to-move=rect] {
  border-color:  #4099f8;
}
[current-to-move=line] {
  //border-color:  #4099f8;
  border-bottom-color:  #4099f8;
}
.debug-tool2 {
  [current-to-move=line] {
    border-bottom-color:  #4099f8;
  }
}

.debug-tool3 {
  [current-to-move] {
    border-color:  #4099f8;
    border-width: 1px;
    border-style: solid;
    > button {
      display: none;
    }
  }
}

$play_media: (
mobile: 375px,
);
.playground {
  min-height: 60px;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(238, 238, 238);
  margin: 0 auto;
  &[type=mobile] {
    width: map-get($play_media, mobile);
  }
}
</style>

<template>
  <div class="z-drag-xml" @mousemove="onMouseMove" >
<!--    {{state}}-->
    <el-row class="a-space-mb-10" justify="space-between" align="middle">
      <el-col :span="toolState.spans[0]">编辑标题</el-col>
      <el-col :span="toolState.spans[1]">
        <el-row  justify="center">
          <el-radio-group size="small" v-model="toolState.type">
            <el-radio-button label="mobile"></el-radio-button>
            <el-radio-button label="responsive"></el-radio-button>
          </el-radio-group>
        </el-row>
      </el-col>
      <el-col :span="toolState.spans[2]">
        <el-row style="flex: 1" justify="end">
          <z-easy-modal title="数据展示" :buttonAttr="{size: 'small'}" :model-attr="{width: '60vw'}">
            <template #button-content>打开数据展示</template>
            <template #default>
              <el-button class="a-space-mb-10" @click="downloadJSON(getZprops())">下载json5</el-button>
              <v-json-viewer
                  :expand-depth=10  :expanded="true"
                  boxed
                  :value="getZprops()"></v-json-viewer>
            </template>
          </z-easy-modal>
          <el-button class="a-space-ml-10" size="small" @click="exportFile">导出</el-button>
          <el-button  size="small" @click="importFile">导入</el-button>
        </el-row>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="toolState.spans[0]" >
        <el-row class="a-space-mb-10" style="min-height: 30vh">
<!--          <div @click="selectTree">selectTree</div>-->
<!--          <el-scrollbar max-height="30vh">{{zprops}}</el-scrollbar>-->
          <el-menu
              :default-active="toolState.defaultIndex"
              class="el-menu-vertical-demo"
              :collapse="true"
              @select="handleMenuSelect"

          >
<!--            <el-sub-menu index="1">-->
<!--              <template #title>-->
<!--                <el-icon><location /></el-icon>-->
<!--                <span>Navigator One</span>-->
<!--              </template>-->
<!--              <el-menu-item-group>-->
<!--                <template #title><span>Group One</span></template>-->
<!--                <el-menu-item index="1-1">item one</el-menu-item>-->
<!--                <el-menu-item index="1-2">item two</el-menu-item>-->
<!--              </el-menu-item-group>-->
<!--              <el-menu-item-group title="Group Two">-->
<!--                <el-menu-item index="1-3">item three</el-menu-item>-->
<!--              </el-menu-item-group>-->
<!--              <el-sub-menu index="1-4">-->
<!--                <template #title><span>item four</span></template>-->
<!--                <el-menu-item index="1-4-1">item one</el-menu-item>-->
<!--              </el-sub-menu>-->
<!--            </el-sub-menu>-->
            <el-menu-item index="1">
              <el-icon><document /></el-icon>
              <template #title>大纲树</template>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><icon-menu /></el-icon>
              <template #title>组件库</template>
            </el-menu-item>
<!--            <el-menu-item index="3" disabled>-->
<!--              <el-icon><document /></el-icon>-->
<!--              <template #title>Navigator Three</template>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="4">-->
<!--              <el-icon><setting /></el-icon>-->
<!--              <template #title>Navigator Four</template>-->
<!--            </el-menu-item>-->
          </el-menu>

          <div style="flex: 1;">
            <el-scrollbar :height="toolState.menuConHeight" v-show="toolState.activeIndex === '1'" >
              <el-tree default-expand-all class="custom-tree"
                       :data="treeState.data"
                       :props="treeState.defaultProps"
                       node-key="id"
                       @node-click="handleNodeClick"
                       :expand-on-click-node="false"
                       :ref="initTreeRef"
              >
                <template #default="{ node, data }">
                  <el-row justify="space-between"
                          class="custom-tree-node"

                  >
                    <el-row align="middle">
                      <template v-if="data.label_xml"><div v-html="data.label_xml"></div></template>
                      <template v-if="!data.label_xml">{{data.label}}</template>
                      <div hidden>{{data.tree_id}}</div>
                    </el-row>
                    <el-row align="middle"
                            v-if="!data.NOT_ACTION"
                    >
                      <el-button size="mini"
                                 type="danger"
                                 @click.stop="removeTreeNode(node, data)"> 删除 </el-button>
                    </el-row>
                  </el-row>
                </template>
              </el-tree>
            </el-scrollbar>

            <el-scrollbar :height="toolState.menuConHeight" v-show="toolState.activeIndex === '2'">
              <!--              {{treeState.tplComponents}}-->
              <template v-for="(components, index) in treeState.tplComponents">
                <!--                {{index}}-->
                <h5>{{treeState.tplComponents[index].label}}</h5>
                <draggable
                    class="dragArea g-list-group"
                    v-model="treeState.tplComponents[index].components"
                    @start="onDropStart"
                    @end="onDropEnd"
                    :group="{ name: toolState.group, pull: 'clone', put: false }"
                    :sort="false"
                    item-key="id"
                    tag="el-row"
                    style="align-items: flex-start; flex-wrap: wrap;"
                >
                  <template #item="{element}">
                    <el-col class="g-list-group-item"
                            :class="list1ItemCls(element)"
                            :span="12"
                            :data-name="element.name"
                            :data-column-max="element.columnMax"
                    ><div
                        class="g-list-group-item__element" v-html="element.label"></div></el-col>
                  </template>
                </draggable>
              </template>
            </el-scrollbar>
          </div>
        </el-row>
      </el-col>
      <el-col :span="toolState.spans[1]">
        <el-scrollbar
        :max-height="toolState.maxCanvasHeight"
        :ref="initScrollRef"
        >
          <div :id="playgroundId"
               class="playground"
               :type="toolState.type"
               data-index="-1"
               @dragover="onDragMove"
               @mouseleave="onMouseLeave"

          >
            <div style="height: 1px; " z-drag-start>&nbsp;</div>
            <z-layout-init
                :z-uuid="item.uuid"
                :uuid="item.uuid"
                v-for="(item, index) in state.layouts"
                :key="item.uuid"
                :column="1"
                :ref="initRef(item)"
                :column-max="item.columnMax"
                @dragenter.prevent="onLayoutSelfDragEnter"
                :drag-enter="onLayoutDragEnter"
                @clear-index="onClearIndex"
                @column-max-err="onClearIndex"
                @changed="onChangedLayout(item, $event)"
                @drag-end="onDragEnd(item, $event)"
                @mouseleave.stop="onMouseLeave"
                :style="item.style"
                :class="item.class"
            ></z-layout-init>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="toolState.spans[2]">
        <template v-if="treeState.current && treeState.current.uuid && treeState.showCurrent">
<!--          {{treeState.current.origin.com}}-->
<!--          {{get_current_config('common', {})}}-->
<!--          <z-common-attrs-->
<!--              :value="get_current_config('common', {})"-->
<!--              @common-change="onCommonModelChange"></z-common-attrs>-->
          <div v-html="treeState.current.com_xml"></div>
          <el-scrollbar height="60vh">
            <z-http-com :resolve-config="resolveConfig"
                        @http:model:change="onModelChange"
                        @select-list="onSelectList"
                        @select-checked="onSelectChecked"
            ></z-http-com>
          </el-scrollbar>
<!--          <el-button @click="changeConfig(treeState.current)">修改</el-button>-->
        </template>
<!--        {{treeState.current}}-->
      </el-col>
    </el-row>
    <div class="debug-tool1" :id="testId1"></div>
    <div class="debug-tool2" :id="testId2"></div>
    <div class="debug-tool3" :id="testId3"></div>
  </div>
</template>

<script>
import {computed, nextTick, onMounted, reactive, provide, toRaw} from "vue";
import draggable from 'vuedraggable'
import JsxRender from "@/components/jsxrender.vue";
import RenderDom from "@/components/renderDom.vue";
import ZLayoutInit from "@/plugins/z-frame/components/ZLayoutInit.vue";
import {DATA_LAYOUT_ITEM_UUID_KEY, DATA_LAYOUT_UUID_KEY} from "@/vars";
import Sortable from 'sortablejs';
import mitt from "mitt";
import ZHttpCom from "@/plugins/z-frame/components/ZHttpCom.vue";
import {createCusWidgetEditorConfig} from "@/plugins/form-render/components/CusWidgetEditor/createConfig";
import ZCommonAttrs from "@/plugins/z-frame/components/ZCommonAttrs.vue";
import {QuickBoolean, QuickBooleanWithNull, setPROPS} from "@/hooks/props";
import ZEasyModal from "@/plugins/z-frame/components/ZEasyModal.vue";
import deepMerge from 'deepmerge'

import {
  Location,
  Document,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons'

export default {
  name: 'ZDragXml',
  components: {
    ZEasyModal,
    ZCommonAttrs,
    ZHttpCom,
    ZLayoutInit,
    RenderDom,
    JsxRender,
    draggable,
    Location,
    Document,
    IconMenu,
    Setting,
  },
  setup() {
    const Z_UUID_KEY = 'z-uuid'
    const PLAY_ID = 'playground__' + ZY.rid(6)
    const TEST1_ID = 'test1__' + ZY.rid(6)
    const TEST2_ID = 'test2__' + ZY.rid(6)
    const TEST3_ID = 'test3__' + ZY.rid(6)
    let lodash = ZY.lodash
    let JSON5 = ZY.JSON5
    let originalEvent = {
    }
    let currentToTarget = null
    let currentToMove = null
    let state = reactive({
      components: [],
      filterList: '',
      isDragging: false,
      disableDrag: false,
      currentDragItem: {},
      cachedGridItem: null,
      // tree: [],
      layouts: [],
      layoutsMap: {},
      layoutRefs: {},
      uuids: [],
      comMemo: {}
    })

    let toolState = reactive({
      type: 'mobile',
      activeIndex:'2',
      defaultIndex: '2',
      spans: [
          7,
          10,
          7,
      ],
      maxCanvasHeight: '600px',
      menuConHeight: '600px',
      group: 'people__' + ZY.rid(6)
    })

    const handleMenuSelect = (key, keyPath) => {
      // console.log(key, keyPath)
      toolState.activeIndex =  key
    }
    const handleMenuClose = (key, keyPath) => {
      // console.log(key, keyPath)
    }

    async function downloadJSON(data) {
      let d = ZY.JSON5.parse(ZY.JSON5.stringify(data))
      await ZY_EXT.saveJSONFile({
        data: d,
        prefix: 'z_drag_form__'
      })
    }

    let dragConfig = new Map()
    let emitter = mitt()
    let DRAG_EVENTS = {
      CHANGED: 'CHANGED'
    }
    let DRAG_CONTEXT = new Map()
    let DRAG_INSTANSE = {
      EVENTS:DRAG_EVENTS,
      dragConfig,
      setConfig(key, value) {
        dragConfig.set(key, value)
        emitter.emit(DRAG_EVENTS.CHANGED, {
          key,
          value,
        })
      },
      getConfig(key) {
        return dragConfig.get(key)
      },
      delConfig(key) {
        dragConfig.delete(key)
      },
      hasConfig(key) {
        return dragConfig.has(key)
      },
      register(key, value) {
        DRAG_CONTEXT.set(key, value)
        // console.log('register', state.comMemo, key, value)
        if (state.comMemo && state.comMemo[key] &&  value && value.fromMemo) {
          value.fromMemo(state.comMemo[key] )
          Reflect.deleteProperty(state.comMemo, key)
        }
      },
      unRegister(key) {
        DRAG_CONTEXT.delete(key)
      },
      get(key) {
        return DRAG_CONTEXT.get(key)
      },
      getCtxs() {
        return DRAG_CONTEXT
      },
      emitter,
      onMouseEnter(e) {
        let clone = createInspect(e.target, 'rect',  {
          onMouseleave(e) {

            test1Tool()
          }
        })
        test1Tool(clone)
      },
      onMouseEnter2(target) {
        let clone = createInspect(target, 'rect',  {
          onMouseleave(e) {
            test1Tool()
          }
        })
        test1Tool(clone)
      },
      onCusConfigChange(uuid, config) {
        let _config = DRAG_INSTANSE.getConfig(uuid)
        if (!_config) {
          _config = {
            ins: {},
            common: {},
          }
        }
        _config.ins = config
        DRAG_INSTANSE.setConfig(uuid, _config)
        // console.log('onCusConfigChange', dragConfig)
      },
      getCurrent() {
        return treeState.current ?? {}
      },
      highLight(context) {
        // console.log(context)
        setTimeout(() => {
          let dom = document.querySelectorAll('.z-drag-highlight')
          if (dom) {
            let arr = Array.of(...dom)
            // let clone = createInspect(arr[arr.length - 1], 'rect',  {
            //   onMouseleave(e) {
            //   }
            // })
            // clone.style.position = 'absolute'
            // test2Tool(clone)
            createHighlightRect(arr[arr.length - 1])
            // console.log(dom)
          }
        }, 30)
      },
      onGridDragEnter(cachedGridItem ) {
        state.cachedGridItem = cachedGridItem
      },
      onGridDragleave() {
        state.cachedGridItem = null
        // console.log('sdsdsds')
      },
      reloadTree() {
        reloadTree()
      }
    }
    provide('dragxml', DRAG_INSTANSE)

    let treeState = reactive({
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      current: {},
      showCurrent: false,
      dragConfig,
      tplComponents: []
    })



    function buildTreeChild(child = []) {
      return child.map(item => {
        item.label = item.com.name
        item.tree_id = item.itemUUID
        item.id = item.itemUUID
        // console.log(item)
        if (item.com.DRAG_LABEL_XML) {
          item.label_xml = item.com.DRAG_LABEL_XML()
        }
        return item
      })
    }

    function buildTree() {
      if (Array.isArray(state.layouts)) {
        // console.log(state.layouts)
        let result = state.layouts.map(layout => {
          // console.log(layout, state.layoutsMap)
          // let ret = {
          //   label: 'item',
          //   children: []
          // }
          let ret = null
          let context =state.layoutsMap[layout.uuid]?.el
          if (context) {
            // console.log(context)
            let columns = context.getChildren()
            // console.log(columns)

            if (columns.length  > 0) {
              let child = columns.map(function (column) {
                let child = column.children
                let res = []
                if (Array.isArray(child) && child.length > 0) {
                  let first = child[0]
                  // console.log(child)
                  if (first && first.com && first.com.DRAG_SUB_FORM) {
                    let arr = buildTreeChild(child.slice(1))
                    res =  {
                      ...first,
                      label: first.com.name,
                      children: arr
                    }
                    if (first.com.DRAG_LABEL_XML) {
                      res.label_xml = first.com.DRAG_LABEL_XML()
                    }
                  }
                  else if(first && first.com && first.com.DRAG_GRID) {
                    // console.log(first, child)
                    res = buildTreeChild(child)
                    // let layMap = state.layoutsMap[first.con_uuid]
                    // let gridLayout = layMap.el.getFirstCom()
                    let itemUUID = first.itemUUID
                    let context = DRAG_INSTANSE.get(itemUUID)
                    if (context) {
                      // console.log(context)
                      res[0].children = context.getTree()
                    }
                  }
                  else {
                    res = buildTreeChild(child)
                  }
                }
                column.children = res
                // console.log('res', res)
                return column
              })
              ret = {
                label: 'row',
                children: child
              }
              if (child.length === 1) {
                // 单个组件
                if (Array.isArray(child[0].children)) {
                  ret = child[0].children[0]
                } else {
                  ret = child[0].children
                }
                ret.tree_id = ret.itemUUID
                ret.id = ret.itemUUID
                // console.log(ret)
              } else {
                // console.log(child)
              }
            }

          }
          return ret
        }).filter( v => v)
        // console.log(result)
        return result
      }  else {
        return []
      }
    }

    function reloadTree() {
      treeState.data = buildTree()
    }

    let domRef = null
    function getRef(v) {
      domRef = v
    }

    function fromPoint(x, y) {
      return document.elementFromPoint(x, y)
    }


    function clearTool(id = TEST1_ID) {
      return function (clone) {
        let tool = document.getElementById(id)
        if (tool) {
          tool.innerHTML = ''
          if (clone) {
            tool.appendChild(clone)
          }
        }
      }
    }

    function getParsedConfig(propKey, item) {
      let wrap_config = JSON5.parse(JSON5.stringify(
          DRAG_INSTANSE.getConfig(propKey) ?? {}))
      // console.log(wrap_config)
      if (wrap_config.ins && wrap_config.ins.rules) {
        wrap_config.ins.rules_json = wrap_config.ins.rules
        wrap_config.ins.rules = JSON5.parse( wrap_config.ins.rules)
        Reflect.deleteProperty(wrap_config.ins, 'rulesArr')
      }
      console.log(wrap_config, item)
      let instanse = DRAG_INSTANSE.get(item.itemUUID)
      if (instanse) {
        console.log(instanse)
        if (instanse.DRAG_EXPORT) {
          let export_data = instanse.DRAG_EXPORT() ?? {}
          let ins = wrap_config.ins ?? {}

          wrap_config.ins = deepMerge(export_data,
              ins)
        }
      }
      // if (item && item.com && item.com.DRAG_EXPORT) {
      //   let export_data = item.com.DRAG_EXPORT() ?? {}
      //   let ins = wrap_config.ins ?? {}
      //
      //   wrap_config.ins = deepMerge(export_data,
      //       ins)
      // }
      return wrap_config
    }

    function getZpropsFieldKey(config, prefix = 'field_') {
      let field_key = prefix + ZY.rid(10)
      if (config.ins && config.ins.server && config.ins.server.field_name) {
        field_key = config.ins.server.field_name

      }
      return field_key
    }

    function traveralTree(data = [], context, pathArr = []) {
      // console.log(pathArr)
      let s_path = ZY.getObjPathFromPathArr(pathArr)
      let target = ZY.deepGet(context.res, s_path)
      lodash.each(data, function (item, key) {
        // console.log(item)
        let propKey = item.itemUUID
        if (item.DRAG_GRID_ITEM) {
          // propKey = lodash
          if (Array.isArray(item.children)) {
            let gridItem = item.children.find(v => v.gridItemUUID === propKey)
            if (gridItem) {
              let wrap_config = getParsedConfig(propKey)
              // console.log(wrap_config)
              propKey = gridItem.itemUUID
              let config =  getParsedConfig(propKey)
              // console.log(propKey)
              target[propKey] = {
                type: 'string',
                wrap: 'z-drag-grid-item',
                wrap_config: wrap_config?.ins ?? {},
                ...config.ins
              }
            }
          }
          // console.log(data, target, s_path)
        } else {
          if (!propKey) {
            return;
          }
          let com = item.com
          let isObjectItem = (Array.isArray(item.children) && item.children.length > 0)
          || (com && com.DRAG_SUB_FORM)
          if (
              isObjectItem
          ) {
            let config = getParsedConfig(propKey, item)
            let field_key = getZpropsFieldKey(config, 'subform__')
            let properties = {}
            target[field_key] = {
              type: 'object',
              properties,
              ...config.ins
            }

            // console.log(target)



            context.pathArr = pathArr.concat( [field_key, 'properties'] )

            traveralTree(item.children, context, context.pathArr)
          } else {
            let config = getParsedConfig(propKey, item)
            let field_key = getZpropsFieldKey(config)
            // console.log( field_key)
            if (target) {
              target[field_key] = {
                type: 'string',
                ...config.ins
              }

              // if (!target[propKey].server) {
              //   target[propKey].server = {}
              // }
              // if (!target[propKey].server.field_name) {
              //   target[propKey].server.field_name = field_key
              // }
            }

          }
        }
      })
    }

    function getZprops() {
      let dragConfig = treeState.dragConfig
      // console.log(dragConfig)
      let context = {
        res: {},
        config: dragConfig,
        pathArr: [''],
        pathMap: {

        }
      }
      let propsDef = {
        type: 'object',
        ui: {
          styles: [

          ],
          widgetConfig: {

          }
        },
        properties: {

        }
      }
      if (Array.isArray(treeState.data)) {
        traveralTree(treeState.data, context, [])
        // console.log(context.res)
        // return context.res
        propsDef.properties = context.res
      }
      // return []
      return propsDef
    }


    let test1Tool = clearTool()
    let test2Tool = clearTool(TEST2_ID)
    let test3Tool = clearTool(TEST3_ID)

    let app = getApp()


    let _currentBuild = null
    function createHighlightRect(dom) {
      function build() {
        let clone = createInspect(dom, 'rect',  {
          onMouseleave(e) {
          }
        })
        clone.style.position = 'fixed'
        test3Tool(clone)
      }
      build()
      _currentBuild = build
    }

    window.addEventListener('resize', function () {
      if (_currentBuild) {
        _currentBuild()
      }
    })

    function onMutation(mutations) {
      let el = document.querySelector('.z-drag-highlight')
      // console.log('mutations', el)
      if (!el) {
        test3Tool()
      }
    }

    /**
     * 初始化拖拽组件
     * @type {{name, label: string}[]}
     */
    state.components = [
      ...app.get_custom_components(
          function ([comName, comDef]) {
            return comDef.ZDragXmlCom
          }
      ).map(v => {
        // console.log(v)
        let extDataset = {}
        if (v.origin && v.origin.DRAG_DATASET) {
          extDataset = v.origin.DRAG_DATASET()
        }
        let label = v.label ?? ''
        if (v.origin && v.origin.DRAG_LABEL_XML) {
          label = v.origin.DRAG_LABEL_XML()
        }
        // console.log(ret)
        return {
          name: v.value,

          DRAG_GROUP: v.origin.DRAG_GROUP,
          label: label,
          ...extDataset
        }
      }),
    ]


    function getTplComponents(group = undefined) {
      return state.components.filter(v => {
        // console.log('v', v)
        return v.DRAG_GROUP === group
      })
    }

    treeState.tplComponents[0] = {
      label: '基础控件',
      components: getTplComponents()
    }
    treeState.tplComponents[1] = {
      label: '高级控件',
      components: getTplComponents('high')
    }

    function list1ItemCls(element) {
      let filted = !element.name.includes(state.filterList)
      return {
        ['list-group-item--hidden']: filted
      }
    }

    function onDropStart(e) {
      state.isDragging = true
      state.disableDrag = true
      state.currentDragItem = e.item
    }

    let currentDragEnterContext = null
    function initLayoutRefs(item) {
      // console.log(uuid, state.layoutsMap)
      let context = state.layoutsMap[item.uuid]
      if (context && context.el) {
        let com = CustomVueComponent.resolve(item.dataset.name)
        context.el.initGrid(com)
      }
    }

    /**
     * 创建layout item
     */
    function createLayoutItem(dataset) {
      let com = CustomVueComponent.resolve(dataset.name)
      let uuid = ZY.rid()
      let columnMax = parseFloat(dataset.columnMax)
      if (!Number.isNaN(columnMax)) {
        dataset.columnMax = columnMax
      }
      let item = {
        uuid,
        columnMax,
        comName: dataset.name,
        dataset,
        com,
      }
      // console.log('createLayoutItem', columnMax,item)
      return item
    }

    function appendLayout(dataset, {style = '', className = {}} = {}) {
      let item = createLayoutItem(dataset)
      item.style = style
      item.class = className
      state.layouts.push(item)
    }


    /**
     *
     * @returns {*[]|*[]}
     */
    function buildUUIDS() {
      let el = getPlaygroundDOM()
      if (el) {
        let zs = Array.of(...el.children)
        if (zs.length > 1) {
          let df = zs.slice(1)
          let uuids = df.filter(v => {
            return true
          }).map(dom => {
            return dom.getAttribute(Z_UUID_KEY)
          })
          // console.log(uuids)
          state.uuids = uuids
          return uuids
        }
        return []
      }
      return []
    }

    function reloadLayoutsSort() {
      let uuids = buildUUIDS()
      // console.log(uuids, state.layouts)

      let dlayouts = JSON5.parse(JSON5.stringify( state.layouts))

      let layouts = []
      uuids.forEach(uuid => {
        let index = dlayouts.findIndex(layout => {
          return layout.uuid === uuid
        })
        if (index > -1) {
          layouts.push(dlayouts[index])
        }
        // console.log(uuid, index)
      })
      state.layouts = layouts
      // console.log(uuids, state.layouts)
    }

    let sortable;
    let dragGroup = "drag-level" + ZY.rid(6);
    /**
     *
     */
    function rebuildSortable() {
      let el = getPlaygroundDOM()
      sortable = new Sortable(el, {
        group: dragGroup,
        onEnd: function (/**Event*/evt) {
          test1Tool()
          test2Tool()
          reloadLayoutsSort()

          nextTick(() => {
            reloadTree()
          })
        }
      })
    }

    let _initScrollRef;
    function initScrollRef(el) {
      _initScrollRef = el
      // console.log(el)
    }

    function selectCurrent(e) {
      // console.log(e)
      treeState.current = {
        origin: e,
        uuid: e.itemUUID,
        ext: {},
      }
      treeState.showCurrent = false
      setTimeout(() => {
        treeState.showCurrent = true
      }, 300)
    }

    function getPlaygroundDOM() {
      return  document.getElementById(PLAY_ID)
    }

    function onDropEndItemsChanged(item) {
      test2Tool()
      initLayoutRefs(item)
      rebuildSortable()
      buildUUIDS()
    }

    function buildGridItem(dataset) {
      let {e,itemKey,context} = state.cachedGridItem
      let target = e.target
      let el = context.$el
      // console.log('onGridDragEnter', e, state.currentDragItem)
      // let dataset = state.currentDragItem?.dataset ?? {}
      // console.log(dataset)
      if (dataset.name) {
        let com = CustomVueComponent.resolve(dataset.name)
        if (!com.DRAG_GRID) {
          // console.log(dataset.name)
          context.initDomCom(itemKey, com)
          nextTick(() => {
            reloadTree()
          })
        }
      }
    }

    function appendLayout(uuid, item) {
      let index = state.uuids.findIndex((v) => v === uuid)
      // console.log(index, uuid)
      // let newUUID = ZY.rid()
      // console.log(uuid, index, newUUID)
      if (index > -1) {
        let newIndex = index + 1
        let newLen =  state.layouts.length
        state.layouts.splice(newIndex, 0, item)
        // console.log(newIndex, newLen)
        nextTick(() => {
          onDropEndItemsChanged(item)
          if (newIndex > newLen -1) {
            setTimeout(() => {
              _initScrollRef.setScrollTop(_initScrollRef.wrap.scrollHeight)
              // console.log(_initScrollRef.wrap.scrollHeight)
              // _initScrollRef.update()
              //   _initScrollRef.wrap.scrollTop = _initScrollRef.wrap.scrollHeight
            }, 300)
          }

        })
      }
    }

    function onDropEnd(e) {
      let playground = getPlaygroundDOM()
      state.isDragging = false
      originalEvent = e.originalEvent
      // console.log('onDropEnd', originalEvent)

      let dataset = e?.item?.dataset ?? {}

      if (state.cachedGridItem) {
        buildGridItem(dataset)
        return;
      }


      currentToTarget = fromPoint(originalEvent.clientX, originalEvent.clientY)

      // console.log(currentToTarget, [originalEvent.clientX, originalEvent.clientY])
      if (!currentToTarget) {
        return;
      }

      /**
       * 获取组件定义
       * @type {*}
       */
      let com = CustomVueComponent.resolve(dataset.name)
      let item = createLayoutItem(dataset)


      if (currentToTarget.hasAttribute('z-drag-start')) {
        state.layouts.unshift(item);
        nextTick(() => {
          onDropEndItemsChanged(item)
          test1Tool()
        })
        return;
      }
      if (playground.isEqualNode(currentToTarget)) {
        state.layouts.push(item)
        nextTick(() => {
          onDropEndItemsChanged(item)
        })
        return;
      }


      if (currentToTarget.hasAttribute(Z_UUID_KEY)) {
        let uuid = currentToTarget.getAttribute(Z_UUID_KEY)
        // let index = Array.of(...playground.children).findIndex(v => {
        //   return v.getAttribute(Z_UUID_KEY) === uuid
        // })

        let index = state.uuids.findIndex((v) => v === uuid)
        // console.log(index, uuid)
        // let newUUID = ZY.rid()
        // console.log(uuid, index, newUUID)
        if (index > -1) {
          let newIndex = index + 1
          state.layouts.splice(newIndex, 0, item)
          nextTick(() => {
            onDropEndItemsChanged(item)
          })
        }
        return;
      }

      let trueDom = null
      if (playground.contains(currentToTarget)) {
        trueDom = getNestRenderDom(currentToTarget)
      }

      console.log(trueDom)

      if (trueDom && trueDom.parentElement && trueDom.parentElement.hasAttribute('z-drag-layout__column')) {
        let columnMax = parseInt(trueDom.parentElement.getAttribute('z-drag-layout__column'))

        if (columnMax < 2) {
          // console.log('sdsdsds', trueDom.parentElement.parentElement)
          let uuid = trueDom.parentElement.parentElement.getAttribute(Z_UUID_KEY)
          appendLayout(uuid, item)
        }
      }

      if (currentDragEnterContext) {
        currentDragEnterContext.append(com, trueDom)
      }
    }



    function getNestRenderDom(dom) {
      if (dom.classList.contains('render-dom-item')) {


        return dom
      }
      if (dom.parentElement) {
        return getNestRenderDom(dom.parentElement)
      }
      return null
    }

    function getLayoutRenderDom(dom) {
      if (dom.hasAttribute('layout-dom')) {
        return dom
      }
      // if (dom.parentElement) {
      //   return getNestRenderDom(dom.parentElement)
      // }
      return null
    }

    let currentInspectContext = null

    /**
     * 创建观察
     * @param trueDom
     * @param type
     * @param options
     * @returns {HTMLElement | HTMLDivElement | any}
     */
    function createInspect(trueDom, type, options = {}) {
      function handleButtonClick() {
        // console.log(trueDom)
        if (trueDom.hasAttribute('z-uuid')) {
          let con_uuid = trueDom.getAttribute('z-uuid')
          let context = state.layoutsMap[con_uuid]
          // removeLayout(con_uuid)
          // console.log(state.layoutsMap, context)
          if (context && context.el) {
            let children = context.el.getChildren()
            if (children[0] && children[0].children[0]) {
              let currentInspectContext = children[0].children[0]
              selectCurrent(currentInspectContext)
              // console.log(context, currentInspectContext)
            }
          }
        }
        else if (trueDom.hasAttribute('z-drag-grid-item')) {
          let dataset = trueDom.dataset
          let gridUUId = dataset.gridId
          let gridIns = DRAG_INSTANSE.get(gridUUId)
          if (gridIns) {
            let dom = gridIns.getDom(dataset.key)
            if (dom) {
              selectCurrent(dom.def)
            }
          }
        }
        else {
          let trueDom_uuid = app.findUUIDfromClassList(trueDom)
          let layout_uuid = app.findUUIDfromClassList(trueDom, DATA_LAYOUT_UUID_KEY)
          let layout_item_uuid = app.findUUIDfromClassList(trueDom, DATA_LAYOUT_ITEM_UUID_KEY)
          // console.log(layout_uuid, trueDom_uuid)
          let context = state.layoutRefs[layout_uuid]
          if (context) {
            currentInspectContext = context.findCom(trueDom_uuid, layout_item_uuid)
            if (currentInspectContext.con_uuid) {
              // console.log(state.layouts.map(v => v.uuid), currentInspectContext.con_uuid)
              // let index = state.layouts.findIndex(v => {
              //   return v.uuid === currentInspectContext.con_uuid
              // })
              // if (index > -1) {
              //   console.log(state.layouts[index])
              // }
              // console.log(currentInspectContext)
              selectCurrent(currentInspectContext)
            }
            // console.log(currentInspectContext, context, state.layouts)
          }
        }
      }

      // console.log(trueDom)

      // 单一组件不可以
      if (type === 'line') {
        if (trueDom && trueDom.parentElement && trueDom.parentElement
            && trueDom.parentElement.hasAttribute('z-drag-layout__column')
            ) {
          let columnMax = parseInt(trueDom.parentElement.getAttribute('z-drag-layout__column'))
          // console.log(columnMax)
          if (columnMax < 2) {
            trueDom = trueDom.parentElement.parentElement
          }
        }
      }

      let clone = document.createElement('div')
      let computedStyle = getComputedStyle(trueDom)
      // console.log(computedStyle.marginBottom)
      let marginBottom = parseFloat(computedStyle.marginBottom)
      let marginTop = parseFloat(computedStyle.marginTop)
      let client = trueDom.getBoundingClientRect()
      // console.log(clone, client)
      clone.setAttribute('data-type', type)
      // clone.style.position = 'fixed'
      clone.style.position = 'fixed'
      clone.style.left = client.left + 'px'
      // clone.style.top = (client.top - marginBottom) + 'px'
      clone.style.width = client.width + 'px'
      clone.style.zIndex = 111
      if (type === 'line') {
        clone.style.top = ( client.top + client.height ) + 'px'
        clone.style.height = 1 + 'px'
      }
      else if (type === 'rect') {
        clone.style.top = (client.top - marginTop) + 'px'
        clone.style.height = (client.height + marginTop + marginBottom + 1) + 'px'
        // clone.style.height = (client.height + marginTop + 1) + 'px'

        clone.addEventListener('mouseleave', function (e) {
          if (options && options.onMouseleave) {
            options.onMouseleave(e)
          }
        })

        let button = document.createElement('button')
        button.textContent = '编辑'
        button.addEventListener('click', handleButtonClick)
        clone.appendChild(button)
      }
      clone.setAttribute('current-to-move', type)
      return clone
    }

    /**
     * 观察DOM
     * @param e
     * @param type
     * @param actionFun
     * @param findDom
     */
    function inspectDom(e, type = 'line', {
      actionFun = test1Tool, findDom = getNestRenderDom, options = {}
    } = {}) {
      let playground = getPlaygroundDOM()
      // console.log(playground, e.pageX, e.pageY)
      currentToMove = fromPoint(e.clientX, e.clientY)
      // console.log(currentToMove)
      let trueDom = null
      if (!currentToMove) {
        return
      }
      if (currentToMove && playground.contains(currentToMove)) {
        trueDom = findDom(currentToMove)
      }
      if (currentToMove.hasAttribute('z-drag-start')) {
        let clone = createInspect(currentToMove, type, options)
        actionFun(clone)
        return;
      }
      if (trueDom) {
        let clone = createInspect(trueDom, type, options)
        actionFun(clone)
      }  else {
        actionFun()
      }
    }

    function onMouseMove(e) {
      // inspectDom(e,'rect')
      // inspectDom(e,'rect', {
      //   actionFun: test2Tool,
      //   findDom: getLayoutRenderDom
      // })
      // clearTool()
      let testId1DOM = document.getElementById(TEST1_ID)
      let playground = getPlaygroundDOM()
      currentToMove = fromPoint(e.clientX, e.clientY)
      // console.log(currentToMove)
      let trueDom = null
      if (currentToMove && playground.contains(currentToMove)) {
        // trueDom = findDom(currentToMove)
        // console.log(trueDom)
      }
       else {
         if (testId1DOM.contains(currentToMove)) {
           // console.log('sdsdsds')
         } else  {
           // console.log(currentToMove, testId1DOM.children)
           if (testId1DOM.children && testId1DOM.children.length > 0) {
             test1Tool()
           }
         }
      }
    }

    function onDragMove(e) {
      // console.log('onDragMove', e)
      inspectDom(e)
      inspectDom(e,'line', {
        actionFun: test2Tool,
        findDom: getLayoutRenderDom
      })
    }

    function onLayoutDragEnter(e) {
      // console.log('onLayoutDragEnter', e)
      currentDragEnterContext  = e
    }

    function onLayoutSelfDragEnter(e) {
      // console.log(e.target)
    }

    /**
     *
     * @param data
     */
    function clearConfig(data) {
      if (data && data.itemUUID) {
        DRAG_INSTANSE.delConfig(data.itemUUID)
      }
    }

    /**
     * removeSubLayout
     * @param con_uuid {string}
     * @param data {{}}
     */
    function removeSubLayout(con_uuid, data = {}) {
      let layouMapItem = state.layoutsMap[con_uuid]
      // console.log(layouMapItem)
      if (layouMapItem && layouMapItem.el && layouMapItem.el.removeChild) {
        layouMapItem.el.removeChild(data)
      }
      // Reflect.deleteProperty(state.layoutsMap, con_uuid)
      reloadTree()
    }

    /**
     * removeLayout
     * @param con_uuid {string}
     * @param data {{}}
     */
    function removeLayout(con_uuid, data = {}) {
      let index = state.layouts.findIndex(v => {
        return v.uuid === con_uuid
      })
      // console.log(state.uuids, con_uuid, index, data)
      if (index > -1) {
        // let layout = state.layouts[index]
        let layouMapItem = state.layoutsMap[con_uuid]
        let layoutUUID = layouMapItem.layoutUUID
        // let layoutRef = state.layoutRefs[layoutUUID]
        Reflect.deleteProperty(state.layoutRefs, layoutUUID)
        Reflect.deleteProperty(state.layoutsMap, con_uuid)
        state.layouts.splice(index, 1)
        buildUUIDS()
        reloadTree()
        // console.log(layout, layouMapItem, layoutRef)
      }
    }

    function initRef(item) {
      // console.log('item', item)
      return function (el) {
        if (el) {
          state.layoutsMap[item.uuid] = {
            el,
            layoutUUID: el.state.layoutUUID
          }
          state.layoutRefs[el.state.layoutUUID] = el
        }
      }
    }

    function onClearIndex() {
      test1Tool()
    }

    function removeTreeNode(node, data) {
      let {com = {}} = data
      // console.log('removeTreeNode', node, data, com)
      if (com.DRAG_SUB_FORM) {
        lodash.each(node.childNodes, (childNode) => {
          let childNodeData = childNode.data
          // console.log(childNode, childNodeData)
          clearConfig(childNodeData)
        })
        clearConfig(data)
        // console.log(dragConfig)
        removeLayout(data.con_uuid, data)
      }
      else {
        if (node.parent && node.parent.data?.com?.DRAG_SUB_FORM) {
          clearConfig(data)
          // console.log(dragConfig, data)
          removeSubLayout(data.con_uuid, data)
        }
        else if (node.parent && node.parent.data?.DRAG_GRID_ITEM) {
          let parentData =  node.parent.data
          // console.log(parentData)
          let parentRef = DRAG_INSTANSE.get(parentData.GRID_UUID)
          // console.log(parentRef)
          if (parentRef) {
            parentRef.clearGridItem(data.gridItemUUID)
            console.log(treeState.current, data)
            if (treeState.current.uuid === data.uuid) {
              treeState.current = {}
            }
            nextTick(() => {
              reloadTree()
            })
          }
          // console.log('dsdsdsds', parentData, data)
        }
        else {
          clearConfig(data)
          removeLayout(data.con_uuid, data)
        }
        // clearConfig(data)
        // console.log(dragConfig, data)
        // removeSubLayout(data.con_uuid, data)
      }
      if (treeState.current.uuid) {
        // console.log(treeState.current.uuid, dragConfig)
        if (!DRAG_INSTANSE.hasConfig(treeState.current.uuid)) {
          treeState.current = {}
        }
      }
    }

    function onChangedLayout() {
      reloadTree()
    }

    /**
     * 当子表单内部拖动结束后
     */
    function onDragEnd() {
      reloadTree()
    }

    function handleNodeClick(e) {
      // console.log('handleNodeClick', e)
      let {config = {}} = e
      treeState.current = {
        origin: e,
        uuid: e.itemUUID,
        ext: {},
      }
      treeState.showCurrent = false
      setTimeout(() => {
        treeState.showCurrent = true
      }, 300)
      if (config.com) {
        let def = CustomVueComponent.resolve(config.com)
        treeState.current.cusEditor =  def.CUS_EDITOR()
      }
      // console.log(treeState.current)

    }

    // function changeConfig(current) {
    //   DRAG_INSTANSE.setConfig(current.uuid, {
    //     test: 1
    //   })
    //
    //   console.log('changeConfig', current, dragConfig)
    // }

    async function resolveConfig() {
      let current  = treeState.current
      let origin = current.origin
      let com = origin.com
      treeState.current.com_name = com.name
      treeState.current.com_xml = treeState.current?.origin?.label_xml ?? com.name
      // console.log(treeState.current)
      if (treeState?.current?.origin?.com?.DRAG_LABEL_XML) {
        treeState.current.com_xml = treeState?.current?.origin?.com?.DRAG_LABEL_XML()

      }
      let widgetConfigProps = {
        disabled: QuickBooleanWithNull('禁用'),
        readonly: QuickBooleanWithNull('只读')
      }
      let base_type_props = {
        type: {
          type: 'string',
          wrap_start: '<xy-tab-content label="常见">',
          ui: {
            label: '类型',
            // widget: 'CusSelect',
            widget: 'CusSuggest',
            widgetConfig: {
              // inputStyle: 'width: 350px',
              enums: "ROOT_STATE('tools.propTypes', [])",
              mode: 'select',
            },
            events: {
            }
          },
        },
        sub_type: {
          type: 'string',
          ui: {
            label: '子类型',
            // widget: 'CusSelect',
            widget: 'CusSuggest',
            widgetConfig: {
              // inputStyle: 'width: 350px',
              enums: "ROOT_GETTERS('subTypes', [MODEL('type', '')])",
              mode: 'select',
            },
            events: {
            }
          },
        },
      }
      let base_ui_props =  {
        type: 'object',
        ui: {
          label: "UI"
        },
        properties: {
          label: {
            type: 'string'
          },
          desc: {
            type: 'string',
            ui: {
              label: '描述',
              widgetConfig: {
                type: 'textarea'
              }
            }
          },
          widgetConfig: {
            type: 'object',
            ui: {
              label: "UI 配置"
            },
            properties: widgetConfigProps
          }
        }
      }
      let base_server_props = {
        type: 'object',
        wrap_start: '<xy-tab-content label="高级">',
        wrap_end: '</xy-tab-content>',
        ui: {
          label: '服务器'
        },
        properties: {
          field_name: {
            type: 'string',
            ui: {
              widgetConfig: {
                readonly: true
              }
            }
          }
        }
      }
      let base_form_props = {

        rules: {
          type: 'string',
          // hidden: true,
          computedProp: 'srules',
          ui: {
            attrs: [
              // ['style', 'height: 0; overflow: hidden']
            ],
            label: '验证规则',
            // widget: 'JsonCodeEditor',
            // widget: 'CodeJsEditor',
            widgetConfig: {
              type: 'textarea',
              disabled: true
              // style: {height: '200px'}
            }
          }
        },
        rulesArr: {
          type: 'array',
          ui: {
            label: '校验规则',
          },
          wrap_end: '</xy-tab-content>',
          items: {
            type: "object",
            properties: {
              value: {
                type: 'string',
                ui: {
                  form_item: {
                    labelWidth: '0px'
                  },
                  // attrs: [
                  //     ['label-width', '70px']
                  // ],
                  label: ' ',
                  widget: 'CusFormRules',
                  widgetConfig: {
                  }
                },
              },
            }
          }
        },
      }
      let properties = {
        ...base_type_props,
        ui: base_ui_props,
        // server: base_server_props,
      }
      if (com.DRAG_CONFIG) {
        let _config  = com.DRAG_CONFIG() ?? {}
        widgetConfigProps = Object.assign(widgetConfigProps, _config.props)
      }
      // console.log(com)
      if (!com.DRAG_GRID) {
        properties = {
          ...base_type_props,
          ui: base_ui_props,
          ...widgetConfigProps,
          ...base_form_props,
          server: base_server_props,
        }
      }

      console.log(widgetConfigProps)
      let computed = {
        srules: `A.getRulesFromRulesArr(MODEL('rulesArr'))`,
      }
      let formDef = {
        type: 'object',

        tag: 'xy-tab',
        ui: {
          attrs: [
            ['label-width', '100px']
          ],
        },
        properties,
      }
      let _cached = DRAG_INSTANSE.getConfig(treeState.current.uuid)
      let defaultVal = setPROPS({
        ui: {
          widgetConfig: {
          }
        },
        server: {
        }
      }, _cached?.ins ?? {})
      // console.log('defaultVal',  _cached?.ins, defaultVal)
      return {
        default: createCusWidgetEditorConfig(formDef,
            computed,
            defaultVal
        )
      }
    }

    let widgetFormLocks = false
    function onModelChange(e) {
      let model = e.model ?? {}
      if (widgetFormLocks) {

      } else {
        // console.log(model, treeState.current.ext)
        DRAG_INSTANSE.setConfig(treeState.current.uuid, {
          ins: model,
          common: treeState.current.ext
        })
      }
    }


    function onCommonModelChange(e) {
      treeState.current.ext = e
      let config = DRAG_INSTANSE.getConfig(treeState.current.uuid)
      if (config) {
        if (typeof config.common !== 'undefined') {
          // lodash.each(config.common, function (item, key) {
          //   Reflect.deleteProperty(config.common, key)
          // })
          // lodash.each(e,function (item, key) {
          //   // if (key === 'common_state') {
          //   //   config.common[item] = item
          //   // }
          //   config.common[key] = item
          // })
          config.common = e
        } else {
          config.common = e
        }
        // console.log('onCommonModelChange', e)
        DRAG_INSTANSE.setConfig(treeState.current.uuid, config)
      } else {
        DRAG_INSTANSE.setConfig(treeState.current.uuid, {
          ins: {},
          common: e
        })
      }
    }

    function get_current_config(path, defaultVal) {
      let config = DRAG_INSTANSE.getConfig(treeState.current.uuid)
      let o = config ?? {}
      return ZY.deepGet(o, path, defaultVal)
    }

    function onMouseLeave() {
      // test1Tool()
    }

    let _initTreeRef = null
    function initTreeRef(el) {
      _initTreeRef = el
    }

    function selectTree() {
      // let current = _initTreeRef.getCurrentNode()
      // console.log(treeState.data)
      // let tree_id = treeState.data[0].tree_id
      // console.log(tree_id, treeState.data)
      // _initTreeRef.setCurrentKey(tree_id)
    }


    function onSelectList(e) {
      // console.log('onSelectList', e)
      // console.log(treeState.current)
      let uuid = treeState?.current?.uuid ?? ''
      if (uuid) {
        let context = DRAG_INSTANSE.get(uuid)
        // console.log(context)
        context.setVal(e.origin.value)
      }
    }

    function onSelectChecked(e) {
      let uuid = treeState?.current?.uuid ?? ''
      if (uuid) {
        let context = DRAG_INSTANSE.get(uuid)
        // console.log('onSelectList', e)
        let arr = e.origin.options ?? []
        if (Array.isArray(arr)) {
          arr = arr.map(v => v.value)
        }
        context.setVal(arr)
        // console.log('onSelectChecked', arr)
      }
    }

    /**
     * 获取存储
     * @returns {{defs: {}, state: {layouts: *[], uuids: *[]}}}
     */
    function getMemo() {
      let ret = {
        state: {
          layouts: toRaw(state.layouts),
          uuids:  toRaw(state.uuids),
        },
        defs: {},
      }
      ret.treeState ={
        data: toRaw(treeState.data)
      }
      ret.dragConfig =  JSON5.stringify(
          [...toRaw(treeState.dragConfig)]
      )
      lodash.each(state.layoutsMap, function (map, key) {
        let cached = map.el.toMemo()
        // console.log(cached)
        ret.defs[key] = cached
      })


      let ctx = DRAG_INSTANSE.getCtxs()

      ret.comMemo = {
      }

      ctx.forEach( function (item, key) {
        // console.log(item, key)
        if (item.toMemo) {
          ret.comMemo[key] = item.toMemo()
        }
      })

      // console.log(ret.comMemo )
      return ret
    }

    // async function exportFile(form) {
    //   let m = getMemo()
    //   ZY_EXT.saveDesignFile({
    //     fileName: 'test_export',
    //     data: m,
    //     prefix: 'dragxml_',
    //     ...form
    //   })
    //   // console.log('sdsdsds')
    // }

    function importData(obj_data = {}) {
      ZY.lodash.each(obj_data.state, function (item, key) {
        // console.log(item, key)
        state[key] = item
      })
      ZY.lodash.each(obj_data.treeState, function (item, key) {
        // console.log(item, key)
        treeState[key] = item
      })
      // console.log(obj_data)
      state.comMemo = obj_data.comMemo
      nextTick(() => {
        lodash.each(obj_data.defs, (item, uuid) => {
          let map = state.layoutsMap[uuid]
          // console.log(item, map)
          if (map && map.el) {
            map.el.fromMemo(item)
          }
        })
        try {
          let map = new Map(JSON5.parse(obj_data.dragConfig))

          // console.log(map)
          map.forEach((item, key) => {
            DRAG_INSTANSE.setConfig(key, item)
          })
        } catch (e) {
          console.error(e)
        }

        // let ctx = DRAG_INSTANSE.getCtxs()
        // console.log(ctx)
        // ctx.forEach( function (item, key) {
        //   // console.log(item, key)
        //   if (item.fromMemo) {
        //     item.fromMemo(obj_data.comMemo)
        //   }
        // })
      })
    }

    async function exportFile() {
      let m = getMemo()
      // console.log(DRAG_INSTANSE.dragConfig)
      // await ZY_EXT.store.setItem('test_export', ZY.JSON5.stringify( { data: m }) )
      ZY_EXT.saveDesignFile({fileName: 'dragxml_export', data: m})
    }

     async function importFile() {
       let obj = await ZY_EXT.fileOpenJSON5()
       // let data = await ZY_EXT.store.getItem('test_export') ?? '{}'
       // let obj = ZY.JSON5.parse(data)
       if (obj.data) {
         const obj_data = obj.data
         // console.log(obj)
         importData(obj_data)
       }
     }

    onMounted(() => {
      // appendLayout({
      //   name: 'ZDragFormStart'
      // }, {
      //   style: {
      //     // height: 0
      //   },
      //   className: {
      //     'form-first-item': true
      //   }
      // })

      const mo = new MutationObserver(onMutation);
      mo.observe(getPlaygroundDOM(), {
        attributes : true,
        subtree: true,
        childList: true
      });
    })

    return {
      list1ItemCls,
      selectTree,
      initTreeRef,
      state,
      getRef,
      getTplComponents,
      playgroundId: PLAY_ID,
      onDropStart,
      importData,
      exportFile,
      importFile,
      downloadJSON,
      initRef,
      onDragMove,
      onLayoutSelfDragEnter,
      onLayoutDragEnter,
      onChangedLayout,
      onDragEnd,
      onClearIndex,
      getMemo,
      testId1: TEST1_ID,
      testId2: TEST2_ID,
      testId3: TEST3_ID,
      onSelectList,
      onSelectChecked,
      onDropEnd,
      onMouseMove,
      treeState,
      // zprops,
      getZprops,
      initScrollRef,
      removeTreeNode,
      toolState,
      handleMenuSelect,
      handleMenuClose,
      resolveConfig,
      get_current_config,
      onCommonModelChange,
      onModelChange,
      onMouseLeave,
      // changeConfig,
      handleNodeClick,
    }
  }
}
</script>
