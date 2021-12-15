import * as NodeDefMap from "@/plugins/ComEditor/nodes.js";
import * as tabNodePlugin from '@/plugins/ComEditor/tabNode.plugin'
NodeDefMap.register(tabNodePlugin)

import * as v1ArrayPlugin from '@/plugins/ComEditor/v1arrayNode.plugin'
NodeDefMap.register(v1ArrayPlugin)

import * as v1objectPlugin from '@/plugins/ComEditor/v1objectNode.plugin'
NodeDefMap.register(v1objectPlugin)

import * as modalNodePlugin from '@/plugins/ComEditor/modalNode.plugin'
NodeDefMap.register(modalNodePlugin)

import * as eleNodePlugin from '@/plugins/ComEditor/eleNode.plugin'
NodeDefMap.register(eleNodePlugin)
