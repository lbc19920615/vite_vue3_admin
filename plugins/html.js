import { render } from './prasetwig'
import { getEnvConfig } from "../config";

export default () => {
    return {
        name: 'html-transform',
        transformIndexHtml(html) {
            const config = getEnvConfig()
            let [ret] =  render(html, config)
            return ret
        }
    }
}
