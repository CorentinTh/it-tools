import{b as M,a as f,f as u,o as I,p as i,q as y,n as N,u as O,v as R,t as V,w as c,x as q,al as D,af as K}from"../entries/src_pages_Home.page.16dc467b.js";import{f as G}from"./chunk-a0dc36f0.js";import{c as J}from"./chunk-60fffae6.js";import{g as Q}from"./chunk-567e13ca.js";import{N as U}from"./chunk-aff6c081.js";import{N as X}from"./chunk-9519e52e.js";import{E as Y,W as Z,I as oo,S as eo}from"./chunk-6e5bd8af.js";import{N as ro}from"./chunk-f206ee20.js";import{d as no,c as E,r as to,h as s,B as so}from"./chunk-449c23a2.js";const lo=r=>{const{lineHeight:o,borderRadius:d,fontWeightStrong:b,baseColor:l,dividerColor:v,actionColor:P,textColor1:g,textColor2:t,closeColorHover:h,closeColorPressed:C,closeIconColor:m,closeIconColorHover:p,closeIconColorPressed:n,infoColor:e,successColor:x,warningColor:z,errorColor:S,fontSize:T}=r;return Object.assign(Object.assign({},J),{fontSize:T,lineHeight:o,titleFontWeight:b,borderRadius:d,border:`1px solid ${v}`,color:P,titleTextColor:g,iconColor:t,contentTextColor:t,closeBorderRadius:d,closeColorHover:h,closeColorPressed:C,closeIconColor:m,closeIconColorHover:p,closeIconColorPressed:n,borderInfo:`1px solid ${f(l,u(e,{alpha:.25}))}`,colorInfo:f(l,u(e,{alpha:.08})),titleTextColorInfo:g,iconColorInfo:e,contentTextColorInfo:t,closeColorHoverInfo:h,closeColorPressedInfo:C,closeIconColorInfo:m,closeIconColorHoverInfo:p,closeIconColorPressedInfo:n,borderSuccess:`1px solid ${f(l,u(x,{alpha:.25}))}`,colorSuccess:f(l,u(x,{alpha:.08})),titleTextColorSuccess:g,iconColorSuccess:x,contentTextColorSuccess:t,closeColorHoverSuccess:h,closeColorPressedSuccess:C,closeIconColorSuccess:m,closeIconColorHoverSuccess:p,closeIconColorPressedSuccess:n,borderWarning:`1px solid ${f(l,u(z,{alpha:.33}))}`,colorWarning:f(l,u(z,{alpha:.08})),titleTextColorWarning:g,iconColorWarning:z,contentTextColorWarning:t,closeColorHoverWarning:h,closeColorPressedWarning:C,closeIconColorWarning:m,closeIconColorHoverWarning:p,closeIconColorPressedWarning:n,borderError:`1px solid ${f(l,u(S,{alpha:.25}))}`,colorError:f(l,u(S,{alpha:.08})),titleTextColorError:g,iconColorError:S,contentTextColorError:t,closeColorHoverError:h,closeColorPressedError:C,closeIconColorError:m,closeIconColorHoverError:p,closeIconColorPressedError:n})},io={name:"Alert",common:M,self:lo},ao=io,co=I("alert",`
 line-height: var(--n-line-height);
 border-radius: var(--n-border-radius);
 position: relative;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 text-align: start;
 word-break: break-word;
`,[i("border",`
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 transition: border-color .3s var(--n-bezier);
 border: var(--n-border);
 pointer-events: none;
 `),y("closable",[I("alert-body",[i("title",`
 padding-right: 24px;
 `)])]),i("icon",{color:"var(--n-icon-color)"}),I("alert-body",{padding:"var(--n-padding)"},[i("title",{color:"var(--n-title-text-color)"}),i("content",{color:"var(--n-content-text-color)"})]),G({originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.9)"}}),i("icon",`
 position: absolute;
 left: 0;
 top: 0;
 align-items: center;
 justify-content: center;
 display: flex;
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 margin: var(--n-icon-margin);
 `),i("close",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 `),y("show-icon",[I("alert-body",{paddingLeft:"calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))"})]),y("right-adjust",[I("alert-body",{paddingRight:"calc(var(--n-close-size) + var(--n-padding) + 2px)"})]),I("alert-body",`
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `,[i("title",`
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `,[N("& +",[i("content",{marginTop:"9px"})])]),i("content",{transition:"color .3s var(--n-bezier)",fontSize:"var(--n-font-size)"})]),i("icon",{transition:"color .3s var(--n-bezier)"})]),go=Object.assign(Object.assign({},R.props),{title:String,showIcon:{type:Boolean,default:!0},type:{type:String,default:"default"},bordered:{type:Boolean,default:!0},closable:Boolean,onClose:Function,onAfterLeave:Function,onAfterHide:Function}),xo=no({name:"Alert",inheritAttrs:!1,props:go,setup(r){const{mergedClsPrefixRef:o,mergedBorderedRef:d,inlineThemeDisabled:b,mergedRtlRef:l}=O(r),v=R("Alert","-alert",co,ao,r,o),P=V("Alert",l,o),g=E(()=>{const{common:{cubicBezierEaseInOut:n},self:e}=v.value,{fontSize:x,borderRadius:z,titleFontWeight:S,lineHeight:T,iconSize:H,iconMargin:$,iconMarginRtl:_,closeIconSize:W,closeBorderRadius:w,closeSize:A,closeMargin:B,closeMarginRtl:L,padding:k}=e,{type:a}=r,{left:j,right:F}=Q($);return{"--n-bezier":n,"--n-color":e[c("color",a)],"--n-close-icon-size":W,"--n-close-border-radius":w,"--n-close-color-hover":e[c("closeColorHover",a)],"--n-close-color-pressed":e[c("closeColorPressed",a)],"--n-close-icon-color":e[c("closeIconColor",a)],"--n-close-icon-color-hover":e[c("closeIconColorHover",a)],"--n-close-icon-color-pressed":e[c("closeIconColorPressed",a)],"--n-icon-color":e[c("iconColor",a)],"--n-border":e[c("border",a)],"--n-title-text-color":e[c("titleTextColor",a)],"--n-content-text-color":e[c("contentTextColor",a)],"--n-line-height":T,"--n-border-radius":z,"--n-font-size":x,"--n-title-font-weight":S,"--n-icon-size":H,"--n-icon-margin":$,"--n-icon-margin-rtl":_,"--n-close-size":A,"--n-close-margin":B,"--n-close-margin-rtl":L,"--n-padding":k,"--n-icon-margin-left":j,"--n-icon-margin-right":F}}),t=b?q("alert",E(()=>r.type[0]),g,r):void 0,h=to(!0),C=()=>{const{onAfterLeave:n,onAfterHide:e}=r;n&&n(),e&&e()};return{rtlEnabled:P,mergedClsPrefix:o,mergedBordered:d,visible:h,handleCloseClick:()=>{var n;Promise.resolve((n=r.onClose)===null||n===void 0?void 0:n.call(r)).then(e=>{e!==!1&&(h.value=!1)})},handleAfterLeave:()=>{C()},mergedTheme:v,cssVars:b?void 0:g,themeClass:t?.themeClass,onRender:t?.onRender}},render(){var r;return(r=this.onRender)===null||r===void 0||r.call(this),s(ro,{onAfterLeave:this.handleAfterLeave},{default:()=>{const{mergedClsPrefix:o,$slots:d}=this,b={class:[`${o}-alert`,this.themeClass,this.closable&&`${o}-alert--closable`,this.showIcon&&`${o}-alert--show-icon`,!this.title&&this.closable&&`${o}-alert--right-adjust`,this.rtlEnabled&&`${o}-alert--rtl`],style:this.cssVars,role:"alert"};return this.visible?s("div",Object.assign({},so(this.$attrs,b)),this.closable&&s(U,{clsPrefix:o,class:`${o}-alert__close`,onClick:this.handleCloseClick}),this.bordered&&s("div",{class:`${o}-alert__border`}),this.showIcon&&s("div",{class:`${o}-alert__icon`,"aria-hidden":"true"},D(d.icon,()=>[s(X,{clsPrefix:o},{default:()=>{switch(this.type){case"success":return s(eo,null);case"info":return s(oo,null);case"warning":return s(Z,null);case"error":return s(Y,null);default:return null}}})])),s("div",{class:[`${o}-alert-body`,this.mergedBordered&&`${o}-alert-body--bordered`]},K(d.header,l=>{const v=l||this.title;return v?s("div",{class:`${o}-alert-body__title`},v):null}),d.default&&s("div",{class:`${o}-alert-body__content`},d))):null}})}});export{xo as _};
