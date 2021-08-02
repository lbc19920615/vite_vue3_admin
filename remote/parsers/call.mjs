import sast from "scss-parser";
import createQueryWrapper from "query-ast";
import fs from 'fs';

export default {
    install(context) {
        context.register('call', function (atRuleValue = new Map()) {
            const ast2 = sast.parse(atRuleValue.get(0))
            // console.log(ast2)
            let $ast2 = createQueryWrapper(ast2)
            let params = $ast2('attribute')
            let ids = $ast2('identifier')

            if (atRuleValue.has(1)) {
                const ast3 = sast.parse(atRuleValue.get(1))
                // console.dir( params, {depth: null})
                // console.log(ast3)
            }

            console.log(ids.eq(2).value())

            // fs.writeFileSync(`./remote/${ids.eq(0).value()}.json`, JSON.stringify(ast2, null, 2))

            return `callMethod("${ids.eq(0).value()}", "${ids.eq(1).value()}", ${ids.eq(2).value()}]})`
        })
    }
}
