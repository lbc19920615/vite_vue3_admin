import{n as e,o as a,p as t,a3 as o,k as l}from"./index.23ee6f22.js";import"./ext.03204df0.js";import{_ as n}from"./FormManager.eb50737c.js";import{FormsMana as s}from"./formsMana.2482dadb.js";import{f as r}from"./form.e330999e.js";import{t as i,r as f,e as p,f as m,g as c,w as d,A as g,B as u,k as v,C as _}from"./vendor.70e2a6e0.js";import"http://192.168.1.67:7002/public/expose/main.js";import"http://192.168.1.67:7002/public/expose/ext.js";import"./CommonRender.d6009dc7.js";import"./nodes.a56b7126.js";const C={components:{FormManager:n},setup(){let n={openDialog:{type:Boolean}},f=e({properties:n,computed:{}},{onInited:function({storeControl:e}){},extendContext:{},servicePrefix:"PageFormUniappService"});f=a(f),f=t(f);let p=f.setRef("formRef");return f.setEventHandler({async"call:save"(e){await f.runRefMethod("formRef","save")},async"call:save:file"(e){let a={};a=await f.runRefMethod("formRef","getModel"),ZY_EXT.saveDesignFile({fileName:a.name,data:a})},"save:form:file"(e){let{parts:a,partName:t,selfpath:o}=e,l=a[t].getModel(),n=i(l),s=ZY.lodash.get(n,o);console.log("save:form:file",n,s)},async"load:single:file"(e){let{parts:a,partName:t,selfpath:o}=e;try{let e=(await s.readFile())[0].value,l=`${o}.value`;a[t].setModelByPath(l,e)}catch(l){}},async"gen:uniapp:file"(e){let a=await f.runRefMethod("formRef","getModel"),t=r(ZY.JSON5.parse(a.forms[0].value)),l=await o({def:t,args:{src:"uniapp_form.twig"}});await ZY_EXT.saveStrUseFS(l,{fileName:a.args.name+".vue",extensions:[".vue"],type:"text/plain",options:{mimeTypes:["text/*"]}})}}),{formRef:p,getConfig:function(){return l((()=>import("./FormManagerEditorConfig.b6f173ba.js")),[])},store:f.store,page:f}}},x={key:0},y=_("h1",null,"uniapp表单生成",-1),M=g("保存"),R=g("保存成文件"),h=g("生成uniapp文件"),j=g("保存");C.render=function(e,a,t,o,l,n){const s=f("el-button"),r=f("el-row"),i=f("FormManager");return o.page.inited?(p(),m("div",x,[y,c(r,null,{default:d((()=>[c(s,{onClick:a[0]||(a[0]=e=>o.page.callEvent("call:save"))},{default:d((()=>[M])),_:1}),c(s,{onClick:a[1]||(a[1]=e=>o.page.callEvent("call:save:file"))},{default:d((()=>[R])),_:1}),c(s,{onClick:a[2]||(a[2]=e=>o.page.callEvent("gen:uniapp:file"))},{default:d((()=>[h])),_:1})])),_:1}),c(i,{getConfig:o.getConfig,ref:o.formRef},{array_con_beforeend:d((e=>[c(s,{size:"small",onClick:a=>o.page.callEvent("save:form:file",e)},{default:d((()=>[j])),_:2},1032,["onClick"]),c(s,{size:"small",onClick:a=>o.page.callEvent("load:single:file",e)},{default:d((()=>[g(" 导入"+u(e.key),1)])),_:2},1032,["onClick"])])),_:1},8,["getConfig"])])):v("",!0)};export{C as default};
