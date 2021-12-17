import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";

/**
 *
 * @param name
 * @param DRAG_GROUP
 * @param columnMax 最大可以支持放几个
 * @param DRAG_LABEL_XML {Function} 放xml
 * @param INIT_CONFIG {{}}
 * @param DRAG_EXPORT {Function}
 */
export function createZDragComponent(name, {
  DRAG_GROUP,
  columnMax = 1,
  DRAG_LABEL_XML,
  INIT_CONFIG = {},
  DRAG_EXPORT = () => {}
} = {}) {
  let id = ZY.rid(6);
  return {
    name: 'ZDragCustom',
    DRAG_GROUP: DRAG_GROUP,
    ZDragXmlCom: true,
    mixins: [
      ZDragCommonMixin
    ],
    DRAG_DATASET() {
      return {
        columnMax: columnMax
      }
    },
    DRAG_LABEL_XML() {
      return  DRAG_LABEL_XML()
    },
    data() {
      return {
        id,
      }
    },
    methods: {
      DRAG_CONFIG() {
        // let obj = CusRichText.CUS_EDITOR() ?? { props: {} }
        // Reflect.deleteProperty(obj.props, 'type')
        // return obj
        return {}
      },
      DRAG_EXPORT() {
        return {
          INIT_CONFIG: INIT_CONFIG,
          ...DRAG_EXPORT(),
        }
      }
    }
  }
}
