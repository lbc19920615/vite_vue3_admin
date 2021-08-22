import CodeMirror from "./CodeMirror.vue";

const install = (app) => {
    app.component('CodeMirror', CodeMirror);
};

export default {
    install,
    CodeMirror
}