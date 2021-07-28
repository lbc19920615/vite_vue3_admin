export let groupManagerMixin = {
    data() {
        return {
            dialogVisible: false,
            groups: [
                {
                    type: 'row',
                    desc: '横向布局'
                },
                {
                    type: 'column',
                    desc: '纵向布局'
                },
                {
                    type: 'form',
                    desc: 'FORM布局'
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
        /**
         * selectGroupTemplate
         * @param group {{}}
         */
        selectGroupTemplate(group = {}) {
            console.log('group', group)
            this.appendDep({
                type: group.type
            })
            this.dialogVisible = false
        }
    }
}
