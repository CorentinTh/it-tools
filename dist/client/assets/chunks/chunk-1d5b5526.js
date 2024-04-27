import{n as s,o as g,p as o}from"../entries/src_pages_Home.page.16dc467b.js";import{i as l,N as f}from"./chunk-f823181b.js";import{u as c}from"./chunk-416dc92c.js";import{d as h,C as m,h as t}from"./chunk-449c23a2.js";const p=s([s("@keyframes loading-container-rotate",`
 to {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }
 `),s("@keyframes loading-layer-rotate",`
 12.5% {
 -webkit-transform: rotate(135deg);
 transform: rotate(135deg);
 }
 25% {
 -webkit-transform: rotate(270deg);
 transform: rotate(270deg);
 }
 37.5% {
 -webkit-transform: rotate(405deg);
 transform: rotate(405deg);
 }
 50% {
 -webkit-transform: rotate(540deg);
 transform: rotate(540deg);
 }
 62.5% {
 -webkit-transform: rotate(675deg);
 transform: rotate(675deg);
 }
 75% {
 -webkit-transform: rotate(810deg);
 transform: rotate(810deg);
 }
 87.5% {
 -webkit-transform: rotate(945deg);
 transform: rotate(945deg);
 }
 100% {
 -webkit-transform: rotate(1080deg);
 transform: rotate(1080deg);
 } 
 `),s("@keyframes loading-left-spin",`
 from {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 50% {
 -webkit-transform: rotate(130deg);
 transform: rotate(130deg);
 }
 to {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 `),s("@keyframes loading-right-spin",`
 from {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 50% {
 -webkit-transform: rotate(-130deg);
 transform: rotate(-130deg);
 }
 to {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 `),g("base-loading",`
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `,[o("transition-wrapper",`
 position: absolute;
 width: 100%;
 height: 100%;
 `,[l()]),o("container",`
 display: inline-flex;
 position: relative;
 direction: ltr;
 line-height: 0;
 animation: loading-container-rotate 1568.2352941176ms linear infinite;
 font-size: 0;
 letter-spacing: 0;
 white-space: nowrap;
 opacity: 1;
 width: 100%;
 height: 100%;
 `,[o("svg",`
 stroke: var(--n-text-color);
 fill: transparent;
 position: absolute;
 height: 100%;
 overflow: hidden;
 `),o("container-layer",`
 position: absolute;
 width: 100%;
 height: 100%;
 animation: loading-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 `,[o("container-layer-left",`
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `,[o("svg",`
 animation: loading-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 width: 200%;
 `)]),o("container-layer-patch",`
 position: absolute;
 top: 0;
 left: 47.5%;
 box-sizing: border-box;
 width: 5%;
 height: 100%;
 overflow: hidden;
 `,[o("svg",`
 left: -900%;
 width: 2000%;
 transform: rotate(180deg);
 `)]),o("container-layer-right",`
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `,[o("svg",`
 animation: loading-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 left: -100%;
 width: 200%;
 `)])])]),o("placeholder",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[l({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})])])]),w={strokeWidth:{type:Number,default:28},stroke:{type:String,default:void 0}},v=h({name:"BaseLoading",props:Object.assign({clsPrefix:{type:String,required:!0},show:{type:Boolean,default:!0},scale:{type:Number,default:1},radius:{type:Number,default:100}},w),setup(e){c("-base-loading",p,m(e,"clsPrefix"))},render(){const{clsPrefix:e,radius:a,strokeWidth:i,stroke:n,scale:d}=this,r=a/d;return t("div",{class:`${e}-base-loading`,role:"img","aria-label":"loading"},t(f,null,{default:()=>this.show?t("div",{key:"icon",class:`${e}-base-loading__transition-wrapper`},t("div",{class:`${e}-base-loading__container`},t("div",{class:`${e}-base-loading__container-layer`},t("div",{class:`${e}-base-loading__container-layer-left`},t("svg",{class:`${e}-base-loading__svg`,viewBox:`0 0 ${2*r} ${2*r}`,xmlns:"http://www.w3.org/2000/svg",style:{color:n}},t("circle",{fill:"none",stroke:"currentColor","stroke-width":i,"stroke-linecap":"round",cx:r,cy:r,r:a-i/2,"stroke-dasharray":4.91*a,"stroke-dashoffset":2.46*a}))),t("div",{class:`${e}-base-loading__container-layer-patch`},t("svg",{class:`${e}-base-loading__svg`,viewBox:`0 0 ${2*r} ${2*r}`,xmlns:"http://www.w3.org/2000/svg",style:{color:n}},t("circle",{fill:"none",stroke:"currentColor","stroke-width":i,"stroke-linecap":"round",cx:r,cy:r,r:a-i/2,"stroke-dasharray":4.91*a,"stroke-dashoffset":2.46*a}))),t("div",{class:`${e}-base-loading__container-layer-right`},t("svg",{class:`${e}-base-loading__svg`,viewBox:`0 0 ${2*r} ${2*r}`,xmlns:"http://www.w3.org/2000/svg",style:{color:n}},t("circle",{fill:"none",stroke:"currentColor","stroke-width":i,"stroke-linecap":"round",cx:r,cy:r,r:a-i/2,"stroke-dasharray":4.91*a,"stroke-dashoffset":2.46*a})))))):t("div",{key:"placeholder",class:`${e}-base-loading__placeholder`},this.$slots)}))}});export{v as N};
