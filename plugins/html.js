import { render } from './prasetwig'
import config from "../config";

console.log(config)

export default () => {
    return {
        name: 'html-transform',
        transformIndexHtml(html) {
            let [ret] =  render(html, config)
            return ret
        }
    }
}
