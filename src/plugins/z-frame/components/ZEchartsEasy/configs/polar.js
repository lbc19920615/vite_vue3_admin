import {QuickNumber, QuickOneOrMany} from "@/hooks/props";

export function createEchartPolar() {
  return {
    type: 'object',
    wrap: 'xy-tab-content',
    wrapAttrs: [
      ['label','polar']
    ],
    properties: {
      zlevel: QuickNumber(),
      center: QuickOneOrMany(),
      radius: QuickOneOrMany(),
    }
  }
}
