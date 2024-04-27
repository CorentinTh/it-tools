import{i as U,N as se}from"./chunk-f823181b.js";import{b as de,f as ce,o as A,p as t,n as P,q as l,M as H,u as ue,v as I,O as he,w as m,x as fe,ae as W,af as w,P as j}from"../entries/src_pages_Home.page.16dc467b.js";import{c as be}from"./chunk-6222e43f.js";import{u as ve}from"./chunk-2749dac9.js";import{p as K,d as s}from"./chunk-567e13ca.js";import{N as ge}from"./chunk-1d5b5526.js";import{d as me,r as O,C as we,c as z,h as n}from"./chunk-449c23a2.js";const pe=e=>{const{primaryColor:d,opacityDisabled:b,borderRadius:a,textColor3:r}=e,p="rgba(0, 0, 0, .14)";return Object.assign(Object.assign({},be),{iconColor:r,textColor:"white",loadingColor:d,opacityDisabled:b,railColor:p,railColorActive:d,buttonBoxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)",buttonColor:"#FFF",railBorderRadiusSmall:a,railBorderRadiusMedium:a,railBorderRadiusLarge:a,buttonBorderRadiusSmall:a,buttonBorderRadiusMedium:a,buttonBorderRadiusLarge:a,boxShadowFocus:`0 0 0 2px ${ce(d,{alpha:.2})}`})},xe={name:"Switch",common:de,self:pe},ye=xe,ke=A("switch",`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[t("children-placeholder",`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),t("rail-placeholder",`
 display: flex;
 flex-wrap: none;
 `),t("button-placeholder",`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),A("base-loading",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[U({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),t("checked, unchecked",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `),t("checked",`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),t("unchecked",`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),P("&:focus",[t("rail",`
 box-shadow: var(--n-box-shadow-focus);
 `)]),l("round",[t("rail","border-radius: calc(var(--n-rail-height) / 2);",[t("button","border-radius: calc(var(--n-button-height) / 2);")])]),H("disabled",[H("icon",[l("rubber-band",[l("pressed",[t("rail",[t("button","max-width: var(--n-button-width-pressed);")])]),t("rail",[P("&:active",[t("button","max-width: var(--n-button-width-pressed);")])]),l("active",[l("pressed",[t("rail",[t("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]),t("rail",[P("&:active",[t("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]),l("active",[t("rail",[t("button","left: calc(100% - var(--n-button-width) - var(--n-offset))")])]),t("rail",`
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 opacity .3s var(--n-bezier),
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[t("button-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `,[U()]),t("button",`
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-height);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]),l("active",[t("rail","background-color: var(--n-rail-color-active);")]),l("loading",[t("rail",`
 cursor: wait;
 `)]),l("disabled",[t("rail",`
 cursor: not-allowed;
 opacity: .5;
 `)])]),Ce=Object.assign(Object.assign({},I.props),{size:{type:String,default:"medium"},value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},onChange:[Function,Array]});let B;const Fe=me({name:"Switch",props:Ce,setup(e){B===void 0&&(typeof CSS<"u"?typeof CSS.supports<"u"?B=CSS.supports("width","max(1px)"):B=!1:B=!0);const{mergedClsPrefixRef:d,inlineThemeDisabled:b}=ue(e),a=I("Switch","-switch",ke,ye,e,d),r=ve(e),{mergedSizeRef:p,mergedDisabledRef:v}=r,k=O(e.defaultValue),R=we(e,"value"),g=he(R,k),C=z(()=>g.value===e.checkedValue),x=O(!1),i=O(!1),c=z(()=>{const{railStyle:o}=e;if(o)return o({focused:i.value,checked:C.value})});function u(o){const{"onUpdate:value":$,onChange:_,onUpdateValue:V}=e,{nTriggerFormInput:F,nTriggerFormChange:T}=r;$&&j($,o),V&&j(V,o),_&&j(_,o),k.value=o,F(),T()}function E(){const{nTriggerFormFocus:o}=r;o()}function X(){const{nTriggerFormBlur:o}=r;o()}function Y(){e.loading||v.value||(g.value!==e.checkedValue?u(e.checkedValue):u(e.uncheckedValue))}function q(){i.value=!0,E()}function G(){i.value=!1,X(),x.value=!1}function J(o){e.loading||v.value||o.key===" "&&(g.value!==e.checkedValue?u(e.checkedValue):u(e.uncheckedValue),x.value=!1)}function Q(o){e.loading||v.value||o.key===" "&&(o.preventDefault(),x.value=!0)}const L=z(()=>{const{value:o}=p,{self:{opacityDisabled:$,railColor:_,railColorActive:V,buttonBoxShadow:F,buttonColor:T,boxShadowFocus:Z,loadingColor:ee,textColor:te,iconColor:oe,[m("buttonHeight",o)]:h,[m("buttonWidth",o)]:ie,[m("buttonWidthPressed",o)]:ne,[m("railHeight",o)]:f,[m("railWidth",o)]:S,[m("railBorderRadius",o)]:ae,[m("buttonBorderRadius",o)]:re},common:{cubicBezierEaseInOut:le}}=a.value;let N,D,M;return B?(N=`calc((${f} - ${h}) / 2)`,D=`max(${f}, ${h})`,M=`max(${S}, calc(${S} + ${h} - ${f}))`):(N=K((s(f)-s(h))/2),D=K(Math.max(s(f),s(h))),M=s(f)>s(h)?S:K(s(S)+s(h)-s(f))),{"--n-bezier":le,"--n-button-border-radius":re,"--n-button-box-shadow":F,"--n-button-color":T,"--n-button-width":ie,"--n-button-width-pressed":ne,"--n-button-height":h,"--n-height":D,"--n-offset":N,"--n-opacity-disabled":$,"--n-rail-border-radius":ae,"--n-rail-color":_,"--n-rail-color-active":V,"--n-rail-height":f,"--n-rail-width":S,"--n-width":M,"--n-box-shadow-focus":Z,"--n-loading-color":ee,"--n-text-color":te,"--n-icon-color":oe}}),y=b?fe("switch",z(()=>p.value[0]),L,e):void 0;return{handleClick:Y,handleBlur:G,handleFocus:q,handleKeyup:J,handleKeydown:Q,mergedRailStyle:c,pressed:x,mergedClsPrefix:d,mergedValue:g,checked:C,mergedDisabled:v,cssVars:b?void 0:L,themeClass:y?.themeClass,onRender:y?.onRender}},render(){const{mergedClsPrefix:e,mergedDisabled:d,checked:b,mergedRailStyle:a,onRender:r,$slots:p}=this;r?.();const{checked:v,unchecked:k,icon:R,"checked-icon":g,"unchecked-icon":C}=p,x=!(W(R)&&W(g)&&W(C));return n("div",{role:"switch","aria-checked":b,class:[`${e}-switch`,this.themeClass,x&&`${e}-switch--icon`,b&&`${e}-switch--active`,d&&`${e}-switch--disabled`,this.round&&`${e}-switch--round`,this.loading&&`${e}-switch--loading`,this.pressed&&`${e}-switch--pressed`,this.rubberBand&&`${e}-switch--rubber-band`],tabindex:this.mergedDisabled?void 0:0,style:this.cssVars,onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},n("div",{class:`${e}-switch__rail`,"aria-hidden":"true",style:a},w(v,i=>w(k,c=>i||c?n("div",{"aria-hidden":!0,class:`${e}-switch__children-placeholder`},n("div",{class:`${e}-switch__rail-placeholder`},n("div",{class:`${e}-switch__button-placeholder`}),i),n("div",{class:`${e}-switch__rail-placeholder`},n("div",{class:`${e}-switch__button-placeholder`}),c)):null)),n("div",{class:`${e}-switch__button`},w(R,i=>w(g,c=>w(C,u=>n(se,null,{default:()=>this.loading?n(ge,{key:"loading",clsPrefix:e,strokeWidth:20}):this.checked&&(c||i)?n("div",{class:`${e}-switch__button-icon`,key:c?"checked-icon":"icon"},c||i):!this.checked&&(u||i)?n("div",{class:`${e}-switch__button-icon`,key:u?"unchecked-icon":"icon"},u||i):null})))),w(v,i=>i&&n("div",{key:"checked",class:`${e}-switch__checked`},i)),w(k,i=>i&&n("div",{key:"unchecked",class:`${e}-switch__unchecked`},i)))))}});export{Fe as _};
