import {baseConfig} from "@/plugins/ComEditor/editorConfig";

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
            this.items = items
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
