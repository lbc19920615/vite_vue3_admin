export default () => {
    return {
        name: 'html-transform',
        transformIndexHtml(html) {
            return html.replace(
                /<title>(.*?)<\/title>/,
                `<title>Title replaced!</title>`
            )
        }
    }
}
