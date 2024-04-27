import{o as n,p as o,u as C,v,t as S,x as R,af as r}from"../entries/src_pages_Home.page.16dc467b.js";import{a as $}from"./chunk-b0ec40cc.js";import{d as T,c as w,h as a}from"./chunk-449c23a2.js";const E=n("statistic",[o("label",`
 font-weight: var(--n-label-font-weight);
 transition: .3s color var(--n-bezier);
 font-size: var(--n-label-font-size);
 color: var(--n-label-text-color);
 `),n("statistic-value",`
 margin-top: 4px;
 font-weight: var(--n-value-font-weight);
 `,[o("prefix",`
 margin: 0 4px 0 0;
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-prefix-text-color);
 `,[n("icon",{verticalAlign:"-0.125em"})]),o("content",`
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-text-color);
 `),o("suffix",`
 margin: 0 0 0 4px;
 font-size: var(--n-value-font-size);
 transition: .3s color var(--n-bezier);
 color: var(--n-value-suffix-text-color);
 `,[n("icon",{verticalAlign:"-0.125em"})])])]),P=Object.assign(Object.assign({},v.props),{tabularNums:Boolean,label:String,value:[String,Number]}),y=T({name:"Statistic",props:P,setup(s){const{mergedClsPrefixRef:t,inlineThemeDisabled:l,mergedRtlRef:c}=C(s),u=v("Statistic","-statistic",E,$,s,t),f=S("Statistic",c,t),e=w(()=>{const{self:{labelFontWeight:m,valueFontSize:x,valueFontWeight:d,valuePrefixTextColor:b,labelTextColor:p,valueSuffixTextColor:h,valueTextColor:g,labelFontSize:z},common:{cubicBezierEaseInOut:_}}=u.value;return{"--n-bezier":_,"--n-label-font-size":z,"--n-label-font-weight":m,"--n-label-text-color":p,"--n-value-font-weight":d,"--n-value-font-size":x,"--n-value-prefix-text-color":b,"--n-value-suffix-text-color":h,"--n-value-text-color":g}}),i=l?R("statistic",void 0,e,s):void 0;return{rtlEnabled:f,mergedClsPrefix:t,cssVars:l?void 0:e,themeClass:i?.themeClass,onRender:i?.onRender}},render(){var s;const{mergedClsPrefix:t,$slots:{default:l,label:c,prefix:u,suffix:f}}=this;return(s=this.onRender)===null||s===void 0||s.call(this),a("div",{class:[`${t}-statistic`,this.themeClass,this.rtlEnabled&&`${t}-statistic--rtl`],style:this.cssVars},r(c,e=>a("div",{class:`${t}-statistic__label`},this.label||e)),a("div",{class:`${t}-statistic-value`,style:{fontVariantNumeric:this.tabularNums?"tabular-nums":""}},r(u,e=>e&&a("span",{class:`${t}-statistic-value__prefix`},e)),this.value!==void 0?a("span",{class:`${t}-statistic-value__content`},this.value):r(l,e=>e&&a("span",{class:`${t}-statistic-value__content`},e)),r(f,e=>e&&a("span",{class:`${t}-statistic-value__suffix`},e))))}});export{y as _};
