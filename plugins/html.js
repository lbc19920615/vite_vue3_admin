import { render } from './prasetwig'

export default () => {
    return {
        name: 'html-transform',
        transformIndexHtml(html) {
            // return html.replace(
            //     /<title>(.*?)<\/title>/,
            //     `<title>Title replaced!</title>`
            // )
            let [ret] =  render(html)
            // console.log(ret)
            return ret
        }
    }
}
