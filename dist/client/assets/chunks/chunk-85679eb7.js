import{h as l,d as ne,r as _,i as ae,C as le,c as B}from"./chunk-449c23a2.js";import{c as de}from"./chunk-a740628f.js";import{n as d,o as r,q as h,p as t,an as ie,ao as te,u as se,O as be,F as he,v as K,t as ue,w as I,x as ke,y as fe,af as ve,ad as xe,P as $}from"../entries/src_pages_Home.page.16dc467b.js";import{i as me,N as ge}from"./chunk-f823181b.js";import{u as pe}from"./chunk-2749dac9.js";import{c as Ce}from"./chunk-506c96ff.js";const we=l("svg",{viewBox:"0 0 64 64",class:"check-icon"},l("path",{d:"M50.42,16.76L22.34,39.45l-8.1-11.46c-1.12-1.58-3.3-1.96-4.88-0.84c-1.58,1.12-1.95,3.3-0.84,4.88l10.26,14.51  c0.56,0.79,1.42,1.31,2.38,1.45c0.16,0.02,0.32,0.03,0.48,0.03c0.8,0,1.57-0.27,2.2-0.78l30.99-25.03c1.5-1.21,1.74-3.42,0.52-4.92  C54.13,15.78,51.93,15.55,50.42,16.76z"})),ye=l("svg",{viewBox:"0 0 100 100",class:"line-icon"},l("path",{d:"M80.2,55.5H21.4c-2.8,0-5.1-2.5-5.1-5.5l0,0c0-3,2.3-5.5,5.1-5.5h58.7c2.8,0,5.1,2.5,5.1,5.5l0,0C85.2,53.1,82.9,55.5,80.2,55.5z"})),ze=de("n-checkbox-group"),Re=d([r("checkbox",`
 font-size: var(--n-font-size);
 outline: none;
 cursor: pointer;
 display: inline-flex;
 flex-wrap: nowrap;
 align-items: flex-start;
 word-break: break-word;
 line-height: var(--n-size);
 --n-merged-color-table: var(--n-color-table);
 `,[h("show-label","line-height: var(--n-label-line-height);"),d("&:hover",[r("checkbox-box",[t("border","border: var(--n-border-checked);")])]),d("&:focus:not(:active)",[r("checkbox-box",[t("border",`
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),h("inside-table",[r("checkbox-box",`
 background-color: var(--n-merged-color-table);
 `)]),h("checked",[r("checkbox-box",`
 background-color: var(--n-color-checked);
 `,[r("checkbox-icon",[d(".check-icon",`
 opacity: 1;
 transform: scale(1);
 `)])])]),h("indeterminate",[r("checkbox-box",[r("checkbox-icon",[d(".check-icon",`
 opacity: 0;
 transform: scale(.5);
 `),d(".line-icon",`
 opacity: 1;
 transform: scale(1);
 `)])])]),h("checked, indeterminate",[d("&:focus:not(:active)",[r("checkbox-box",[t("border",`
 border: var(--n-border-checked);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),r("checkbox-box",`
 background-color: var(--n-color-checked);
 border-left: 0;
 border-top: 0;
 `,[t("border",{border:"var(--n-border-checked)"})])]),h("disabled",{cursor:"not-allowed"},[h("checked",[r("checkbox-box",`
 background-color: var(--n-color-disabled-checked);
 `,[t("border",{border:"var(--n-border-disabled-checked)"}),r("checkbox-icon",[d(".check-icon, .line-icon",{fill:"var(--n-check-mark-color-disabled-checked)"})])])]),r("checkbox-box",`
 background-color: var(--n-color-disabled);
 `,[t("border",`
 border: var(--n-border-disabled);
 `),r("checkbox-icon",[d(".check-icon, .line-icon",`
 fill: var(--n-check-mark-color-disabled);
 `)])]),t("label",`
 color: var(--n-text-color-disabled);
 `)]),r("checkbox-box-wrapper",`
 position: relative;
 width: var(--n-size);
 flex-shrink: 0;
 flex-grow: 0;
 user-select: none;
 -webkit-user-select: none;
 `),r("checkbox-box",`
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 height: var(--n-size);
 width: var(--n-size);
 display: inline-block;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color 0.3s var(--n-bezier);
 `,[t("border",`
 transition:
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border: var(--n-border);
 `),r("checkbox-icon",`
 display: flex;
 align-items: center;
 justify-content: center;
 position: absolute;
 left: 1px;
 right: 1px;
 top: 1px;
 bottom: 1px;
 `,[d(".check-icon, .line-icon",`
 width: 100%;
 fill: var(--n-check-mark-color);
 opacity: 0;
 transform: scale(0.5);
 transform-origin: center;
 transition:
 fill 0.3s var(--n-bezier),
 transform 0.3s var(--n-bezier),
 opacity 0.3s var(--n-bezier),
 border-color 0.3s var(--n-bezier);
 `),me({left:"1px",top:"1px"})])]),t("label",`
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 `,[d("&:empty",{display:"none"})])]),ie(r("checkbox",`
 --n-merged-color-table: var(--n-color-table-modal);
 `)),te(r("checkbox",`
 --n-merged-color-table: var(--n-color-table-popover);
 `))]),Se=Object.assign(Object.assign({},K.props),{size:String,checked:{type:[Boolean,String,Number],default:void 0},defaultChecked:{type:[Boolean,String,Number],default:!1},value:[String,Number],disabled:{type:Boolean,default:void 0},indeterminate:Boolean,label:String,focusable:{type:Boolean,default:!0},checkedValue:{type:[Boolean,String,Number],default:!0},uncheckedValue:{type:[Boolean,String,Number],default:!1},"onUpdate:checked":[Function,Array],onUpdateChecked:[Function,Array],privateInsideTable:Boolean,onChange:[Function,Array]}),Ie=ne({name:"Checkbox",props:Se,setup(o){const m=_(null),{mergedClsPrefixRef:u,inlineThemeDisabled:g,mergedRtlRef:z}=se(o),p=pe(o,{mergedSize(e){const{size:i}=o;if(i!==void 0)return i;if(n){const{value:a}=n.mergedSizeRef;if(a!==void 0)return a}if(e){const{mergedSize:a}=e;if(a!==void 0)return a.value}return"medium"},mergedDisabled(e){const{disabled:i}=o;if(i!==void 0)return i;if(n){if(n.disabledRef.value)return!0;const{maxRef:{value:a},checkedCountRef:b}=n;if(a!==void 0&&b.value>=a&&!s.value)return!0;const{minRef:{value:v}}=n;if(v!==void 0&&b.value<=v&&s.value)return!0}return e?e.disabled.value:!1}}),{mergedDisabledRef:C,mergedSizeRef:w}=p,n=ae(ze,null),c=_(o.defaultChecked),S=le(o,"checked"),D=be(S,c),s=he(()=>{if(n){const e=n.valueSetRef.value;return e&&o.value!==void 0?e.has(o.value):!1}else return D.value===o.checkedValue}),R=K("Checkbox","-checkbox",Re,Ce,o,u);function y(e){if(n&&o.value!==void 0)n.toggleCheckbox(!s.value,o.value);else{const{onChange:i,"onUpdate:checked":a,onUpdateChecked:b}=o,{nTriggerFormInput:v,nTriggerFormChange:M}=p,x=s.value?o.uncheckedValue:o.checkedValue;a&&$(a,x,e),b&&$(b,x,e),i&&$(i,x,e),v(),M(),c.value=x}}function k(e){C.value||y(e)}function V(e){if(!C.value)switch(e.key){case" ":case"Enter":y(e)}}function F(e){switch(e.key){case" ":e.preventDefault()}}const P={focus:()=>{var e;(e=m.value)===null||e===void 0||e.focus()},blur:()=>{var e;(e=m.value)===null||e===void 0||e.blur()}},j=ue("Checkbox",z,u),T=B(()=>{const{value:e}=w,{common:{cubicBezierEaseInOut:i},self:{borderRadius:a,color:b,colorChecked:v,colorDisabled:M,colorTableHeader:x,colorTableHeaderModal:N,colorTableHeaderPopover:U,checkMarkColor:E,checkMarkColorDisabled:H,border:O,borderFocus:A,borderDisabled:L,borderChecked:G,boxShadowFocus:W,textColor:q,textColorDisabled:Y,checkMarkColorDisabledChecked:J,colorDisabledChecked:Q,borderDisabledChecked:X,labelPadding:Z,labelLineHeight:ee,labelFontWeight:oe,[I("fontSize",e)]:re,[I("size",e)]:ce}}=R.value;return{"--n-label-line-height":ee,"--n-label-font-weight":oe,"--n-size":ce,"--n-bezier":i,"--n-border-radius":a,"--n-border":O,"--n-border-checked":G,"--n-border-focus":A,"--n-border-disabled":L,"--n-border-disabled-checked":X,"--n-box-shadow-focus":W,"--n-color":b,"--n-color-checked":v,"--n-color-table":x,"--n-color-table-modal":N,"--n-color-table-popover":U,"--n-color-disabled":M,"--n-color-disabled-checked":Q,"--n-text-color":q,"--n-text-color-disabled":Y,"--n-check-mark-color":E,"--n-check-mark-color-disabled":H,"--n-check-mark-color-disabled-checked":J,"--n-font-size":re,"--n-label-padding":Z}}),f=g?ke("checkbox",B(()=>w.value[0]),T,o):void 0;return Object.assign(p,P,{rtlEnabled:j,selfRef:m,mergedClsPrefix:u,mergedDisabled:C,renderedChecked:s,mergedTheme:R,labelId:fe(),handleClick:k,handleKeyUp:V,handleKeyDown:F,cssVars:g?void 0:T,themeClass:f?.themeClass,onRender:f?.onRender})},render(){var o;const{$slots:m,renderedChecked:u,mergedDisabled:g,indeterminate:z,privateInsideTable:p,cssVars:C,labelId:w,label:n,mergedClsPrefix:c,focusable:S,handleKeyUp:D,handleKeyDown:s,handleClick:R}=this;(o=this.onRender)===null||o===void 0||o.call(this);const y=ve(m.default,k=>n||k?l("span",{class:`${c}-checkbox__label`,id:w},n||k):null);return l("div",{ref:"selfRef",class:[`${c}-checkbox`,this.themeClass,this.rtlEnabled&&`${c}-checkbox--rtl`,u&&`${c}-checkbox--checked`,g&&`${c}-checkbox--disabled`,z&&`${c}-checkbox--indeterminate`,p&&`${c}-checkbox--inside-table`,y&&`${c}-checkbox--show-label`],tabindex:g||!S?void 0:0,role:"checkbox","aria-checked":z?"mixed":u,"aria-labelledby":w,style:C,onKeyup:D,onKeydown:s,onClick:R,onMousedown:()=>{xe("selectstart",window,k=>{k.preventDefault()},{once:!0})}},l("div",{class:`${c}-checkbox-box-wrapper`}," ",l("div",{class:`${c}-checkbox-box`},l(ge,null,{default:()=>this.indeterminate?l("div",{key:"indeterminate",class:`${c}-checkbox-icon`},ye):l("div",{key:"check",class:`${c}-checkbox-icon`},we)}),l("div",{class:`${c}-checkbox-box__border`}))),y)}});export{Ie as _};
