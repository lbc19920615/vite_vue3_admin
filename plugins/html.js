// import { render } from './prasetwig'
import ejs from 'ejs'
import { getEnvConfig } from "../config";
import process from 'process'
import path from 'path'
import fs from 'fs'

let cwd = process.cwd()

export default () => {
    return {
        name: 'html-transform',
        async transformIndexHtml(html) {
            const config = getEnvConfig()

            let matches = [...html.matchAll(/\[\[\[(.+)\]\]\]/g)]

            let datas = matches.map(v => {
                return {
                    key: v[0],
                    data: fs.readFileSync(
                        path.resolve(cwd, v[1])).toString()
                }
            })

            // console.log(cwd, datas)
            datas.forEach(data => {
                html = html.replace(data.key, data.data)
            })

            let ret = ejs.render(html, config);
            return ret

           // return new Promise(resolve => {
           //     ejs.renderFile('/index.html', '', config, function (err, str) {
           //         if (err) {
           //             console.error(err)
           //             return;
           //         }
           //         resolve(str)
           //     });
           // })

            // let [ret] =  render(html, config)
            // return ret
        }
    }
}
