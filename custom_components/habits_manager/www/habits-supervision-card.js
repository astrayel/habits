function e(e,t,s,i){var r,o=arguments.length,a=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,s,i);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(a=(o<3?r(a):o>3?r(t,s,a):r(t,s))||a);return o>3&&a&&Object.defineProperty(t,s,a),a}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let o=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(t,e))}return e}toString(){return this.cssText}};const a=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new o(s,e,i)},n=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",b=g.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},_=(e,t)=>!l(e,t),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const o=i?.call(this);r?.call(this,t),this.requestUpdate(e,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(s)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=s.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(t,s.type);this._$Em=e,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=i;const o=r.fromAttribute(t,e.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(e,t,s){if(void 0!==e){const i=this.constructor,r=this[e];if(s??=i.getPropertyOptions(e),!((s.hasChanged??_)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==r||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,b?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.1");const $=globalThis,k=$.trustedTypes,C=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+S,T=`<${E}>`,I=document,P=()=>I.createComment(""),z=e=>null===e||"object"!=typeof e&&"function"!=typeof e,R=Array.isArray,H="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,N=/>/g,O=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,M=/"/g,L=/^(?:script|style|textarea|title)$/i,V=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),B=new WeakMap,W=I.createTreeWalker(I,129);function Y(e,t){if(!R(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}const Z=(e,t)=>{const s=e.length-1,i=[];let r,o=2===t?"<svg>":3===t?"<math>":"",a=D;for(let t=0;t<s;t++){const s=e[t];let n,l,c=-1,d=0;for(;d<s.length&&(a.lastIndex=d,l=a.exec(s),null!==l);)d=a.lastIndex,a===D?"!--"===l[1]?a=U:void 0!==l[1]?a=N:void 0!==l[2]?(L.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=O):void 0!==l[3]&&(a=O):a===O?">"===l[0]?(a=r??D,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,n=l[1],a=void 0===l[3]?O:'"'===l[3]?M:j):a===M||a===j?a=O:a===U||a===N?a=D:(a=O,r=void 0);const h=a===O&&e[t+1].startsWith("/>")?" ":"";o+=a===D?s+T:c>=0?(i.push(n),s.slice(0,c)+A+s.slice(c)+S+h):s+S+(-2===c?t:h)}return[Y(e,o+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class J{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,o=0;const a=e.length-1,n=this.parts,[l,c]=Z(e,t);if(this.el=J.createElement(l,s),W.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=W.nextNode())&&n.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(A)){const t=c[o++],s=i.getAttribute(e).split(S),a=/([.?@])?(.*)/.exec(t);n.push({type:1,index:r,name:a[2],strings:s,ctor:"."===a[1]?ee:"?"===a[1]?te:"@"===a[1]?se:Q}),i.removeAttribute(e)}else e.startsWith(S)&&(n.push({type:6,index:r}),i.removeAttribute(e));if(L.test(i.tagName)){const e=i.textContent.split(S),t=e.length-1;if(t>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],P()),W.nextNode(),n.push({type:2,index:++r});i.append(e[t],P())}}}else if(8===i.nodeType)if(i.data===E)n.push({type:2,index:r});else{let e=-1;for(;-1!==(e=i.data.indexOf(S,e+1));)n.push({type:7,index:r}),e+=S.length-1}r++}}static createElement(e,t){const s=I.createElement("template");return s.innerHTML=e,s}}function X(e,t,s=e,i){if(t===q)return t;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const o=z(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(e),r._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(t=X(e,r._$AS(e,t.values),r,i)),t}class K{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??I).importNode(t,!0);W.currentNode=i;let r=W.nextNode(),o=0,a=0,n=s[0];for(;void 0!==n;){if(o===n.index){let t;2===n.type?t=new G(r,r.nextSibling,this,e):1===n.type?t=new n.ctor(r,n.name,n.strings,this,e):6===n.type&&(t=new ie(r,this,e)),this._$AV.push(t),n=s[++a]}o!==n?.index&&(r=W.nextNode(),o++)}return W.currentNode=I,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class G{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),z(e)?e===F||null==e||""===e?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>R(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==F&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=J.createElement(Y(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new K(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=B.get(e.strings);return void 0===t&&B.set(e.strings,t=new J(e)),t}k(e){R(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const r of e)i===t.length?t.push(s=new G(this.O(P()),this.O(P()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=F}_$AI(e,t=this,s,i){const r=this.strings;let o=!1;if(void 0===r)e=X(this,e,t,0),o=!z(e)||e!==this._$AH&&e!==q,o&&(this._$AH=e);else{const i=e;let a,n;for(e=r[0],a=0;a<r.length-1;a++)n=X(this,i[s+a],t,a),n===q&&(n=this._$AH[a]),o||=!z(n)||n!==this._$AH[a],n===F?e=F:e!==F&&(e+=(n??"")+r[a+1]),this._$AH[a]=n}o&&!i&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Q{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}}class te extends Q{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==F)}}class se extends Q{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??F)===q)return;const s=this._$AH,i=e===F&&s!==F||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==F&&(s===F||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(J,G),($.litHtmlVersions??=[]).push("3.3.1");const oe=globalThis;class ae extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let r=i._$litPart$;if(void 0===r){const e=s?.renderBefore??null;i._$litPart$=r=new G(t.insertBefore(P(),e),e,void 0,s??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ae._$litElement$=!0,ae.finalized=!0,oe.litElementHydrateSupport?.({LitElement:ae});const ne=oe.litElementPolyfillSupport;ne?.({LitElement:ae}),(oe.litElementVersions??=[]).push("4.2.1");const le={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:_},ce=(e=le,t,s)=>{const{kind:i,metadata:r}=s;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),o.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const r=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,r,e)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];t.call(this,s),this.requestUpdate(i,r,e)}}throw Error("Unsupported decorator location: "+i)};function de(e){return(t,s)=>"object"==typeof s?ce(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function he(e){return de({...e,state:!0,attribute:!1})}const pe="habits_manager",ue="create_child",ge="update_child",me="delete_child",fe="create_task",be="update_task",ve="delete_task",ye="mark_task_completed",_e="validate_task",xe="refuse_task",we="validate_penalty",$e="create_habit",ke="update_habit",Ce="delete_habit",Ae="complete_habit",Se="create_reward",Ee="claim_reward",Te="approve_claim",Ie="create_cosmetic",Pe="purchase_cosmetic",ze="list_children",Re="list_tasks",He="list_habits",De="list_rewards",Ue="list_cosmetics",Ne="2025-11-07T19:30:00Z";class Oe{constructor(e){this.hass=e,console.log(`%c[Habits Manager API v${Ne}]`,"color: #03a9f4; font-weight: bold","Initialized with WebSocket API for return_response")}async callService(e,t={}){return console.log(`[API] callService: ${pe}.${e}`,t),this.hass.callService(pe,e,t)}async callServiceWithResponse(e,t={}){const s={type:"call_service",domain:pe,service:e,service_data:t,return_response:!0};console.log(`%c[API] callServiceWithResponse: ${pe}.${e}`,"color: #4caf50; font-weight: bold"),console.log("[API] WebSocket message:",JSON.stringify(s,null,2));try{const t=await this.hass.connection.sendMessagePromise(s);return console.log(`%c[API] ✓ Response received for ${e}:`,"color: #4caf50",t),t}catch(t){throw console.error(`%c[API] ✗ Error calling ${e}:`,"color: #f44336; font-weight: bold",t),t}}async createChild(e){return this.callService(ue,e)}async updateChild(e,t){return this.callService(ge,{child_id:e,...t})}async deleteChild(e){return this.callService(me,{child_id:e})}async createTask(e){return this.callService(fe,e)}async updateTask(e,t){return this.callService(be,{task_id:e,...t})}async deleteTask(e){return this.callService(ve,{task_id:e})}async markTaskCompleted(e,t){return this.callService(ye,{instance_id:e,child_id:t})}async validateTask(e,t,s){return this.callService(_e,{instance_id:e,validator_id:t,note:s})}async refuseTask(e,t,s=!1,i){return this.callService(xe,{instance_id:e,validator_id:t,apply_penalty:s,note:i})}async validatePenalty(e,t){return this.callService(we,{instance_id:e,validator_id:t})}async createHabit(e){return this.callService($e,e)}async updateHabit(e,t){return this.callService(ke,{habit_id:e,...t})}async deleteHabit(e){return this.callService(Ce,{habit_id:e})}async completeHabit(e,t){return this.callService(Ae,{habit_id:e,child_id:t})}async createReward(e){return this.callService(Se,e)}async claimReward(e,t){return this.callService(Ee,{reward_id:e,child_id:t})}async approveClaim(e,t){return this.callService(Te,{claim_id:e,approver_id:t})}async createCosmetic(e){return this.callService(Ie,e)}async purchaseCosmetic(e,t){return this.callService(Pe,{cosmetic_id:e,child_id:t})}getChildren(){const e=[],t=Object.values(this.hass.states).filter(e=>e.entity_id.startsWith(`sensor.${pe}_`)&&e.entity_id.endsWith("_points"));for(const s of t){const t=s.attributes.child_id;if(t){const s=this.getChildData(t);s&&e.push(s)}}return e}getChildData(e){const t=this.hass.states[`sensor.${pe}_${e}_points`];if(!t)return null;const s=this.hass.states[`sensor.${pe}_${e}_coins`],i=this.hass.states[`sensor.${pe}_${e}_level`],r=this.hass.states[`sensor.${pe}_${e}_experience`];return{id:e,name:t.attributes.child_name||"Unknown",person_entity:t.attributes.person_entity||"",points:parseInt(t.state)||0,coins:s&&parseInt(s.state)||0,level:i&&parseInt(i.state)||1,experience:r&&parseInt(r.state)||0,experience_to_next_level:r?.attributes.experience_to_next_level||100,avatar:t.attributes.avatar||{photo_url:"",customization:{clothes:null,accessory:null,pet:null,theme:"default"}},badges:t.attributes.badges||[],owned_cosmetics:t.attributes.owned_cosmetics||[],created_at:t.attributes.created_at||(new Date).toISOString(),updated_at:t.attributes.updated_at||(new Date).toISOString()}}getTaskCounts(e){const t=this.hass.states[`sensor.${pe}_${e}_tasks_pending`],s=this.hass.states[`sensor.${pe}_${e}_tasks_completed_waiting`];return{pending:t&&parseInt(t.state)||0,waiting:s&&parseInt(s.state)||0}}getHabitStats(e){const t=this.hass.states[`sensor.${pe}_${e}_habits_count`],s=this.hass.states[`sensor.${pe}_${e}_longest_streak`];return{count:t&&parseInt(t.state)||0,longest_streak:s&&parseInt(s.state)||0}}getCosmetics(){const e=this.hass.states[`sensor.${pe}_cosmetics`];return e&&e.attributes.cosmetics?e.attributes.cosmetics:[]}async subscribeToUpdates(e){return this.hass.connection.subscribeEvents(e,`${pe}_update`)}async listChildren(){console.log("[API] Calling list_children service with return_response...");try{const e=await this.callServiceWithResponse(ze,{});return console.log(`[API] ✓ list_children responded with ${e.children?.length||0} children`),e.children||[]}catch(e){throw console.error("[API] ✗ Error calling list_children service:",e),e}}async listTasks(e){console.log("[API] Calling list_tasks service with return_response, filters:",e);try{const t=await this.callServiceWithResponse(Re,e||{});return console.log(`[API] ✓ list_tasks responded with ${t.tasks?.length||0} tasks`),t.tasks||[]}catch(e){throw console.error("[API] ✗ Error calling list_tasks service:",e),e}}async listHabits(e){console.log("[API] Calling list_habits service with return_response, filters:",e);try{const t=await this.callServiceWithResponse(He,e||{});return console.log(`[API] ✓ list_habits responded with ${t.habits?.length||0} habits`),t.habits||[]}catch(e){throw console.error("[API] ✗ Error calling list_habits service:",e),e}}async listRewards(e){console.log("[API] Calling list_rewards service with return_response, filters:",e);try{const t=await this.callServiceWithResponse(De,e||{});return console.log(`[API] ✓ list_rewards responded with ${t.rewards?.length||0} rewards`),t.rewards||[]}catch(e){throw console.error("[API] ✗ Error calling list_rewards service:",e),e}}async listCosmetics(e){console.log("[API] Calling list_cosmetics service with return_response, filters:",e);try{const t=await this.callServiceWithResponse(Ue,e||{});return console.log(`[API] ✓ list_cosmetics responded with ${t.cosmetics?.length||0} cosmetics`),t.cosmetics||[]}catch(e){throw console.error("[API] ✗ Error calling list_cosmetics service:",e),e}}}class je{constructor(e){this.listeners=new Set,this.state={children:[],tasks:[],taskInstances:[],habits:[],habitStreaks:[],rewards:[],rewardClaims:[],cosmetics:[],loading:!0,error:null},this.hass=e,this.api=new Oe(e),this.initialize()}async initialize(){console.log("[Store] Initializing Habits Manager Store...");try{const e=setTimeout(()=>{console.warn("[Store] Data loading is taking longer than expected (10s)")},1e4);await this.loadAllData(),clearTimeout(e),console.log("[Store] Subscribing to Home Assistant updates..."),this.unsubscribe=await this.api.subscribeToUpdates(e=>{console.log("[Store] Received update event:",e),this.handleUpdate(e)}),this.state.loading=!1,console.log("[Store] ✓ Store initialized successfully"),console.log("[Store] State:",{children:this.state.children.length,tasks:this.state.tasks.length,habits:this.state.habits.length,rewards:this.state.rewards.length,cosmetics:this.state.cosmetics.length}),this.notifyListeners()}catch(e){console.error("[Store] ✗ Failed to initialize store:",e),this.state.error=e instanceof Error?e.message:"Unknown error",this.state.loading=!1,this.notifyListeners()}}async loadAllData(){console.log("[Store] Loading all data from listing services...");const e=await Promise.allSettled([this.api.listChildren(),this.api.listTasks(),this.api.listHabits(),this.api.listRewards(),this.api.listCosmetics({active_only:!0})]);"fulfilled"===e[0].status?(this.state.children=e[0].value,console.log(`[Store] ✓ Loaded ${this.state.children.length} children`)):(console.error("[Store] ✗ Error loading children:",e[0].reason),console.warn("[Store]   This is normal if no children exist yet"),this.state.children=[]),"fulfilled"===e[1].status?(this.state.tasks=e[1].value,console.log(`[Store] ✓ Loaded ${this.state.tasks.length} tasks`)):(console.error("[Store] ✗ Error loading tasks:",e[1].reason),console.warn("[Store]   This is normal if no tasks exist yet"),this.state.tasks=[]),"fulfilled"===e[2].status?(this.state.habits=e[2].value,console.log(`[Store] ✓ Loaded ${this.state.habits.length} habits`)):(console.error("[Store] ✗ Error loading habits:",e[2].reason),console.warn("[Store]   This is normal if no habits exist yet"),this.state.habits=[]),"fulfilled"===e[3].status?(this.state.rewards=e[3].value,console.log(`[Store] ✓ Loaded ${this.state.rewards.length} rewards`)):(console.error("[Store] ✗ Error loading rewards:",e[3].reason),console.warn("[Store]   This is normal if no rewards exist yet"),this.state.rewards=[]),"fulfilled"===e[4].status?(this.state.cosmetics=e[4].value,console.log(`[Store] ✓ Loaded ${this.state.cosmetics.length} cosmetics`)):(console.error("[Store] ✗ Error loading cosmetics:",e[4].reason),console.warn("[Store]   This is normal if no cosmetics exist yet"),this.state.cosmetics=[]),console.log("[Store] ✓ All data loading completed")}handleUpdate(e){const{update_type:t}=e;switch(t){case"child_created":case"child_updated":case"child_deleted":case"reward_claimed":case"reward_approved":case"cosmetic_purchased":case"level_up":case"badge_earned":case"points_changed":case"coins_changed":this.state.children=this.api.getChildren();break;case"task_completed":case"task_validated":case"task_refused":case"task_failed":case"habit_completed":case"streak_increased":case"streak_broken":e.child_id&&(this.state.children=this.api.getChildren())}this.notifyListeners()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notifyListeners(){this.listeners.forEach(e=>e())}getState(){return{...this.state}}async refresh(){this.state.loading=!0,this.notifyListeners();try{await this.loadAllData(),this.state.loading=!1,this.state.error=null}catch(e){this.state.error=e instanceof Error?e.message:"Unknown error",this.state.loading=!1}this.notifyListeners()}getChildren(){return this.state.children}getChild(e){return this.state.children.find(t=>t.id===e)}async createChild(e){try{await this.api.createChild(e),await this.refresh()}catch(e){throw console.error("Failed to create child:",e),e}}async updateChild(e,t){try{await this.api.updateChild(e,t),await this.refresh()}catch(e){throw console.error("Failed to update child:",e),e}}async deleteChild(e){try{await this.api.deleteChild(e),await this.refresh()}catch(e){throw console.error("Failed to delete child:",e),e}}getTasks(){return this.state.tasks}getTask(e){return this.state.tasks.find(t=>t.id===e)}getTaskCounts(e){return this.api.getTaskCounts(e)}async createTask(e){try{await this.api.createTask(e),await this.refresh()}catch(e){throw console.error("Failed to create task:",e),e}}async updateTask(e,t){try{await this.api.updateTask(e,t),await this.refresh()}catch(e){throw console.error("Failed to update task:",e),e}}async deleteTask(e){try{await this.api.deleteTask(e),await this.refresh()}catch(e){throw console.error("Failed to delete task:",e),e}}async markTaskCompleted(e,t){try{await this.api.markTaskCompleted(e,t),await this.refresh()}catch(e){throw console.error("Failed to mark task completed:",e),e}}async validateTask(e,t,s){try{await this.api.validateTask(e,t,s),await this.refresh()}catch(e){throw console.error("Failed to validate task:",e),e}}async refuseTask(e,t,s,i){try{await this.api.refuseTask(e,t,s,i),await this.refresh()}catch(e){throw console.error("Failed to refuse task:",e),e}}getHabits(){return this.state.habits}getHabit(e){return this.state.habits.find(t=>t.id===e)}getHabitStats(e){return this.api.getHabitStats(e)}async createHabit(e){try{await this.api.createHabit(e),await this.refresh()}catch(e){throw console.error("Failed to create habit:",e),e}}async updateHabit(e,t){try{await this.api.updateHabit(e,t),await this.refresh()}catch(e){throw console.error("Failed to update habit:",e),e}}async deleteHabit(e){try{await this.api.deleteHabit(e),await this.refresh()}catch(e){throw console.error("Failed to delete habit:",e),e}}async completeHabit(e,t){try{await this.api.completeHabit(e,t),await this.refresh()}catch(e){throw console.error("Failed to complete habit:",e),e}}getRewards(){return this.state.rewards}getReward(e){return this.state.rewards.find(t=>t.id===e)}async createReward(e){try{await this.api.createReward(e),await this.refresh()}catch(e){throw console.error("Failed to create reward:",e),e}}async claimReward(e,t){try{await this.api.claimReward(e,t),await this.refresh()}catch(e){throw console.error("Failed to claim reward:",e),e}}async approveClaim(e,t){try{await this.api.approveClaim(e,t),await this.refresh()}catch(e){throw console.error("Failed to approve claim:",e),e}}getCosmetics(){return this.state.cosmetics}getOwnedCosmetics(e){const t=this.getChild(e);return t?this.state.cosmetics.filter(e=>t.owned_cosmetics.includes(e.id)):[]}getAvailableCosmetics(e){const t=this.getChild(e);return t?this.state.cosmetics.filter(e=>{if(t.owned_cosmetics.includes(e.id))return!1;if(e.unlock_requirements){const s=e.unlock_requirements;if(s.level&&t.level<s.level)return!1;if(s.badge&&!t.badges.includes(s.badge))return!1}return!0}):[]}async createCosmetic(e){try{await this.api.createCosmetic(e),await this.refresh()}catch(e){throw console.error("Failed to create cosmetic:",e),e}}async purchaseCosmetic(e,t){try{await this.api.purchaseCosmetic(e,t),await this.refresh()}catch(e){throw console.error("Failed to purchase cosmetic:",e),e}}destroy(){this.unsubscribe&&this.unsubscribe(),this.listeners.clear()}}const Me=a`
  :host {
    display: block;
    box-sizing: border-box;
  }

  * {
    box-sizing: border-box;
  }

  /* Card container */
  .card {
    padding: 16px;
    background: var(--ha-card-background, var(--card-background-color, white));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
  }

  /* Card header */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .card-title {
    font-size: 24px;
    font-weight: 500;
    color: var(--primary-text-color, #212121);
    margin: 0;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 500;
    color: var(--primary-text-color, #212121);
  }

  h1 { font-size: 24px; }
  h2 { font-size: 20px; }
  h3 { font-size: 18px; }
  h4 { font-size: 16px; }
  h5 { font-size: 14px; }
  h6 { font-size: 12px; }

  p {
    margin: 0;
    color: var(--secondary-text-color, #727272);
  }

  /* Buttons */
  .btn,
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color, #212121);
    text-decoration: none;
    outline: none;
  }

  .btn:hover,
  .button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .btn:active,
  .button:active {
    transform: translateY(0);
  }

  .btn:disabled,
  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, white);
  }

  .btn-primary:hover {
    background: var(--primary-color-dark, #0288d1);
  }

  .btn-secondary,
  .button-secondary {
    background: transparent;
    color: var(--primary-color, #03a9f4);
    border: 1px solid var(--primary-color, #03a9f4);
  }

  .btn-secondary:hover,
  .button-secondary:hover {
    background: rgba(3, 169, 244, 0.08);
  }

  .btn-success,
  .button-success {
    background: var(--success-color, #4caf50);
    color: white;
  }

  .btn-danger,
  .button-danger {
    background: var(--error-color, #f44336);
    color: white;
  }

  .btn-text {
    background: transparent;
    color: var(--primary-color, #03a9f4);
    padding: 8px 12px;
  }

  .btn-text:hover {
    background: rgba(3, 169, 244, 0.08);
    transform: none;
    box-shadow: none;
  }

  .btn-icon,
  .button-icon {
    padding: 8px;
    border-radius: 50%;
    min-width: 40px;
    min-height: 40px;
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 20px;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--secondary-text-color, #727272);
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    min-width: 100px;
    outline: none;
  }

  .tab:hover {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
    color: var(--primary-text-color, #212121);
  }

  .tab.active {
    color: var(--primary-color, #03a9f4);
    border-bottom-color: var(--primary-color, #03a9f4);
    background: transparent;
  }

  .tab-icon {
    font-size: 24px;
    line-height: 1;
  }

  .tab-label {
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
  }

  /* Section Header (used in tabs content) */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .section-header .section-title {
    margin-bottom: 0;
  }

  /* Icons */
  ha-icon {
    --mdc-icon-size: 24px;
  }

  .icon-small {
    --mdc-icon-size: 18px;
  }

  .icon-large {
    --mdc-icon-size: 32px;
  }

  /* Cards and containers */
  .section {
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--primary-text-color, #212121);
  }

  .item-card {
    padding: 12px;
    margin-bottom: 8px;
    background: var(--secondary-background-color, #fafafa);
    border-radius: 8px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    transition: all 0.2s ease;
  }

  .item-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .empty-message {
    padding: 32px;
    text-align: center;
    color: var(--secondary-text-color, #727272);
    font-size: 14px;
    font-style: italic;
  }

  /* Error banner */
  .error-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    margin-bottom: 16px;
    background: var(--error-color, #f44336);
    color: white;
    border-radius: 8px;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  }

  .error-banner .btn {
    color: white;
    background: transparent;
    border: 1px solid white;
    padding: 4px 12px;
    font-size: 12px;
    min-width: auto;
  }

  .error-banner .btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Badges */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    background: var(--label-badge-background-color, #e0e0e0);
    color: var(--label-badge-text-color, #212121);
  }

  .badge-primary {
    background: var(--primary-color, #03a9f4);
    color: white;
  }

  .badge-success {
    background: var(--success-color, #4caf50);
    color: white;
  }

  .badge-warning {
    background: var(--warning-color, #ff9800);
    color: white;
  }

  .badge-danger {
    background: var(--error-color, #f44336);
    color: white;
  }

  /* Lists */
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .list-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }

  .list-item:last-child {
    border-bottom: none;
  }

  /* Grid layouts */
  .grid {
    display: grid;
    gap: 12px;
  }

  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    .grid-3,
    .grid-4 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .grid-2,
    .grid-3,
    .grid-4 {
      grid-template-columns: 1fr;
    }
  }

  /* Flex layouts */
  .flex {
    display: flex;
  }

  .flex-row {
    flex-direction: row;
  }

  .flex-column {
    flex-direction: column;
  }

  .flex-center {
    align-items: center;
    justify-content: center;
  }

  .flex-between {
    justify-content: space-between;
  }

  .flex-gap-sm {
    gap: 8px;
  }

  .flex-gap-md {
    gap: 16px;
  }

  .flex-gap-lg {
    gap: 24px;
  }

  /* Form layouts */
  .form-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .form-row > * {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 600px) {
    .form-row {
      flex-direction: column;
    }
  }

  /* Loading state */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    color: var(--secondary-text-color, #727272);
  }

  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    text-align: center;
    color: var(--secondary-text-color, #727272);
  }

  .empty-state ha-icon {
    --mdc-icon-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .slide-in {
    animation: slideIn 0.3s ease;
  }

  /* Utilities */
  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .mt-sm { margin-top: 8px; }
  .mt-md { margin-top: 16px; }
  .mt-lg { margin-top: 24px; }

  .mb-sm { margin-bottom: 8px; }
  .mb-md { margin-bottom: 16px; }
  .mb-lg { margin-bottom: 24px; }

  .p-sm { padding: 8px; }
  .p-md { padding: 16px; }
  .p-lg { padding: 24px; }

  .hidden {
    display: none !important;
  }
`;class Le extends ae{constructor(){super(...arguments),this.open=!1,this.title="",this.hideActions=!1,this.confirmText="Confirmer",this.cancelText="Annuler",this.hideCancel=!1,this.loading=!1}handleOverlayClick(e){e.target===e.currentTarget&&this.close()}handleCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0})),this.close()}handleConfirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}close(){this.open=!1}render(){return this.open?V`
      <div class="overlay" @click="${this.handleOverlayClick}">
        <div class="dialog">
          <div class="dialog-header">
            <h2 class="dialog-title">${this.title}</h2>
            <button class="close-button" @click="${this.close}" ?disabled="${this.loading}">
              ✕
            </button>
          </div>

          <div class="dialog-content">
            <slot></slot>
          </div>

          ${this.hideActions?"":V`
                <div class="dialog-actions">
                  ${this.hideCancel?"":V`
                        <button
                          class="cancel-button"
                          @click="${this.handleCancel}"
                          ?disabled="${this.loading}"
                        >
                          ${this.cancelText}
                        </button>
                      `}
                  <button
                    class="confirm-button"
                    @click="${this.handleConfirm}"
                    ?disabled="${this.loading}"
                  >
                    ${this.loading?V`<span class="loading-spinner"></span>`:""}${this.confirmText}
                  </button>
                </div>
              `}
        </div>
      </div>
    `:V``}}Le.styles=a`
    :host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .dialog {
      background: var(--card-background-color, white);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s ease;
    }

    .dialog-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .dialog-title {
      font-size: 20px;
      font-weight: 500;
      margin: 0;
      color: var(--primary-text-color, #212121);
    }

    .close-button {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      border-radius: 50%;
      color: var(--secondary-text-color, #727272);
      transition: background 0.2s;
    }

    .close-button:hover {
      background: var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .dialog-content {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }

    .dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    button {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .cancel-button {
      background: var(--secondary-color, #e0e0e0);
      color: var(--primary-text-color, #212121);
    }

    .cancel-button:hover:not(:disabled) {
      background: var(--divider-color, #d0d0d0);
    }

    .confirm-button {
      background: var(--primary-color, #03a9f4);
      color: white;
    }

    .confirm-button:hover:not(:disabled) {
      opacity: 0.9;
    }

    .loading-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,e([de({type:Boolean,reflect:!0})],Le.prototype,"open",void 0),e([de({type:String})],Le.prototype,"title",void 0),e([de({type:Boolean})],Le.prototype,"hideActions",void 0),e([de({type:String})],Le.prototype,"confirmText",void 0),e([de({type:String})],Le.prototype,"cancelText",void 0),e([de({type:Boolean})],Le.prototype,"hideCancel",void 0),e([de({type:Boolean})],Le.prototype,"loading",void 0),customElements.get("hm-dialog")||customElements.define("hm-dialog",Le);class Ve extends ae{constructor(){super(...arguments),this.icon="",this.iconColor="",this.clickable=!1,this.selected=!1}handleClick(){this.clickable&&this.dispatchEvent(new CustomEvent("item-click",{bubbles:!0,composed:!0}))}render(){return V`
      <div
        class="card ${this.clickable?"clickable":""} ${this.selected?"selected":""}"
        @click="${this.handleClick}"
      >
        ${this.icon?V`
              <div class="icon-container" style="color: ${this.iconColor||"inherit"}">
                ${this.icon}
              </div>
            `:""}
        <div class="content">
          <slot></slot>
        </div>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `}}Ve.styles=a`
    :host {
      display: block;
    }

    .card {
      padding: 16px;
      background: var(--secondary-background-color, #fafafa);
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      transition: all 0.2s ease;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .card.clickable {
      cursor: pointer;
    }

    .card.clickable:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .card.selected {
      border-color: var(--primary-color, #03a9f4);
      background: var(--primary-color-light, rgba(3, 169, 244, 0.1));
    }

    .icon-container {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--card-background-color, white);
      font-size: 20px;
    }

    .content {
      flex: 1;
      min-width: 0;
    }

    .actions {
      flex-shrink: 0;
      display: flex;
      gap: 8px;
    }

    ::slotted([slot='actions']) {
      display: flex;
      gap: 8px;
    }
  `,e([de({type:String})],Ve.prototype,"icon",void 0),e([de({type:String})],Ve.prototype,"iconColor",void 0),e([de({type:Boolean})],Ve.prototype,"clickable",void 0),e([de({type:Boolean})],Ve.prototype,"selected",void 0),customElements.get("hm-item-card")||customElements.define("hm-item-card",Ve);class qe extends ae{constructor(){super(...arguments),this.label="",this.value="",this.placeholder="",this.required=!1,this.disabled=!1,this.rows=3,this.error="",this.helper=""}handleInput(e){const t=e.target;this.value=t.value,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return V`
      <div class="textarea-container">
        ${this.label?V`<label class="${this.required?"required":""}">${this.label}</label>`:""}
        <textarea
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          rows="${this.rows}"
          maxlength="${this.maxlength||""}"
          class="${this.error?"error":""}"
          @input="${this.handleInput}"
        ></textarea>
        ${this.error?V`<span class="error-text">${this.error}</span>`:this.helper?V`<span class="helper-text">${this.helper}</span>`:""}
        ${this.maxlength?V`<span class="char-count">${this.value.length} / ${this.maxlength}</span>`:""}
      </div>
    `}}qe.styles=a`
    :host {
      display: block;
      margin-bottom: 16px;
    }

    .textarea-container {
      display: flex;
      flex-direction: column;
    }

    label {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
      color: var(--primary-text-color, #212121);
    }

    label.required::after {
      content: ' *';
      color: var(--error-color, #f44336);
    }

    textarea {
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, #212121);
      resize: vertical;
      transition: border-color 0.2s;
    }

    textarea:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    textarea:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--disabled-color, #f5f5f5);
      resize: none;
    }

    textarea.error {
      border-color: var(--error-color, #f44336);
    }

    .helper-text {
      font-size: 12px;
      margin-top: 4px;
      color: var(--secondary-text-color, #727272);
    }

    .error-text {
      font-size: 12px;
      margin-top: 4px;
      color: var(--error-color, #f44336);
    }

    .char-count {
      font-size: 12px;
      margin-top: 4px;
      text-align: right;
      color: var(--secondary-text-color, #727272);
    }
  `,e([de({type:String})],qe.prototype,"label",void 0),e([de({type:String})],qe.prototype,"value",void 0),e([de({type:String})],qe.prototype,"placeholder",void 0),e([de({type:Boolean})],qe.prototype,"required",void 0),e([de({type:Boolean})],qe.prototype,"disabled",void 0),e([de({type:Number})],qe.prototype,"rows",void 0),e([de({type:Number})],qe.prototype,"maxlength",void 0),e([de({type:String})],qe.prototype,"error",void 0),e([de({type:String})],qe.prototype,"helper",void 0),customElements.get("hm-form-textarea")||customElements.define("hm-form-textarea",qe);class Fe extends ae{constructor(){super(...arguments),this.label="",this.checked=!1,this.disabled=!1,this.helper=""}handleChange(e){const t=e.target;this.checked=t.checked,this.dispatchEvent(new CustomEvent("checked-changed",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}render(){return V`
      <div>
        <label class="checkbox-container ${this.disabled?"disabled":""}">
          <input
            type="checkbox"
            .checked="${this.checked}"
            ?disabled="${this.disabled}"
            @change="${this.handleChange}"
          />
          <span class="label-text">${this.label}</span>
        </label>
        ${this.helper?V`<div class="helper-text">${this.helper}</div>`:""}
      </div>
    `}}Fe.styles=a`
    :host {
      display: block;
      margin-bottom: 16px;
    }

    .checkbox-container {
      display: flex;
      align-items: flex-start;
      cursor: pointer;
    }

    .checkbox-container.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    input[type='checkbox'] {
      width: 18px;
      height: 18px;
      margin: 2px 8px 0 0;
      cursor: pointer;
      accent-color: var(--primary-color, #03a9f4);
    }

    input[type='checkbox']:disabled {
      cursor: not-allowed;
    }

    .label-text {
      flex: 1;
      font-size: 14px;
      color: var(--primary-text-color, #212121);
      user-select: none;
    }

    .helper-text {
      font-size: 12px;
      margin-top: 4px;
      margin-left: 26px;
      color: var(--secondary-text-color, #727272);
    }
  `,e([de({type:String})],Fe.prototype,"label",void 0),e([de({type:Boolean})],Fe.prototype,"checked",void 0),e([de({type:Boolean})],Fe.prototype,"disabled",void 0),e([de({type:String})],Fe.prototype,"helper",void 0),customElements.get("hm-form-checkbox")||customElements.define("hm-form-checkbox",Fe);let Be=class extends ae{constructor(){super(...arguments),this._children=[],this._showValidateDialog=!1,this._showRefuseDialog=!1,this._showApproveClaimDialog=!1,this._validationNote="",this._refuseNote="",this._applyPenalty=!1,this._loading=!1}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config=e,console.log("%c╔═══════════════════════════════════════════════════════╗","color: #ff9800; font-weight: bold"),console.log("%c║  👨‍👩‍👧‍👦 Habits Supervision Card                         ║","color: #ff9800; font-weight: bold"),console.log("%c║  Version: 2025-11-07T19:30:00Z                ║","color: #ff9800; font-weight: bold"),console.log(`%c║  API Version: ${Ne}         ║`,"color: #ff9800; font-weight: bold"),console.log("%c╚═══════════════════════════════════════════════════════╝","color: #ff9800; font-weight: bold")}getCardSize(){return 3}updated(e){var t;super.updated(e),e.has("hass")&&this.hass&&(this._store||(console.log("[Supervision Card] Initializing store with hass:",!!this.hass),this._store=(t=this.hass,new je(t)),this._unsubscribe=this._store.subscribe(()=>{console.log("[Supervision Card] Store state changed, requesting update"),this._loadData(),this.requestUpdate()}),this._loadData(),this.requestUpdate()))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe&&this._unsubscribe(),this._store&&this._store.destroy()}_loadData(){this._store&&(this._children=this._store.getChildren())}render(){if(!this._config||!this.hass)return V``;const e=this._config.title||"Supervision";if(!this._store)return V`
        <ha-card>
          <div class="card">
            <div class="card-header">
              <h1 class="card-title">${e}</h1>
            </div>
            <div class="loading">Initialisation du store...</div>
          </div>
        </ha-card>
      `;const t=this._store.getState();return t.loading?V`
        <ha-card>
          <div class="card">
            <div class="card-header">
              <h1 class="card-title">${e}</h1>
            </div>
            <div class="loading">Chargement des données...</div>
          </div>
        </ha-card>
      `:t.error?V`
        <ha-card>
          <div class="card">
            <div class="card-header">
              <h1 class="card-title">${e}</h1>
            </div>
            <div class="error-banner">
              <span>Erreur: ${t.error}</span>
              <button class="btn btn-text" @click="${()=>this._store?.refresh()}">Réessayer</button>
            </div>
          </div>
        </ha-card>
      `:V`
      <ha-card>
        <div class="card">
          <div class="card-header">
            <h1 class="card-title">${e}</h1>
          </div>

          ${0===this._children.length?V`
                <div class="empty-state">
                  <ha-icon icon="mdi:account-child"></ha-icon>
                  <p>Aucun enfant configuré</p>
                </div>
              `:V`
                ${this._renderChildrenOverview()}
                ${this._renderTasksSection()}
                ${this._renderClaimsSection()}
              `}
        </div>
      </ha-card>

      ${this._renderValidateDialog()}
      ${this._renderRefuseDialog()}
      ${this._renderApproveClaimDialog()}
    `}_renderChildrenOverview(){return V`
      <div class="section">
        <h2 class="section-title">Vue d'ensemble des enfants (${this._children.length})</h2>
        <div class="grid grid-2">
          ${this._children.map(e=>this._renderChildCard(e))}
        </div>
      </div>
    `}_renderChildCard(e){const t=this._store?.getTaskCounts(e.id)||{pending:0,waiting:0},s=this._store?.getHabitStats(e.id)||{longest_streak:0};return V`
      <hm-item-card
        .icon=${"👤"}
        .iconColor=${"var(--primary-color, #03a9f4)"}
        .clickable=${!0}
        @item-click=${()=>this._handleChildClick(e.id)}
      >
        <div>
          <h3>${e.name}</h3>
          <p style="margin: 4px 0; font-size: 14px; color: var(--secondary-text-color);">
            Niveau ${e.level} • ${e.points} pts • ${e.coins} 💰
          </p>
          <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
            ${t.pending>0?V`<span class="badge badge-primary">${t.pending} à faire</span>`:""}
            ${t.waiting>0?V`<span class="badge badge-warning">${t.waiting} à valider</span>`:""}
            ${s.longest_streak>0?V`<span class="badge badge-success">🔥 ${s.longest_streak} jours</span>`:""}
          </div>
        </div>
      </hm-item-card>
    `}_renderTasksSection(){return V`
      <div class="section">
        <h2 class="section-title">Tâches en attente de validation</h2>

        <div style="padding: 16px; background: var(--secondary-background-color, #fafafa); border-radius: 8px; border-left: 4px solid var(--warning-color, #ff9800);">
          <p style="margin: 0; font-size: 14px;">
            <strong>⚠️ Limitation backend:</strong> Le backend ne fournit pas encore la liste des task instances via les sensors.
          </p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
            Les méthodes <code>validateTask()</code> et <code>refuseTask()</code> sont déjà implémentées et fonctionnelles.
            Pour l'instant, seuls les <strong>counts</strong> sont disponibles et affichés dans la vue d'ensemble ci-dessus.
          </p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
            <strong>À faire:</strong> Ajouter un service backend pour exposer les task instances avec status "completed_waiting" via un sensor.
          </p>
        </div>

        ${this._renderTaskValidationExample()}
      </div>
    `}_renderTaskValidationExample(){return V`
      <div style="margin-top: 16px;">
        <p style="font-size: 13px; color: var(--secondary-text-color); margin-bottom: 8px;">
          <strong>Aperçu UI</strong> (Exemple de ce qui sera affiché une fois les données disponibles):
        </p>

        <hm-item-card .icon=${"✓"} .iconColor=${"var(--success-color)"}>
          <div style="flex: 1;">
            <h4 style="margin: 0; font-size: 15px;">Ranger sa chambre</h4>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
              Par: <strong>Emma</strong> • Complétée le 05/11/2025 à 14:30
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--secondary-text-color);">
              Récompense: +10 pts, +5 💰, +8 XP
            </p>
          </div>
          <div slot="actions" style="display: flex; gap: 8px;">
            <button
              class="button button-success"
              style="padding: 6px 12px; font-size: 13px;"
              @click=${()=>this._handleValidateTaskDemo("demo-instance-1")}
            >
              ✓ Valider
            </button>
            <button
              class="button button-danger"
              style="padding: 6px 12px; font-size: 13px;"
              @click=${()=>this._handleRefuseTaskDemo("demo-instance-1")}
            >
              ✗ Refuser
            </button>
          </div>
        </hm-item-card>
      </div>
    `}_renderClaimsSection(){return V`
      <div class="section">
        <h2 class="section-title">Réclamations de récompenses</h2>

        <div style="padding: 16px; background: var(--secondary-background-color, #fafafa); border-radius: 8px; border-left: 4px solid var(--warning-color, #ff9800);">
          <p style="margin: 0; font-size: 14px;">
            <strong>⚠️ Limitation backend:</strong> Le backend ne fournit pas encore la liste des reward claims via les sensors.
          </p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
            La méthode <code>approveClaim()</code> est déjà implémentée et fonctionnelle.
          </p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
            <strong>À faire:</strong> Ajouter un service backend pour exposer les reward claims avec status "pending" via un sensor.
          </p>
        </div>

        ${this._renderClaimApprovalExample()}
      </div>
    `}_renderClaimApprovalExample(){return V`
      <div style="margin-top: 16px;">
        <p style="font-size: 13px; color: var(--secondary-text-color); margin-bottom: 8px;">
          <strong>Aperçu UI</strong> (Exemple de ce qui sera affiché une fois les données disponibles):
        </p>

        <hm-item-card .icon=${"🎁"} .iconColor=${"var(--primary-color)"}>
          <div style="flex: 1;">
            <h4 style="margin: 0; font-size: 15px;">30 minutes de jeu vidéo</h4>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
              Réclamée par: <strong>Emma</strong> • Le 05/11/2025 à 15:00
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--secondary-text-color);">
              Coût: 50 pts, 20 💰
            </p>
          </div>
          <div slot="actions" style="display: flex; gap: 8px;">
            <button
              class="button button-success"
              style="padding: 6px 12px; font-size: 13px;"
              @click=${()=>this._handleApproveClaimDemo("demo-claim-1")}
            >
              ✓ Approuver
            </button>
            <button
              class="button button-danger"
              style="padding: 6px 12px; font-size: 13px;"
            >
              ✗ Refuser
            </button>
          </div>
        </hm-item-card>
      </div>
    `}_renderValidateDialog(){return V`
      <hm-dialog
        ?open=${this._showValidateDialog}
        title="Valider la tâche"
        confirmText="Valider"
        cancelText="Annuler"
        ?loading=${this._loading}
        @confirm=${this._handleConfirmValidate}
        @cancel=${this._handleCancelValidate}
      >
        <p style="margin: 0 0 16px 0; font-size: 14px; color: var(--secondary-text-color);">
          Confirmez-vous la validation de cette tâche ? L'enfant recevra les récompenses associées.
        </p>

        <hm-form-textarea
          label="Note (optionnelle)"
          placeholder="Excellent travail ! Très bien rangé."
          .value=${this._validationNote}
          rows="3"
          helper="Ajoutez un message d'encouragement"
          @value-changed=${e=>{this._validationNote=e.detail.value}}
        ></hm-form-textarea>
      </hm-dialog>
    `}_renderRefuseDialog(){return V`
      <hm-dialog
        ?open=${this._showRefuseDialog}
        title="Refuser la tâche"
        confirmText="Refuser"
        cancelText="Annuler"
        ?loading=${this._loading}
        @confirm=${this._handleConfirmRefuse}
        @cancel=${this._handleCancelRefuse}
      >
        <p style="margin: 0 0 16px 0; font-size: 14px; color: var(--error-color, #f44336);">
          ⚠️ Attention: Refuser cette tâche la marquera comme non complétée.
        </p>

        <hm-form-textarea
          label="Raison du refus"
          placeholder="La chambre n'est pas encore bien rangée. Merci de refaire..."
          .value=${this._refuseNote}
          rows="3"
          required
          helper="Expliquez pourquoi la tâche est refusée"
          @value-changed=${e=>{this._refuseNote=e.detail.value}}
        ></hm-form-textarea>

        <hm-form-checkbox
          label="Appliquer la pénalité"
          .checked=${this._applyPenalty}
          helper="Si activé, l'enfant perdra les points/pièces définis comme pénalité"
          @checked-changed=${e=>{this._applyPenalty=e.detail.checked}}
        ></hm-form-checkbox>
      </hm-dialog>
    `}_renderApproveClaimDialog(){return V`
      <hm-dialog
        ?open=${this._showApproveClaimDialog}
        title="Approuver la réclamation"
        confirmText="Approuver"
        cancelText="Annuler"
        ?loading=${this._loading}
        @confirm=${this._handleConfirmApproveClaim}
        @cancel=${this._handleCancelApproveClaim}
      >
        <p style="margin: 0; font-size: 14px; color: var(--secondary-text-color);">
          Confirmez-vous l'approbation de cette réclamation de récompense ?
        </p>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--secondary-text-color);">
          L'enfant pourra utiliser sa récompense une fois approuvée.
        </p>
      </hm-dialog>
    `}_handleChildClick(e){console.log("Child clicked:",e)}_handleValidateTaskDemo(e){this._selectedInstanceId=e,this._validationNote="",this._showValidateDialog=!0}_handleRefuseTaskDemo(e){this._selectedInstanceId=e,this._refuseNote="",this._applyPenalty=!1,this._showRefuseDialog=!0}_handleApproveClaimDemo(e){this._selectedClaimId=e,this._showApproveClaimDialog=!0}async _handleConfirmValidate(){if(this._selectedInstanceId&&this._store){this._loading=!0;try{await this._store.validateTask(this._selectedInstanceId,void 0,this._validationNote||void 0),console.log("Task validated successfully:",this._selectedInstanceId),this._showValidateDialog=!1,this._validationNote="",this._selectedInstanceId=void 0,alert("✓ Tâche validée avec succès!")}catch(e){console.error("Failed to validate task:",e),alert("❌ Erreur lors de la validation de la tâche")}finally{this._loading=!1}}}_handleCancelValidate(){this._showValidateDialog=!1,this._validationNote="",this._selectedInstanceId=void 0}async _handleConfirmRefuse(){if(this._selectedInstanceId&&this._store)if(this._refuseNote.trim()){this._loading=!0;try{await this._store.refuseTask(this._selectedInstanceId,void 0,this._applyPenalty,this._refuseNote),console.log("Task refused successfully:",this._selectedInstanceId),this._showRefuseDialog=!1,this._refuseNote="",this._applyPenalty=!1,this._selectedInstanceId=void 0,alert("✓ Tâche refusée")}catch(e){console.error("Failed to refuse task:",e),alert("❌ Erreur lors du refus de la tâche")}finally{this._loading=!1}}else alert("⚠️ Veuillez fournir une raison pour le refus")}_handleCancelRefuse(){this._showRefuseDialog=!1,this._refuseNote="",this._applyPenalty=!1,this._selectedInstanceId=void 0}async _handleConfirmApproveClaim(){if(this._selectedClaimId&&this._store){this._loading=!0;try{await this._store.approveClaim(this._selectedClaimId,void 0),console.log("Claim approved successfully:",this._selectedClaimId),this._showApproveClaimDialog=!1,this._selectedClaimId=void 0,alert("✓ Réclamation approuvée avec succès!")}catch(e){console.error("Failed to approve claim:",e),alert("❌ Erreur lors de l'approbation de la réclamation")}finally{this._loading=!1}}}_handleCancelApproveClaim(){this._showApproveClaimDialog=!1,this._selectedClaimId=void 0}};Be.styles=Me,e([de({attribute:!1})],Be.prototype,"hass",void 0),e([he()],Be.prototype,"_config",void 0),e([he()],Be.prototype,"_store",void 0),e([he()],Be.prototype,"_children",void 0),e([he()],Be.prototype,"_unsubscribe",void 0),e([he()],Be.prototype,"_showValidateDialog",void 0),e([he()],Be.prototype,"_showRefuseDialog",void 0),e([he()],Be.prototype,"_showApproveClaimDialog",void 0),e([he()],Be.prototype,"_selectedInstanceId",void 0),e([he()],Be.prototype,"_selectedClaimId",void 0),e([he()],Be.prototype,"_validationNote",void 0),e([he()],Be.prototype,"_refuseNote",void 0),e([he()],Be.prototype,"_applyPenalty",void 0),e([he()],Be.prototype,"_loading",void 0),Be=e([(e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)})("habits-supervision-card")],Be),window.customCards=window.customCards||[],window.customCards.push({type:"habits-supervision-card",name:"Habits Supervision",description:"Carte de supervision pour valider les tâches et suivre les enfants"});export{Be as HabitsSupervisionCard};
