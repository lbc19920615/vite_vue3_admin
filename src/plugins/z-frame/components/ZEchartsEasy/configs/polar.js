import {QuickNumber, QuickOneOrMany} from "@/hooks/props";

export function createEchartPolar() {
  return {
    type: 'object',
    properties: {
      zlevel: QuickNumber(),
      center: QuickOneOrMany(),
      radius: QuickOneOrMany(),
    }
  }
}
