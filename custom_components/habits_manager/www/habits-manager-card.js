function e(e,t,i,a){var r,s=arguments.length,o=s<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,a);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(o=(s<3?r(o):s>3?r(t,i,o):r(t,i))||o);return s>3&&o&&Object.defineProperty(t,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),r=new WeakMap;let s=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new s(i,e,a)},n=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,a))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,_=m.trustedTypes,f=_?_.emptyScript:"",v=m.reactiveElementPolyfillSupport,g=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(e,i,t);void 0!==a&&c(this.prototype,e,a)}}static getPropertyDescriptor(e,t,i){const{get:a,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const s=a?.call(this);r?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,a)=>{if(i)e.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of a){const a=document.createElement("style"),r=t.litNonce;void 0!==r&&a.setAttribute("nonce",r),a.textContent=i.cssText,e.appendChild(a)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,i);if(void 0!==a&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,a=i._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=i.getPropertyOptions(a),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=a;const s=r.fromAttribute(t,e.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(e,t,i){if(void 0!==e){const a=this.constructor,r=this[e];if(i??=a.getPropertyOptions(e),!((i.hasChanged??y)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:a,wrapped:r},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==r||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,i,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[g("elementProperties")]=new Map,x[g("finalized")]=new Map,v?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.1");const w=globalThis,k=w.trustedTypes,D=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+S,E=`<${A}>`,T=document,q=()=>T.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,H=Array.isArray,I="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,P=/>/g,M=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,U=/"/g,L=/^(?:script|style|textarea|title)$/i,j=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),B=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),Y=new WeakMap,V=T.createTreeWalker(T,129);function W(e,t){if(!H(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==D?D.createHTML(t):t}const G=(e,t)=>{const i=e.length-1,a=[];let r,s=2===t?"<svg>":3===t?"<math>":"",o=N;for(let t=0;t<i;t++){const i=e[t];let n,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===N?"!--"===l[1]?o=O:void 0!==l[1]?o=P:void 0!==l[2]?(L.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=M):void 0!==l[3]&&(o=M):o===M?">"===l[0]?(o=r??N,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,n=l[1],o=void 0===l[3]?M:'"'===l[3]?U:z):o===U||o===z?o=M:o===O||o===P?o=N:(o=M,r=void 0);const h=o===M&&e[t+1].startsWith("/>")?" ":"";s+=o===N?i+E:c>=0?(a.push(n),i.slice(0,c)+C+i.slice(c)+S+h):i+S+(-2===c?t:h)}return[W(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class K{constructor({strings:e,_$litType$:t},i){let a;this.parts=[];let r=0,s=0;const o=e.length-1,n=this.parts,[l,c]=G(e,t);if(this.el=K.createElement(l,i),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=V.nextNode())&&n.length<o;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(C)){const t=c[s++],i=a.getAttribute(e).split(S),o=/([.?@])?(.*)/.exec(t);n.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?ee:"?"===o[1]?te:"@"===o[1]?ie:Z}),a.removeAttribute(e)}else e.startsWith(S)&&(n.push({type:6,index:r}),a.removeAttribute(e));if(L.test(a.tagName)){const e=a.textContent.split(S),t=e.length-1;if(t>0){a.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)a.append(e[i],q()),V.nextNode(),n.push({type:2,index:++r});a.append(e[t],q())}}}else if(8===a.nodeType)if(a.data===A)n.push({type:2,index:r});else{let e=-1;for(;-1!==(e=a.data.indexOf(S,e+1));)n.push({type:7,index:r}),e+=S.length-1}r++}}static createElement(e,t){const i=T.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,a){if(t===B)return t;let r=void 0!==a?i._$Co?.[a]:i._$Cl;const s=R(t)?void 0:t._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(e),r._$AT(e,i,a)),void 0!==a?(i._$Co??=[])[a]=r:i._$Cl=r),void 0!==r&&(t=X(e,r._$AS(e,t.values),r,a)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,a=(e?.creationScope??T).importNode(t,!0);V.currentNode=a;let r=V.nextNode(),s=0,o=0,n=i[0];for(;void 0!==n;){if(s===n.index){let t;2===n.type?t=new J(r,r.nextSibling,this,e):1===n.type?t=new n.ctor(r,n.name,n.strings,this,e):6===n.type&&(t=new ae(r,this,e)),this._$AV.push(t),n=i[++o]}s!==n?.index&&(r=V.nextNode(),s++)}return V.currentNode=T,a}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,a){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),R(e)?e===F||null==e||""===e?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>H(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==F&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,a="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=K.createElement(W(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new Q(a,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Y.get(e.strings);return void 0===t&&Y.set(e.strings,t=new K(e)),t}k(e){H(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,a=0;for(const r of e)a===t.length?t.push(i=new J(this.O(q()),this.O(q()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,a,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(e,t=this,i,a){const r=this.strings;let s=!1;if(void 0===r)e=X(this,e,t,0),s=!R(e)||e!==this._$AH&&e!==B,s&&(this._$AH=e);else{const a=e;let o,n;for(e=r[0],o=0;o<r.length-1;o++)n=X(this,a[i+o],t,o),n===B&&(n=this._$AH[o]),s||=!R(n)||n!==this._$AH[o],n===F?e=F:e!==F&&(e+=(n??"")+r[o+1]),this._$AH[o]=n}s&&!a&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Z{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}}class te extends Z{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==F)}}class ie extends Z{constructor(e,t,i,a,r){super(e,t,i,a,r),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??F)===B)return;const i=this._$AH,a=e===F&&i!==F||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==F&&(i===F||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ae{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=w.litHtmlPolyfillSupport;re?.(K,J),(w.litHtmlVersions??=[]).push("3.3.1");const se=globalThis;class oe extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const a=i?.renderBefore??t;let r=a._$litPart$;if(void 0===r){const e=i?.renderBefore??null;a._$litPart$=r=new J(t.insertBefore(q(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}oe._$litElement$=!0,oe.finalized=!0,se.litElementHydrateSupport?.({LitElement:oe});const ne=se.litElementPolyfillSupport;ne?.({LitElement:oe}),(se.litElementVersions??=[]).push("4.2.1");const le=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ce={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},de=(e=ce,t,i)=>{const{kind:a,metadata:r}=i;let s=globalThis.litPropertyMetadata.get(r);if(void 0===s&&globalThis.litPropertyMetadata.set(r,s=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),s.set(i.name,e),"accessor"===a){const{name:a}=i;return{set(i){const r=t.get.call(this);t.set.call(this,i),this.requestUpdate(a,r,e)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=i;return function(i){const r=this[a];t.call(this,i),this.requestUpdate(a,r,e)}}throw Error("Unsupported decorator location: "+a)};function he(e){return(t,i)=>"object"==typeof i?de(e,t,i):((e,t,i)=>{const a=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),a?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function pe(e){return he({...e,state:!0,attribute:!1})}const ue="habits_manager",me="create_child",_e="update_child",fe="delete_child",ve="create_task",ge="update_task",be="delete_task",ye="mark_task_completed",$e="validate_task",xe="refuse_task",we="validate_penalty",ke="create_habit",De="update_habit",Ce="delete_habit",Se="complete_habit",Ae="create_reward",Ee="claim_reward",Te="approve_claim",qe="create_cosmetic",Re="purchase_cosmetic";class He{constructor(e){this.hass=e}async callService(e,t={}){return this.hass.callService(ue,e,t)}async createChild(e){return this.callService(me,e)}async updateChild(e,t){return this.callService(_e,{child_id:e,...t})}async deleteChild(e){return this.callService(fe,{child_id:e})}async createTask(e){return this.callService(ve,e)}async updateTask(e,t){return this.callService(ge,{task_id:e,...t})}async deleteTask(e){return this.callService(be,{task_id:e})}async markTaskCompleted(e,t){return this.callService(ye,{instance_id:e,child_id:t})}async validateTask(e,t,i){return this.callService($e,{instance_id:e,validator_id:t,note:i})}async refuseTask(e,t,i=!1,a){return this.callService(xe,{instance_id:e,validator_id:t,apply_penalty:i,note:a})}async validatePenalty(e,t){return this.callService(we,{instance_id:e,validator_id:t})}async createHabit(e){return this.callService(ke,e)}async updateHabit(e,t){return this.callService(De,{habit_id:e,...t})}async deleteHabit(e){return this.callService(Ce,{habit_id:e})}async completeHabit(e,t){return this.callService(Se,{habit_id:e,child_id:t})}async createReward(e){return this.callService(Ae,e)}async claimReward(e,t){return this.callService(Ee,{reward_id:e,child_id:t})}async approveClaim(e,t){return this.callService(Te,{claim_id:e,approver_id:t})}async createCosmetic(e){return this.callService(qe,e)}async purchaseCosmetic(e,t){return this.callService(Re,{cosmetic_id:e,child_id:t})}getChildren(){const e=[],t=Object.values(this.hass.states).filter(e=>e.entity_id.startsWith(`sensor.${ue}_`)&&e.entity_id.endsWith("_points"));for(const i of t){const t=i.attributes.child_id;if(t){const i=this.getChildData(t);i&&e.push(i)}}return e}getChildData(e){const t=this.hass.states[`sensor.${ue}_${e}_points`];if(!t)return null;const i=this.hass.states[`sensor.${ue}_${e}_coins`],a=this.hass.states[`sensor.${ue}_${e}_level`],r=this.hass.states[`sensor.${ue}_${e}_experience`];return{id:e,name:t.attributes.child_name||"Unknown",person_entity:t.attributes.person_entity||"",points:parseInt(t.state)||0,coins:i&&parseInt(i.state)||0,level:a&&parseInt(a.state)||1,experience:r&&parseInt(r.state)||0,experience_to_next_level:r?.attributes.experience_to_next_level||100,avatar:t.attributes.avatar||{photo_url:"",customization:{clothes:null,accessory:null,pet:null,theme:"default"}},badges:t.attributes.badges||[],owned_cosmetics:t.attributes.owned_cosmetics||[],created_at:t.attributes.created_at||(new Date).toISOString(),updated_at:t.attributes.updated_at||(new Date).toISOString()}}getTaskCounts(e){const t=this.hass.states[`sensor.${ue}_${e}_tasks_pending`],i=this.hass.states[`sensor.${ue}_${e}_tasks_completed_waiting`];return{pending:t&&parseInt(t.state)||0,waiting:i&&parseInt(i.state)||0}}getHabitStats(e){const t=this.hass.states[`sensor.${ue}_${e}_habits_count`],i=this.hass.states[`sensor.${ue}_${e}_longest_streak`];return{count:t&&parseInt(t.state)||0,longest_streak:i&&parseInt(i.state)||0}}getCosmetics(){const e=this.hass.states[`sensor.${ue}_cosmetics`];return e&&e.attributes.cosmetics?e.attributes.cosmetics:[]}async subscribeToUpdates(e){return this.hass.connection.subscribeEvents(e,`${ue}_update`)}}class Ie{constructor(e){this.listeners=new Set,this.state={children:[],tasks:[],taskInstances:[],habits:[],habitStreaks:[],rewards:[],rewardClaims:[],cosmetics:[],loading:!0,error:null},this.hass=e,this.api=new He(e),this.initialize()}async initialize(){try{await this.loadAllData(),this.unsubscribe=await this.api.subscribeToUpdates(e=>{this.handleUpdate(e)}),this.state.loading=!1,this.notifyListeners()}catch(e){this.state.error=e instanceof Error?e.message:"Unknown error",this.state.loading=!1,this.notifyListeners()}}async loadAllData(){this.state.children=this.api.getChildren(),this.state.cosmetics=this.api.getCosmetics()}handleUpdate(e){const{update_type:t}=e;switch(t){case"child_created":case"child_updated":case"child_deleted":case"reward_claimed":case"reward_approved":case"cosmetic_purchased":case"level_up":case"badge_earned":case"points_changed":case"coins_changed":this.state.children=this.api.getChildren();break;case"task_completed":case"task_validated":case"task_refused":case"task_failed":case"habit_completed":case"streak_increased":case"streak_broken":e.child_id&&(this.state.children=this.api.getChildren())}this.notifyListeners()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notifyListeners(){this.listeners.forEach(e=>e())}getState(){return{...this.state}}async refresh(){this.state.loading=!0,this.notifyListeners();try{await this.loadAllData(),this.state.loading=!1,this.state.error=null}catch(e){this.state.error=e instanceof Error?e.message:"Unknown error",this.state.loading=!1}this.notifyListeners()}getChildren(){return this.state.children}getChild(e){return this.state.children.find(t=>t.id===e)}async createChild(e){try{await this.api.createChild(e),await this.refresh()}catch(e){throw e}}async updateChild(e,t){try{await this.api.updateChild(e,t),await this.refresh()}catch(e){throw e}}async deleteChild(e){try{await this.api.deleteChild(e),await this.refresh()}catch(e){throw e}}getTaskCounts(e){return this.api.getTaskCounts(e)}async createTask(e){try{await this.api.createTask(e),await this.refresh()}catch(e){throw e}}async updateTask(e,t){try{await this.api.updateTask(e,t),await this.refresh()}catch(e){throw e}}async deleteTask(e){try{await this.api.deleteTask(e),await this.refresh()}catch(e){throw e}}async markTaskCompleted(e,t){try{await this.api.markTaskCompleted(e,t),await this.refresh()}catch(e){throw e}}async validateTask(e,t,i){try{await this.api.validateTask(e,t,i),await this.refresh()}catch(e){throw e}}async refuseTask(e,t,i,a){try{await this.api.refuseTask(e,t,i,a),await this.refresh()}catch(e){throw e}}getHabitStats(e){return this.api.getHabitStats(e)}async createHabit(e){try{await this.api.createHabit(e),await this.refresh()}catch(e){throw e}}async updateHabit(e,t){try{await this.api.updateHabit(e,t),await this.refresh()}catch(e){throw e}}async deleteHabit(e){try{await this.api.deleteHabit(e),await this.refresh()}catch(e){throw e}}async completeHabit(e,t){try{await this.api.completeHabit(e,t),await this.refresh()}catch(e){throw e}}async createReward(e){try{await this.api.createReward(e),await this.refresh()}catch(e){throw e}}async claimReward(e,t){try{await this.api.claimReward(e,t),await this.refresh()}catch(e){throw e}}async approveClaim(e,t){try{await this.api.approveClaim(e,t),await this.refresh()}catch(e){throw e}}getCosmetics(){return this.state.cosmetics}getOwnedCosmetics(e){const t=this.getChild(e);return t?this.state.cosmetics.filter(e=>t.owned_cosmetics.includes(e.id)):[]}getAvailableCosmetics(e){const t=this.getChild(e);return t?this.state.cosmetics.filter(e=>{if(t.owned_cosmetics.includes(e.id))return!1;if(e.unlock_requirements){const i=e.unlock_requirements;if(i.level&&t.level<i.level)return!1;if(i.badge&&!t.badges.includes(i.badge))return!1}return!0}):[]}async createCosmetic(e){try{await this.api.createCosmetic(e),await this.refresh()}catch(e){throw e}}async purchaseCosmetic(e,t){try{await this.api.purchaseCosmetic(e,t),await this.refresh()}catch(e){throw e}}destroy(){this.unsubscribe&&this.unsubscribe(),this.listeners.clear()}}const Ne=o`
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
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, white);
  }

  .button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .button:active {
    transform: translateY(0);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button-secondary {
    background: var(--secondary-color, #e0e0e0);
    color: var(--primary-text-color, #212121);
  }

  .button-success {
    background: var(--success-color, #4caf50);
    color: white;
  }

  .button-danger {
    background: var(--error-color, #f44336);
    color: white;
  }

  .button-icon {
    padding: 8px;
    border-radius: 50%;
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
    font-size: 16px;
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
`;var Oe,Pe,Me,ze,Ue,Le,je,Be,Fe,Ye,Ve;!function(e){e.MANDATORY="mandatory",e.BONUS="bonus"}(Oe||(Oe={})),function(e){e.DAILY="daily",e.WEEKLY="weekly",e.MONTHLY="monthly",e.SPECIFIC_DATE="specific_date"}(Pe||(Pe={})),function(e){e.CHORES="chores",e.HOMEWORK="homework",e.PERSONAL="personal",e.OTHER="other"}(Me||(Me={})),function(e){e.PENDING="pending",e.COMPLETED_WAITING="completed_waiting",e.VALIDATED="validated",e.REFUSED="refused",e.FAILED="failed"}(ze||(ze={})),function(e){e.DAILY="daily",e.WEEKLY="weekly",e.MONTHLY="monthly"}(Ue||(Ue={})),function(e){e.PROGRESSIVE="progressive",e.FIXED="fixed"}(Le||(Le={})),function(e){e.SCREEN_TIME="screen_time",e.MEAL_CHOICE="meal_choice",e.ACTIVITY="activity",e.OTHER="other"}(je||(je={})),function(e){e.PENDING="pending",e.APPROVED="approved",e.USED="used",e.EXPIRED="expired"}(Be||(Be={})),function(e){e.CLOTHES="clothes",e.ACCESSORY="accessory",e.PET="pet",e.THEME="theme",e.BADGE="badge",e.ANIMATION="animation"}(Fe||(Fe={})),function(e){e.COMMON="common",e.RARE="rare",e.EPIC="epic",e.LEGENDARY="legendary"}(Ye||(Ye={})),function(e){e.FIRST_TASK="first_task",e.TASKS_COUNT="tasks_count",e.STREAK_DAYS="streak_days",e.LEVEL_REACHED="level_reached",e.POINTS_EARNED="points_earned"}(Ve||(Ve={}));let We=class extends oe{constructor(){super(...arguments),this.label="",this.value="",this.type="text",this.placeholder="",this.required=!1,this.disabled=!1,this.error="",this.helper=""}handleInput(e){const t=e.target;this.value=t.value,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return j`
      <div class="input-container">
        ${this.label?j`<label class="${this.required?"required":""}">${this.label}</label>`:""}
        <input
          type="${this.type}"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          min="${this.min}"
          max="${this.max}"
          step="${this.step}"
          class="${this.error?"error":""}"
          @input="${this.handleInput}"
        />
        ${this.error?j`<span class="error-text">${this.error}</span>`:this.helper?j`<span class="helper-text">${this.helper}</span>`:""}
      </div>
    `}};We.styles=o`
    :host {
      display: block;
      margin-bottom: 16px;
    }

    .input-container {
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

    input {
      padding: 10px 12px;
      font-size: 14px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, #212121);
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--disabled-color, #f5f5f5);
    }

    input.error {
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
  `,e([he({type:String})],We.prototype,"label",void 0),e([he({type:String})],We.prototype,"value",void 0),e([he({type:String})],We.prototype,"type",void 0),e([he({type:String})],We.prototype,"placeholder",void 0),e([he({type:Boolean})],We.prototype,"required",void 0),e([he({type:Boolean})],We.prototype,"disabled",void 0),e([he({type:Number})],We.prototype,"min",void 0),e([he({type:Number})],We.prototype,"max",void 0),e([he({type:Number})],We.prototype,"step",void 0),e([he({type:String})],We.prototype,"error",void 0),e([he({type:String})],We.prototype,"helper",void 0),We=e([le("hm-form-input")],We);let Ge=class extends oe{constructor(){super(...arguments),this.label="",this.value="",this.options=[],this.required=!1,this.disabled=!1,this.error="",this.helper="",this.multiple=!1}handleChange(e){const t=e.target;if(this.multiple){const e=Array.from(t.selectedOptions).map(e=>e.value);this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}else this.value=t.value,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return j`
      <div class="select-container">
        ${this.label?j`<label class="${this.required?"required":""}">${this.label}</label>`:""}
        <select
          .value="${this.value}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          ?multiple="${this.multiple}"
          class="${this.error?"error":""}"
          @change="${this.handleChange}"
        >
          ${this.required||this.multiple?"":j`<option value="">-- Sélectionner --</option>`}
          ${this.options.map(e=>j`
              <option value="${e.value}" ?disabled="${e.disabled}">
                ${e.label}
              </option>
            `)}
        </select>
        ${this.error?j`<span class="error-text">${this.error}</span>`:this.helper?j`<span class="helper-text">${this.helper}</span>`:""}
      </div>
    `}};Ge.styles=o`
    :host {
      display: block;
      margin-bottom: 16px;
    }

    .select-container {
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

    select {
      padding: 10px 12px;
      font-size: 14px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, #212121);
      cursor: pointer;
      transition: border-color 0.2s;
    }

    select:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--disabled-color, #f5f5f5);
    }

    select.error {
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
  `,e([he({type:String})],Ge.prototype,"label",void 0),e([he({type:String})],Ge.prototype,"value",void 0),e([he({type:Array})],Ge.prototype,"options",void 0),e([he({type:Boolean})],Ge.prototype,"required",void 0),e([he({type:Boolean})],Ge.prototype,"disabled",void 0),e([he({type:String})],Ge.prototype,"error",void 0),e([he({type:String})],Ge.prototype,"helper",void 0),e([he({type:Boolean})],Ge.prototype,"multiple",void 0),Ge=e([le("hm-form-select")],Ge);let Ke=class extends oe{constructor(){super(...arguments),this.label="",this.value="",this.placeholder="",this.required=!1,this.disabled=!1,this.rows=3,this.error="",this.helper=""}handleInput(e){const t=e.target;this.value=t.value,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return j`
      <div class="textarea-container">
        ${this.label?j`<label class="${this.required?"required":""}">${this.label}</label>`:""}
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
        ${this.error?j`<span class="error-text">${this.error}</span>`:this.helper?j`<span class="helper-text">${this.helper}</span>`:""}
        ${this.maxlength?j`<span class="char-count">${this.value.length} / ${this.maxlength}</span>`:""}
      </div>
    `}};Ke.styles=o`
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
  `,e([he({type:String})],Ke.prototype,"label",void 0),e([he({type:String})],Ke.prototype,"value",void 0),e([he({type:String})],Ke.prototype,"placeholder",void 0),e([he({type:Boolean})],Ke.prototype,"required",void 0),e([he({type:Boolean})],Ke.prototype,"disabled",void 0),e([he({type:Number})],Ke.prototype,"rows",void 0),e([he({type:Number})],Ke.prototype,"maxlength",void 0),e([he({type:String})],Ke.prototype,"error",void 0),e([he({type:String})],Ke.prototype,"helper",void 0),Ke=e([le("hm-form-textarea")],Ke);let Xe=class extends oe{constructor(){super(...arguments),this.label="",this.checked=!1,this.disabled=!1,this.helper=""}handleChange(e){const t=e.target;this.checked=t.checked,this.dispatchEvent(new CustomEvent("checked-changed",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}render(){return j`
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
        ${this.helper?j`<div class="helper-text">${this.helper}</div>`:""}
      </div>
    `}};Xe.styles=o`
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
  `,e([he({type:String})],Xe.prototype,"label",void 0),e([he({type:Boolean})],Xe.prototype,"checked",void 0),e([he({type:Boolean})],Xe.prototype,"disabled",void 0),e([he({type:String})],Xe.prototype,"helper",void 0),Xe=e([le("hm-form-checkbox")],Xe);let Qe=class extends oe{constructor(){super(...arguments),this.open=!1,this.title="",this.hideActions=!1,this.confirmText="Confirmer",this.cancelText="Annuler",this.hideCancel=!1,this.loading=!1}handleOverlayClick(e){e.target===e.currentTarget&&this.close()}handleCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0})),this.close()}handleConfirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}close(){this.open=!1}render(){return this.open?j`
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

          ${this.hideActions?"":j`
                <div class="dialog-actions">
                  ${this.hideCancel?"":j`
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
                    ${this.loading?j`<span class="loading-spinner"></span>`:""}${this.confirmText}
                  </button>
                </div>
              `}
        </div>
      </div>
    `:j``}};Qe.styles=o`
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
  `,e([he({type:Boolean})],Qe.prototype,"open",void 0),e([he({type:String})],Qe.prototype,"title",void 0),e([he({type:Boolean})],Qe.prototype,"hideActions",void 0),e([he({type:String})],Qe.prototype,"confirmText",void 0),e([he({type:String})],Qe.prototype,"cancelText",void 0),e([he({type:Boolean})],Qe.prototype,"hideCancel",void 0),e([he({type:Boolean})],Qe.prototype,"loading",void 0),Qe=e([le("hm-dialog")],Qe);let Je=class extends oe{constructor(){super(...arguments),this.icon="",this.iconColor="",this.clickable=!1,this.selected=!1}handleClick(){this.clickable&&this.dispatchEvent(new CustomEvent("item-click",{bubbles:!0,composed:!0}))}render(){return j`
      <div
        class="card ${this.clickable?"clickable":""} ${this.selected?"selected":""}"
        @click="${this.handleClick}"
      >
        ${this.icon?j`
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
    `}};Je.styles=o`
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
  `,e([he({type:String})],Je.prototype,"icon",void 0),e([he({type:String})],Je.prototype,"iconColor",void 0),e([he({type:Boolean})],Je.prototype,"clickable",void 0),e([he({type:Boolean})],Je.prototype,"selected",void 0),Je=e([le("hm-item-card")],Je);let Ze=class extends oe{constructor(){super(...arguments),this._activeTab="children",this._showDialog=!1,this._dialogMode="create",this._loading=!1,this._error="",this._formData={}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config=e}getCardSize(){return 3}updated(e){var t;super.updated(e),e.has("hass")&&this.hass&&!this._store&&(this._store=(t=this.hass,new Ie(t)),this._store.subscribe(()=>this.requestUpdate()))}disconnectedCallback(){super.disconnectedCallback(),this._store&&this._store.destroy()}render(){if(!this._config||!this.hass)return j``;const e=this._config.title||"Gestionnaire de Tâches";return j`
      <ha-card>
        <div class="card">
          <div class="card-header">
            <h1 class="card-title">${e}</h1>
          </div>

          ${this._error?j`
                <div class="error-banner">
                  <span>${this._error}</span>
                  <button class="btn btn-text" @click="${()=>this._error=""}">✕</button>
                </div>
              `:""}

          ${this._renderTabs()} ${this._renderContent()} ${this._renderDialog()}
        </div>
      </ha-card>
    `}_renderTabs(){return j`
      <div class="tabs">
        ${[{key:"children",label:"Enfants",icon:"👶"},{key:"tasks",label:"Tâches",icon:"✅"},{key:"habits",label:"Habitudes",icon:"🔄"},{key:"rewards",label:"Récompenses",icon:"🎁"},{key:"cosmetics",label:"Cosmétiques",icon:"👕"}].map(e=>j`
            <button
              class="tab ${this._activeTab===e.key?"active":""}"
              @click="${()=>this._handleTabChange(e.key)}"
            >
              <span class="tab-icon">${e.icon}</span>
              <span class="tab-label">${e.label}</span>
            </button>
          `)}
      </div>
    `}_handleTabChange(e){this._activeTab=e,this._error=""}_renderContent(){switch(this._activeTab){case"children":return this._renderChildrenSection();case"tasks":return this._renderTasksSection();case"habits":return this._renderHabitsSection();case"rewards":return this._renderRewardsSection();case"cosmetics":return this._renderCosmeticsSection();default:return j``}}_renderChildrenSection(){if(!this._store)return j`<div class="loading">Chargement...</div>`;const e=this._store.getChildren();return j`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Enfants</h2>
          <button class="btn btn-primary" @click="${()=>this._openChildDialog("create")}">
            + Ajouter un enfant
          </button>
        </div>

        ${0===e.length?j`<p class="empty-message">Aucun enfant enregistré</p>`:j`
              <div class="items-list">
                ${e.map(e=>this._renderChildCard(e))}
              </div>
            `}
      </div>
    `}_renderChildCard(e){return j`
      <hm-item-card .icon="${"👤"}" .iconColor="${"#03a9f4"}">
        <div class="item-content">
          <h3 class="item-title">${e.name}</h3>
          <p class="item-description">
            Niveau ${e.level} • ${e.points} points • ${e.coins} pièces
          </p>
          <div class="item-meta">
            <span class="badge">${e.person_entity}</span>
          </div>
        </div>
        <div slot="actions">
          <button
            class="btn-icon"
            @click="${()=>this._openChildDialog("edit",e)}"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            class="btn-icon"
            @click="${()=>this._handleDeleteChild(e)}"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </hm-item-card>
    `}_openChildDialog(e,t){this._dialogMode=e,this._selectedItem=t,this._formData=t?{name:t.name,person_entity:t.person_entity,avatar_photo_url:t.avatar.photo_url}:{name:"",person_entity:"",avatar_photo_url:""},this._showDialog=!0}async _handleSaveChild(){if(this._store)try{this._loading=!0,this._error="","create"===this._dialogMode?await this._store.createChild({name:this._formData.name,person_entity:this._formData.person_entity,avatar_photo_url:this._formData.avatar_photo_url||void 0}):this._selectedItem&&await this._store.updateChild(this._selectedItem.id,{name:this._formData.name,person_entity:this._formData.person_entity,avatar:{...this._selectedItem.avatar,photo_url:this._formData.avatar_photo_url}}),this._showDialog=!1,this._formData={}}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la sauvegarde"}finally{this._loading=!1}}async _handleDeleteChild(e){if(this._store&&confirm(`Supprimer l'enfant "${e.name}" ?`))try{this._loading=!0,this._error="",await this._store.deleteChild(e.id)}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la suppression"}finally{this._loading=!1}}_renderTasksSection(){if(!this._store)return j`<div class="loading">Chargement...</div>`;const e=this._store.getState().tasks;return j`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Tâches</h2>
          <button class="btn btn-primary" @click="${()=>this._openTaskDialog("create")}">
            + Ajouter une tâche
          </button>
        </div>

        ${0===e.length?j`<p class="empty-message">Aucune tâche créée</p>`:j`
              <div class="items-list">
                ${e.map(e=>this._renderTaskCard(e))}
              </div>
            `}
      </div>
    `}_renderTaskCard(e){const t=this._store?.getChildren()||[],i=e.assigned_to.map(e=>t.find(t=>t.id===e)?.name).filter(Boolean).join(", ");return j`
      <hm-item-card .icon="${e.icon}" .iconColor="${e.color}">
        <div class="item-content">
          <h3 class="item-title">${e.title}</h3>
          <p class="item-description">${e.description}</p>
          <div class="item-meta">
            <span class="badge">${"mandatory"===e.type?"Obligatoire":"Bonus"}</span>
            <span class="badge">${this._formatCategory(e.category)}</span>
            ${i?j`<span class="badge">👤 ${i}</span>`:""}
            <span class="badge">⭐ ${e.rewards.points} pts</span>
          </div>
        </div>
        <div slot="actions">
          <button
            class="btn-icon"
            @click="${()=>this._openTaskDialog("edit",e)}"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            class="btn-icon"
            @click="${()=>this._handleDeleteTask(e)}"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </hm-item-card>
    `}_openTaskDialog(e,t){this._dialogMode=e,this._selectedItem=t,this._formData=t?{title:t.title,description:t.description,type:t.type,assigned_to:t.assigned_to,schedule_type:t.schedule.type,schedule_days:t.schedule.days||[],schedule_time:t.schedule.time||"",schedule_specific_date:t.schedule.specific_date||"",rewards_points:t.rewards.points,rewards_coins:t.rewards.coins,rewards_experience:t.rewards.experience,penalties_points:t.penalties.points,penalties_coins:t.penalties.coins,icon:t.icon,color:t.color,difficulty:t.difficulty,estimated_duration:t.estimated_duration,category:t.category}:{title:"",description:"",type:"mandatory",assigned_to:[],schedule_type:"daily",schedule_days:[],schedule_time:"",schedule_specific_date:"",rewards_points:10,rewards_coins:5,rewards_experience:10,penalties_points:5,penalties_coins:2,icon:"✅",color:"#03a9f4",difficulty:1,estimated_duration:15,category:"chores"},this._showDialog=!0}async _handleSaveTask(){if(this._store)try{this._loading=!0,this._error="";const e={title:this._formData.title,description:this._formData.description,type:this._formData.type,assigned_to:this._formData.assigned_to,schedule:{type:this._formData.schedule_type,days:this._formData.schedule_days.length>0?this._formData.schedule_days:void 0,time:this._formData.schedule_time||void 0,specific_date:this._formData.schedule_specific_date||void 0},rewards:{points:Number(this._formData.rewards_points),coins:Number(this._formData.rewards_coins),experience:Number(this._formData.rewards_experience)},penalties:{points:Number(this._formData.penalties_points),coins:Number(this._formData.penalties_coins)},icon:this._formData.icon,color:this._formData.color,difficulty:Number(this._formData.difficulty),estimated_duration:Number(this._formData.estimated_duration),category:this._formData.category,active:!0};"create"===this._dialogMode?await this._store.createTask(e):this._selectedItem&&await this._store.updateTask(this._selectedItem.id,e),this._showDialog=!1,this._formData={}}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la sauvegarde"}finally{this._loading=!1}}async _handleDeleteTask(e){if(this._store&&confirm(`Supprimer la tâche "${e.title}" ?`))try{this._loading=!0,this._error="",await this._store.deleteTask(e.id)}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la suppression"}finally{this._loading=!1}}_renderHabitsSection(){if(!this._store)return j`<div class="loading">Chargement...</div>`;const e=this._store.getState().habits;return j`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Habitudes</h2>
          <button class="btn btn-primary" @click="${()=>this._openHabitDialog("create")}">
            + Ajouter une habitude
          </button>
        </div>

        ${0===e.length?j`<p class="empty-message">Aucune habitude créée</p>`:j`
              <div class="items-list">
                ${e.map(e=>this._renderHabitCard(e))}
              </div>
            `}
      </div>
    `}_renderHabitCard(e){const t=this._store?.getChildren()||[],i=e.assigned_to.map(e=>t.find(t=>t.id===e)?.name).filter(Boolean).join(", ");return j`
      <hm-item-card .icon="${e.icon}" .iconColor="${e.color}">
        <div class="item-content">
          <h3 class="item-title">${e.title}</h3>
          <p class="item-description">${e.description}</p>
          <div class="item-meta">
            <span class="badge">${this._formatFrequency(e.frequency)}</span>
            ${i?j`<span class="badge">👤 ${i}</span>`:""}
            <span class="badge">⭐ ${e.rewards.points} pts</span>
          </div>
        </div>
        <div slot="actions">
          <button
            class="btn-icon"
            @click="${()=>this._openHabitDialog("edit",e)}"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            class="btn-icon"
            @click="${()=>this._handleDeleteHabit(e)}"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </hm-item-card>
    `}_openHabitDialog(e,t){this._dialogMode=e,this._selectedItem=t,this._formData=t?{title:t.title,description:t.description,frequency:t.frequency,assigned_to:t.assigned_to,rewards_points:t.rewards.points,rewards_coins:t.rewards.coins,rewards_experience:t.rewards.experience,streak_bonus_enabled:t.rewards.streak_bonus.enabled,streak_bonus_type:t.rewards.streak_bonus.type,streak_bonus_multiplier:t.rewards.streak_bonus.multiplier,icon:t.icon,color:t.color}:{title:"",description:"",frequency:"daily",assigned_to:[],rewards_points:5,rewards_coins:2,rewards_experience:5,streak_bonus_enabled:!0,streak_bonus_type:"progressive",streak_bonus_multiplier:1.1,icon:"🔄",color:"#4caf50"},this._showDialog=!0}async _handleSaveHabit(){if(this._store)try{this._loading=!0,this._error="";const e={title:this._formData.title,description:this._formData.description,frequency:this._formData.frequency,assigned_to:this._formData.assigned_to,rewards:{points:Number(this._formData.rewards_points),coins:Number(this._formData.rewards_coins),experience:Number(this._formData.rewards_experience),streak_bonus:{enabled:Boolean(this._formData.streak_bonus_enabled),type:this._formData.streak_bonus_type,multiplier:Number(this._formData.streak_bonus_multiplier)}},icon:this._formData.icon,color:this._formData.color,active:!0};"create"===this._dialogMode?await this._store.createHabit(e):this._selectedItem&&await this._store.updateHabit(this._selectedItem.id,e),this._showDialog=!1,this._formData={}}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la sauvegarde"}finally{this._loading=!1}}async _handleDeleteHabit(e){if(this._store&&confirm(`Supprimer l'habitude "${e.title}" ?`))try{this._loading=!0,this._error="",await this._store.deleteHabit(e.id)}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la suppression"}finally{this._loading=!1}}_renderRewardsSection(){if(!this._store)return j`<div class="loading">Chargement...</div>`;const e=this._store.getState().rewards;return j`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Récompenses</h2>
          <button class="btn btn-primary" @click="${()=>this._openRewardDialog("create")}">
            + Ajouter une récompense
          </button>
        </div>

        ${0===e.length?j`<p class="empty-message">Aucune récompense créée</p>`:j`
              <div class="items-list">
                ${e.map(e=>this._renderRewardCard(e))}
              </div>
            `}
      </div>
    `}_renderRewardCard(e){return j`
      <hm-item-card .icon="${e.icon}" .iconColor="${e.color}">
        <div class="item-content">
          <h3 class="item-title">${e.title}</h3>
          <p class="item-description">${e.description}</p>
          <div class="item-meta">
            <span class="badge">${this._formatRewardType(e.type)}</span>
            <span class="badge">⭐ ${e.cost_points} pts</span>
            <span class="badge">💰 ${e.cost_coins} pièces</span>
            ${e.requires_parent_approval?j`<span class="badge">✅ Validation requise</span>`:""}
          </div>
        </div>
        <div slot="actions">
          <button
            class="btn-icon"
            @click="${()=>this._openRewardDialog("edit",e)}"
            title="Modifier"
          >
            ✏️
          </button>
        </div>
      </hm-item-card>
    `}_openRewardDialog(e,t){this._dialogMode=e,this._selectedItem=t,this._formData=t?{title:t.title,description:t.description,type:t.type,cost_points:t.cost_points,cost_coins:t.cost_coins,icon:t.icon,color:t.color,stock:t.stock,cooldown_days:t.cooldown_days,requires_parent_approval:t.requires_parent_approval}:{title:"",description:"",type:"activity",cost_points:50,cost_coins:20,icon:"🎁",color:"#ff9800",stock:null,cooldown_days:0,requires_parent_approval:!0},this._showDialog=!0}async _handleSaveReward(){if(this._store)try{this._loading=!0,this._error="";const e={title:this._formData.title,description:this._formData.description,type:this._formData.type,cost_points:Number(this._formData.cost_points),cost_coins:Number(this._formData.cost_coins),icon:this._formData.icon,color:this._formData.color,stock:this._formData.stock?Number(this._formData.stock):null,cooldown_days:Number(this._formData.cooldown_days),requires_parent_approval:Boolean(this._formData.requires_parent_approval),active:!0};("create"===this._dialogMode||this._selectedItem)&&await this._store.createReward(e),this._showDialog=!1,this._formData={}}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la sauvegarde"}finally{this._loading=!1}}_renderDialog(){if(!this._showDialog)return j``;const e="create"===this._dialogMode?`Ajouter ${this._getDialogTitleSuffix()}`:`Modifier ${this._getDialogTitleSuffix()}`;return j`
      <hm-dialog
        .open="${this._showDialog}"
        .title="${e}"
        .loading="${this._loading}"
        @confirm="${this._handleDialogConfirm}"
        @cancel="${this._handleDialogCancel}"
      >
        ${this._renderDialogContent()}
      </hm-dialog>
    `}_getDialogTitleSuffix(){switch(this._activeTab){case"children":return"un enfant";case"tasks":return"une tâche";case"habits":return"une habitude";case"rewards":return"une récompense";case"cosmetics":return"un cosmétique";default:return""}}_renderDialogContent(){switch(this._activeTab){case"children":return this._renderChildForm();case"tasks":return this._renderTaskForm();case"habits":return this._renderHabitForm();case"rewards":return this._renderRewardForm();case"cosmetics":return this._renderCosmeticForm();default:return j``}}_handleDialogConfirm(){switch(this._activeTab){case"children":this._handleSaveChild();break;case"tasks":this._handleSaveTask();break;case"habits":this._handleSaveHabit();break;case"rewards":this._handleSaveReward();break;case"cosmetics":this._saveCosmeticDialog()}}_handleDialogCancel(){this._showDialog=!1,this._formData={},this._selectedItem=void 0}_renderChildForm(){return j`
      <hm-form-input
        label="Nom"
        .value="${this._formData.name||""}"
        required
        @value-changed="${e=>this._formData.name=e.detail.value}"
      ></hm-form-input>

      <hm-form-input
        label="Entité Person"
        .value="${this._formData.person_entity||""}"
        required
        helper="Ex: person.alice"
        @value-changed="${e=>this._formData.person_entity=e.detail.value}"
      ></hm-form-input>

      <hm-form-input
        label="URL Avatar (optionnel)"
        .value="${this._formData.avatar_photo_url||""}"
        type="text"
        placeholder="https://..."
        @value-changed="${e=>this._formData.avatar_photo_url=e.detail.value}"
      ></hm-form-input>
    `}_renderTaskForm(){const e=(this._store?.getChildren()||[]).map(e=>({value:e.id,label:e.name}));return j`
      <hm-form-input
        label="Titre"
        .value="${this._formData.title||""}"
        required
        @value-changed="${e=>this._formData.title=e.detail.value}"
      ></hm-form-input>

      <hm-form-textarea
        label="Description"
        .value="${this._formData.description||""}"
        rows="3"
        @value-changed="${e=>this._formData.description=e.detail.value}"
      ></hm-form-textarea>

      <hm-form-select
        label="Type"
        .value="${this._formData.type||"mandatory"}"
        .options="${[{value:"mandatory",label:"Obligatoire"},{value:"bonus",label:"Bonus"}]}"
        required
        @value-changed="${e=>this._formData.type=e.detail.value}"
      ></hm-form-select>

      <hm-form-select
        label="Assigné à"
        .value="${this._formData.assigned_to||[]}"
        .options="${e}"
        .multiple="${!0}"
        helper="Sélectionnez un ou plusieurs enfants"
        @value-changed="${e=>this._formData.assigned_to=e.detail.value}"
      ></hm-form-select>

      <hm-form-select
        label="Fréquence"
        .value="${this._formData.schedule_type||"daily"}"
        .options="${[{value:"daily",label:"Quotidien"},{value:"weekly",label:"Hebdomadaire"},{value:"monthly",label:"Mensuel"},{value:"specific_date",label:"Date spécifique"}]}"
        required
        @value-changed="${e=>this._formData.schedule_type=e.detail.value}"
      ></hm-form-select>

      <hm-form-select
        label="Catégorie"
        .value="${this._formData.category||"chores"}"
        .options="${[{value:"chores",label:"Tâches ménagères"},{value:"homework",label:"Devoirs"},{value:"personal",label:"Personnel"},{value:"other",label:"Autre"}]}"
        required
        @value-changed="${e=>this._formData.category=e.detail.value}"
      ></hm-form-select>

      <div class="form-row">
        <hm-form-input
          label="Points"
          .value="${String(this._formData.rewards_points||10)}"
          type="number"
          min="0"
          required
          @value-changed="${e=>this._formData.rewards_points=e.detail.value}"
        ></hm-form-input>

        <hm-form-input
          label="Pièces"
          .value="${String(this._formData.rewards_coins||5)}"
          type="number"
          min="0"
          required
          @value-changed="${e=>this._formData.rewards_coins=e.detail.value}"
        ></hm-form-input>

        <hm-form-input
          label="Expérience"
          .value="${String(this._formData.rewards_experience||10)}"
          type="number"
          min="0"
          required
          @value-changed="${e=>this._formData.rewards_experience=e.detail.value}"
        ></hm-form-input>
      </div>

      <div class="form-row">
        <hm-form-input
          label="Difficulté (1-3)"
          .value="${String(this._formData.difficulty||1)}"
          type="number"
          min="1"
          max="3"
          required
          @value-changed="${e=>this._formData.difficulty=e.detail.value}"
        ></hm-form-input>

        <hm-form-input
          label="Durée (minutes)"
          .value="${String(this._formData.estimated_duration||15)}"
          type="number"
          min="1"
          required
          @value-changed="${e=>this._formData.estimated_duration=e.detail.value}"
        ></hm-form-input>
      </div>

      <div class="form-row">
        <hm-form-input
          label="Icône"
          .value="${this._formData.icon||"✅"}"
          placeholder="✅"
          @value-changed="${e=>this._formData.icon=e.detail.value}"
        ></hm-form-input>

        <hm-form-input
          label="Couleur"
          .value="${this._formData.color||"#03a9f4"}"
          type="text"
          placeholder="#03a9f4"
          @value-changed="${e=>this._formData.color=e.detail.value}"
        ></hm-form-input>
      </div>
    `}_renderHabitForm(){const e=(this._store?.getChildren()||[]).map(e=>({value:e.id,label:e.name}));return j`
      <hm-form-input
        label="Titre"
        .value="${this._formData.title||""}"
        required
        @value-changed="${e=>this._formData.title=e.detail.value}"
      ></hm-form-input>

      <hm-form-textarea
        label="Description"
        .value="${this._formData.description||""}"
        rows="3"
        @value-changed="${e=>this._formData.description=e.detail.value}"
      ></hm-form-textarea>

      <hm-form-select
        label="Fréquence"
        .value="${this._formData.frequency||"daily"}"
        .options="${[{value:"daily",label:"Quotidien"},{value:"weekly",label:"Hebdomadaire"},{value:"monthly",label:"Mensuel"}]}"
        required
        @value-changed="${e=>this._formData.frequency=e.detail.value}"
      ></hm-form-select>

      <hm-form-select
        label="Assigné à"
        .value="${this._formData.assigned_to||[]}"
        .options="${e}"
        .multiple="${!0}"
        helper="Sélectionnez un ou plusieurs enfants"
        @value-changed="${e=>this._formData.assigned_to=e.detail.value}"
      ></hm-form-select>

      <div class="form-row">
        <hm-form-input
          label="Points"
          .value="${String(this._formData.rewards_points||5)}"
          type="number"
          min="0"
          required
          @value-changed="${e=>this._formData.rewards_points=e.detail.value}"
        ></hm-form-input>

        <hm-form-input
          label="Pièces"
          .value="${String(this._formData.rewards_coins||2)}"
          type="number"
          min="0"
          required
          @value-changed="${e=>this._formData.rewards_coins=e.detail.value}"
        ></hm-form-input>

        <hm-form-input
          label="Expérience"
          .value="${String(this._formData.rewards_experience||5)}"
          type="number"
          min="0"
          required
          @value-changed="${e=>this._formData.rewards_experience=e.detail.value}"
        ></hm-form-input>
      </div>

      <hm-form-checkbox
        label="Activer bonus de série"
        .checked="${this._formData.streak_bonus_enabled??!0}"
        @checked-changed="${e=>this._formData.streak_bonus_enabled=e.detail.checked}"
      ></hm-form-checkbox>

      ${this._formData.streak_bonus_enabled?j`
            <div class="form-row">
              <hm-form-select
                label="Type de bonus"
                .value="${this._formData.streak_bonus_type||"progressive"}"
                .options="${[{value:"progressive",label:"Progressif"},{value:"fixed",label:"Fixe"}]}"
                @value-changed="${e=>this._formData.streak_bonus_type=e.detail.value}"
              ></hm-form-select>

              <hm-form-input
                label="Multiplicateur"
                .value="${String(this._formData.streak_bonus_multiplier||1.1)}"
                type="number"
                min="1"
                step="0.1"
                @value-changed="${e=>this._formData.streak_bonus_multiplier=e.detail.value}"
              ></hm-form-input>
            </div>
          `:""}

      <div class="form-row">
        <hm-form-input
          label="Icône"
          .value="${this._formData.icon||"🔄"}"
          placeholder="🔄"
          @value-changed="${e=>this._formData.icon=e.detail.value}"
        ></hm-form-input>

        <hm-form-input
          label="Couleur"
          .value="${this._formData.color||"#4caf50"}"
          type="text"
          placeholder="#4caf50"
          @value-changed="${e=>this._formData.color=e.detail.value}"
        ></hm-form-input>
      </div>
    `}_renderRewardForm(){return j`
      <hm-form-input
        label="Titre"
        .value="${this._formData.title||""}"
        required
        @value-changed="${e=>this._formData.title=e.detail.value}"
      ></hm-form-input>

      <hm-form-textarea
        label="Description"
        .value="${this._formData.description||""}"
        rows="3"
        @value-changed="${e=>this._formData.description=e.detail.value}"
      ></hm-form-textarea>

      <hm-form-select
        label="Type"
        .value="${this._formData.type||"activity"}"
        .options="${[{value:"screen_time",label:"Temps d'écran"},{value:"meal_choice",label:"Choix de repas"},{value:"activity",label:"Activité"},{value:"other",label:"Autre"}]}"
        required
        @value-changed="${e=>this._formData.type=e.detail.value}"
      ></hm-form-select>

      <div class="form-row">
        <hm-form-input
          label="Coût (points)"
          .value="${String(this._formData.cost_points||50)}"
          type="number"
          min="0"
          required
          @value-changed="${e=>this._formData.cost_points=e.detail.value}"
        ></hm-form-input>

        <hm-form-input
          label="Coût (pièces)"
          .value="${String(this._formData.cost_coins||20)}"
          type="number"
          min="0"
          required
          @value-changed="${e=>this._formData.cost_coins=e.detail.value}"
        ></hm-form-input>
      </div>

      <div class="form-row">
        <hm-form-input
          label="Stock (optionnel)"
          .value="${null!==this._formData.stock?String(this._formData.stock):""}"
          type="number"
          min="0"
          placeholder="Illimité"
          helper="Laissez vide pour stock illimité"
          @value-changed="${e=>this._formData.stock=e.detail.value?Number(e.detail.value):null}"
        ></hm-form-input>

        <hm-form-input
          label="Cooldown (jours)"
          .value="${String(this._formData.cooldown_days||0)}"
          type="number"
          min="0"
          helper="Délai avant réutilisation"
          @value-changed="${e=>this._formData.cooldown_days=e.detail.value}"
        ></hm-form-input>
      </div>

      <hm-form-checkbox
        label="Requiert validation parentale"
        .checked="${this._formData.requires_parent_approval??!0}"
        @checked-changed="${e=>this._formData.requires_parent_approval=e.detail.checked}"
      ></hm-form-checkbox>

      <div class="form-row">
        <hm-form-input
          label="Icône"
          .value="${this._formData.icon||"🎁"}"
          placeholder="🎁"
          @value-changed="${e=>this._formData.icon=e.detail.value}"
        ></hm-form-input>

        <hm-form-input
          label="Couleur"
          .value="${this._formData.color||"#ff9800"}"
          type="text"
          placeholder="#ff9800"
          @value-changed="${e=>this._formData.color=e.detail.value}"
        ></hm-form-input>
      </div>
    `}_renderCosmeticForm(){return j`
      <hm-form-input
        label="Nom"
        .value="${this._formData.name||""}"
        required
        @value-changed="${e=>this._formData.name=e.detail.value}"
      ></hm-form-input>

      <hm-form-textarea
        label="Description"
        .value="${this._formData.description||""}"
        rows="3"
        @value-changed="${e=>this._formData.description=e.detail.value}"
      ></hm-form-textarea>

      <div class="form-row">
        <hm-form-select
          label="Catégorie"
          .value="${this._formData.category||"clothes"}"
          .options="${[{value:"clothes",label:"Vêtements"},{value:"accessory",label:"Accessoires"},{value:"pet",label:"Animaux"},{value:"theme",label:"Thèmes"},{value:"badge",label:"Badges"},{value:"animation",label:"Animations"}]}"
          required
          @value-changed="${e=>this._formData.category=e.detail.value}"
        ></hm-form-select>

        <hm-form-input
          label="Sous-catégorie"
          .value="${this._formData.subcategory||""}"
          placeholder="shirt, hat, dog..."
          helper="Type spécifique dans la catégorie"
          @value-changed="${e=>this._formData.subcategory=e.detail.value}"
        ></hm-form-input>
      </div>

      <div class="form-row">
        <hm-form-select
          label="Rareté"
          .value="${this._formData.rarity||"common"}"
          .options="${[{value:"common",label:"Commun"},{value:"rare",label:"Rare"},{value:"epic",label:"Épique"},{value:"legendary",label:"Légendaire"}]}"
          required
          @value-changed="${e=>this._formData.rarity=e.detail.value}"
        ></hm-form-select>

        <hm-form-input
          label="Coût (pièces)"
          .value="${String(this._formData.cost_coins||10)}"
          type="number"
          min="0"
          required
          @value-changed="${e=>this._formData.cost_coins=e.detail.value}"
        ></hm-form-input>
      </div>

      <hm-form-input
        label="Image/Emoji de prévisualisation"
        .value="${this._formData.preview_image||""}"
        placeholder="👕"
        required
        helper="Emoji ou URL d'image"
        @value-changed="${e=>this._formData.preview_image=e.detail.value}"
      ></hm-form-input>

      <hm-form-input
        label="Niveau minimum requis (optionnel)"
        .value="${this._formData.unlock_min_level?String(this._formData.unlock_min_level):""}"
        type="number"
        min="1"
        placeholder="Aucun prérequis"
        helper="Laissez vide si accessible dès le début"
        @value-changed="${e=>this._formData.unlock_min_level=e.detail.value?Number(e.detail.value):null}"
      ></hm-form-input>

      <hm-form-checkbox
        label="Actif"
        .checked="${this._formData.active??!0}"
        helper="Désactivez pour retirer temporairement de la boutique"
        @checked-changed="${e=>this._formData.active=e.detail.checked}"
      ></hm-form-checkbox>
    `}_renderCosmeticsSection(){if(!this._store)return j`<div class="loading">Chargement...</div>`;const e=this._store.getCosmetics();return j`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Cosmétiques</h2>
          <button class="btn btn-primary" @click="${()=>this._openCosmeticDialog("create")}">
            + Ajouter un cosmétique
          </button>
        </div>

        <p style="margin-bottom: 16px; color: var(--secondary-text-color);">
          Les cosmétiques permettent aux enfants de personnaliser leur avatar avec les pièces qu'ils gagnent.
        </p>

        ${0===e.length?j`
              <div class="empty-message">
                <p>Aucun cosmétique disponible</p>
                <p style="font-size: 14px; margin-top: 8px;">
                  Les cosmétiques par défaut seront chargés au démarrage du système.
                </p>
              </div>
            `:j`
              <div class="items-list">
                ${e.map(e=>this._renderCosmeticCard(e))}
              </div>
            `}
      </div>
    `}_renderCosmeticCard(e){return j`
      <hm-item-card .icon="${e.preview_image}" .iconColor="${this._getRarityColor(e.rarity)}">
        <div>
          <h3 style="margin: 0 0 4px 0;">${e.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: var(--secondary-text-color);">
            ${e.description}
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
            <span class="badge" style="background: ${this._getRarityColor(e.rarity)}">
              ${this._formatRarity(e.rarity)}
            </span>
            <span class="badge">${this._formatCosmeticCategory(e.category)}</span>
            <span class="badge">🪙 ${e.cost_coins}</span>
            ${e.unlock_requirements?j`<span class="badge">🔒 Niveau requis</span>`:""}
          </div>
        </div>
        <div slot="actions">
          <button
            class="btn btn-icon"
            @click="${()=>this._openCosmeticDialog("edit",e)}"
            title="Modifier"
          >
            ✏️
          </button>
        </div>
      </hm-item-card>
    `}_openCosmeticDialog(e,t){this._dialogMode=e,this._selectedItem=t,this._formData=t?{...t}:{name:"",description:"",category:Fe.CLOTHES,subcategory:"",rarity:Ye.COMMON,cost_coins:10,preview_image:"",unlock_requirements:null,active:!0},this._showDialog=!0}async _saveCosmeticDialog(){if(this._store){this._loading=!0,this._error="";try{"create"===this._dialogMode&&await this._store.createCosmetic({name:this._formData.name,description:this._formData.description,category:this._formData.category,subcategory:this._formData.subcategory,rarity:this._formData.rarity,cost_coins:parseInt(this._formData.cost_coins),preview_image:this._formData.preview_image,unlock_requirements:this._formData.unlock_min_level?{min_level:parseInt(this._formData.unlock_min_level)}:null,active:!1!==this._formData.active}),this._showDialog=!1,this._formData={},this._selectedItem=void 0}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la sauvegarde"}finally{this._loading=!1}}}_formatCategory(e){return{chores:"Tâches ménagères",homework:"Devoirs",personal:"Personnel",other:"Autre"}[e]||e}_formatFrequency(e){return{daily:"Quotidien",weekly:"Hebdomadaire",monthly:"Mensuel"}[e]||e}_formatRewardType(e){return{screen_time:"Temps d'écran",meal_choice:"Choix de repas",activity:"Activité",other:"Autre"}[e]||e}_formatCosmeticCategory(e){return{clothes:"Vêtements",accessory:"Accessoires",pet:"Animaux",theme:"Thèmes",badge:"Badges",animation:"Animations"}[e]||e}_formatRarity(e){return{common:"Commun",rare:"Rare",epic:"Épique",legendary:"Légendaire"}[e]||e}_getRarityColor(e){return{common:"#9E9E9E",rare:"#2196F3",epic:"#9C27B0",legendary:"#FF9800"}[e]||"#9E9E9E"}};Ze.styles=Ne,e([he({attribute:!1})],Ze.prototype,"hass",void 0),e([pe()],Ze.prototype,"_config",void 0),e([pe()],Ze.prototype,"_store",void 0),e([pe()],Ze.prototype,"_activeTab",void 0),e([pe()],Ze.prototype,"_showDialog",void 0),e([pe()],Ze.prototype,"_dialogMode",void 0),e([pe()],Ze.prototype,"_selectedItem",void 0),e([pe()],Ze.prototype,"_loading",void 0),e([pe()],Ze.prototype,"_error",void 0),e([pe()],Ze.prototype,"_formData",void 0),Ze=e([le("habits-manager-card")],Ze),window.customCards=window.customCards||[],window.customCards.push({type:"habits-manager-card",name:"Habits Manager",description:"Carte de gestion pour configurer les enfants, tâches et récompenses"});export{Ze as HabitsManagerCard};
