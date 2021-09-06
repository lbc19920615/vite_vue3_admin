import CodeMirror from "./CodeMirror.vue";

const install = (app) => {
    CustomVueComponent.app = app
    CustomVueComponent.register(CodeMirror)
};

export default {
    install,
    CodeMirror
}
