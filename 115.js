/*! For license information please see 115.js.LICENSE.txt */
"use strict";(self.webpackChunkcoding_with_chrome=self.webpackChunkcoding_with_chrome||[]).push([[115],{74115:(t,i,o)=>{o.r(i),o.d(i,{default:()=>d});var n=o(67294),e=o(33818),s=o.n(e);class r{constructor(t,i){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:500,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:300,e=arguments.length>4&&void 0!==arguments[4]?arguments[4]:200,s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:200;this.id=t,this.title=i,this.width=o,this.height=n,this.x=e,this.y=s,this.noClose=!1}}var l=o(68611);class h extends n.PureComponent{static component;static windowsMap=new Map;static lastXPosition=20;static lastYPosition=50;static WINDOW_PREFIX="window_";static DEFAULT_WINDOW_OPTIONS={title:"Unnamed",width:500,height:400,x:"center",y:50,noClose:!1};static addNewWindow(t){return h.addWindow({...h.DEFAULT_WINDOW_OPTIONS,title:t})}static addWindow(t){const i=h.getWindowId(t.id||"unnamed_"+Math.random().toString(36).substring(2,5)),o=h.getWindowNode(i);return new Promise(((n,e)=>{o?o instanceof HTMLElement?(console.warn(`Will use existing window with id ${i}:`,o),n(i)):e(new Error(`Existing element for ${i} is no HTMLElement!`)):(console.info(`Adding new window ${i} with:`,t),h.lastXPosition<600?h.lastXPosition+=20:h.lastXPosition=10,h.lastYPosition<400?h.lastYPosition+=20:h.lastYPosition=50,this.updateWindowData(i,new r(i,t.title,500,300,h.lastXPosition,h.lastYPosition)).then((t=>{n(t)})))}))}static updateWindowData(t,i){return new Promise(((o,n)=>{h.windowsMap.set(t,i),h.component.setState({windows:h.windowsMap},(()=>{h.component.forceUpdate(),setTimeout((()=>{h.getWindowNode(t)?o(t):n(new Error(`Unable to find element for ${t}!`))}),100)}))}))}static getWindowId(t){return t.startsWith(h.WINDOW_PREFIX)?t:h.WINDOW_PREFIX+t}static getWindowNode(t){return document.querySelector("#"+h.getWindowId(t)+" .wb-body")}static updateData(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];h.component.setState({windows:h.windowsMap},(()=>{i&&h.component.forceUpdate(),void 0!==t&&setTimeout((()=>{t()}))}))}constructor(t){super(t),this.state={windows:new Map},h.component=this}handleClose(t,i){l.n0.getTarget().dispatchEvent(new l.Rj(t)),i||(console.log("Prepare closing windows with id",t,i),h.windowsMap.delete(t),h.updateData())}handleResize(t,i,o){console.debug(`Resize request for ${t} with ${i} ${o} ...`),l.n0.getTarget().dispatchEvent(new l.ST(t))}render(){return n.createElement(n.StrictMode,null,[...this.state.windows.keys()].map((t=>n.createElement(s(),{key:this.state.windows.get(t).id,id:this.state.windows.get(t).id,x:this.state.windows.get(t).x,y:this.state.windows.get(t).y,title:this.state.windows.get(t).title,width:this.state.windows.get(t).width,height:this.state.windows.get(t).height,minHeight:160,top:50,onclose:i=>this.handleClose(t,i),onresize:(i,o)=>this.handleResize(t,i,o)}))))}}const d=h},33818:function(t,i,o){var n,e=this&&this.__extends||(n=function(t,i){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,i){t.__proto__=i}||function(t,i){for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o])},n(t,i)},function(t,i){if("function"!=typeof i&&null!==i)throw new TypeError("Class extends value "+String(i)+" is not a constructor or null");function o(){this.constructor=t}n(t,i),t.prototype=null===i?Object.create(i):(o.prototype=i.prototype,new o)}),s=this&&this.__assign||function(){return s=Object.assign||function(t){for(var i,o=1,n=arguments.length;o<n;o++)for(var e in i=arguments[o])Object.prototype.hasOwnProperty.call(i,e)&&(t[e]=i[e]);return t},s.apply(this,arguments)},r=this&&this.__createBinding||(Object.create?function(t,i,o,n){void 0===n&&(n=o),Object.defineProperty(t,n,{enumerable:!0,get:function(){return i[o]}})}:function(t,i,o,n){void 0===n&&(n=o),t[n]=i[o]}),l=this&&this.__setModuleDefault||(Object.create?function(t,i){Object.defineProperty(t,"default",{enumerable:!0,value:i})}:function(t,i){t.default=i}),h=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var i={};if(null!=t)for(var o in t)"default"!==o&&Object.prototype.hasOwnProperty.call(t,o)&&r(i,t,o);return l(i,t),i},d=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(i,"__esModule",{value:!0});var a=o(85893),u=h(o(67294)),c=d(o(52480)),p=d(o(73935)),m=function(t){function i(i){var o=t.call(this,i)||this;return o.cdmCount=0,o.checkReactVersionGE18=function(){return parseInt(u.default.version.split(".")[0])>=18},o.getId=function(){var t;return null===(t=o.winBoxObj)||void 0===t?void 0:t.id},o.getIndex=function(){var t;return null===(t=o.winBoxObj)||void 0===t?void 0:t.index},o.getPosition=function(){if(o.winBoxObj)return{x:o.winBoxObj.x,y:o.winBoxObj.y}},o.getSize=function(){if(o.winBoxObj)return{width:o.winBoxObj.width,height:o.winBoxObj.height}},o.getSizeLimit=function(){if(o.winBoxObj)return{minWidth:o.winBoxObj.minwidth,minHeight:o.winBoxObj.minheight,maxWidth:o.winBoxObj.maxwidth,maxHeight:o.winBoxObj.maxheight}},o.getViewportBoundary=function(){if(o.winBoxObj)return{top:o.winBoxObj.top,right:o.winBoxObj.right,bottom:o.winBoxObj.bottom,left:o.winBoxObj.left}},o.isFocused=function(){var t,i;return null!==(i=null===(t=o.winBoxObj)||void 0===t?void 0:t.focused)&&void 0!==i&&i},o.isHidden=function(){var t,i;return null!==(i=null===(t=o.winBoxObj)||void 0===t?void 0:t.hidden)&&void 0!==i&&i},o.isMax=function(){var t,i;return null!==(i=null===(t=o.winBoxObj)||void 0===t?void 0:t.max)&&void 0!==i&&i},o.isMin=function(){var t,i;return null!==(i=null===(t=o.winBoxObj)||void 0===t?void 0:t.min)&&void 0!==i&&i},o.isFullscreen=function(){var t,i;return null!==(i=null===(t=o.winBoxObj)||void 0===t?void 0:t.full)&&void 0!==i&&i},o.isClosed=function(){return o.state.closed},o.focus=function(){var t;null===(t=o.winBoxObj)||void 0===t||t.focus()},o.blur=function(){var t;null===(t=o.winBoxObj)||void 0===t||t.blur()},o.minimize=function(){var t;null===(t=o.winBoxObj)||void 0===t||t.minimize()},o.maximize=function(){var t;null===(t=o.winBoxObj)||void 0===t||t.maximize()},o.fullscreen=function(){var t;null===(t=o.winBoxObj)||void 0===t||t.fullscreen()},o.restore=function(){var t;null===(t=o.winBoxObj)||void 0===t||t.restore()},o.hide=function(){var t;null===(t=o.winBoxObj)||void 0===t||t.hide()},o.show=function(){var t;null===(t=o.winBoxObj)||void 0===t||t.show()},o.maintainStyle=function(){o.winBoxObj&&(o.winBoxObj[o.props.noAnimation?"addClass":"removeClass"]("no-animation"),o.winBoxObj[o.props.noClose?"addClass":"removeClass"]("no-close"),o.winBoxObj[o.props.noFull?"addClass":"removeClass"]("no-full"),o.winBoxObj[o.props.noMin?"addClass":"removeClass"]("no-min"),o.winBoxObj[o.props.noMax?"addClass":"removeClass"]("no-max"),o.winBoxObj[o.props.noMove?"addClass":"removeClass"]("no-move"),o.winBoxObj[o.props.noHeader?"addClass":"removeClass"]("no-header"),o.winBoxObj[o.props.noResize?"addClass":"removeClass"]("no-resize"),o.winBoxObj[o.props.noShadow?"addClass":"removeClass"]("no-shadow"),o.winBoxObj[o.props.modal?"addClass":"removeClass"]("modal"),o.winBoxObj[o.props.hide?"addClass":"removeClass"]("hide"))},o.maintain=function(t){var i,n,e,s,r,l,h,d,a,u,c,p;if(o.winBoxObj){var m=null!=t?t:{},f=m.force,v=m.prevProps;if((f||(null==v?void 0:v.title)!==o.props.title)&&"string"==typeof o.props.title&&o.winBoxObj.setTitle(o.props.title),(f||(null==v?void 0:v.icon)!==o.props.icon)&&"string"==typeof o.props.icon&&o.winBoxObj.setIcon(o.props.icon),(f||(null==v?void 0:v.url)!==o.props.url)&&null!=o.props.url&&o.winBoxObj.setUrl(o.props.url),(f||(null==v?void 0:v.background)!==o.props.background)&&null!=o.props.background&&o.winBoxObj.setBackground(o.props.background),f||(null==v?void 0:v.minWidth)!==o.props.minWidth||(null==v?void 0:v.minHeight)!==o.props.minHeight||(null==v?void 0:v.maxWidth)!==o.props.maxWidth||(null==v?void 0:v.maxHeight)!==o.props.maxHeight){var x=null!==(i=o.props.minWidth)&&void 0!==i?i:o.winBoxObj.minwidth,b=null!==(n=o.props.minHeight)&&void 0!==n?n:o.winBoxObj.minheight,g=null!==(e=o.props.maxWidth)&&void 0!==e?e:o.winBoxObj.maxwidth,O=null!==(s=o.props.maxHeight)&&void 0!==s?s:o.winBoxObj.maxheight;o.winBoxObj.minwidth=x,o.winBoxObj.minheight=b,o.winBoxObj.maxwidth=g,o.winBoxObj.maxheight=O}if(f||(null==v?void 0:v.width)!==o.props.width||(null==v?void 0:v.height)!==o.props.height){var y=null!==(r=o.props.width)&&void 0!==r?r:o.winBoxObj.width,j=null!==(l=o.props.height)&&void 0!==l?l:o.winBoxObj.height;o.winBoxObj.resize(y,j)}if(f||(null==v?void 0:v.x)!==o.props.x||(null==v?void 0:v.y)!==o.props.y){var B=null!==(h=o.props.x)&&void 0!==h?h:o.winBoxObj.x,C=null!==(d=o.props.y)&&void 0!==d?d:o.winBoxObj.y;o.winBoxObj.move(B,C)}if((f||(null==v?void 0:v.top)!==o.props.top||(null==v?void 0:v.right)!==o.props.right||(null==v?void 0:v.bottom)!==o.props.bottom||(null==v?void 0:v.left)!==o.props.left)&&(o.winBoxObj.top=null!==(a=o.props.top)&&void 0!==a?a:o.winBoxObj.top,o.winBoxObj.right=null!==(u=o.props.right)&&void 0!==u?u:o.winBoxObj.right,o.winBoxObj.bottom=null!==(c=o.props.bottom)&&void 0!==c?c:o.winBoxObj.bottom,o.winBoxObj.left=null!==(p=o.props.left)&&void 0!==p?p:o.winBoxObj.left,o.winBoxObj.move()),(f||(null==v?void 0:v.fullscreen)!==o.props.fullscreen)&&null!=o.props.fullscreen&&o.winBoxObj.fullscreen(o.props.fullscreen),(f||(null==v?void 0:v.min)!==o.props.min)&&null!=o.props.min&&o.winBoxObj.minimize(o.props.min),(f||(null==v?void 0:v.max)!==o.props.max)&&null!=o.props.max&&o.winBoxObj.maximize(o.props.max),f||(null==v?void 0:v.className)!==o.props.className){if(null!=(null==v?void 0:v.className))for(var z=v.className.replaceAll(/\s+/g," ").split(" ").filter((function(t){return""!=t})),_=0,M=z;_<M.length;_++){var k=M[_];o.winBoxObj.hasClass(k)&&o.winBoxObj.removeClass(k)}if(null!=o.props.className){z=o.props.className.replaceAll(/\s+/g," ").split(" ").filter((function(t){return""!=t}));for(var W=0,P=z;W<P.length;W++){k=P[W];o.winBoxObj.hasClass(k)||o.winBoxObj.addClass(k)}}}(f||(null==v?void 0:v.customControls)!==o.props.customControls&&!w(null==v?void 0:v.customControls,o.props.customControls))&&(null!=(null==v?void 0:v.customControls)&&v.customControls.filter((function(t){return"object"==typeof t&&t.class})).forEach((function(t){return o.winBoxObj.removeControl(t.class)})),null!=o.props.customControls&&o.props.customControls.filter((function(t){return"object"==typeof t&&t.class})).forEach((function(t){return o.winBoxObj.addControl(t)}))),o.maintainStyle()}},o.handleClose=function(){o.winBoxObj=void 0,o.setState({closed:!0})},o.state={closed:!1},o.winBoxObj=void 0,o}return e(i,t),i.prototype.componentDidMount=function(){var t,i,o,n,e,r,l,h,d,a=this;if(this.cdmCount++,!(this.checkReactVersionGE18()&&this.cdmCount>=2))try{if(void 0!==this.props.id&&null!==this.props.id&&document.getElementById(this.props.id))throw"duplicated window id";this.winBoxObj=c.default.new(s(s({width:300,height:200,top:0,bottom:0,left:0,right:0,hidden:this.props.hide},this.props),{minwidth:null!==(t=this.props.minWidth)&&void 0!==t?t:150,maxwidth:null!==(i=this.props.maxWidth)&&void 0!==i?i:2147483647,minheight:null!==(o=this.props.minHeight)&&void 0!==o?o:35,maxheight:null!==(n=this.props.maxHeight)&&void 0!==n?n:2147483647,max:!1,min:!1,fullscreen:!1,class:""+(null!==(e=this.props.className)&&void 0!==e?e:""),onclose:function(t){var i,o,n,e;return!!(null===(o=(i=a.props).onClose)||void 0===o?void 0:o.call(i,null!=t&&t))||(!!(null===(e=(n=a.props).onclose)||void 0===e?void 0:e.call(n,null!=t&&t))||(a.handleClose(),!1))},onmove:null!==(r=this.props.onMove)&&void 0!==r?r:this.props.onmove,onresize:null!==(l=this.props.onResize)&&void 0!==l?l:this.props.onresize,onblur:null!==(h=this.props.onBlur)&&void 0!==h?h:this.props.onblur,onfocus:null!==(d=this.props.onFocus)&&void 0!==d?d:this.props.onfocus,oncreate:this.props.onCreate,onfullscreen:this.props.onFullscreen,onminimize:this.props.onMinimize,onmaximize:this.props.onMaximize,onrestore:this.props.onRestore,onhide:this.props.onHide,onshow:this.props.onShow})),setTimeout((function(){a.forceUpdate()}))}catch(t){console.error(t)}},i.prototype.componentDidUpdate=function(t,i){this.maintain({prevProps:t})},i.prototype.componentWillUnmount=function(){var t,i,o=this;try{this.checkReactVersionGE18()?this.cdmCount<=1?setTimeout((function(){var t;o.cdmCount<=1&&(null===(t=o.winBoxObj)||void 0===t||t.close(!0))}),100):null===(t=this.winBoxObj)||void 0===t||t.close(!0):null===(i=this.winBoxObj)||void 0===i||i.close(!0)}catch(t){}},i.prototype.forceUpdate=function(i){try{this.maintain({force:!0})}catch(t){console.error(t)}t.prototype.forceUpdate.call(this,i)},i.prototype.render=function(){return-1!==Object.keys(this.props).indexOf("url")&&this.props.url?null:this.winBoxObj&&this.winBoxObj.body?p.default.createPortal(a.jsx(a.Fragment,{children:this.props.children},void 0),this.winBoxObj.body):null},i}(u.Component);function w(t,i){var o=Object.keys,n=typeof t;return t&&i&&"object"===n&&n===typeof i?o(t).length===o(i).length&&o(t).every((function(o){return w(t[o],i[o])})):t===i}i.default=m},52480:(t,i,o)=>{o.r(i),o.d(i,{default:()=>B});const n=document.createElement("div");function e(t,i,o,n){t&&t.addEventListener(i,o,n||!1)}function s(t,i,o,n){t&&t.removeEventListener(i,o,n||!1)}function r(t,i){t.stopPropagation(),t.cancelable&&t.preventDefault()}function l(t,i){return t.getElementsByClassName(i)[0]}function h(t,i){t.classList.add(i)}function d(t,i){t.classList.remove(i)}function a(t,i,o){o=""+o,t["_s_"+i]!==o&&(t.style.setProperty(i,o),t["_s_"+i]=o)}n.innerHTML="<div class=wb-header><div class=wb-control><span class=wb-min></span><span class=wb-max></span><span class=wb-full></span><span class=wb-close></span></div><div class=wb-drag><div class=wb-icon></div><div class=wb-title></div></div></div><div class=wb-body></div><div class=wb-n></div><div class=wb-s></div><div class=wb-w></div><div class=wb-e></div><div class=wb-nw></div><div class=wb-ne></div><div class=wb-se></div><div class=wb-sw></div>";const u=!1,c=[],p={capture:!0,passive:!0};let m,w,f,v,x,b,g,O=0,y=10;function j(t,i){if(!(this instanceof j))return new j(t);let o,s,h,d,u,c,p,w,f,B,z,W,P,E,N,H,F,I,T,R,S,D,L,U,q,X,A,Y,$,V,G,J,K,Q,Z,tt,it,ot,nt,et,st,rt,lt;if(m||(m=document.body,m[v="requestFullscreen"]||m[v="msRequestFullscreen"]||m[v="webkitRequestFullscreen"]||m[v="mozRequestFullscreen"]||(v=""),x=v&&v.replace("request","exit").replace("mozRequest","mozCancel").replace("Request","Exit"),e(window,"resize",(function(){k(),_()})),k()),t&&(i&&(u=t,t=i),"string"==typeof t?u=t:(o=t.id,s=t.index,h=t.root,d=t.template,u=u||t.title,c=t.icon,p=t.mount,w=t.html,f=t.url,B=t.width,z=t.height,W=t.minwidth,P=t.minheight,E=t.maxwidth,N=t.maxheight,H=t.autosize,L=t.min,U=t.max,q=t.hidden,X=t.modal,F=t.x||(X?"center":0),I=t.y||(X?"center":0),T=t.top,R=t.left,S=t.bottom,D=t.right,A=t.background,Y=t.border,$=t.header,V=t.class,J=t.onclose,K=t.onfocus,Q=t.onblur,Z=t.onmove,tt=t.onresize,it=t.onfullscreen,ot=t.onmaximize,nt=t.onminimize,et=t.onrestore,st=t.onhide,rt=t.onshow,lt=t.onload)),this.dom=function(t){return(t||n).cloneNode(!0)}(d),this.dom.id=this.id=o||"winbox-"+ ++O,this.dom.className="winbox"+(V?" "+("string"==typeof V?V:V.join(" ")):"")+(X?" modal":""),this.dom.winbox=this,this.window=this.dom,this.body=l(this.dom,"wb-body"),this.header=$||35,A&&this.setBackground(A),Y?a(this.body,"margin",Y+(isNaN(Y)?"":"px")):Y=0,$){const t=l(this.dom,"wb-header");a(t,"height",$+"px"),a(t,"line-height",$+"px"),a(this.body,"top",$+"px")}u&&this.setTitle(u),c&&this.setIcon(c),p?this.mount(p):w?this.body.innerHTML=w:f&&this.setUrl(f,lt),T=T?C(T,g):0,S=S?C(S,g):0,R=R?C(R,b):0,D=D?C(D,b):0;const ht=b-R-D,dt=g-T-S;E=E?C(E,ht):ht,N=N?C(N,dt):dt,W=W?C(W,E):150,P=P?C(P,N):this.header,H?((h||m).appendChild(this.body),B=Math.max(Math.min(this.body.clientWidth+2*Y+1,E),W),z=Math.max(Math.min(this.body.clientHeight+this.header+Y+1,N),P),this.dom.appendChild(this.body)):(B=B?C(B,E):0|Math.max(E/2,W),z=z?C(z,N):0|Math.max(N/2,P)),F=F?C(F,ht,B):R,I=I?C(I,dt,z):T,this.x=F,this.y=I,this.width=B,this.height=z,this.minwidth=W,this.minheight=P,this.maxwidth=E,this.maxheight=N,this.top=T,this.right=D,this.bottom=S,this.left=R,this.index=s,this.min=!1,this.max=!1,this.full=!1,this.hidden=!1,this.focused=!1,this.onclose=J,this.onfocus=K,this.onblur=Q,this.onmove=Z,this.onresize=tt,this.onfullscreen=it,this.onmaximize=ot,this.onminimize=nt,this.onrestore=et,this.onhide=st,this.onshow=rt,U?this.maximize():L?this.minimize():this.resize().move(),q?this.hide():(this.focus(),(s||0===s)&&(this.index=s,a(this.dom,"z-index",s),s>y&&(y=s))),function(t){M(t,"drag"),M(t,"n"),M(t,"s"),M(t,"w"),M(t,"e"),M(t,"nw"),M(t,"ne"),M(t,"se"),M(t,"sw"),e(l(t.dom,"wb-min"),"click",(function(i){r(i),t.min?t.focus().restore():t.blur().minimize()})),e(l(t.dom,"wb-max"),"click",(function(i){t.max?t.restore():t.maximize()})),v?e(l(t.dom,"wb-full"),"click",(function(i){t.fullscreen()})):t.addClass("no-full");e(l(t.dom,"wb-close"),"click",(function(i){r(i),t.close()||(t=null)})),e(t.dom,"click",(function(i){t.focus()}))}(this),(h||m).appendChild(this.dom),(G=t.oncreate)&&G.call(this,t)}j.new=function(t){return new j(t)};const B=j;function C(t,i,o){if("string"==typeof t)if("center"===t)t=(i-o)/2|0;else if("right"===t||"bottom"===t)t=i-o;else{const o=parseFloat(t),n=""+o!==t&&t.substring((""+o).length);t="%"===n?i/100*o|0:o}return t}function z(t){c.splice(c.indexOf(t),1),_(),t.removeClass("min"),t.min=!1,t.dom.title=""}function _(){const t=c.length,i={},o={};for(let n,e,s=0;s<t;s++)n=c[s],e=(n.left||n.right)+":"+(n.top||n.bottom),o[e]?o[e]++:(i[e]=0,o[e]=1);for(let n,e,s,r=0;r<t;r++)n=c[r],e=(n.left||n.right)+":"+(n.top||n.bottom),s=Math.min((b-n.left-n.right)/o[e],250),n.resize(s+1|0,n.header,!0).move(n.left+i[e]*s|0,g-n.bottom-n.header,!0),i[e]++}function M(t,i){const o=l(t.dom,"wb-"+i);if(!o)return;let n,a,c,w,f,v,x=0;function O(){w=requestAnimationFrame(O),v&&(t.resize(),v=!1),f&&(t.move(),f=!1)}function y(o){if(r(o),t.focus(),"drag"===i){if(t.min)return void t.restore();const i=Date.now(),o=i-x;if(x=i,o<300)return void(t.max?t.restore():t.maximize())}t.max||t.min||(h(m,"wb-lock"),u&&O(),(n=o.touches)&&(n=n[0])?(o=n,e(window,"touchmove",j,p),e(window,"touchend",B,p)):(e(window,"mousemove",j),e(window,"mouseup",B)),a=o.pageX,c=o.pageY)}function j(o){r(o),n&&(o=o.touches[0]);const e=o.pageX,s=o.pageY,l=e-a,h=s-c,d=t.width,p=t.height,m=t.x,w=t.y;let x,O,y,j;"drag"===i?(t.x+=l,t.y+=h,y=j=1):("e"===i||"se"===i||"ne"===i?(t.width+=l,x=1):"w"!==i&&"sw"!==i&&"nw"!==i||(t.x+=l,t.width-=l,x=1,y=1),"s"===i||"se"===i||"sw"===i?(t.height+=h,O=1):"n"!==i&&"ne"!==i&&"nw"!==i||(t.y+=h,t.height-=h,O=1,j=1)),x&&(t.width=Math.max(Math.min(t.width,t.maxwidth,b-t.x-t.right),t.minwidth),x=t.width!==d),O&&(t.height=Math.max(Math.min(t.height,t.maxheight,g-t.y-t.bottom),t.minheight),O=t.height!==p),(x||O)&&(u?v=!0:t.resize()),y&&(t.x=Math.max(Math.min(t.x,b-t.width-t.right),t.left),y=t.x!==m),j&&(t.y=Math.max(Math.min(t.y,g-t.height-t.bottom),t.top),j=t.y!==w),(y||j)&&(u?f=!0:t.move()),(x||y)&&(a=e),(O||j)&&(c=s)}function B(t){r(t),d(m,"wb-lock"),u&&cancelAnimationFrame(w),n?(s(window,"touchmove",j,p),s(window,"touchend",B,p)):(s(window,"mousemove",j),s(window,"mouseup",B))}e(o,"mousedown",y),e(o,"touchstart",y,p)}function k(){const t=document.documentElement;b=t.clientWidth,g=t.clientHeight}function W(){if(w.full=!1,document.fullscreen||document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement)return document[x](),!0}j.prototype.mount=function(t){return this.unmount(),t._backstore||(t._backstore=t.parentNode),this.body.textContent="",this.body.appendChild(t),this},j.prototype.unmount=function(t){const i=this.body.firstChild;if(i){const o=t||i._backstore;o&&o.appendChild(i),i._backstore=t}return this},j.prototype.setTitle=function(t){return function(t,i){const o=t.firstChild;o?o.nodeValue=i:t.textContent=i}(l(this.dom,"wb-title"),this.title=t),this},j.prototype.setIcon=function(t){const i=l(this.dom,"wb-icon");return a(i,"background-image","url("+t+")"),a(i,"display","inline-block"),this},j.prototype.setBackground=function(t){return a(this.dom,"background",t),this},j.prototype.setUrl=function(t,i){const o=this.body.firstChild;return o&&"iframe"===o.tagName.toLowerCase()?o.src=t:(this.body.innerHTML='<iframe src="'+t+'"></iframe>',i&&(this.body.firstChild.onload=i)),this},j.prototype.focus=function(t){return!1===t?this.blur():(f!==this&&this.dom&&(f&&f.blur(),a(this.dom,"z-index",++y),this.index=y,this.addClass("focus"),f=this,this.focused=!0,this.onfocus&&this.onfocus()),this)},j.prototype.blur=function(t){return!1===t?this.focus():(f===this&&(this.removeClass("focus"),this.focused=!1,this.onblur&&this.onblur(),f=null),this)},j.prototype.hide=function(t){return!1===t?this.show():this.hidden?void 0:(this.onhide&&this.onhide(),this.hidden=!0,this.addClass("hide"))},j.prototype.show=function(t){return!1===t?this.hide():this.hidden?(this.onshow&&this.onshow(),this.hidden=!1,this.removeClass("hide")):void 0},j.prototype.minimize=function(t){return!1===t?this.restore():(w&&W(),this.max&&(this.removeClass("max"),this.max=!1),this.min||(c.push(this),_(),this.dom.title=this.title,this.addClass("min"),this.min=!0,this.onminimize&&this.onminimize()),this)},j.prototype.restore=function(){return w&&W(),this.min&&(z(this),this.resize().move(),this.onrestore&&this.onrestore()),this.max&&(this.max=!1,this.removeClass("max").resize().move(),this.onrestore&&this.onrestore()),this},j.prototype.maximize=function(t){return!1===t?this.restore():(w&&W(),this.min&&z(this),this.max||(this.addClass("max").resize(b-this.left-this.right,g-this.top-this.bottom,!0).move(this.left,this.top,!0),this.max=!0,this.onmaximize&&this.onmaximize()),this)},j.prototype.fullscreen=function(t){if(this.min&&(z(this),this.resize().move()),w&&W()){if(!1===t)return this.restore()}else this.body[v](),w=this,this.full=!0,this.onfullscreen&&this.onfullscreen();return this},j.prototype.close=function(t){if(this.onclose&&this.onclose(t))return!0;this.min&&z(this),this.unmount(),this.dom.remove(),this.dom.textContent="",this.dom.winbox=null,this.body=null,this.dom=null,f===this&&(f=null)},j.prototype.move=function(t,i,o){return t||0===t?o||(this.x=t?t=C(t,b-this.left-this.right,this.width):0,this.y=i?i=C(i,g-this.top-this.bottom,this.height):0):(t=this.x,i=this.y),a(this.dom,"left",t+"px"),a(this.dom,"top",i+"px"),this.onmove&&this.onmove(t,i),this},j.prototype.resize=function(t,i,o){return t||0===t?o||(this.width=t?t=C(t,this.maxwidth):0,this.height=i?i=C(i,this.maxheight):0,t=Math.max(t,this.minwidth),i=Math.max(i,this.minheight)):(t=this.width,i=this.height),a(this.dom,"width",t+"px"),a(this.dom,"height",i+"px"),this.onresize&&this.onresize(t,i),this},j.prototype.addControl=function(t){const i=t.class,o=t.image,n=t.click,e=t.index,s=document.createElement("span"),r=l(this.dom,"wb-control"),h=this;return i&&(s.className=i),o&&a(s,"background-image","url("+o+")"),n&&(s.onclick=function(t){n.call(this,t,h)}),r.insertBefore(s,r.childNodes[e||0]),this},j.prototype.removeControl=function(t){return(t=l(this.dom,t))&&t.remove(),this},j.prototype.addClass=function(t){return h(this.dom,t),this},j.prototype.removeClass=function(t){return d(this.dom,t),this},j.prototype.hasClass=function(t){return function(t,i){return t.classList.contains(i)}(this.dom,t)},j.prototype.toggleClass=function(t){return this.hasClass(t)?this.removeClass(t):this.addClass(t)}}}]);