"use strict";(self.__LOADABLE_LOADED_CHUNKS__=self.__LOADABLE_LOADED_CHUNKS__||[]).push([[16251,61012],{720687:(e,t,n)=>{n.d(t,{default:()=>r});var i=n(934980);let a=`pulsing {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
}`,r={css:(0,i.Ll)([a]),animation:"pulsing 2s infinite"}},31723:(e,t,n)=>{n.r(t),n.d(t,{default:()=>j});var i=n(667294),a=n(883119),r=n(573706),o=n(986782);function l(e,t,n){var i;return(t="symbol"==typeof(i=function(e,t){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var i=n.call(e,t||"default");if("object"!=typeof i)return i;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"))?i:i+"")in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}let s={},m=e=>{let t=e.__id||e.id;return"string"==typeof t&&t||null};class u{constructor(){l(this,"idMap",new Map),l(this,"objMap",new WeakMap)}get(e){let t=m(e);return this.objMap.get(e)??(t?this.idMap.get(t):void 0)}has(e){let t=m(e);return this.objMap.has(e)??(!!t&&this.idMap.has(t))}set(e,t){let n=m(e);n&&this.idMap.set(n,t),this.objMap.set(e,t)}reset(){this.idMap=new Map,this.objMap=new WeakMap}}function p(e,t){return"number"==typeof e?e:"_lg1"===t?e[t]??e.lg??1:e[t]??1}var c=n(587435),d=n(39260),h=n(876594),g=n(720687),f=n(512541),y=n(785893);let{css:x,animation:b}=g.default,_={backgroundColor:h._VP,animation:b,borderRadius:h.Ev2};function w({data:e}){let{height:t}=e;return(0,y.jsxs)(i.Fragment,{children:[(0,y.jsx)(f.Z,{unsafeCSS:x}),(0,y.jsx)(a.xu,{dangerouslySetInlineStyle:{__style:_},"data-test-id":"skeleton-pin",children:(0,y.jsx)(a.xu,{height:t})})]})}var v=n(679482),C=n(297728),M=n(730212),$=n(410150),S=n(415787),k=n(855746);function j(e){let t,{align:n,cacheKey:l,id:m,isFetching:h,isGridCentered:g=!0,items:x,layout:b,loadItems:_,masonryRef:j,optOutFluidGridExperiment:R=!1,renderItem:W,scrollContainerRef:E,virtualize:I=!0,_getColumnSpanConfig:B,_getResponsiveModuleConfigForSecondItem:A,_dynamicHeights:G,useLoadingState:P,initialLoadingStatePinCount:O,isLoadingAccessibilityLabel:z,isLoadedAccessibilityLabel:F}=e,L=(0,$.ZP)(),{isAuthenticated:T,isRTL:D}=(0,M.B)(),{logContextEvent:N}=(0,r.v)(),X=(0,C.F)(),Z="desktop"===L,H=(0,k.MM)(),Q=((0,i.useRef)(x.map(()=>({fetchTimestamp:Date.now(),measureTimestamp:Date.now(),hasRendered:!1,pageCount:0}))),Z&&!R),{experimentalColumnWidth:V,experimentalGutter:q}=(0,c.Z)(Q),K=e.serverRender??!!Z,U="flexible"===b||"uniformRowFlexible"===b||"desktop"!==L||Q,J=(U&&b?.startsWith("uniformRow")?"uniformRowFlexible":void 0)??(K?"serverRenderedFlexible":"flexible"),Y=e.columnWidth??V??v.yF;U&&(Y=Math.floor(Y));let ee=e.gutterWidth??q??(Z?v.oX:1),et=e.minCols??v.yc,en=(0,i.useRef)(0),ei=Y+ee,ea=function(e){if(null==e)return;let t=function(e){let t=s[e];return t&&t.screenWidth===window.innerWidth||(s[e]={screenWidth:window.innerWidth}),s[e]}(e);return t.measurementCache||(t.measurementCache=new u),t.measurementCache}(l),er=(0,i.useCallback)(()=>E?.current||window,[E]),eo=(0,i.useRef)(!0),{anyEnabled:el}=X.checkExperiment("web_masonry_enable_dynamic_heights_for_all"),{anyEnabled:es}=X.checkExperiment("web_masonry_pin_overlap_calculation_and_logging"),{anyEnabled:em,group:eu}=X.checkExperiment("web_masonry_dynamic_batches");em&&(t=(e,t)=>{let n={itemsBatchSize:0,whitespaceThreshold:0,iterationsLimit:15e3};return t>3&&(n.whitespaceThreshold=ee*t),"enabled_sections_position_fixed"===eu&&(n.itemsBatchSize=5,n.iterationsLimit=1e4),"enabled_sections_position_responsive"===eu&&(n.iterationsLimit=15e3,n.itemsBatchSize=5,t>5&&(n.itemsBatchSize=7)),("enabled_small_batch"===eu||"employees"===eu)&&(e>=7?n.itemsBatchSize=7:n.itemsBatchSize=5),"enabled_large_batch"===eu&&(e>=7?n.itemsBatchSize=9:n.itemsBatchSize=5),n});let ep=g&&eo.current?"centered":"",{className:ec,styles:ed}=function(e){let t=`m_${Object.keys(e).sort().reduce((t,n)=>{let i=e[n];return null==i||"object"==typeof i||"function"==typeof i?t:"boolean"==typeof i?t+(i?"t":"f"):t+i},"").replace(/\:/g,"\\:")}`,{flexible:n,gutterWidth:i,isRTL:a,itemWidth:r,maxColumns:o,minColumns:l,items:s,_getColumnSpanConfig:m,_getResponsiveModuleConfigForSecondItem:u}=e,c=m?s.map((e,t)=>({index:t,columnSpanConfig:m(e)??1})).filter(e=>1!==e.columnSpanConfig):[],d=r+i,h=Array.from({length:o+1-l},(e,t)=>t+l).map(e=>{let h,g,f=e===l?0:e*d,y=e===o?null:(e+1)*d-.01;m&&u&&s.length>1&&(h=m(s[0]),g=u(s[1]));let{styles:x,numberOfVisibleItems:b}=c.reduce((a,o)=>{let{columnSpanConfig:l}=o,m=Math.min(function({columnCount:e,columnSpanConfig:t,firstItemColumnSpanConfig:n,isFlexibleWidthItem:i,secondItemResponsiveModuleConfig:a}){let r=e<=2?"sm":e<=4?"md":e<=6?"_lg1":e<=8?"lg":"xl",o=p(t,r);if(i){let t=p(n,r);o="number"==typeof a?a:a?Math.max(a.min,Math.min(a.max,e-t)):1}return o}({columnCount:e,columnSpanConfig:l,isFlexibleWidthItem:!!g&&o===s[1],firstItemColumnSpanConfig:h??1,secondItemResponsiveModuleConfig:g??1}),e),u=null!=o.index&&a.numberOfVisibleItems>=m+o.index,c=n?100/e*m:r*m+i*(m-1),{numberOfVisibleItems:d}=a;return u?d-=m-1:o.index<d&&(d+=1),{styles:a.styles.concat(function({className:e,index:t,columnSpanConfig:n,visible:i,width:a,flexible:r}){let o="number"==typeof n?n:btoa(JSON.stringify(n));return r?`
      .${e} .static[data-column-span="${o}"]:nth-child(${t+1}) {
        visibility: ${i?"visible":"hidden"} !important;
        position: ${i?"inherit":"absolute"} !important;
        width: ${a}% !important;
      }`:`
      .${e} .static[data-column-span="${o}"]:nth-child(${t+1}) {
        visibility: ${i?"visible":"hidden"} !important;
        position: ${i?"inherit":"absolute"} !important;
        width: ${a}px !important;
      }`}({className:t,index:o.index,columnSpanConfig:l,visible:u,width:c,flexible:n})),numberOfVisibleItems:d}},{styles:"",numberOfVisibleItems:e}),_=n?`
      .${t} .static {
        box-sizing: border-box;
        width: calc(100% / ${e}) !important;
      }
    `:`
      .${t} {
        max-width: ${e*d}px;
      }

      .${t} .static {
        width: ${r}px !important;
      }
    `;return{minWidth:f,maxWidth:y,styles:`
      .${t} .static:nth-child(-n+${b}) {
        position: static !important;
        visibility: visible !important;
        float: ${a?"right":"left"};
        display: block;
      }

      .${t} .static {
        padding: 0 ${i/2}px;
      }

      ${_}

      ${x}
    `}}),g=h.map(({minWidth:e,maxWidth:t,styles:n})=>`
    @container (min-width: ${e}px) ${t?`and (max-width: ${t}px)`:""} {
      ${n}
    }
  `),f=h.map(({minWidth:e,maxWidth:t,styles:n})=>`
    @media (min-width: ${e}px) ${t?`and (max-width: ${t}px)`:""} {
      ${n}
    }
  `),y=`
    ${g.join("")}
    @supports not (container-type: inline-size) {
      ${f.join("")}
    }
  `;return{className:t,styles:`
    .masonryContainer:has(.${t}) {
      container-type: inline-size;
    }

    .masonryContainer > .centered {
      margin-left: auto;
      margin-right: auto;
    }

    .${t} .static {
      position: absolute !important;
      visibility: hidden !important;
    }

    ${y}
  `}}({gutterWidth:ee,flexible:U,items:x,isRTL:D,itemWidth:Y,maxColumns:e.maxColumns??Math.max(x.length,v.g5),minColumns:et,_getColumnSpanConfig:B,_getResponsiveModuleConfigForSecondItem:A}),eh=`${ep} ${ec}`.trim(),{anyEnabled:eg,expName:ef,group:ey,isMeasureAllEnabled:ex}=(0,d.Z)(),eb=((0,i.useRef)(),(0,i.useRef)(x.length)),e_=(0,i.useRef)(0),ew=(0,i.useRef)(null);(0,i.useEffect)(()=>{eb.current=x.length,e_.current+=1},[x]),(0,i.useEffect)(()=>{eo.current&&(eo.current=!1)},[]),(0,i.useEffect)(()=>()=>{},[]);let ev=(0,i.useCallback)((e,t,n)=>{let i=e.reduce((e,t)=>e+t),a=i/e.length;(0,S.S0)("webapp.masonry.multiColumnWhitespace.average",a,{sampleRate:1,tags:{experimentalMasonryGroup:ey||"unknown",dynamicBatchesExperimentGroup:eu||"unknown",handlerId:H,isAuthenticated:T,multiColumnItemSpan:e.length}}),(0,S.S0)("webapp.masonry.twoColWhitespace",a,{sampleRate:1,tags:{columnWidth:Y,minCols:et}}),eu&&(0,S.S0)("webapp.masonry.graphIterations",t,{sampleRate:1,tags:{columnSpan:n,experimentGroup:eu}}),N({event_type:15878,component:14468,aux_data:{total_whitespace_px:i}}),N({event_type:16062,component:14468,aux_data:{average_whitespace_px:a}}),N({event_type:16063,component:14468,aux_data:{max_whitespace_px:Math.max(...e)}}),e.forEach(t=>{t>=50&&((0,S.nP)("webapp.masonry.multiColumnWhitespace.over50",{sampleRate:1,tags:{experimentalMasonryGroup:ey||"unknown",dynamicBatchesExperimentGroup:eu||"unknown",handlerId:H,isAuthenticated:T,multiColumnItemSpan:e.length}}),N({event_type:16261,component:14468})),t>=100&&((0,S.nP)("webapp.masonry.multiColumnWhitespace.over100",{sampleRate:1,tags:{experimentalMasonryGroup:ey||"unknown",dynamicBatchesExperimentGroup:eu||"unknown",handlerId:H,isAuthenticated:T,multiColumnItemSpan:e.length}}),N({event_type:16262,component:14468}))}),(0,S.nP)("webapp.masonry.multiColumnWhitespace.count",{sampleRate:1,tags:{experimentalMasonryGroup:ey||"unknown",dynamicBatchesExperimentGroup:eu||"unknown",handlerId:H,isAuthenticated:T,multiColumnItemSpan:e.length}})},[Y,N,et,T,H,ey,eu]),{_items:eC,_renderItem:eM}=function({initialLoadingStatePinCount:e=50,infiniteScrollPinCount:t=10,isFetching:n,items:a=[],renderItem:r,useLoadingState:o}){let l=a.filter(e=>"object"==typeof e&&null!==e&&"type"in e&&"closeup_module"===e.type).length>0,s=o&&n&&0===a.length,m=o&&n&&l&&1===a.length,u=o&&n&&a.length>+!!l,p=(0,i.useMemo)(()=>Array.from({length:u?t:e}).reduce((e,t,n)=>[...e,{height:n%2==0?356:236,key:`skeleton-pin-${n}`,isSkeleton:!0}],[]),[e,t,u]);return{_items:(0,i.useMemo)(()=>m||u?[...a,...p]:s?p:a,[s,u,m,a,p]),_renderItem:(0,i.useMemo)(()=>o?e=>{let{itemIdx:t,data:n}=e;return t>=a.length&&n&&"object"==typeof n&&"key"in n&&"height"in n?(0,y.jsx)(w,{data:n},n.key):r(e)}:r,[o,r,a.length])}}({useLoadingState:P,items:x,renderItem:(0,i.useCallback)(e=>(0,y.jsx)(o.Z,{name:"MasonryItem",children:W(e)}),[W]),isFetching:h,initialLoadingStatePinCount:O}),e$=P&&h,eS=(0,i.useRef)(new Set);return(0,i.useEffect)(()=>{if(!es)return;let e=setTimeout(()=>{requestAnimationFrame(()=>{let e=Array.from(ew.current?.querySelectorAll("[data-grid-item-idx]")??[]);if(0===e.length)return;let t=e.map(e=>{let t=e.getAttribute("data-grid-item-idx");return{rect:e.getBoundingClientRect(),itemIdx:t}}),n=0,i=0,a=0,r=0,o=0,l=0;for(let e=0;e<t.length;e+=1){let s=t[e]?.rect,m=t[e]?.itemIdx;for(let u=e+1;u<t.length;u+=1){let e=t[u]?.rect,p=t[u]?.itemIdx;if(s&&e&&m&&p){let t=[m,p].sort().join("|");if(!eS.current.has(t)&&s.right>=e.left&&s.left<=e.right&&s.bottom>=e.top&&s.top<=e.bottom&&s.height>0&&e.height>0){eS.current.add(t),n+=1;let m=Math.max(0,Math.min(s.right,e.right)-Math.max(s.left,e.left))*Math.max(0,Math.min(s.bottom,e.bottom)-Math.max(s.top,e.top));m>8e4?l+=1:m>4e4?o+=1:m>1e4?r+=1:m>5e3?a+=1:m>2500&&(i+=1)}}}}n>0&&(0,S.QX)("webapp.masonry.pinOverlapHits",n,{tags:{isAuthenticated:T,isDesktop:Z,experimentalMasonryGroup:ey||"unknown"}}),i>0&&(0,S.QX)("webapp.masonry.pinOverlap.AreaPx.over2500",i,{tags:{isAuthenticated:T,isDesktop:Z,experimentalMasonryGroup:ey||"unknown"}}),a>0&&(0,S.QX)("webapp.masonry.pinOverlap.AreaPx.over5000",a,{tags:{isAuthenticated:T,isDesktop:Z,experimentalMasonryGroup:ey||"unknown"}}),r>0&&(0,S.QX)("webapp.masonry.pinOverlap.AreaPx.over10000",r,{tags:{isAuthenticated:T,isDesktop:Z,experimentalMasonryGroup:ey||"unknown"}}),o>0&&(0,S.QX)("webapp.masonry.pinOverlap.AreaPx.over40000",o,{tags:{isAuthenticated:T,isDesktop:Z,experimentalMasonryGroup:ey||"unknown"}}),l>0&&(0,S.QX)("webapp.masonry.pinOverlap.AreaPx.over80000",l,{tags:{isAuthenticated:T,isDesktop:Z,experimentalMasonryGroup:ey||"unknown"}})})},1e3);return()=>{clearTimeout(e)}},[Y,ey,T,Z,es,x]),(0,y.jsxs)(i.Fragment,{children:[P&&!eo.current&&(0,y.jsx)(a.xu,{"aria-live":"polite",display:"visuallyHidden",children:e$?z:F}),(0,y.jsx)("div",{ref:ew,"aria-busy":P?!!e$:void 0,className:"masonryContainer","data-test-id":"masonry-container",id:m,style:Q?{padding:`0 ${ee/2}px`}:void 0,children:(0,y.jsxs)("div",{className:eh,children:[K&&eo.current?(0,y.jsx)(f.Z,{"data-test-id":"masonry-ssr-styles",unsafeCSS:ed}):null,(0,y.jsx)(a.xu,{"data-test-id":"max-width-container",marginBottom:0,marginEnd:"auto",marginStart:"auto",marginTop:0,maxWidth:e.maxColumns?ei*e.maxColumns:void 0,children:eg?(0,y.jsx)(a.GX,{ref:e=>{j&&(j.current=e)},_dynamicHeights:el||G,_enableSectioningPosition:em&&eu.includes("enabled_sections_position"),_getColumnSpanConfig:B,_getModulePositioningConfig:t,_getResponsiveModuleConfigForSecondItem:A,_logTwoColWhitespace:ev,_measureAll:ex,align:n,columnWidth:Y,gutterWidth:ee,items:eC,layout:U?J:b??"basic",loadItems:_,measurementStore:ea,minCols:et,renderItem:eM,scrollContainer:er,virtualBufferFactor:.3,virtualize:I}):(0,y.jsx)(a.Rk,{ref:e=>{j&&(j.current=e)},_dynamicHeights:el||G,_enableSectioningPosition:em&&eu.includes("enabled_sections_position"),_getColumnSpanConfig:B,_getModulePositioningConfig:t,_getResponsiveModuleConfigForSecondItem:A,_logTwoColWhitespace:ev,align:n,columnWidth:Y,gutterWidth:ee,items:eC,layout:U?J:b??"basic",loadItems:_,measurementStore:ea,minCols:et,renderItem:eM,scrollContainer:er,virtualBufferFactor:.3,virtualize:I})})]})})]})}},587435:(e,t,n)=>{n.d(t,{Z:()=>i});function i(e=!0){let t=e?16:void 0,n=t?Math.floor(t/4):void 0;return{experimentalColumnWidth:e?221:void 0,experimentalGutter:t,experimentalGutterBoints:n}}}}]);
//# sourceMappingURL=https://sm.pinimg.com/webapp/16251-e36cd0444256f8c6.mjs.map