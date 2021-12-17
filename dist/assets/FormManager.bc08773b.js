var e=Object.defineProperty,t=Object.defineProperties,o=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable,r=(t,o,a)=>o in t?e(t,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[o]=a;import{u as l,j as i,n as m,o as p,p as c,k as d}from"./index.872417fc.js";import{i as f,z as u,x as g,r as y,e as b,f as _,g as h,w as v,F as w,A as C,o as S,M as E,J as M,al as O,h as j,C as k,B as F,k as x,t as N}from"./vendor.70e2a6e0.js";import{FormsMana as P,useFormsMana as D}from"./formsMana.2482dadb.js";var R={name:"CustomElement",props:{is:String,name:{type:String,default:()=>ZY.nid()},params:{type:Object,default:()=>({})}},data:()=>({EVENT_TYPES:{inited:Symbol("customElement:inited")},obj:null,webComponentRef:null}),watch:{name:{handler(e){},immediate:!0}},render(){let e=this,l=f("webComponentRef"),i=[];for(let t in this.$slots){let o=this.$slots[t];i.push(o({is:e.is}))}return this.webComponentRef=l,u(this.is,(m=((e,t)=>{for(var o in t||(t={}))n.call(t,o)&&r(e,o,t[o]);if(a)for(var o of a(t))s.call(t,o)&&r(e,o,t[o]);return e})({style:{"--dialog-inner-top":"10vh"}},this.params),p={name:this.name,onInited:function(t){let o=t.detail[0];e.obj=l.register(o.ctx,e.name)},onFires:function(t){if(t.detail[0]){let{type:o,args:a}=t.detail[0];e.obj.emit(o,a),e.$emit(o,a)}}},t(m,o(p))),i);var m,p},beforeUnmount(){this.webComponentRef.destory(this.obj.uuid)}};const Y={name:"FormsManaSelect",components:{},props:{comName:String},setup(e,t){var o;let a=null!=(o=e.comName)?o:"form_mana_"+ZY.rid(),n=D(),s=g({suggest:[],column:[{prop:"label",width:"150px"},{prop:"sdsds",width:"150px",label:"NAME",render(e,t){var o;const a=t.scope;return e("div",{},null!=(o=ZY.JSON5.parse(a.row.value).name)?o:"")}},{prop:"value",label:"VALUE",render(e,t){const o=y("v-json-viewer"),a=t.scope;let n=e(o,{value:ZY.JSON5.parse(a.row[a.column.property]),expanded:!0,copyable:!0});return e("div",{style:{overflow:"auto",maxHeight:"350px"}},[n])}}]});async function r(){await n.init(),await ZY.sleep(30),s.suggest=n.getOptions()}let i={uuid:a,state:s,exportFile:async function(){await P.saveCache2File(P.getOptions())},loadFile:async function(){await n.loadFile(),await r()},onSelect:function(e){e.label=e.label+"___"+ZY.rid(3),t.emit("select-form",e)},load:r};return l(i,[async function(e){}]),i}},A=C("加载"),T=C("保存到本地");Y.render=function(e,t,o,a,n,s){const r=y("el-button"),l=y("el-space"),i=y("simple-list");return b(),_(w,null,[h(l,{style:{"margin-bottom":"var(--z-size-20)"}},{default:v((()=>[h(r,{type:"primary",onClick:e.loadFile},{default:v((()=>[A])),_:1},8,["onClick"]),h(r,{type:"primary",onClick:e.exportFile},{default:v((()=>[T])),_:1},8,["onClick"])])),_:1}),h(i,{suggest:e.state.suggest,column:e.state.column,onSelect:e.onSelect},null,8,["suggest","column","onSelect"])],64)};const Z={name:"FormManager",components:{FormsManaSelect:Y,CustomElement:R,HttpComponent:i},props:{getConfig:Function},setup(e,t){let o=m({properties:{form_step:{type:String}},computed:{curss:"A.getDeeps(MODEL('links'),MODEL('deps'))"}},{onInited:function({storeControl:e}){},extendContext:{}});o=p(o),o=c(o);let a="haha-events-model",n=null;return o.setEventHandler({"add:forms"(e){let{parts:t,partName:o,selfpath:a,process:n}=e;t[o].arrAppend(a)},"open:forms"(e){o.refsManager.runCom("form-mana-select","load"),o.webComponentRef.toggleDialog("form-mana-dialog")},"HTTP:COM:MOUNTED"(e){let a=o.store.model.form_step;o.httpComContext[a],console.log("stepName",a),t.emit("com-ready",e)},"model:update:all"(e){let{model:t,key:a,newVal:s,config:r}=e;r.process===o.store.model.form_step&&(n=t)}}),S((()=>{o.commonLoadStep(async function(){let t=await d((()=>import("./FormManagerEditorConfig.29735844.js")),[]);return e.getConfig&&(t=await e.getConfig(t)),t}(),"form_step",{async onMounted(e){let t=await o.dispatchRoot("GetStoreEvents",{storeName:a});o.setPartModel(e.name,"form2",null!=t?t:{})}})})),{save:async function(){n&&await o.dispatchRoot("SetStore",{storeName:a,model:n})},getModel:async function(){return N(n)},setModel:async function(e={}){let t=o.store.model.form_step;o.setPartModel(t,"form2",e)},store:o.store,page:o,allDef:o.defMap}}},$={key:0};Z.render=function(e,t,o,a,n,s){const r=y("FormsManaSelect"),l=y("CustomElement"),i=y("el-button"),m=y("el-space"),p=y("HttpComponent");return a.page.inited?(b(),_("div",$,[h(l,{is:"my-vue-dialog",name:"form-mana-dialog",params:{sstyle:"width: 60vw; min-width: 720px;"}},{default:v((e=>[h(r,{"com-name":"form-mana-select",onSelectForm:t=>a.page.callEvent("forms:select-form",{scope:e,value:t})},null,8,["onSelectForm"])])),_:1}),a.store.model.form_step?(b(),_(w,{key:0},[E(e.$slots,"form_before",M(O({}))),h(p,{defs:a.allDef,is:a.store.model.form_step,debug:!0},{array_beforebegin:v((e=>["forms"===e.key?(b(),j(m,{key:0,align:"middle"},{default:v((()=>[k("h3",null,F(e.selfpath),1),h(i,{size:"small",onClick:t=>a.page.callEvent("add:forms",e)},{default:v((()=>[C("添加"+F(e.key),1)])),_:2},1032,["onClick"]),h(i,{size:"small",onClick:t=>a.page.callEvent("open:forms",e)},{default:v((()=>[C("打开"+F(e.key)+"管理",1)])),_:2},1032,["onClick"])])),_:2},1024)):x("",!0)])),array_afterbegin:v((t=>[E(e.$slots,"array_afterbegin",M(O(t)))])),array_con_beforeend:v((t=>[E(e.$slots,"array_con_beforeend",M(O(t)))])),object_beforebegin:v((e=>[k("h3",null,F(e.selfpath),1)])),_:3},8,["defs","is"])],64)):x("",!0)])):x("",!0)};export{Z as _,Y as a,R as b};