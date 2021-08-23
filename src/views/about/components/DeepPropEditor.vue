<template>
<div>
<!--  {{store.model}}-->
  <el-row type="flex">
    <AsyncPlumbLayout
        style="flex: 1"
        @init="onPlumbLayoutInit"
        :root-id="rootId"
        :handleAppend="handleAppend"
        :handle-dep="handleDep"
        @edit-dep="onEditDep"
        @save-data="onSaveDep"
    ></AsyncPlumbLayout>
    <div style="width: 600px">
      <template v-if="renderFormDesigner && currentEditDep">
        {{currentEditItem}}
<!--        {{currentEditItem}}-->
        <template v-if="currentEditDep.type === 'object'">
          <HttpComponent
              :defs="allDef"
              :is="store.model.editor_step"
          >
            <template #form_array_before="scope">
              <h3>{{scope.index}}</h3>
            </template>
          </HttpComponent>
        </template>
      </template>
    </div>
  </el-row>
</div>
</template>

<script>
import AsyncPlumbLayout from "@/components/AsyncPlumbLayout.vue";
import {getCurrentInstance, nextTick} from "vue";
import {usePage} from "@/mixins/framework";

let depManagerMixin = {
  data() {
    return {
      renderFormLoading: false,
      renderFormDesigner: false,
      currentEditDep: null,
      currentEditItem: null,
    }
  },
  methods: {
    async onEditDep({dep, item}) {
      this.renderFormLoading = true
      this.renderFormDesigner = false
      this.currentEditDep = dep
      this.currentEditItem = item
      console.log('onEditDep', dep, item)
      if (dep.editor) {
        await this.loadStepByContent('editor_step', item)
      }
      // console.log(currentHtc)
      this.$nextTick(() => {
        setTimeout(() => {
          this.renderFormLoading = false
          this.renderFormDesigner = true
        }, 30)
      })
    }
  }
}

let plumbLayoutMixin = {
  data() {
    return {
      showCurrent: true,
      currentLinks: [],
      currentLayoutMap: {},
    }
  },
  methods: {
    onPlumbLayoutInit(self) {
      self.deps = [
        {
          id: 'i111',
          type: 'object',
          config: {
            version: 'v1',
            closure: false,
            root: true
          },
          editor: `editor`,
          content: '',
          items: [
            {
              id: 'i111-0',
              key: 'parts',
              data: '',
            },
            {
              id: 'i111-1',
              key: 'other',
              data: '',
            },
          ],
        },
        {
          id: 'i222',
          type: 'array',
          config: {
            version: 'v1',
            closure: false
          },
          editor: `editor`,
          name: '',
          items: [
            {
              id: 'i222-0',
              key: 'items',
              data: '',
            },
          ]
        },
        {
          id: 'i333',
          type: 'object',
          config: {
            version: 'v1',
            closure: false
          },
          editor: `editor`,
          content: '',
          items: [
            {
              id: 'i333-0',
              key: 'name1',
              data: '',
            },
            {
              id: 'i333-0',
              key: 'name2',
              data: '',
            },
          ],
        }
      ]
      self.$nextTick(() => {
        self.insDeps(self.deps)
        setTimeout(() => {
          self.insComLinks(
              [
                {
                  "toPID": "i222",
                  "fromPID": "i111",
                  "from": "i111-0",
                  "to": "i222-top"
                },
                {
                  "toPID": "i333",
                  "fromPID": "i222",
                  "from": "i222-0",
                  "to": "i333-top"
                },
              ]
          )
        }, 300)
      })
    },
    handleDep(dep) {
      console.log('handleDep', dep)
      if (dep.type === 'form') {
        dep.content = ''
        dep.config.closure = true
      }
    },
    handleAppend(newItem, dep) {
      // console.log('newItem', dep)
      if (dep.type === 'column') {
        newItem.h = 120
      }
      if (dep.type === 'row') {
        newItem.w = '1fr'
        newItem.h = 50
      }
    },
    onSaveDep({deps, links = []}) {
      const JSON_PARSE_KEYS = ['widgetConfig', 'rules']

      function findItemLinkedDep(item) {
        let dep
        let link = links.find(v => v.from === item.id)
        if (link) {
          dep = deps.find(v => v.id === link.toPID)
        }
        return dep
      }

      // console.log('onGetData', deps, links)
      let deepObj = {}
      let cur =  deps.find(v => v.id === this.rootId)

      let setObj = ZY.lodash.set
      let JSON5 =  ZY.JSON5

      function deepTransform(target, obj, path) {

        for (let [key, value] of Object.entries(obj)) {
          if (Array.isArray(value)) {
            //
          } else {
            // 当value是object类型 递归查找
            if (typeof value === 'object') {
              deepTransform(target, value, `${path}['${key}']`)
            } else {
              // 只有特殊key才被翻译
              if (JSON_PARSE_KEYS.includes(key)) {
                // context.obj[key] = JSON5.parse(value)
                // setObj(target, path, JSON5.parse(value))
                // console.log(key, path)
                let parent = ZY.lodash.get(target, path)
                if (path === '') {
                  parent = target
                }
                // console.log(parent, key, value)
                try {
                  parent[key] = JSON5.parse(value)
                } catch (e) {
                  parent[key] = {}
                }
              }
            }
          }
        }
      }

      function parseEditorData(dataStr) {
        try {
          let obj = JSON5.parse(dataStr)
          deepTransform(
              obj,
              obj,
              ''
          )
          // console.log(obj)
          return obj
        } catch (e) {
          return {}
        }
      }

      function handleDeep(curDep = {}, path) {
        if (curDep.type === 'array') {
          // console.log('array')
          setObj(deepObj, path, {
            type: 'array',
            items: {
            }
          })

          let newPath = `${path}['items']`

          // console.log(deepObj)
          // 因为array是特殊的object 只有items一个属性
          let item = curDep.items[0]
          let dep = findItemLinkedDep(item)
          if (dep) {
            handleDeep(dep, newPath)
          }
        }
        else if (curDep.type === 'object') {
          setObj(deepObj, path,
              {
                type: 'object',
                properties: {
                },
              }
          )

          for (let item of curDep.items) {
            let parsedData = {}
            parsedData = parseEditorData(item.data)
            let newPath = `${path}['properties']['${item.key}']`

            // deepPoint.properties[item.key] = parsedData

            console.log(path, parsedData)

            setObj(deepObj, newPath,
                parsedData
            )

            // 找寻当前item是否有绑定的下一个dep
            let dep = findItemLinkedDep(item)

            // console.log(item, dep, deepObj, newPath)
            if (dep) {
              handleDeep(dep, newPath)
            }
          }
        }
        else {
          console.log('not array and object', curDep, deepPoint)
        }
      }

      `
{
  type: 'object',
  properties: {
    parts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name1: {},
          name2: {},
        },
      },
    },
  },
}
      `

      handleDeep(cur, 'root')

      console.log(ZY.JSON5.stringify(deepObj.root.properties, null, 2))

      let map = {
        [this.rootId]: deps.find(v => v.id === this.rootId)
      }
      links.forEach(link => {
        let { toPID = '' } = link
        if (toPID) {
          let dep = deps.find(v => v.id === toPID)
          if (dep) {
            map[toPID] = dep
          }
        }
      })
      this.currentLayoutMap = JSON.parse(JSON.stringify(map))
      this.currentLinks = JSON.parse(JSON.stringify(links))
      // console.log(deepObj)
      // this.showCurrent = false
      // setTimeout(() => {
      //   this.showCurrent = true
      // }, 500)
    }
  }
}

export default {
  name: "DeepPropEditor",
  components: {AsyncPlumbLayout},
  mixins: [
    plumbLayoutMixin,
    depManagerMixin
  ],
  data() {
    return {
      rootId: 'i111',
    }
  },
  setup() {
    let self = getCurrentInstance().ctx
    let page = usePage({
      data: {
        editor_step: {
          type: String,
        },
      },
      filters: {
        showCom: "ZY_NOT(MODEL('reload'))",
      },
      defaultVal: {
        editor_step: '',
      }
    })

    page.setEventHandler({
      ['model:update'](e) {
        let { model, key, newVal, config } = e
        let oldVal = ZY.lodash.get(self.currentEditItem.data, key)
        if (oldVal !== newVal) {
          self.currentEditItem.data = ZY.JSON5.stringify(model)
        }
        // console.log( self.currentEditItem.data)
      }

    })

    async function loadStepByContent( varName = '', item) {
      let [,res] = await ZY.awaitTo(
          import('./DeepPropEditor/DeepEditorConfig')
      )
      const config = res.default
      config.name = ZY.nid()

      page.setDef(config, function ({done}) {
        let cached = null
        if (item.data) {
          cached = ZY.JSON5.parse(item.data)
        }


        for (let [partName, data] of Object.entries(config.defaultVal)) {
          let defaultObj = ZY.JSON5.parse(ZY.JSON5.stringify(data))
           page.setPartModel( config.name, partName,
               cached ? cached : defaultObj
           )
        }
        done()
      })
      await nextTick()
      page.storeControl.set({
        [varName]: config.name
      })
    }

    return {
      loadStepByContent,
      store: page.storeControl.store,
      filter: page.storeControl.filter,
      allDef: page.allDef,
    }
  }
}
</script>

<style scoped>

</style>
