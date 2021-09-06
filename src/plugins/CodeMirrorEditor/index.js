import CodeMirror from "./CodeMirror.vue";

const install = (app) => {
    CustomVueComponent.app = app
    CustomVueComponent.register(CodeMirror, 'CodeMirror')
};

export default {
    install,
    CodeMirror
}
