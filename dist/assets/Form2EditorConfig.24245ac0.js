var e={name:"event-handler",defaultVal:{form2:{}},init:{def:{constants:{},parts:[{type:"form",name:"form2",serviceTpl:{def:{},args:{src:"bservice.twig"}},def:{type:"object",tag:"em-props",ui:{attrs:[["label-width","150px"]],class:[]},properties:{name:{type:"string",tag:"div",ui:{label:"表单名",form_item:{labelWidth:"100px"},styles:[["width","60vw"]]}},value:{type:"string",tag:"div",ui:{label:"表单值",hiddenLabel:!0,form_item:{labelWidth:"0px"},widget:"CusForm",widgetConfig:{configUrl:"/formEditorConfig3.js",enums:"ROOT_STATE('tools.propTypes', [])"}}}}},computed:{pagePropertiesComp:"A.getBeforeScript(MODEL('props'))",doubled:"MODEL('events[0].name', '')",layoutSlotArrComputed:"A.slotArrToStr(MODEL('layoutSlotArr'))",processes:"map(MODEL('events', []), v => v.name)"}}]},args:{src:"comformscr2.twig"}}};export{e as default};
