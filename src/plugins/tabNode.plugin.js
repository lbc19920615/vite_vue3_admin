export function install({
                            LayoutNode,
                            ClosureNode
                        }) {

    class TabNode extends LayoutNode {
        constructor(id, items) {
            super(id, items);
            this.type = 'tab'
        }
    }

    let ret = {
        name: 'TabNode',
        type: 'tab',
        cls: TabNode,
        fromJSON5(obj) {
            return new TabNode(obj.id, obj.items)
        }
    }

    return ret
}