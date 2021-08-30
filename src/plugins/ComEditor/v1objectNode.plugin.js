import {baseConfig} from "@/plugins/ComEditor/editorConfig";

export function install({
    V1Node,
                            LayoutNode,
                            ClosureNode
                        }) {


    let type = 'object'

    class V1ObjectNode extends V1Node {
        constructor(id, items) {
            super(id, items);
            this.type = type;
            this.editor = ``
            this.items = items
        }
    }

    let ret = {
        name: 'V1ObjectNode',
        type: type,
        cls: V1ObjectNode,
        fromJSON5(obj) {
            return new V1ObjectNode(obj.id, obj.items)
        }
    }

    return ret
}
