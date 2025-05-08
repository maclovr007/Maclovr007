"use strict";(self.__LOADABLE_LOADED_CHUNKS__=self.__LOADABLE_LOADED_CHUNKS__||[]).push([[4402],{55988:(e,t,o)=>{o.d(t,{_K:()=>f,z3:()=>g});var i=o(56070),n=o(26325),a=o(45297),r=o(57431),l=o(89049),s=o(44630),d=o(68783),c=o(71111),u=o(31209),p=function(e,t,o,i){return new(o||(o=Promise))((function(n,a){function r(e){try{s(i.next(e))}catch(e){a(e)}}function l(e){try{s(i.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?n(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,l)}s((i=i.apply(e,t||[])).next())}))};const m=(0,c.atom)(l.hA);m.debugLabel="collectionCandidateAtom";const{useAtomService:f,useServiceState:h,useServiceDispatchers:g}=(0,u.i)(m,((e,t)=>({getCandidates(){return p(this,void 0,void 0,(function*(){const{user:o}=(0,r.x)();if(o){t(m,(e=>Object.assign(Object.assign({},e),{loading:!0})));try{const r=(0,s.bv)(e,m,{secUid:o.secUid}),l=yield function(e){return p(this,void 0,void 0,(function*(){return i.h.get("/api/collection/candidate/item_list/",{query:e,baseUrlType:2,headers:{[n.nk]:i.h.csrfToken}})}))}(Object.assign(Object.assign({},r),{appId:a.xE,scene:155}));(0,d.Tj)(e,t,m,"collection",l,{disableReportMore:!0})}catch(e){(0,d.e_)(t,m)}}}))},resetCandidates(){t(m,Object.assign({},l.hA))}})))},23303:(e,t,o)=>{o.d(t,{l:()=>D});var i=o(2787),n=o(40099),a=o(30543),r=o(58542),l=o(25616),s=o(32125),d=o(24834),c=o(92866),u=o(3797),p=o(21765);const m=(0,i.Y)(u.C,{size:72}),f=(0,n.memo)((function({listInfo:{statusCode:e},detailInfo:{reset:t,loadMore:o}}){const a=(0,n.useCallback)((()=>{t(),o()}),[t,o]);return(0,i.Y)(p.QW,{statusCode:e,iconElement:m,onRefresh:a})})),h=(0,n.memo)((function(){const e=(0,l.s)(),t=(0,n.useMemo)((()=>({title:e("collectionsProfilePage_collectionPage_emptyModal_header"),desc:e("collectionsProfilePage_collectionPage_emptyModal_desc")})),[e]);return(0,i.Y)(p.LL,{iconElement:m,emptyTip:t})}));var g=o(10745),v=o(66551),b=o(8154),x=o(41952);const y=(0,n.memo)((function({detailInfo:{loadMore:e},listInfo:{list:t,loading:o,hasMore:a,statusCode:r},listKey:l}){const s=(0,n.useRef)(null),d=(0,n.useCallback)((()=>{return t=this,i=void 0,l=function*(){!o&&a&&0===r&&(yield e())},new((n=void 0)||(n=Promise))((function(e,o){function a(e){try{s(l.next(e))}catch(e){o(e)}}function r(e){try{s(l.throw(e))}catch(e){o(e)}}function s(t){var o;t.done?e(t.value):(o=t.value,o instanceof n?o:new n((function(e){e(o)}))).then(a,r)}s((l=l.apply(t,i||[])).next())}));var t,i,n,l}),[o,a,r,e]);return(0,g.O9)({onHitBottom:d,elemRef:s,bottomThreshold:200}),(0,i.Y)(x.Gi,{ref:s,children:(0,i.Y)(v.Z,{pageType:121,itemList:[],itemListKey:l,loading:o,onHitBottom:()=>{},children:t.map((e=>(0,i.Y)(b.l,{itemId:e},e)))})})}));function _(){return(0,i.Y)(x.Gi,{children:(0,i.Y)(c.C,{isUser:!0})})}const C=(0,n.memo)((function({loadMore:e,reset:t,listState:o}){const a=(0,n.useMemo)((()=>({statusCode:o.statusCode,loadMore:e,reset:t})),[o.statusCode,e,t]);return(0,n.useEffect)((()=>{0===o.statusCode&&o.hasMore&&0===o.list.length&&e()}),[e,o.hasMore,o.list.length,o.statusCode]),(0,i.Y)(d.s6,{Error:f,Empty:h,List:y,Skeleton:_,detailInfo:a,listInfo:o,listKey:"collection"})}));var w=o(17446),k=o(55988),I=o(62186),P=o(65530);const S=I.default.div`
  padding: 0 12px 24px 12px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  & > div:first-of-type {
    height: 475px;
    width: ${456}px;

    ${P.ph} {
      grid-gap: ${12}px;
      grid-template-columns: repeat(${3}, 1fr) !important;

      // could be improved with container query once supported
      div[data-e2e='collection-selector-footer'] {
        padding: 67px 8px 8px;

        & > svg:first-of-type {
          width: 13px;
          height: 13px;
        }

        & > span:first-of-type {
          font-size: 12px;
          line-height: 12px;
        }
      }
    }
  }

  & > button {
    margin: 0 12px;
  }
`,Y=I.default.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 8px 8px 4px 8px;
  & > .leading {
    width: 88px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  & > .title {
    flex: 1;
    text-align: center;
    font-size: 17px;
    font-weight: 700;
    color: ${e=>e.theme.colors.UIText1};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  & > .trailing {
    width: 88px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`,D=(0,n.memo)((function({isFromCreateCollection:e,open:t,onOpenChange:o,onCommit:d,onPrev:c,loading:u}){const p=(0,l.s)(),[m,f]=(0,k._K)((e=>e),s.bN),h=(0,w.Xq)(),g=(0,n.useMemo)((()=>0!==m.list.length||e?0===h.size&&e?(0,i.Y)(r.I05,{variant:"secondary",label:p("live_done"),onClick:d,loading:u}):(0,i.Y)(r.I05,{label:p("collectionsProfilePage_favoritesPage_selectVideosModal_btn2",{d_numOfVideos:h.size}),disabled:0===h.size,onClick:d,loading:u}):(0,i.Y)(r.I05,{variant:"secondary",label:p("Close"),onClick:()=>o(!1),loading:u})),[p,h.size,e,d,u,m.list.length,o]),v=(0,n.useCallback)((t=>{"Escape"===t.key?o(!1):"Enter"===t.key&&(m.list.length>0||e)&&d()}),[m.list.length,e,d,o]);return(0,n.useEffect)((()=>{if(t)return document.addEventListener("keydown",v,!0),()=>{document.removeEventListener("keydown",v,!0)}}),[v,t]),(0,i.FD)(r.nOL,{width:"large",style:{maxWidth:"480px",zIndex:3001},open:t,onOpenChange:o,outsidePressDismiss:0===h.size,children:[(0,i.FD)(Y,{children:[(0,i.Y)("div",{className:"leading",children:c&&(0,i.Y)(r.PH3,{icon:(0,i.Y)(r.VMf,{autoMirror:!0}),onClick:c})}),(0,i.Y)("div",{className:"title",children:p("collectionsProfilePage_favoritesPage_selectVideosModal_header")}),(0,i.Y)("div",{className:"trailing",children:(0,i.Y)(r.PH3,{"aria-label":"close",icon:(0,i.Y)(a.g,{}),onClick:()=>o(!1)})})]}),(0,i.FD)(S,{children:[(0,i.Y)(C,{listState:m,loadMore:f.getCandidates,reset:f.resetCandidates}),g]})]})}))},73174:(e,t,o)=>{o.d(t,{l:()=>c});var i=o(40099),n=o(50299),a=o(87934),r=o(25616),l=o(93608),s=o(28086),d=function(e,t,o,i){return new(o||(o=Promise))((function(n,a){function r(e){try{s(i.next(e))}catch(e){a(e)}}function l(e){try{s(i.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?n(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,l)}s((i=i.apply(e,t||[])).next())}))};function c({onSuccess:e,enterMethod:t,playModeForTea:o}){const c=(0,r.s)(),u=(0,n.Z)(),[{isFetching:p},m]=(0,s.I)(a.m,{resetStateBeforeDispatch:!0}),f=(0,i.useCallback)((({statusCode:i,collectionId:n,selectedVideosToAdd:a})=>{if(0===i){l.f.sendEvent("add_vids_to_collection",{enter_method:t,play_mode:o});const i=1===a.size?c("collectionsProfilePage_collectionsPage_topSection_addToastSingular"):c("collectionsProfilePage_collectionsPage_topSection_addToastPlural",{d_numOfVideos:a.size});u({success:!0,message:i}),e(n)}else u({success:!1,message:c("Sorry, something wrong with the server, please try again.")})}),[u,c,t,e,o]);return[p,(0,i.useCallback)(((e,t)=>d(this,void 0,void 0,(function*(){t.size>0&&(yield m({collectionId:e,commitIds:[...t].join(",")},(({statusCode:o})=>f({statusCode:o,collectionId:e,selectedVideosToAdd:t}))))}))),[m,f])]}},17446:(e,t,o)=>{o.d(t,{B6:()=>r,Xq:()=>l,fi:()=>d});var i=o(71111),n=o(31209);const a=(0,i.atom)(new Set),{useAtomService:r,useServiceState:l,useServiceDispatchers:s,getStaticApi:d}=(0,n.i)(a,((e,t)=>({toggle(e){t(a,(t=>{const o=new Set(t);return t.has(e)?o.delete(e):o.add(e),o}))},set(e){t(a,new Set(e))},clear(){t(a,new Set)}})))},8154:(e,t,o)=>{o.d(t,{l:()=>g});var i=o(2787),n=o(40099),a=o(58542),r=o(60484),l=o(53438),s=o(31344),d=o(60072),c=o(77170),u=o(32125),p=o(63185),m=o(80635),f=o(17446),h=o(41952);const g=(0,n.memo)((function({itemId:e,isOverlay:t}){const[o,g]=(0,f.B6)((t=>t.has(e))),v=(0,d.F3)((t=>t[e]),u.bN),{video:{cover:b,zoomCover:x},desc:y}=(0,n.useMemo)((()=>(0,r.L$)(v)),[v]),{playCount:_}=(0,c.D)(v),C=(0,n.useMemo)((()=>({zoomCover:x,cover:b,quality:"480"})),[x,b]),w=(0,l.mx)(v),k=w||!t,I=(0,n.useCallback)((()=>{g.toggle(e)}),[g,e]),P=(0,n.useCallback)((e=>{e.preventDefault(),e.stopPropagation(),I()}),[I]),S=(0,n.useCallback)((e=>{13!==e.keyCode&&32!==e.keyCode||I()}),[I]),Y=(0,r.D1)(null!=_?_:0),{ratio:D}=s.f.compact;return(0,i.Y)(h.xO,{isOverlay:t,onClick:P,onKeyDown:S,children:(0,i.FD)(m.w,{e2eTag:"collection-item",ratio:D,borderRadius:"4px",onKeyDown:S,children:[(0,i.FD)(p.NR,{children:[(0,i.Y)(h.xl,{label:"",checked:o,onChange:I}),k&&(0,i.Y)(h.zj,{video:C,alt:y,hidePhotoIcon:t&&w})]}),!t&&(0,i.FD)(h.xk,{"data-e2e":"collection-selector-footer",children:[(0,i.Y)(a.bt4,{}),(0,i.Y)("span",{children:Y})]})]})})}))},41952:(e,t,o)=>{o.d(t,{Gi:()=>d,xO:()=>p,xk:()=>u,xl:()=>c,zj:()=>m});var i=o(62186),n=o(58542),a=o(32545),r=o(92060),l=o(63185),s=o(56999);const d=i.default.div`
  overflow: auto;

  scroll-behavior: smooth;
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
`,c=(0,i.default)(n.h$y)`
  position: absolute;
  top: ${8}px;
  inset-inline-end: ${8}px;
  pointer-events: none;
  z-index: 1;

  & > .TUXCheckboxStandalone--circle > .TUXCheckboxStandalone-indicator {
    border-radius: 50%;
    border: 2.26px solid ${e=>e.theme.colors.ConstTextInverse};
  }

  & > .TUXCheckbox-labelContainer {
    display: none;
  }
`,u=(0,i.default)(r.xk)`
  display: flex;
  align-items: center;
  height: unset;
  color: ${e=>e.theme.colors.ConstTextInverse};
  gap: 4px;
  padding: 67px 13px 8px;
  pointer-events: none;

  & > svg:first-of-type {
    width: 18px;
    height: 18px;
  }

  & > span:first-of-type {
    font-size: 16px;
    font-weight: 500;
  }
`,p=(0,i.default)(l.iP,{target:"e18o3lv10"})((({isOverlay:e})=>[e&&{position:"absolute",top:0,zIndex:1,height:"100%",width:"100%",[`${s.h9}`]:{visibility:"hidden"}}]),"label:DivSelectorItemContainer;"),m=(0,i.default)(a.x)`
  clip-path: ${e=>e.hidePhotoIcon?"circle(14px at calc(100% - 20px) 20px)":"none"};
  pointer-events: ${e=>e.hidePhotoIcon?"none":"auto"};
`},92866:(e,t,o)=>{o.d(t,{C:()=>s,p:()=>d});var i=o(2787),n=o(40099),a=o(88920),r=o(99051);function l({mode:e,aspectRatio:t}){return(0,i.Y)(r.pQ,{mode:e,aspectRatio:t})}const s=(0,n.memo)((function({mode:e,aspectRatio:t=208/276,isUser:o}){const{isInProductHoldout:s}=(0,a.Vv)(),d=!s,c=(0,n.useMemo)((()=>Array.from({length:24}).fill(t)),[t]).map(((t,o)=>(0,i.Y)(l,{index:o,mode:e,aspectRatio:t},o)));return(0,i.Y)(r.Ct,{mode:e,useLargerGrid:o&&d,children:c})})),d=(0,n.memo)((function({row:e=4,gap:t="18px",radius:o="8px",cardWidth:n="226px",cardHeight:a="302px"}){return(0,i.Y)(r.z_,{children:Array.from({length:e}).map(((e,l)=>{return s=l+1,(0,i.Y)(r.C2,{children:Array.from({length:3}).map(((e,l)=>(0,i.Y)(r.Ql,{cardWidth:n,cardHeight:a,gap:t,radius:o},l+1)))},s);var s}))})}))},99051:(e,t,o)=>{o.d(t,{C2:()=>u,Ct:()=>s,Ql:()=>p,pQ:()=>d,z_:()=>c});var i=o(75431),n=o(62186),a=o(72153),r=o(65530);const l=(0,i.i7)({"0%":{backgroundPositionX:"200%"},"100%":{backgroundPositionX:"-150%"}}),s=r.ph,d=(0,n.default)("div",{target:"e15jf4tc0"})((({theme:e,mode:t,aspectRatio:o=208/276})=>[{borderRadius:"explore"===t?"8px":"4px",position:"relative",width:"100%",paddingTop:100/o+"%",backgroundColor:e.colors.BGPlaceholderDefault,backgroundImage:"linear-gradient(90deg, rgba(22, 24, 35, 0) 0%, rgba(22, 24, 35, .04) 50%, rgba(22, 24, 35, 0) 100%)",backgroundSize:"200% 100%",backgroundRepeat:"no-repeat",animation:`${l} cubic-bezier(0, 0, 1, 1) 1.5s infinite`}]),"label:DivSkeletonCard;"),c=(0,n.default)("div",{target:"e15jf4tc1"})({display:"flex",flexDirection:"column",paddingTop:"20px"},"label:DivSkeletonContainerV1;"),u=(0,n.default)("div",{target:"e15jf4tc2"})({display:"flex"},"label:DivSkeletonRowContainer;"),p=(0,n.default)("div",{target:"e15jf4tc3"})((({theme:e,cardWidth:t,cardHeight:o,gap:i,radius:n})=>[(0,a.mp)({direction:e.direction,marginEnd:i}),{width:t,height:o,borderRadius:n,marginBottom:i,display:"block",float:"left",overflow:"hidden",flex:"0 0 auto",backgroundColor:e.colors.BGPlaceholderDefault,backgroundImage:"linear-gradient(90deg, rgba(22, 24, 35, 0) 0%, rgba(22, 24, 35, .04) 50%, rgba(22, 24, 35, 0) 100%)",backgroundSize:"200% 100%",backgroundRepeat:"no-repeat",animation:`${l} cubic-bezier(0, 0, 1, 1) 1.5s infinite`}]),"label:DivSkeletonCardV1;")},25047:(e,t,o)=>{o.d(t,{H:()=>f});var i=o(2787),n=o(40099),a=o(53873),r=o(61595),l=o(51664),s=o(4538),d=o(35656),c=o(64738),u=o(9782),p=o(93608),m=o(20024);const f=(0,n.memo)((({isFTC:e,user:t,e2eTag:o,size:f=116,quality:h="Medium"})=>{const{uniqueId:g,secUid:v}=t,b=m.Rg("avatar-stable-url-hook",{user:t}),x=t[`avatar${h}`],[y]=(0,c.useAtom)(r.K),_=y.isLive,C=(0,l.AL)({user:t,enterMethod:"others_photo"}),w=(0,n.useMemo)((()=>({enter_from_merge:C.enter_from_merge,enter_method:C.enter_method})),[C]),k=y.isError;(0,n.useEffect)((()=>{_&&u.mx.handleLiveShow({enter_from_merge:C.enter_from_merge,enter_method:C.enter_method,follow_status:C.follow_status,anchor_id:C.anchor_id,room_id:C.room_id,action_type:C.action_type,previous_page:p.f.commonParams.previous_page})}),[_]);const I=(0,n.useCallback)((()=>{_&&u.mx.handleRecLivePlay({enter_from_merge:C.enter_from_merge,enter_method:C.enter_method,follow_status:C.follow_status,anchor_id:C.anchor_id,room_id:C.room_id,action_type:C.action_type,previous_page:p.f.commonParams.previous_page})}),[C,_]),P=()=>(0,i.Y)(s.i,{alt:null==b?void 0:b.alt,isShowLive:_,src:x,size:f,needAnimation:k,e2eTag:o,isBiggerBadge:!0});return e?(0,i.Y)(a.A,{width:96,height:96,"data-e2e":"user-avatar"}):_?(0,i.Y)(d.B,{uniqueId:g,secUid:v,teaParams:C,extraQuery:w,onClick:I,children:P()}):P()}))},38145:(e,t,o)=>{o.d(t,{A:()=>c});var i=o(2787),n=o(40099),a=o(17529),r=o(58542),l=o(43291);const s=(0,n.memo)((0,n.forwardRef)((function(e,t){return(0,i.Y)(l.iS,Object.assign({ref:t,role:"button",label:"",variant:"secondary",leadingIcon:(0,i.Y)(r.aCW,{})},e))}))),d=(0,n.forwardRef)((function({embedCode:e,embedType:t,isEmbedDisabled:o,isEmbedBanned:r,uid:l,uniqueId:d,collectionId:c,collectionName:u,tagId:p,shareUrl:m},f){const h=(0,n.useRef)(null),g=(0,n.useMemo)((()=>({author_id:l,tag_id:p,collection_id:c,collection_name:u})),[l,p,c,u]),v=(0,a.R)({from:1,mode:1,shareUrl:m,uniqueId:d,enabled:!0,embedCode:e,embedType:t,isEmbedDisabled:o,isEmbedBanned:r,teaParams:g});return(0,n.useImperativeHandle)(f,(()=>({show(){var e,t;null===(e=h.current)||void 0===e||e.focus(),null===(t=h.current)||void 0===t||t.click()}})),[]),(0,i.Y)(s,Object.assign({ref:h},v))})),c=(0,n.memo)(d)},43291:(e,t,o)=>{o.d(t,{$7:()=>s,Dx:()=>l,iS:()=>d});var i=o(62186),n=o(72153),a=o(58542),r=o(88091);const l=(0,i.default)("div",{target:"efrkfhz0"})([{position:"relative",display:"flex",flexDirection:"row",alignItems:"center",gap:"12px",marginTop:"20px"}],"label:DivButtonPanelWrapper;"),s=(0,i.default)(a.I05,{target:"efrkfhz1"})((0,n.jJ)({max:r.f5.Small-1,style:{minWidth:"0 !important",width:"40px !important",paddingLeft:"0 !important",paddingRight:"0 !important","& > :first-child":{"& > .TUXButton-label":{display:"none !important"}}}},{min:r.f5.Small,style:{minWidth:"0 !important",width:"fit-content","& > :first-of-type":{"& > .TUXButton-iconContainer":{display:"none !important"},"& > .TUXButton-label":{margin:"unset !important"}}}}),"label:StyledTUXResponsiveButton;"),d=(0,i.default)(a.I05,{target:"efrkfhz2"})({minWidth:"0 !important",width:"40px !important",paddingLeft:"0 !important",paddingRight:"0 !important","& > :first-of-type":{"& > .TUXButton-label":{display:"none !important"}}},"label:StyledTUXIconOnlyButton;")},73713:(e,t,o)=>{o.d(t,{N:()=>n,R:()=>a});var i=o(56070);const n=e=>i.h.get("/webcast/room/preload_room/",{query:e,baseUrlType:4}),a=e=>i.h.get("/webcast/room/check_alive/",{query:e,baseUrlType:4})},61595:(e,t,o)=>{o.d(t,{K:()=>r,r:()=>s});var i=o(58632),n=o(71111),a=o(73713);const r=(0,n.atom)({isLive:!1,isError:!1,isBlock:!1}),l=(0,n.atom)({isFatal:!1,isEnd:!1,roomInfo:null}),s=(0,n.atom)((e=>e(l)),((e,t,o)=>(0,i.__awaiter)(void 0,void 0,void 0,(function*(){try{const e=yield(0,a.N)(o);if(!(null==e?void 0:e.data))throw Error("no data");t(l,{roomInfo:e.data,isFatal:!0,isEnd:!0})}catch(e){t(l,{roomInfo:null,isFatal:!0,isEnd:!0})}}))))}}]);