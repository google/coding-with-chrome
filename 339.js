"use strict";(self.webpackChunkcoding_with_chrome=self.webpackChunkcoding_with_chrome||[]).push([[339],{44339:(e,t,i)=>{i.r(t),i.d(t,{basicSetup:()=>$e,default:()=>pt,getDefaultExtensions:()=>lt,getStatistics:()=>ct,minimalSetup:()=>He,useCodeMirror:()=>dt});var o=i(87462),n=i(63366),s=i(67294),r=i(78120),a=i(32864),l=i(45383);function c(){var e=arguments[0];"string"==typeof e&&(e=document.createElement(e));var t=1,i=arguments[1];if(i&&"object"==typeof i&&null==i.nodeType&&!Array.isArray(i)){for(var o in i)if(Object.prototype.hasOwnProperty.call(i,o)){var n=i[o];"string"==typeof n?e.setAttribute(o,n):null!=n&&(e[o]=n)}t++}for(;t<arguments.length;t++)h(e,arguments[t]);return e}function h(e,t){if("string"==typeof t)e.appendChild(document.createTextNode(t));else if(null==t);else if(null!=t.nodeType)e.appendChild(t);else{if(!Array.isArray(t))throw new RangeError("Unsupported child node: "+t);for(var i=0;i<t.length;i++)h(e,t[i])}}const d="function"==typeof String.prototype.normalize?e=>e.normalize("NFKD"):e=>e;class u{constructor(e,t,i=0,o=e.length,n,s){this.test=s,this.value={from:0,to:0},this.done=!1,this.matches=[],this.buffer="",this.bufferPos=0,this.iter=e.iterRange(i,o),this.bufferStart=i,this.normalize=n?e=>n(d(e)):d,this.query=this.normalize(t)}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return-1;this.bufferPos=0,this.buffer=this.iter.value}return(0,r.gm)(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let e=this.peek();if(e<0)return this.done=!0,this;let t=(0,r.bg)(e),i=this.bufferStart+this.bufferPos;this.bufferPos+=(0,r.nZ)(e);let o=this.normalize(t);for(let e=0,n=i;;e++){let s=o.charCodeAt(e),r=this.match(s,n);if(r)return this.value=r,this;if(e==o.length-1)break;n==i&&e<t.length&&t.charCodeAt(e)==s&&n++}}}match(e,t){let i=null;for(let o=0;o<this.matches.length;o+=2){let n=this.matches[o],s=!1;this.query.charCodeAt(n)==e&&(n==this.query.length-1?i={from:this.matches[o+1],to:t+1}:(this.matches[o]++,s=!0)),s||(this.matches.splice(o,2),o-=2)}return this.query.charCodeAt(0)==e&&(1==this.query.length?i={from:t,to:t+1}:this.matches.push(1,t)),i&&this.test&&!this.test(i.from,i.to,this.buffer,this.bufferPos)&&(i=null),i}}"undefined"!=typeof Symbol&&(u.prototype[Symbol.iterator]=function(){return this});const f={from:-1,to:-1,match:/.*/.exec("")},m="gm"+(null==/x/.unicode?"":"u");class p{constructor(e,t,i,o=0,n=e.length){if(this.text=e,this.to=n,this.curLine="",this.done=!1,this.value=f,/\\[sWDnr]|\n|\r|\[\^/.test(t))return new b(e,t,i,o,n);this.re=new RegExp(t,m+((null==i?void 0:i.ignoreCase)?"i":"")),this.test=null==i?void 0:i.test,this.iter=e.iter();let s=e.lineAt(o);this.curLineStart=s.from,this.matchPos=y(e,o),this.getLine(this.curLineStart)}getLine(e){this.iter.next(e),this.iter.lineBreak?this.curLine="":(this.curLine=this.iter.value,this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart)),this.iter.next())}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1,this.curLineStart>this.to?this.curLine="":this.getLine(0)}next(){for(let e=this.matchPos-this.curLineStart;;){this.re.lastIndex=e;let t=this.matchPos<=this.to&&this.re.exec(this.curLine);if(t){let i=this.curLineStart+t.index,o=i+t[0].length;if(this.matchPos=y(this.text,o+(i==o?1:0)),i==this.curLineStart+this.curLine.length&&this.nextLine(),(i<o||i>this.value.to)&&(!this.test||this.test(i,o,t)))return this.value={from:i,to:o,match:t},this;e=this.matchPos-this.curLineStart}else{if(!(this.curLineStart+this.curLine.length<this.to))return this.done=!0,this;this.nextLine(),e=0}}}}const g=new WeakMap;class v{constructor(e,t){this.from=e,this.text=t}get to(){return this.from+this.text.length}static get(e,t,i){let o=g.get(e);if(!o||o.from>=i||o.to<=t){let o=new v(t,e.sliceString(t,i));return g.set(e,o),o}if(o.from==t&&o.to==i)return o;let{text:n,from:s}=o;return s>t&&(n=e.sliceString(t,s)+n,s=t),o.to<i&&(n+=e.sliceString(o.to,i)),g.set(e,new v(s,n)),new v(t,n.slice(t-s,i-s))}}class b{constructor(e,t,i,o,n){this.text=e,this.to=n,this.done=!1,this.value=f,this.matchPos=y(e,o),this.re=new RegExp(t,m+((null==i?void 0:i.ignoreCase)?"i":"")),this.test=null==i?void 0:i.test,this.flat=v.get(e,o,this.chunkEnd(o+5e3))}chunkEnd(e){return e>=this.to?this.to:this.text.lineAt(e).to}next(){for(;;){let e=this.re.lastIndex=this.matchPos-this.flat.from,t=this.re.exec(this.flat.text);if(t&&!t[0]&&t.index==e&&(this.re.lastIndex=e+1,t=this.re.exec(this.flat.text)),t){let e=this.flat.from+t.index,i=e+t[0].length;if((this.flat.to>=this.to||t.index+t[0].length<=this.flat.text.length-10)&&(!this.test||this.test(e,i,t)))return this.value={from:e,to:i,match:t},this.matchPos=y(this.text,i+(e==i?1:0)),this}if(this.flat.to==this.to)return this.done=!0,this;this.flat=v.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+2*this.flat.text.length))}}}function y(e,t){if(t>=e.length)return t;let i,o=e.lineAt(t);for(;t<o.to&&(i=o.text.charCodeAt(t-o.from))>=56320&&i<57344;)t++;return t}function x(e){let t=c("input",{class:"cm-textfield",name:"line"});function i(){let i=/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(t.value);if(!i)return;let{state:o}=e,n=o.doc.lineAt(o.selection.main.head),[,s,a,l,c]=i,h=l?+l.slice(1):0,d=a?+a:n.number;if(a&&c){let e=d/100;s&&(e=e*("-"==s?-1:1)+n.number/o.doc.lines),d=Math.round(o.doc.lines*e)}else a&&s&&(d=d*("-"==s?-1:1)+n.number);let u=o.doc.line(Math.max(1,Math.min(o.doc.lines,d)));e.dispatch({effects:w.of(!1),selection:r.jT.cursor(u.from+Math.max(0,Math.min(h,u.length))),scrollIntoView:!0}),e.focus()}return{dom:c("form",{class:"cm-gotoLine",onkeydown:t=>{27==t.keyCode?(t.preventDefault(),e.dispatch({effects:w.of(!1)}),e.focus()):13==t.keyCode&&(t.preventDefault(),i())},onsubmit:e=>{e.preventDefault(),i()}},c("label",e.state.phrase("Go to line"),": ",t)," ",c("button",{class:"cm-button",type:"submit"},e.state.phrase("go")))}}"undefined"!=typeof Symbol&&(p.prototype[Symbol.iterator]=b.prototype[Symbol.iterator]=function(){return this});const w=r.Py.define(),k=r.QQ.define({create:()=>!0,update(e,t){for(let i of t.effects)i.is(w)&&(e=i.value);return e},provide:e=>a.mH.from(e,(e=>e?x:null))}),C=a.tk.baseTheme({".cm-panel.cm-gotoLine":{padding:"2px 6px 4px","& label":{fontSize:"80%"}}}),S={highlightWordAroundCursor:!1,minSelectionLength:1,maxMatches:100,wholeWords:!1},M=r.r$.define({combine:e=>(0,r.BO)(e,S,{highlightWordAroundCursor:(e,t)=>e||t,minSelectionLength:Math.min,maxMatches:Math.min})});const L=a.p.mark({class:"cm-selectionMatch"}),A=a.p.mark({class:"cm-selectionMatch cm-selectionMatch-main"});function W(e,t,i,o){return!(0!=i&&e(t.sliceDoc(i-1,i))==r.D0.Word||o!=t.doc.length&&e(t.sliceDoc(o,o+1))==r.D0.Word)}const D=a.lg.fromClass(class{constructor(e){this.decorations=this.getDeco(e)}update(e){(e.selectionSet||e.docChanged||e.viewportChanged)&&(this.decorations=this.getDeco(e.view))}getDeco(e){let t=e.state.facet(M),{state:i}=e,o=i.selection;if(o.ranges.length>1)return a.p.none;let n,s=o.main,l=null;if(s.empty){if(!t.highlightWordAroundCursor)return a.p.none;let e=i.wordAt(s.head);if(!e)return a.p.none;l=i.charCategorizer(s.head),n=i.sliceDoc(e.from,e.to)}else{let e=s.to-s.from;if(e<t.minSelectionLength||e>200)return a.p.none;if(t.wholeWords){if(n=i.sliceDoc(s.from,s.to),l=i.charCategorizer(s.head),!W(l,i,s.from,s.to)||!function(e,t,i,o){return e(t.sliceDoc(i,i+1))==r.D0.Word&&e(t.sliceDoc(o-1,o))==r.D0.Word}(l,i,s.from,s.to))return a.p.none}else if(n=i.sliceDoc(s.from,s.to).trim(),!n)return a.p.none}let c=[];for(let o of e.visibleRanges){let e=new u(i.doc,n,o.from,o.to);for(;!e.next().done;){let{from:o,to:n}=e.value;if((!l||W(l,i,o,n))&&(s.empty&&o<=s.from&&n>=s.to?c.push(A.range(o,n)):(o>=s.to||n<=s.from)&&c.push(L.range(o,n)),c.length>t.maxMatches))return a.p.none}}return a.p.set(c)}},{decorations:e=>e.decorations}),J=a.tk.baseTheme({".cm-selectionMatch":{backgroundColor:"#99ff7780"},".cm-searchMatch .cm-selectionMatch":{backgroundColor:"transparent"}});const T=r.r$.define({combine:e=>(0,r.BO)(e,{top:!1,caseSensitive:!1,literal:!1,wholeWord:!1,createPanel:e=>new re(e),scrollToMatch:e=>a.tk.scrollIntoView(e)})});class R{constructor(e){this.search=e.search,this.caseSensitive=!!e.caseSensitive,this.literal=!!e.literal,this.regexp=!!e.regexp,this.replace=e.replace||"",this.valid=!!this.search&&(!this.regexp||function(e){try{return new RegExp(e,m),!0}catch(e){return!1}}(this.search)),this.unquoted=this.unquote(this.search),this.wholeWord=!!e.wholeWord}unquote(e){return this.literal?e:e.replace(/\\([nrt\\])/g,((e,t)=>"n"==t?"\n":"r"==t?"\r":"t"==t?"\t":"\\"))}eq(e){return this.search==e.search&&this.replace==e.replace&&this.caseSensitive==e.caseSensitive&&this.regexp==e.regexp&&this.wholeWord==e.wholeWord}create(){return this.regexp?new B(this):new E(this)}getCursor(e,t=0,i){let o=e.doc?e:r.yy.create({doc:e});return null==i&&(i=o.doc.length),this.regexp?P(this,o,t,i):F(this,o,t,i)}}class q{constructor(e){this.spec=e}}function F(e,t,i,o){return new u(t.doc,e.unquoted,i,o,e.caseSensitive?void 0:e=>e.toLowerCase(),e.wholeWord?(n=t.doc,s=t.charCategorizer(t.selection.main.head),(e,t,i,o)=>((o>e||o+i.length<t)&&(o=Math.max(0,e-2),i=n.sliceString(o,Math.min(n.length,t+2))),!(s(I(i,e-o))==r.D0.Word&&s(O(i,e-o))==r.D0.Word||s(O(i,t-o))==r.D0.Word&&s(I(i,t-o))==r.D0.Word))):void 0);var n,s}class E extends q{constructor(e){super(e)}nextMatch(e,t,i){let o=F(this.spec,e,i,e.doc.length).nextOverlapping();return o.done&&(o=F(this.spec,e,0,t).nextOverlapping()),o.done?null:o.value}prevMatchInRange(e,t,i){for(let o=i;;){let i=Math.max(t,o-1e4-this.spec.unquoted.length),n=F(this.spec,e,i,o),s=null;for(;!n.nextOverlapping().done;)s=n.value;if(s)return s;if(i==t)return null;o-=1e4}}prevMatch(e,t,i){return this.prevMatchInRange(e,0,t)||this.prevMatchInRange(e,i,e.doc.length)}getReplacement(e){return this.spec.unquote(this.spec.replace)}matchAll(e,t){let i=F(this.spec,e,0,e.doc.length),o=[];for(;!i.next().done;){if(o.length>=t)return null;o.push(i.value)}return o}highlight(e,t,i,o){let n=F(this.spec,e,Math.max(0,t-this.spec.unquoted.length),Math.min(i+this.spec.unquoted.length,e.doc.length));for(;!n.next().done;)o(n.value.from,n.value.to)}}function P(e,t,i,o){return new p(t.doc,e.search,{ignoreCase:!e.caseSensitive,test:e.wholeWord?(n=t.charCategorizer(t.selection.main.head),(e,t,i)=>!i[0].length||(n(I(i.input,i.index))!=r.D0.Word||n(O(i.input,i.index))!=r.D0.Word)&&(n(O(i.input,i.index+i[0].length))!=r.D0.Word||n(I(i.input,i.index+i[0].length))!=r.D0.Word)):void 0},i,o);var n}function I(e,t){return e.slice((0,r.cp)(e,t,!1),t)}function O(e,t){return e.slice(t,(0,r.cp)(e,t))}class B extends q{nextMatch(e,t,i){let o=P(this.spec,e,i,e.doc.length).next();return o.done&&(o=P(this.spec,e,0,t).next()),o.done?null:o.value}prevMatchInRange(e,t,i){for(let o=1;;o++){let n=Math.max(t,i-1e4*o),s=P(this.spec,e,n,i),r=null;for(;!s.next().done;)r=s.value;if(r&&(n==t||r.from>n+10))return r;if(n==t)return null}}prevMatch(e,t,i){return this.prevMatchInRange(e,0,t)||this.prevMatchInRange(e,i,e.doc.length)}getReplacement(e){return this.spec.unquote(this.spec.replace.replace(/\$([$&\d+])/g,((t,i)=>"$"==i?"$":"&"==i?e.match[0]:"0"!=i&&+i<e.match.length?e.match[i]:t)))}matchAll(e,t){let i=P(this.spec,e,0,e.doc.length),o=[];for(;!i.next().done;){if(o.length>=t)return null;o.push(i.value)}return o}highlight(e,t,i,o){let n=P(this.spec,e,Math.max(0,t-250),Math.min(i+250,e.doc.length));for(;!n.next().done;)o(n.value.from,n.value.to)}}const $=r.Py.define(),H=r.Py.define(),N=r.QQ.define({create:e=>new z(ee(e).create(),null),update(e,t){for(let i of t.effects)i.is($)?e=new z(i.value.create(),e.panel):i.is(H)&&(e=new z(e.query,i.value?X:null));return e},provide:e=>a.mH.from(e,(e=>e.panel))});class z{constructor(e,t){this.query=e,this.panel=t}}const j=a.p.mark({class:"cm-searchMatch"}),Q=a.p.mark({class:"cm-searchMatch cm-searchMatch-selected"}),K=a.lg.fromClass(class{constructor(e){this.view=e,this.decorations=this.highlight(e.state.field(N))}update(e){let t=e.state.field(N);(t!=e.startState.field(N)||e.docChanged||e.selectionSet||e.viewportChanged)&&(this.decorations=this.highlight(t))}highlight({query:e,panel:t}){if(!t||!e.spec.valid)return a.p.none;let{view:i}=this,o=new r.f_;for(let t=0,n=i.visibleRanges,s=n.length;t<s;t++){let{from:r,to:a}=n[t];for(;t<s-1&&a>n[t+1].from-500;)a=n[++t].to;e.highlight(i.state,r,a,((e,t)=>{let n=i.state.selection.ranges.some((i=>i.from==e&&i.to==t));o.add(e,t,n?Q:j)}))}return o.finish()}},{decorations:e=>e.decorations});function G(e){return t=>{let i=t.state.field(N,!1);return i&&i.query.spec.valid?e(t,i):oe(t)}}const _=G(((e,{query:t})=>{let{to:i}=e.state.selection.main,o=t.nextMatch(e.state,i,i);if(!o)return!1;let n=r.jT.single(o.from,o.to),s=e.state.facet(T);return e.dispatch({selection:n,effects:[he(e,o),s.scrollToMatch(n.main,e)],userEvent:"select.search"}),ie(e),!0})),U=G(((e,{query:t})=>{let{state:i}=e,{from:o}=i.selection.main,n=t.prevMatch(i,o,o);if(!n)return!1;let s=r.jT.single(n.from,n.to),a=e.state.facet(T);return e.dispatch({selection:s,effects:[he(e,n),a.scrollToMatch(s.main,e)],userEvent:"select.search"}),ie(e),!0})),V=G(((e,{query:t})=>{let i=t.matchAll(e.state,1e3);return!(!i||!i.length)&&(e.dispatch({selection:r.jT.create(i.map((e=>r.jT.range(e.from,e.to)))),userEvent:"select.search.matches"}),!0)})),Z=G(((e,{query:t})=>{let{state:i}=e,{from:o,to:n}=i.selection.main;if(i.readOnly)return!1;let s=t.nextMatch(i,o,o);if(!s)return!1;let l,c,h=[],d=[];if(s.from==o&&s.to==n&&(c=i.toText(t.getReplacement(s)),h.push({from:s.from,to:s.to,insert:c}),s=t.nextMatch(i,s.from,s.to),d.push(a.tk.announce.of(i.phrase("replaced match on line $",i.doc.lineAt(o).number)+"."))),s){let t=0==h.length||h[0].from>=s.to?0:s.to-s.from-c.length;l=r.jT.single(s.from-t,s.to-t),d.push(he(e,s)),d.push(i.facet(T).scrollToMatch(l.main,e))}return e.dispatch({changes:h,selection:l,effects:d,userEvent:"input.replace"}),!0})),Y=G(((e,{query:t})=>{if(e.state.readOnly)return!1;let i=t.matchAll(e.state,1e9).map((e=>{let{from:i,to:o}=e;return{from:i,to:o,insert:t.getReplacement(e)}}));if(!i.length)return!1;let o=e.state.phrase("replaced $ matches",i.length)+".";return e.dispatch({changes:i,effects:a.tk.announce.of(o),userEvent:"input.replace.all"}),!0}));function X(e){return e.state.facet(T).createPanel(e)}function ee(e,t){var i,o,n,s;let r=e.selection.main,a=r.empty||r.to>r.from+100?"":e.sliceDoc(r.from,r.to);if(t&&!a)return t;let l=e.facet(T);return new R({search:(null!==(i=null==t?void 0:t.literal)&&void 0!==i?i:l.literal)?a:a.replace(/\n/g,"\\n"),caseSensitive:null!==(o=null==t?void 0:t.caseSensitive)&&void 0!==o?o:l.caseSensitive,literal:null!==(n=null==t?void 0:t.literal)&&void 0!==n?n:l.literal,wholeWord:null!==(s=null==t?void 0:t.wholeWord)&&void 0!==s?s:l.wholeWord})}function te(e){let t=(0,a.Sd)(e,X);return t&&t.dom.querySelector("[main-field]")}function ie(e){let t=te(e);t&&t==e.root.activeElement&&t.select()}const oe=e=>{let t=e.state.field(N,!1);if(t&&t.panel){let i=te(e);if(i&&i!=e.root.activeElement){let o=ee(e.state,t.query.spec);o.valid&&e.dispatch({effects:$.of(o)}),i.focus(),i.select()}}else e.dispatch({effects:[H.of(!0),t?$.of(ee(e.state,t.query.spec)):r.Py.appendConfig.of(ue)]});return!0},ne=e=>{let t=e.state.field(N,!1);if(!t||!t.panel)return!1;let i=(0,a.Sd)(e,X);return i&&i.dom.contains(e.root.activeElement)&&e.focus(),e.dispatch({effects:H.of(!1)}),!0},se=[{key:"Mod-f",run:oe,scope:"editor search-panel"},{key:"F3",run:_,shift:U,scope:"editor search-panel",preventDefault:!0},{key:"Mod-g",run:_,shift:U,scope:"editor search-panel",preventDefault:!0},{key:"Escape",run:ne,scope:"editor search-panel"},{key:"Mod-Shift-l",run:({state:e,dispatch:t})=>{let i=e.selection;if(i.ranges.length>1||i.main.empty)return!1;let{from:o,to:n}=i.main,s=[],a=0;for(let t=new u(e.doc,e.sliceDoc(o,n));!t.next().done;){if(s.length>1e3)return!1;t.value.from==o&&(a=s.length),s.push(r.jT.range(t.value.from,t.value.to))}return t(e.update({selection:r.jT.create(s,a),userEvent:"select.search.matches"})),!0}},{key:"Alt-g",run:e=>{let t=(0,a.Sd)(e,x);if(!t){let i=[w.of(!0)];null==e.state.field(k,!1)&&i.push(r.Py.appendConfig.of([k,C])),e.dispatch({effects:i}),t=(0,a.Sd)(e,x)}return t&&t.dom.querySelector("input").focus(),!0}},{key:"Mod-d",run:({state:e,dispatch:t})=>{let{ranges:i}=e.selection;if(i.some((e=>e.from===e.to)))return(({state:e,dispatch:t})=>{let{selection:i}=e,o=r.jT.create(i.ranges.map((t=>e.wordAt(t.head)||r.jT.cursor(t.head))),i.mainIndex);return!o.eq(i)&&(t(e.update({selection:o})),!0)})({state:e,dispatch:t});let o=e.sliceDoc(i[0].from,i[0].to);if(e.selection.ranges.some((t=>e.sliceDoc(t.from,t.to)!=o)))return!1;let n=function(e,t){let{main:i,ranges:o}=e.selection,n=e.wordAt(i.head),s=n&&n.from==i.from&&n.to==i.to;for(let i=!1,n=new u(e.doc,t,o[o.length-1].to);;){if(n.next(),!n.done){if(i&&o.some((e=>e.from==n.value.from)))continue;if(s){let t=e.wordAt(n.value.from);if(!t||t.from!=n.value.from||t.to!=n.value.to)continue}return n.value}if(i)return null;n=new u(e.doc,t,0,Math.max(0,o[o.length-1].from-1)),i=!0}}(e,o);return!!n&&(t(e.update({selection:e.selection.addRange(r.jT.range(n.from,n.to),!1),effects:a.tk.scrollIntoView(n.to)})),!0)},preventDefault:!0}];class re{constructor(e){this.view=e;let t=this.query=e.state.field(N).query.spec;function i(e,t,i){return c("button",{class:"cm-button",name:e,onclick:t,type:"button"},i)}this.commit=this.commit.bind(this),this.searchField=c("input",{value:t.search,placeholder:ae(e,"Find"),"aria-label":ae(e,"Find"),class:"cm-textfield",name:"search",form:"","main-field":"true",onchange:this.commit,onkeyup:this.commit}),this.replaceField=c("input",{value:t.replace,placeholder:ae(e,"Replace"),"aria-label":ae(e,"Replace"),class:"cm-textfield",name:"replace",form:"",onchange:this.commit,onkeyup:this.commit}),this.caseField=c("input",{type:"checkbox",name:"case",form:"",checked:t.caseSensitive,onchange:this.commit}),this.reField=c("input",{type:"checkbox",name:"re",form:"",checked:t.regexp,onchange:this.commit}),this.wordField=c("input",{type:"checkbox",name:"word",form:"",checked:t.wholeWord,onchange:this.commit}),this.dom=c("div",{onkeydown:e=>this.keydown(e),class:"cm-search"},[this.searchField,i("next",(()=>_(e)),[ae(e,"next")]),i("prev",(()=>U(e)),[ae(e,"previous")]),i("select",(()=>V(e)),[ae(e,"all")]),c("label",null,[this.caseField,ae(e,"match case")]),c("label",null,[this.reField,ae(e,"regexp")]),c("label",null,[this.wordField,ae(e,"by word")]),...e.state.readOnly?[]:[c("br"),this.replaceField,i("replace",(()=>Z(e)),[ae(e,"replace")]),i("replaceAll",(()=>Y(e)),[ae(e,"replace all")])],c("button",{name:"close",onclick:()=>ne(e),"aria-label":ae(e,"close"),type:"button"},["×"])])}commit(){let e=new R({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});e.eq(this.query)||(this.query=e,this.view.dispatch({effects:$.of(e)}))}keydown(e){(0,a.$1)(this.view,e,"search-panel")?e.preventDefault():13==e.keyCode&&e.target==this.searchField?(e.preventDefault(),(e.shiftKey?U:_)(this.view)):13==e.keyCode&&e.target==this.replaceField&&(e.preventDefault(),Z(this.view))}update(e){for(let t of e.transactions)for(let e of t.effects)e.is($)&&!e.value.eq(this.query)&&this.setQuery(e.value)}setQuery(e){this.query=e,this.searchField.value=e.search,this.replaceField.value=e.replace,this.caseField.checked=e.caseSensitive,this.reField.checked=e.regexp,this.wordField.checked=e.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(T).top}}function ae(e,t){return e.state.phrase(t)}const le=30,ce=/[\s\.,:;?!]/;function he(e,{from:t,to:i}){let o=e.state.doc.lineAt(t),n=e.state.doc.lineAt(i).to,s=Math.max(o.from,t-le),r=Math.min(n,i+le),l=e.state.sliceDoc(s,r);if(s!=o.from)for(let e=0;e<le;e++)if(!ce.test(l[e+1])&&ce.test(l[e])){l=l.slice(e);break}if(r!=n)for(let e=l.length-1;e>l.length-le;e--)if(!ce.test(l[e-1])&&ce.test(l[e])){l=l.slice(0,e);break}return a.tk.announce.of(`${e.state.phrase("current match")}. ${l} ${e.state.phrase("on line")} ${o.number}.`)}const de=a.tk.baseTheme({".cm-panel.cm-search":{padding:"2px 6px 4px",position:"relative","& [name=close]":{position:"absolute",top:"0",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",padding:0,margin:0},"& input, & button, & label":{margin:".2em .6em .2em 0"},"& input[type=checkbox]":{marginRight:".2em"},"& label":{fontSize:"80%",whiteSpace:"pre"}},"&light .cm-searchMatch":{backgroundColor:"#ffff0054"},"&dark .cm-searchMatch":{backgroundColor:"#00ffff8a"},"&light .cm-searchMatch-selected":{backgroundColor:"#ff6a0054"},"&dark .cm-searchMatch-selected":{backgroundColor:"#ff00ff8a"}}),ue=[N,r.Wl.lowest(K),de];var fe=i(34790),me=i(59119);class pe{constructor(e,t,i){this.from=e,this.to=t,this.diagnostic=i}}class ge{constructor(e,t,i){this.diagnostics=e,this.panel=t,this.selected=i}static init(e,t,i){let o=e,n=i.facet(De).markerFilter;n&&(o=n(o));let s=a.p.set(o.map((e=>e.from==e.to||e.from==e.to-1&&i.doc.lineAt(e.from).to==e.from?a.p.widget({widget:new Re(e),diagnostic:e}).range(e.from):a.p.mark({attributes:{class:"cm-lintRange cm-lintRange-"+e.severity},diagnostic:e}).range(e.from,e.to))),!0);return new ge(s,t,ve(s))}}function ve(e,t=null,i=0){let o=null;return e.between(i,1e9,((e,i,{spec:n})=>{if(!t||n.diagnostic==t)return o=new pe(e,i,n.diagnostic),!1})),o}function be(e,t){return!(!e.effects.some((e=>e.is(xe)))&&!e.changes.touchesRange(t.pos))}function ye(e,t){return e.field(Ce,!1)?t:t.concat(r.Py.appendConfig.of(Be))}const xe=r.Py.define(),we=r.Py.define(),ke=r.Py.define(),Ce=r.QQ.define({create:()=>new ge(a.p.none,null,null),update(e,t){if(t.docChanged){let i=e.diagnostics.map(t.changes),o=null;if(e.selected){let n=t.changes.mapPos(e.selected.from,1);o=ve(i,e.selected.diagnostic,n)||ve(i,null,n)}e=new ge(i,e.panel,o)}for(let i of t.effects)i.is(xe)?e=ge.init(i.value,e.panel,t.state):i.is(we)?e=new ge(e.diagnostics,i.value?Fe.open:null,e.selected):i.is(ke)&&(e=new ge(e.diagnostics,e.panel,i.value));return e},provide:e=>[a.mH.from(e,(e=>e.panel)),a.tk.decorations.from(e,(e=>e.diagnostics))]});const Se=a.p.mark({class:"cm-lintRange cm-lintRange-active"});function Me(e,t,i){let{diagnostics:o}=e.state.field(Ce),n=[],s=2e8,r=0;o.between(t-(i<0?1:0),t+(i>0?1:0),((e,o,{spec:a})=>{t>=e&&t<=o&&(e==o||(t>e||i>0)&&(t<o||i<0))&&(n.push(a.diagnostic),s=Math.min(e,s),r=Math.max(o,r))}));let a=e.state.facet(De).tooltipFilter;return a&&(n=a(n)),n.length?{pos:s,end:r,above:e.state.doc.lineAt(s).to<r,create:()=>({dom:Le(e,n)})}:null}function Le(e,t){return c("ul",{class:"cm-tooltip-lint"},t.map((t=>Te(e,t,!1))))}const Ae=e=>{let t=e.state.field(Ce,!1);return!(!t||!t.panel)&&(e.dispatch({effects:we.of(!1)}),!0)},We=[{key:"Mod-Shift-m",run:e=>{let t=e.state.field(Ce,!1);t&&t.panel||e.dispatch({effects:ye(e.state,[we.of(!0)])});let i=(0,a.Sd)(e,Fe.open);return i&&i.dom.querySelector(".cm-panel-lint ul").focus(),!0},preventDefault:!0},{key:"F8",run:e=>{let t=e.state.field(Ce,!1);if(!t)return!1;let i=e.state.selection.main,o=t.diagnostics.iter(i.to+1);return!(!o.value&&(o=t.diagnostics.iter(0),!o.value||o.from==i.from&&o.to==i.to))&&(e.dispatch({selection:{anchor:o.from,head:o.to},scrollIntoView:!0}),!0)}}],De=r.r$.define({combine:e=>Object.assign({sources:e.map((e=>e.source))},(0,r.BO)(e.map((e=>e.config)),{delay:750,markerFilter:null,tooltipFilter:null,needsRefresh:null},{needsRefresh:(e,t)=>e?t?i=>e(i)||t(i):e:t}))});function Je(e){let t=[];if(e)e:for(let{name:i}of e){for(let e=0;e<i.length;e++){let o=i[e];if(/[a-zA-Z]/.test(o)&&!t.some((e=>e.toLowerCase()==o.toLowerCase()))){t.push(o);continue e}}t.push("")}return t}function Te(e,t,i){var o;let n=i?Je(t.actions):[];return c("li",{class:"cm-diagnostic cm-diagnostic-"+t.severity},c("span",{class:"cm-diagnosticText"},t.renderMessage?t.renderMessage():t.message),null===(o=t.actions)||void 0===o?void 0:o.map(((i,o)=>{let s=!1,r=o=>{if(o.preventDefault(),s)return;s=!0;let n=ve(e.state.field(Ce).diagnostics,t);n&&i.apply(e,n.from,n.to)},{name:a}=i,l=n[o]?a.indexOf(n[o]):-1,h=l<0?a:[a.slice(0,l),c("u",a.slice(l,l+1)),a.slice(l+1)];return c("button",{type:"button",class:"cm-diagnosticAction",onclick:r,onmousedown:r,"aria-label":` Action: ${a}${l<0?"":` (access key "${n[o]})"`}.`},h)})),t.source&&c("div",{class:"cm-diagnosticSource"},t.source))}class Re extends a.l9{constructor(e){super(),this.diagnostic=e}eq(e){return e.diagnostic==this.diagnostic}toDOM(){return c("span",{class:"cm-lintPoint cm-lintPoint-"+this.diagnostic.severity})}}class qe{constructor(e,t){this.diagnostic=t,this.id="item_"+Math.floor(4294967295*Math.random()).toString(16),this.dom=Te(e,t,!0),this.dom.id=this.id,this.dom.setAttribute("role","option")}}class Fe{constructor(e){this.view=e,this.items=[];this.list=c("ul",{tabIndex:0,role:"listbox","aria-label":this.view.state.phrase("Diagnostics"),onkeydown:t=>{if(27==t.keyCode)Ae(this.view),this.view.focus();else if(38==t.keyCode||33==t.keyCode)this.moveSelection((this.selectedIndex-1+this.items.length)%this.items.length);else if(40==t.keyCode||34==t.keyCode)this.moveSelection((this.selectedIndex+1)%this.items.length);else if(36==t.keyCode)this.moveSelection(0);else if(35==t.keyCode)this.moveSelection(this.items.length-1);else if(13==t.keyCode)this.view.focus();else{if(!(t.keyCode>=65&&t.keyCode<=90&&this.selectedIndex>=0))return;{let{diagnostic:i}=this.items[this.selectedIndex],o=Je(i.actions);for(let n=0;n<o.length;n++)if(o[n].toUpperCase().charCodeAt(0)==t.keyCode){let t=ve(this.view.state.field(Ce).diagnostics,i);t&&i.actions[n].apply(e,t.from,t.to)}}}t.preventDefault()},onclick:e=>{for(let t=0;t<this.items.length;t++)this.items[t].dom.contains(e.target)&&this.moveSelection(t)}}),this.dom=c("div",{class:"cm-panel-lint"},this.list,c("button",{type:"button",name:"close","aria-label":this.view.state.phrase("close"),onclick:()=>Ae(this.view)},"×")),this.update()}get selectedIndex(){let e=this.view.state.field(Ce).selected;if(!e)return-1;for(let t=0;t<this.items.length;t++)if(this.items[t].diagnostic==e.diagnostic)return t;return-1}update(){let{diagnostics:e,selected:t}=this.view.state.field(Ce),i=0,o=!1,n=null;for(e.between(0,this.view.state.doc.length,((e,s,{spec:r})=>{let a,l=-1;for(let e=i;e<this.items.length;e++)if(this.items[e].diagnostic==r.diagnostic){l=e;break}l<0?(a=new qe(this.view,r.diagnostic),this.items.splice(i,0,a),o=!0):(a=this.items[l],l>i&&(this.items.splice(i,l-i),o=!0)),t&&a.diagnostic==t.diagnostic?a.dom.hasAttribute("aria-selected")||(a.dom.setAttribute("aria-selected","true"),n=a):a.dom.hasAttribute("aria-selected")&&a.dom.removeAttribute("aria-selected"),i++}));i<this.items.length&&!(1==this.items.length&&this.items[0].diagnostic.from<0);)o=!0,this.items.pop();0==this.items.length&&(this.items.push(new qe(this.view,{from:-1,to:-1,severity:"info",message:this.view.state.phrase("No diagnostics")})),o=!0),n?(this.list.setAttribute("aria-activedescendant",n.id),this.view.requestMeasure({key:this,read:()=>({sel:n.dom.getBoundingClientRect(),panel:this.list.getBoundingClientRect()}),write:({sel:e,panel:t})=>{e.top<t.top?this.list.scrollTop-=t.top-e.top:e.bottom>t.bottom&&(this.list.scrollTop+=e.bottom-t.bottom)}})):this.selectedIndex<0&&this.list.removeAttribute("aria-activedescendant"),o&&this.sync()}sync(){let e=this.list.firstChild;function t(){let t=e;e=t.nextSibling,t.remove()}for(let i of this.items)if(i.dom.parentNode==this.list){for(;e!=i.dom;)t();e=i.dom.nextSibling}else this.list.insertBefore(i.dom,e);for(;e;)t()}moveSelection(e){if(this.selectedIndex<0)return;let t=ve(this.view.state.field(Ce).diagnostics,this.items[e].diagnostic);t&&this.view.dispatch({selection:{anchor:t.from,head:t.to},scrollIntoView:!0,effects:ke.of(t)})}static open(e){return new Fe(e)}}function Ee(e,t='viewBox="0 0 40 40"'){return`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${t}>${encodeURIComponent(e)}</svg>')`}function Pe(e){return Ee(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${e}" fill="none" stroke-width=".7"/>`,'width="6" height="3"')}const Ie=a.tk.baseTheme({".cm-diagnostic":{padding:"3px 6px 3px 8px",marginLeft:"-1px",display:"block",whiteSpace:"pre-wrap"},".cm-diagnostic-error":{borderLeft:"5px solid #d11"},".cm-diagnostic-warning":{borderLeft:"5px solid orange"},".cm-diagnostic-info":{borderLeft:"5px solid #999"},".cm-diagnosticAction":{font:"inherit",border:"none",padding:"2px 4px",backgroundColor:"#444",color:"white",borderRadius:"3px",marginLeft:"8px",cursor:"pointer"},".cm-diagnosticSource":{fontSize:"70%",opacity:.7},".cm-lintRange":{backgroundPosition:"left bottom",backgroundRepeat:"repeat-x",paddingBottom:"0.7px"},".cm-lintRange-error":{backgroundImage:Pe("#d11")},".cm-lintRange-warning":{backgroundImage:Pe("orange")},".cm-lintRange-info":{backgroundImage:Pe("#999")},".cm-lintRange-active":{backgroundColor:"#ffdd9980"},".cm-tooltip-lint":{padding:0,margin:0},".cm-lintPoint":{position:"relative","&:after":{content:'""',position:"absolute",bottom:0,left:"-2px",borderLeft:"3px solid transparent",borderRight:"3px solid transparent",borderBottom:"4px solid #d11"}},".cm-lintPoint-warning":{"&:after":{borderBottomColor:"orange"}},".cm-lintPoint-info":{"&:after":{borderBottomColor:"#999"}},".cm-panel.cm-panel-lint":{position:"relative","& ul":{maxHeight:"100px",overflowY:"auto","& [aria-selected]":{backgroundColor:"#ddd","& u":{textDecoration:"underline"}},"&:focus [aria-selected]":{background_fallback:"#bdf",backgroundColor:"Highlight",color_fallback:"white",color:"HighlightText"},"& u":{textDecoration:"none"},padding:0,margin:0},"& [name=close]":{position:"absolute",top:"0",right:"2px",background:"inherit",border:"none",font:"inherit",padding:0,margin:0}}});class Oe extends a.SJ{constructor(e){super(),this.diagnostics=e,this.severity=e.reduce(((e,t)=>{let i=t.severity;return"error"==i||"warning"==i&&"info"==e?i:e}),"info")}toDOM(e){let t=document.createElement("div");t.className="cm-lint-marker cm-lint-marker-"+this.severity;let i=this.diagnostics,o=e.state.facet(lintGutterConfig).tooltipFilter;return o&&o(i),i.length&&(t.onmouseover=()=>function(e,t,i){function o(){let o=e.elementAtHeight(t.getBoundingClientRect().top+5-e.documentTop);e.coordsAtPos(o.from)&&e.dispatch({effects:setLintGutterTooltip.of({pos:o.from,above:!1,create:()=>({dom:Le(e,i),getCoords:()=>t.getBoundingClientRect()})})}),t.onmouseout=t.onmousemove=null,function(e,t){let i=o=>{let n=t.getBoundingClientRect();if(!(o.clientX>n.left-10&&o.clientX<n.right+10&&o.clientY>n.top-10&&o.clientY<n.bottom+10)){for(let e=o.target;e;e.parentNode)if(1==e.nodeType&&e.classList.contains("cm-tooltip-lint"))return;window.removeEventListener("mousemove",i),e.state.field(lintGutterTooltip)&&e.dispatch({effects:setLintGutterTooltip.of(null)})}};window.addEventListener("mousemove",i)}(e,t)}let{hoverTime:n}=e.state.facet(lintGutterConfig),s=setTimeout(o,n);t.onmouseout=()=>{clearTimeout(s),t.onmouseout=t.onmousemove=null},t.onmousemove=()=>{clearTimeout(s),setTimeout(o,n)}}(e,t,i)),t}}const Be=[Ce,a.tk.decorations.compute([Ce],(e=>{let{selected:t,panel:i}=e.field(Ce);return t&&i&&t.from!=t.to?a.p.set([Se.range(t.from,t.to)]):a.p.none})),(0,a.bF)(Me,{hideOn:be}),Ie];var $e=function(e){void 0===e&&(e={});var t=[];!1!==e.closeBracketsKeymap&&(t=t.concat(fe.GA)),!1!==e.defaultKeymap&&(t=t.concat(l.wQ)),!1!==e.searchKeymap&&(t=t.concat(se)),!1!==e.historyKeymap&&(t=t.concat(l.f$)),!1!==e.foldKeymap&&(t=t.concat(me.e7)),!1!==e.completionKeymap&&(t=t.concat(fe.B1)),!1!==e.lintKeymap&&(t=t.concat(We));var i=[];return!1!==e.lineNumbers&&i.push((0,a.Eu)()),!1!==e.highlightActiveLineGutter&&i.push((0,a.HQ)()),!1!==e.highlightSpecialChars&&i.push((0,a.AE)()),!1!==e.history&&i.push((0,l.m8)()),!1!==e.foldGutter&&i.push((0,me.mi)()),!1!==e.drawSelection&&i.push((0,a.Uw)()),!1!==e.dropCursor&&i.push((0,a.qr)()),!1!==e.allowMultipleSelections&&i.push(r.yy.allowMultipleSelections.of(!0)),!1!==e.indentOnInput&&i.push((0,me.nY)()),!1!==e.syntaxHighlighting&&i.push((0,me.nF)(me.R_,{fallback:!0})),!1!==e.bracketMatching&&i.push((0,me.n$)()),!1!==e.closeBrackets&&i.push((0,fe.vQ)()),!1!==e.autocompletion&&i.push((0,fe.ys)()),!1!==e.rectangularSelection&&i.push((0,a.Zs)()),!1!==e.crosshairCursor&&i.push((0,a.S2)()),!1!==e.highlightActiveLine&&i.push((0,a.ZO)()),!1!==e.highlightSelectionMatches&&i.push(function(e){let t=[J,D];return e&&t.push(M.of(e)),t}()),e.tabSize&&"number"==typeof e.tabSize&&i.push(me.c.of(" ".repeat(e.tabSize))),i.concat([a.$f.of(t.flat())]).filter(Boolean)},He=function(e){void 0===e&&(e={});var t=[];!1!==e.defaultKeymap&&(t=t.concat(l.wQ)),!1!==e.historyKeymap&&(t=t.concat(l.f$));var i=[];return!1!==e.highlightSpecialChars&&i.push((0,a.AE)()),!1!==e.history&&i.push((0,l.m8)()),!1!==e.drawSelection&&i.push((0,a.Uw)()),!1!==e.syntaxHighlighting&&i.push((0,me.nF)(me.R_,{fallback:!0})),i.concat([a.$f.of(t.flat())]).filter(Boolean)},Ne=i(35524);const ze="#e5c07b",je="#e06c75",Qe="#56b6c2",Ke="#ffffff",Ge="#abb2bf",_e="#7d8799",Ue="#61afef",Ve="#98c379",Ze="#d19a66",Ye="#c678dd",Xe="#21252b",et="#2c313a",tt="#282c34",it="#353a42",ot="#3E4451",nt="#528bff",st=a.tk.theme({"&":{color:Ge,backgroundColor:tt},".cm-content":{caretColor:nt},".cm-cursor, .cm-dropCursor":{borderLeftColor:nt},"&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":{backgroundColor:ot},".cm-panels":{backgroundColor:Xe,color:Ge},".cm-panels.cm-panels-top":{borderBottom:"2px solid black"},".cm-panels.cm-panels-bottom":{borderTop:"2px solid black"},".cm-searchMatch":{backgroundColor:"#72a1ff59",outline:"1px solid #457dff"},".cm-searchMatch.cm-searchMatch-selected":{backgroundColor:"#6199ff2f"},".cm-activeLine":{backgroundColor:"#6699ff0b"},".cm-selectionMatch":{backgroundColor:"#aafe661a"},"&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bad0f847"},".cm-gutters":{backgroundColor:tt,color:_e,border:"none"},".cm-activeLineGutter":{backgroundColor:et},".cm-foldPlaceholder":{backgroundColor:"transparent",border:"none",color:"#ddd"},".cm-tooltip":{border:"none",backgroundColor:it},".cm-tooltip .cm-tooltip-arrow:before":{borderTopColor:"transparent",borderBottomColor:"transparent"},".cm-tooltip .cm-tooltip-arrow:after":{borderTopColor:it,borderBottomColor:it},".cm-tooltip-autocomplete":{"& > ul > li[aria-selected]":{backgroundColor:et,color:Ge}}},{dark:!0}),rt=me.Qf.define([{tag:Ne.pJ.keyword,color:Ye},{tag:[Ne.pJ.name,Ne.pJ.deleted,Ne.pJ.character,Ne.pJ.propertyName,Ne.pJ.macroName],color:je},{tag:[Ne.pJ.function(Ne.pJ.variableName),Ne.pJ.labelName],color:Ue},{tag:[Ne.pJ.color,Ne.pJ.constant(Ne.pJ.name),Ne.pJ.standard(Ne.pJ.name)],color:Ze},{tag:[Ne.pJ.definition(Ne.pJ.name),Ne.pJ.separator],color:Ge},{tag:[Ne.pJ.typeName,Ne.pJ.className,Ne.pJ.number,Ne.pJ.changed,Ne.pJ.annotation,Ne.pJ.modifier,Ne.pJ.self,Ne.pJ.namespace],color:ze},{tag:[Ne.pJ.operator,Ne.pJ.operatorKeyword,Ne.pJ.url,Ne.pJ.escape,Ne.pJ.regexp,Ne.pJ.link,Ne.pJ.special(Ne.pJ.string)],color:Qe},{tag:[Ne.pJ.meta,Ne.pJ.comment],color:_e},{tag:Ne.pJ.strong,fontWeight:"bold"},{tag:Ne.pJ.emphasis,fontStyle:"italic"},{tag:Ne.pJ.strikethrough,textDecoration:"line-through"},{tag:Ne.pJ.link,color:_e,textDecoration:"underline"},{tag:Ne.pJ.heading,fontWeight:"bold",color:je},{tag:[Ne.pJ.atom,Ne.pJ.bool,Ne.pJ.special(Ne.pJ.variableName)],color:Ze},{tag:[Ne.pJ.processingInstruction,Ne.pJ.string,Ne.pJ.inserted],color:Ve},{tag:Ne.pJ.invalid,color:Ke}]),at=[st,(0,me.nF)(rt)];var lt=function(e){void 0===e&&(e={});var{indentWithTab:t=!0,editable:i=!0,readOnly:o=!1,theme:n="light",placeholder:s="",basicSetup:c=!0}=e,h=[],d=a.tk.theme({"&":{backgroundColor:"#fff"}},{dark:!1});switch(t&&h.unshift(a.$f.of([l.oc])),c&&("boolean"==typeof c?h.unshift($e()):h.unshift($e(c))),s&&h.unshift((0,a.W$)(s)),n){case"light":h.push(d);break;case"dark":h.push(at);break;case"none":break;default:h.push(n)}return!1===i&&h.push(a.tk.editable.of(!1)),o&&h.push(r.yy.readOnly.of(!0)),[...h]},ct=e=>({line:e.state.doc.lineAt(e.state.selection.main.from),lineCount:e.state.doc.lines,lineBreak:e.state.lineBreak,length:e.state.doc.length,readOnly:e.state.readOnly,tabSize:e.state.tabSize,selection:e.state.selection,selectionAsSingle:e.state.selection.asSingle().main,ranges:e.state.selection.ranges,selectionCode:e.state.sliceDoc(e.state.selection.main.from,e.state.selection.main.to),selections:e.state.selection.ranges.map((t=>e.state.sliceDoc(t.from,t.to))),selectedText:e.state.selection.ranges.some((e=>!e.empty))}),ht=r.q6.define();function dt(e){var{value:t,selection:i,onChange:o,onStatistics:n,onCreateEditor:l,onUpdate:c,extensions:h=[],autoFocus:d,theme:u="light",height:f="",minHeight:m="",maxHeight:p="",placeholder:g="",width:v="",minWidth:b="",maxWidth:y="",editable:x=!0,readOnly:w=!1,indentWithTab:k=!0,basicSetup:C=!0,root:S,initialState:M}=e,[L,A]=(0,s.useState)(),[W,D]=(0,s.useState)(),[J,T]=(0,s.useState)(),R=a.tk.theme({"&":{height:f,minHeight:m,maxHeight:p,width:v,minWidth:b,maxWidth:y}}),q=[a.tk.updateListener.of((e=>{if(e.docChanged&&"function"==typeof o&&!e.transactions.some((e=>e.annotation(ht)))){var t=e.state.doc.toString();o(t,e)}n&&n(ct(e))})),R,...lt({theme:u,editable:x,readOnly:w,placeholder:g,indentWithTab:k,basicSetup:C})];return c&&"function"==typeof c&&q.push(a.tk.updateListener.of(c)),q=q.concat(h),(0,s.useEffect)((()=>{if(L&&!J){var e={doc:t,selection:i,extensions:q},o=M?r.yy.fromJSON(M.json,e,M.fields):r.yy.create(e);if(T(o),!W){var n=new a.tk({state:o,parent:L,root:S});D(n),l&&l(n,o)}}return()=>{W&&(T(void 0),D(void 0))}}),[L,J]),(0,s.useEffect)((()=>A(e.container)),[e.container]),(0,s.useEffect)((()=>()=>{W&&(W.destroy(),D(void 0))}),[W]),(0,s.useEffect)((()=>{d&&W&&W.focus()}),[d,W]),(0,s.useEffect)((()=>{W&&W.dispatch({effects:r.Py.reconfigure.of(q)})}),[u,h,f,m,p,v,b,y,g,x,w,k,C,o,c]),(0,s.useEffect)((()=>{if(void 0!==t){var e=W?W.state.doc.toString():"";W&&t!==e&&W.dispatch({changes:{from:0,to:e.length,insert:t||""},annotations:[ht.of(!0)]})}}),[t,W]),{state:J,setState:T,view:W,setView:D,container:L,setContainer:A}}var ut=i(85893),ft=["className","value","selection","extensions","onChange","onStatistics","onCreateEditor","onUpdate","autoFocus","theme","height","minHeight","maxHeight","width","minWidth","maxWidth","basicSetup","placeholder","indentWithTab","editable","readOnly","root","initialState"],mt=(0,s.forwardRef)(((e,t)=>{var{className:i,value:r="",selection:a,extensions:l=[],onChange:c,onStatistics:h,onCreateEditor:d,onUpdate:u,autoFocus:f,theme:m="light",height:p,minHeight:g,maxHeight:v,width:b,minWidth:y,maxWidth:x,basicSetup:w,placeholder:k,indentWithTab:C,editable:S,readOnly:M,root:L,initialState:A}=e,W=(0,n.Z)(e,ft),D=(0,s.useRef)(null),{state:J,view:T,container:R}=dt({container:D.current,root:L,value:r,autoFocus:f,theme:m,height:p,minHeight:g,maxHeight:v,width:b,minWidth:y,maxWidth:x,basicSetup:w,placeholder:k,indentWithTab:C,editable:S,readOnly:M,selection:a,onChange:c,onStatistics:h,onCreateEditor:d,onUpdate:u,extensions:l,initialState:A});if((0,s.useImperativeHandle)(t,(()=>({editor:D.current,state:J,view:T})),[D,R,J,T]),"string"!=typeof r)throw new Error("value must be typeof string but got "+typeof r);var q="string"==typeof m?"cm-theme-"+m:"cm-theme";return(0,ut.jsx)("div",(0,o.Z)({ref:D,className:q+(i?" "+i:"")},W))}));mt.displayName="CodeMirror";const pt=mt}}]);