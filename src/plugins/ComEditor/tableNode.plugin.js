export function install({
                            V1Node,
                            ClosureNode
                        }) {

    class TableNode extends ClosureNode {
        constructor(id) {
            super(id);
            this.type = 'table'
        }
    }

    let ret = {
        fromJSON5(obj) {
            return new TableNode(obj.id)
        }
    }

    return ret
}