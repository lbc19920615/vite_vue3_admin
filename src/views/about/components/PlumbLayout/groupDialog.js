import * as NodeRefMap from '@/plugins/ComEditor/nodes.js'
import {showMsgError} from "@/plugins/message";

export let groupManagerMixin = {
    data() {
        return {
            dialogVisible: false,
            groups: [
                {
                    type: 'row',
                    desc: '横向布局',
                    img: '/tools/row.png',
                    cls: 'RowNode'
                },
                {
                    type: 'column',
                    desc: '纵向布局',
                    cls: 'ColumnNode'
                },
                {
                    type: 'form',
                    desc: 'FORM布局',
                    cls: 'FormNode'
                }
            ]
        }
    },
    methods: {
        /**
         * toggleGroupDialog
         * @param v {Boolean}
         */
        toggleGroupDialog(v) {
            this.dialogVisible = v
            if (v) {
            }
        },
        buildDepFromGroup(group) {
            if (!group.cls) {
                showMsgError('no group.cls')
            }
            let id = 'i' + ZY.rid(6)
            let dep;
            dep = NodeRefMap.create(group.type, {
                id,
                content: '',
                data: [],
                items: [],
                editor: ''
            })
            return dep
        },
        /**
         * selectGroupTemplate
         * @param group {{}}
         */
        selectGroupTemplate(group = {}) {
            // console.log('group', group)
            let dep = this.buildDepFromGroup(group)
            this.appendDep(
              dep
            )
            this.dialogVisible = false
        },
    }
}
