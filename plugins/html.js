// import { render } from './prasetwig'
import ejs from 'ejs'
import { getEnvConfig } from "../config";

export default () => {
    return {
        name: 'html-transform',
        transformIndexHtml(html) {
            const config = getEnvConfig()
            let ret = ejs.render(html, config);
            return ret
            // let [ret] =  render(html, config)
            // return ret
        }
    }
}
