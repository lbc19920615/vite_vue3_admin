import{v as e,w as t}from"./index.23ee6f22.js";import{j as r}from"./ext.03204df0.js";import{r as s,e as o,h as i,k as n}from"./vendor.70e2a6e0.js";import"http://192.168.1.67:7002/public/expose/main.js";import"http://192.168.1.67:7002/public/expose/ext.js";import"./CommonRender.d6009dc7.js";import"./nodes.a56b7126.js";import"./form.e330999e.js";const a={name:"CusXmlShower",mixins:[e],setup(e,s){let{data:o,methods:i,listeners:n,init:a}=t(e,s),m=o();return a(e),{state:m,widgetConfig:e.ui.widgetConfig,methods:i,listeners:n,prettyStr:function(e){return r.html(e)}}}};a.render=function(e,t,r,a,m,p){const d=s("el-input");return e.inited?(o(),i(d,{key:0,type:"textarea",value:a.prettyStr(a.state.value),readonly:""},null,8,["value"])):n("",!0)};export{a as default};
