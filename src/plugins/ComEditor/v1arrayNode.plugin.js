export function install({
    V1Node,
                            LayoutNode,
                            ClosureNode
                        }) {


    let type = 'array'

    class V1ArrayNode extends V1Node {
        constructor(id, items) {
            super(id, items);
            this.type = type;
            this.editor = ``
            this.items = [
                {
                    id: id + '-0',
                    key: 'items',
                    data: '',
                }
            ]
        }
    }

    let ret = {
        name: 'V1ArrayNode',
        type: type,
        cls: V1ArrayNode,
        fromJSON5(obj) {
            return new V1ArrayNode(obj.id, obj.items)
        }
    }

    return ret
}
