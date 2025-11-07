function e(e,t,i,r){var a,s=arguments.length,o=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(o=(s<3?a(o):s>3?a(t,i,o):a(t,i))||o);return s>3&&o&&Object.defineProperty(t,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),a=new WeakMap;let s=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(t,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1],e[0]);return new s(i,e,r)},n=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,r))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,_=m.trustedTypes,f=_?_.emptyScript:"",v=m.reactiveElementPolyfillSupport,b=(e,t)=>e,g={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:g,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);void 0!==r&&c(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:a}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){const s=r?.call(this);a?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,r)=>{if(i)e.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of r){const r=document.createElement("style"),a=t.litNonce;void 0!==a&&r.setAttribute("nonce",a),r.textContent=i.cssText,e.appendChild(r)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(void 0!==r&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:g).toAttribute(t,i.type);this._$Em=e,null==a?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(e,t){const i=this.constructor,r=i._$Eh.get(e);if(void 0!==r&&this._$Em!==r){const e=i.getPropertyOptions(r),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:g;this._$Em=r;const s=a.fromAttribute(t,e.type);this[r]=s??this._$Ej?.get(r)??s,this._$Em=null}}requestUpdate(e,t,i){if(void 0!==e){const r=this.constructor,a=this[e];if(i??=r.getPropertyOptions(e),!((i.hasChanged??y)(a,t)||i.useDefault&&i.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:a},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==a||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,r=this[t];!0!==e||this._$AL.has(t)||void 0===r||this.C(t,void 0,i,r)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,v?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.1");const w=globalThis,k=w.trustedTypes,D=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+S,A=`<${E}>`,T=document,q=()=>T.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,H=Array.isArray,I="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,O=/>/g,M=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,U=/"/g,L=/^(?:script|style|textarea|title)$/i,j=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),B=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),W=new WeakMap,Y=T.createTreeWalker(T,129);function V(e,t){if(!H(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==D?D.createHTML(t):t}const G=(e,t)=>{const i=e.length-1,r=[];let a,s=2===t?"<svg>":3===t?"<math>":"",o=P;for(let t=0;t<i;t++){const i=e[t];let n,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===P?"!--"===l[1]?o=N:void 0!==l[1]?o=O:void 0!==l[2]?(L.test(l[2])&&(a=RegExp("</"+l[2],"g")),o=M):void 0!==l[3]&&(o=M):o===M?">"===l[0]?(o=a??P,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,n=l[1],o=void 0===l[3]?M:'"'===l[3]?U:z):o===U||o===z?o=M:o===N||o===O?o=P:(o=M,a=void 0);const h=o===M&&e[t+1].startsWith("/>")?" ":"";s+=o===P?i+A:c>=0?(r.push(n),i.slice(0,c)+C+i.slice(c)+S+h):i+S+(-2===c?t:h)}return[V(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),r]};class K{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let a=0,s=0;const o=e.length-1,n=this.parts,[l,c]=G(e,t);if(this.el=K.createElement(l,i),Y.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(r=Y.nextNode())&&n.length<o;){if(1===r.nodeType){if(r.hasAttributes())for(const e of r.getAttributeNames())if(e.endsWith(C)){const t=c[s++],i=r.getAttribute(e).split(S),o=/([.?@])?(.*)/.exec(t);n.push({type:1,index:a,name:o[2],strings:i,ctor:"."===o[1]?ee:"?"===o[1]?te:"@"===o[1]?ie:Z}),r.removeAttribute(e)}else e.startsWith(S)&&(n.push({type:6,index:a}),r.removeAttribute(e));if(L.test(r.tagName)){const e=r.textContent.split(S),t=e.length-1;if(t>0){r.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)r.append(e[i],q()),Y.nextNode(),n.push({type:2,index:++a});r.append(e[t],q())}}}else if(8===r.nodeType)if(r.data===E)n.push({type:2,index:a});else{let e=-1;for(;-1!==(e=r.data.indexOf(S,e+1));)n.push({type:7,index:a}),e+=S.length-1}a++}}static createElement(e,t){const i=T.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,r){if(t===B)return t;let a=void 0!==r?i._$Co?.[r]:i._$Cl;const s=R(t)?void 0:t._$litDirective$;return a?.constructor!==s&&(a?._$AO?.(!1),void 0===s?a=void 0:(a=new s(e),a._$AT(e,i,r)),void 0!==r?(i._$Co??=[])[r]=a:i._$Cl=a),void 0!==a&&(t=X(e,a._$AS(e,t.values),a,r)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=(e?.creationScope??T).importNode(t,!0);Y.currentNode=r;let a=Y.nextNode(),s=0,o=0,n=i[0];for(;void 0!==n;){if(s===n.index){let t;2===n.type?t=new J(a,a.nextSibling,this,e):1===n.type?t=new n.ctor(a,n.name,n.strings,this,e):6===n.type&&(t=new re(a,this,e)),this._$AV.push(t),n=i[++o]}s!==n?.index&&(a=Y.nextNode(),s++)}return Y.currentNode=T,r}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),R(e)?e===F||null==e||""===e?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>H(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==F&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,r="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=K.createElement(V(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(t);else{const e=new Q(r,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new K(e)),t}k(e){H(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const a of e)r===t.length?t.push(i=new J(this.O(q()),this.O(q()),this,this.options)):i=t[r],i._$AI(a),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,a){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(e,t=this,i,r){const a=this.strings;let s=!1;if(void 0===a)e=X(this,e,t,0),s=!R(e)||e!==this._$AH&&e!==B,s&&(this._$AH=e);else{const r=e;let o,n;for(e=a[0],o=0;o<a.length-1;o++)n=X(this,r[i+o],t,o),n===B&&(n=this._$AH[o]),s||=!R(n)||n!==this._$AH[o],n===F?e=F:e!==F&&(e+=(n??"")+a[o+1]),this._$AH[o]=n}s&&!r&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Z{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}}class te extends Z{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==F)}}class ie extends Z{constructor(e,t,i,r,a){super(e,t,i,r,a),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??F)===B)return;const i=this._$AH,r=e===F&&i!==F||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,a=e!==F&&(i===F||r);r&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(K,J),(w.litHtmlVersions??=[]).push("3.3.1");const se=globalThis;class oe extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const r=i?.renderBefore??t;let a=r._$litPart$;if(void 0===a){const e=i?.renderBefore??null;r._$litPart$=a=new J(t.insertBefore(q(),e),e,void 0,i??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}oe._$litElement$=!0,oe.finalized=!0,se.litElementHydrateSupport?.({LitElement:oe});const ne=se.litElementPolyfillSupport;ne?.({LitElement:oe}),(se.litElementVersions??=[]).push("4.2.1");const le={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:y},ce=(e=le,t,i)=>{const{kind:r,metadata:a}=i;let s=globalThis.litPropertyMetadata.get(a);if(void 0===s&&globalThis.litPropertyMetadata.set(a,s=new Map),"setter"===r&&((e=Object.create(e)).wrapped=!0),s.set(i.name,e),"accessor"===r){const{name:r}=i;return{set(i){const a=t.get.call(this);t.set.call(this,i),this.requestUpdate(r,a,e)},init(t){return void 0!==t&&this.C(r,void 0,e,t),t}}}if("setter"===r){const{name:r}=i;return function(i){const a=this[r];t.call(this,i),this.requestUpdate(r,a,e)}}throw Error("Unsupported decorator location: "+r)};function de(e){return(t,i)=>"object"==typeof i?ce(e,t,i):((e,t,i)=>{const r=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),r?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function he(e){return de({...e,state:!0,attribute:!1})}const pe="habits_manager",ue="create_child",me="update_child",_e="delete_child",fe="create_task",ve="update_task",be="delete_task",ge="mark_task_completed",ye="validate_task",$e="refuse_task",xe="validate_penalty",we="create_habit",ke="update_habit",De="delete_habit",Ce="complete_habit",Se="create_reward",Ee="claim_reward",Ae="approve_claim",Te="create_cosmetic",qe="purchase_cosmetic",Re="list_children",He="list_tasks",Ie="list_habits",Pe="list_rewards",Ne="list_cosmetics";class Oe{constructor(e){this.hass=e}async callService(e,t={}){return this.hass.callService(pe,e,t)}async callServiceWithResponse(e,t={}){return this.hass.connection.sendMessagePromise({type:"call_service",domain:pe,service:e,service_data:t,return_response:!0})}async createChild(e){return this.callService(ue,e)}async updateChild(e,t){return this.callService(me,{child_id:e,...t})}async deleteChild(e){return this.callService(_e,{child_id:e})}async createTask(e){return this.callService(fe,e)}async updateTask(e,t){return this.callService(ve,{task_id:e,...t})}async deleteTask(e){return this.callService(be,{task_id:e})}async markTaskCompleted(e,t){return this.callService(ge,{instance_id:e,child_id:t})}async validateTask(e,t,i){return this.callService(ye,{instance_id:e,validator_id:t,note:i})}async refuseTask(e,t,i=!1,r){return this.callService($e,{instance_id:e,validator_id:t,apply_penalty:i,note:r})}async validatePenalty(e,t){return this.callService(xe,{instance_id:e,validator_id:t})}async createHabit(e){return this.callService(we,e)}async updateHabit(e,t){return this.callService(ke,{habit_id:e,...t})}async deleteHabit(e){return this.callService(De,{habit_id:e})}async completeHabit(e,t){return this.callService(Ce,{habit_id:e,child_id:t})}async createReward(e){return this.callService(Se,e)}async claimReward(e,t){return this.callService(Ee,{reward_id:e,child_id:t})}async approveClaim(e,t){return this.callService(Ae,{claim_id:e,approver_id:t})}async createCosmetic(e){return this.callService(Te,e)}async purchaseCosmetic(e,t){return this.callService(qe,{cosmetic_id:e,child_id:t})}getChildren(){const e=[],t=Object.values(this.hass.states).filter(e=>e.entity_id.startsWith(`sensor.${pe}_`)&&e.entity_id.endsWith("_points"));for(const i of t){const t=i.attributes.child_id;if(t){const i=this.getChildData(t);i&&e.push(i)}}return e}getChildData(e){const t=this.hass.states[`sensor.${pe}_${e}_points`];if(!t)return null;const i=this.hass.states[`sensor.${pe}_${e}_coins`],r=this.hass.states[`sensor.${pe}_${e}_level`],a=this.hass.states[`sensor.${pe}_${e}_experience`];return{id:e,name:t.attributes.child_name||"Unknown",person_entity:t.attributes.person_entity||"",points:parseInt(t.state)||0,coins:i&&parseInt(i.state)||0,level:r&&parseInt(r.state)||1,experience:a&&parseInt(a.state)||0,experience_to_next_level:a?.attributes.experience_to_next_level||100,avatar:t.attributes.avatar||{photo_url:"",customization:{clothes:null,accessory:null,pet:null,theme:"default"}},badges:t.attributes.badges||[],owned_cosmetics:t.attributes.owned_cosmetics||[],created_at:t.attributes.created_at||(new Date).toISOString(),updated_at:t.attributes.updated_at||(new Date).toISOString()}}getTaskCounts(e){const t=this.hass.states[`sensor.${pe}_${e}_tasks_pending`],i=this.hass.states[`sensor.${pe}_${e}_tasks_completed_waiting`];return{pending:t&&parseInt(t.state)||0,waiting:i&&parseInt(i.state)||0}}getHabitStats(e){const t=this.hass.states[`sensor.${pe}_${e}_habits_count`],i=this.hass.states[`sensor.${pe}_${e}_longest_streak`];return{count:t&&parseInt(t.state)||0,longest_streak:i&&parseInt(i.state)||0}}getCosmetics(){const e=this.hass.states[`sensor.${pe}_cosmetics`];return e&&e.attributes.cosmetics?e.attributes.cosmetics:[]}async subscribeToUpdates(e){return this.hass.connection.subscribeEvents(e,`${pe}_update`)}async listChildren(){try{return(await this.callServiceWithResponse(Re,{})).children||[]}catch(e){throw e}}async listTasks(e){try{return(await this.callServiceWithResponse(He,e||{})).tasks||[]}catch(e){throw e}}async listHabits(e){try{return(await this.callServiceWithResponse(Ie,e||{})).habits||[]}catch(e){throw e}}async listRewards(e){try{return(await this.callServiceWithResponse(Pe,e||{})).rewards||[]}catch(e){throw e}}async listCosmetics(e){try{return(await this.callServiceWithResponse(Ne,e||{})).cosmetics||[]}catch(e){throw e}}}class Me{constructor(e){this.listeners=new Set,this.state={children:[],tasks:[],taskInstances:[],habits:[],habitStreaks:[],rewards:[],rewardClaims:[],cosmetics:[],loading:!0,error:null},this.hass=e,this.api=new Oe(e),this.initialize()}async initialize(){try{const e=setTimeout(()=>{},1e4);await this.loadAllData(),clearTimeout(e),this.unsubscribe=await this.api.subscribeToUpdates(e=>{this.handleUpdate(e)}),this.state.loading=!1,this.notifyListeners()}catch(e){this.state.error=e instanceof Error?e.message:"Unknown error",this.state.loading=!1,this.notifyListeners()}}async loadAllData(){const e=await Promise.allSettled([this.api.listChildren(),this.api.listTasks(),this.api.listHabits(),this.api.listRewards(),this.api.listCosmetics({active_only:!0})]);"fulfilled"===e[0].status?this.state.children=e[0].value:this.state.children=[],"fulfilled"===e[1].status?this.state.tasks=e[1].value:this.state.tasks=[],"fulfilled"===e[2].status?this.state.habits=e[2].value:this.state.habits=[],"fulfilled"===e[3].status?this.state.rewards=e[3].value:this.state.rewards=[],"fulfilled"===e[4].status?this.state.cosmetics=e[4].value:this.state.cosmetics=[]}handleUpdate(e){const{update_type:t}=e;switch(t){case"child_created":case"child_updated":case"child_deleted":case"reward_claimed":case"reward_approved":case"cosmetic_purchased":case"level_up":case"badge_earned":case"points_changed":case"coins_changed":this.state.children=this.api.getChildren();break;case"task_completed":case"task_validated":case"task_refused":case"task_failed":case"habit_completed":case"streak_increased":case"streak_broken":e.child_id&&(this.state.children=this.api.getChildren())}this.notifyListeners()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notifyListeners(){this.listeners.forEach(e=>e())}getState(){return{...this.state}}async refresh(){this.state.loading=!0,this.notifyListeners();try{await this.loadAllData(),this.state.loading=!1,this.state.error=null}catch(e){this.state.error=e instanceof Error?e.message:"Unknown error",this.state.loading=!1}this.notifyListeners()}getChildren(){return this.state.children}getChild(e){return this.state.children.find(t=>t.id===e)}async createChild(e){try{await this.api.createChild(e),await this.refresh()}catch(e){throw e}}async updateChild(e,t){try{await this.api.updateChild(e,t),await this.refresh()}catch(e){throw e}}async deleteChild(e){try{await this.api.deleteChild(e),await this.refresh()}catch(e){throw e}}getTasks(){return this.state.tasks}getTask(e){return this.state.tasks.find(t=>t.id===e)}getTaskCounts(e){return this.api.getTaskCounts(e)}async createTask(e){try{await this.api.createTask(e),await this.refresh()}catch(e){throw e}}async updateTask(e,t){try{await this.api.updateTask(e,t),await this.refresh()}catch(e){throw e}}async deleteTask(e){try{await this.api.deleteTask(e),await this.refresh()}catch(e){throw e}}async markTaskCompleted(e,t){try{await this.api.markTaskCompleted(e,t),await this.refresh()}catch(e){throw e}}async validateTask(e,t,i){try{await this.api.validateTask(e,t,i),await this.refresh()}catch(e){throw e}}async refuseTask(e,t,i,r){try{await this.api.refuseTask(e,t,i,r),await this.refresh()}catch(e){throw e}}getHabits(){return this.state.habits}getHabit(e){return this.state.habits.find(t=>t.id===e)}getHabitStats(e){return this.api.getHabitStats(e)}async createHabit(e){try{await this.api.createHabit(e),await this.refresh()}catch(e){throw e}}async updateHabit(e,t){try{await this.api.updateHabit(e,t),await this.refresh()}catch(e){throw e}}async deleteHabit(e){try{await this.api.deleteHabit(e),await this.refresh()}catch(e){throw e}}async completeHabit(e,t){try{await this.api.completeHabit(e,t),await this.refresh()}catch(e){throw e}}getRewards(){return this.state.rewards}getReward(e){return this.state.rewards.find(t=>t.id===e)}async createReward(e){try{await this.api.createReward(e),await this.refresh()}catch(e){throw e}}async claimReward(e,t){try{await this.api.claimReward(e,t),await this.refresh()}catch(e){throw e}}async approveClaim(e,t){try{await this.api.approveClaim(e,t),await this.refresh()}catch(e){throw e}}getCosmetics(){return this.state.cosmetics}getOwnedCosmetics(e){const t=this.getChild(e);return t?this.state.cosmetics.filter(e=>t.owned_cosmetics.includes(e.id)):[]}getAvailableCosmetics(e){const t=this.getChild(e);return t?this.state.cosmetics.filter(e=>{if(t.owned_cosmetics.includes(e.id))return!1;if(e.unlock_requirements){const i=e.unlock_requirements;if(i.level&&t.level<i.level)return!1;if(i.badge&&!t.badges.includes(i.badge))return!1}return!0}):[]}async createCosmetic(e){try{await this.api.createCosmetic(e),await this.refresh()}catch(e){throw e}}async purchaseCosmetic(e,t){try{await this.api.purchaseCosmetic(e,t),await this.refresh()}catch(e){throw e}}destroy(){this.unsubscribe&&this.unsubscribe(),this.listeners.clear()}}const ze=o`
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
`;var Ue,Le,je,Be,Fe,We,Ye,Ve,Ge,Ke,Xe;!function(e){e.MANDATORY="mandatory",e.BONUS="bonus"}(Ue||(Ue={})),function(e){e.DAILY="daily",e.WEEKLY="weekly",e.MONTHLY="monthly",e.SPECIFIC_DATE="specific_date"}(Le||(Le={})),function(e){e.CHORES="chores",e.HOMEWORK="homework",e.PERSONAL="personal",e.OTHER="other"}(je||(je={})),function(e){e.PENDING="pending",e.COMPLETED_WAITING="completed_waiting",e.VALIDATED="validated",e.REFUSED="refused",e.FAILED="failed"}(Be||(Be={})),function(e){e.DAILY="daily",e.WEEKLY="weekly",e.MONTHLY="monthly"}(Fe||(Fe={})),function(e){e.PROGRESSIVE="progressive",e.FIXED="fixed"}(We||(We={})),function(e){e.SCREEN_TIME="screen_time",e.MEAL_CHOICE="meal_choice",e.ACTIVITY="activity",e.OTHER="other"}(Ye||(Ye={})),function(e){e.PENDING="pending",e.APPROVED="approved",e.USED="used",e.EXPIRED="expired"}(Ve||(Ve={})),function(e){e.CLOTHES="clothes",e.ACCESSORY="accessory",e.PET="pet",e.THEME="theme",e.BADGE="badge",e.ANIMATION="animation"}(Ge||(Ge={})),function(e){e.COMMON="common",e.RARE="rare",e.EPIC="epic",e.LEGENDARY="legendary"}(Ke||(Ke={})),function(e){e.FIRST_TASK="first_task",e.TASKS_COUNT="tasks_count",e.STREAK_DAYS="streak_days",e.LEVEL_REACHED="level_reached",e.POINTS_EARNED="points_earned"}(Xe||(Xe={}));class Qe extends oe{constructor(){super(...arguments),this.label="",this.value="",this.type="text",this.placeholder="",this.required=!1,this.disabled=!1,this.error="",this.helper=""}handleInput(e){const t=e.target;this.value=t.value,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return j`
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
    `}}Qe.styles=o`
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
  `,e([de({type:String})],Qe.prototype,"label",void 0),e([de({type:String})],Qe.prototype,"value",void 0),e([de({type:String})],Qe.prototype,"type",void 0),e([de({type:String})],Qe.prototype,"placeholder",void 0),e([de({type:Boolean})],Qe.prototype,"required",void 0),e([de({type:Boolean})],Qe.prototype,"disabled",void 0),e([de({type:Number})],Qe.prototype,"min",void 0),e([de({type:Number})],Qe.prototype,"max",void 0),e([de({type:Number})],Qe.prototype,"step",void 0),e([de({type:String})],Qe.prototype,"error",void 0),e([de({type:String})],Qe.prototype,"helper",void 0),customElements.get("hm-form-input")||customElements.define("hm-form-input",Qe);class Je extends oe{constructor(){super(...arguments),this.label="",this.value="",this.options=[],this.required=!1,this.disabled=!1,this.error="",this.helper="",this.multiple=!1}handleChange(e){const t=e.target;if(this.multiple){const e=Array.from(t.selectedOptions).map(e=>e.value);this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}else this.value=t.value,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){const e=this.multiple&&Array.isArray(this.value)?this.value:[this.value];return j`
      <div class="select-container">
        ${this.label?j`<label class="${this.required?"required":""}">${this.label}</label>`:""}
        <select
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          ?multiple="${this.multiple}"
          class="${this.error?"error":""}"
          @change="${this.handleChange}"
        >
          ${this.required||this.multiple?"":j`<option value="">-- Sélectionner --</option>`}
          ${this.options.map(t=>j`
              <option
                value="${t.value}"
                ?disabled="${t.disabled}"
                ?selected="${e.includes(t.value)}"
              >
                ${t.label}
              </option>
            `)}
        </select>
        ${this.error?j`<span class="error-text">${this.error}</span>`:this.helper?j`<span class="helper-text">${this.helper}</span>`:""}
      </div>
    `}}Je.styles=o`
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
  `,e([de({type:String})],Je.prototype,"label",void 0),e([de()],Je.prototype,"value",void 0),e([de({type:Array})],Je.prototype,"options",void 0),e([de({type:Boolean})],Je.prototype,"required",void 0),e([de({type:Boolean})],Je.prototype,"disabled",void 0),e([de({type:String})],Je.prototype,"error",void 0),e([de({type:String})],Je.prototype,"helper",void 0),e([de({type:Boolean})],Je.prototype,"multiple",void 0),customElements.get("hm-form-select")||customElements.define("hm-form-select",Je);class Ze extends oe{constructor(){super(...arguments),this.label="",this.value="",this.placeholder="",this.required=!1,this.disabled=!1,this.rows=3,this.error="",this.helper=""}handleInput(e){const t=e.target;this.value=t.value,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return j`
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
    `}}Ze.styles=o`
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
  `,e([de({type:String})],Ze.prototype,"label",void 0),e([de({type:String})],Ze.prototype,"value",void 0),e([de({type:String})],Ze.prototype,"placeholder",void 0),e([de({type:Boolean})],Ze.prototype,"required",void 0),e([de({type:Boolean})],Ze.prototype,"disabled",void 0),e([de({type:Number})],Ze.prototype,"rows",void 0),e([de({type:Number})],Ze.prototype,"maxlength",void 0),e([de({type:String})],Ze.prototype,"error",void 0),e([de({type:String})],Ze.prototype,"helper",void 0),customElements.get("hm-form-textarea")||customElements.define("hm-form-textarea",Ze);class et extends oe{constructor(){super(...arguments),this.label="",this.checked=!1,this.disabled=!1,this.helper=""}handleChange(e){const t=e.target;this.checked=t.checked,this.dispatchEvent(new CustomEvent("checked-changed",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}render(){return j`
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
    `}}et.styles=o`
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
  `,e([de({type:String})],et.prototype,"label",void 0),e([de({type:Boolean})],et.prototype,"checked",void 0),e([de({type:Boolean})],et.prototype,"disabled",void 0),e([de({type:String})],et.prototype,"helper",void 0),customElements.get("hm-form-checkbox")||customElements.define("hm-form-checkbox",et);class tt extends oe{constructor(){super(...arguments),this.open=!1,this.title="",this.hideActions=!1,this.confirmText="Confirmer",this.cancelText="Annuler",this.hideCancel=!1,this.loading=!1}handleOverlayClick(e){e.target===e.currentTarget&&this.close()}handleCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0})),this.close()}handleConfirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}close(){this.open=!1}render(){return this.open?j`
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
    `:j``}}tt.styles=o`
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
  `,e([de({type:Boolean,reflect:!0})],tt.prototype,"open",void 0),e([de({type:String})],tt.prototype,"title",void 0),e([de({type:Boolean})],tt.prototype,"hideActions",void 0),e([de({type:String})],tt.prototype,"confirmText",void 0),e([de({type:String})],tt.prototype,"cancelText",void 0),e([de({type:Boolean})],tt.prototype,"hideCancel",void 0),e([de({type:Boolean})],tt.prototype,"loading",void 0),customElements.get("hm-dialog")||customElements.define("hm-dialog",tt);class it extends oe{constructor(){super(...arguments),this.icon="",this.iconColor="",this.clickable=!1,this.selected=!1}handleClick(){this.clickable&&this.dispatchEvent(new CustomEvent("item-click",{bubbles:!0,composed:!0}))}render(){return j`
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
    `}}it.styles=o`
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
  `,e([de({type:String})],it.prototype,"icon",void 0),e([de({type:String})],it.prototype,"iconColor",void 0),e([de({type:Boolean})],it.prototype,"clickable",void 0),e([de({type:Boolean})],it.prototype,"selected",void 0),customElements.get("hm-item-card")||customElements.define("hm-item-card",it);let rt=class extends oe{constructor(){super(...arguments),this._activeTab="children",this._showDialog=!1,this._dialogMode="create",this._loading=!1,this._error="",this._formData={}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config=e}getCardSize(){return 3}updated(e){var t;super.updated(e),e.has("hass")&&this.hass&&!this._store&&(this._store=(t=this.hass,new Me(t)),this._store.subscribe(()=>{this.requestUpdate()}),this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._store&&this._store.destroy()}render(){if(!this._config||!this.hass)return j`<div>Loading Habits Manager v${"0.1.0"}...</div>`;const e=this._config.title||"Gestionnaire de Tâches";return j`
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
    `}_handleTabChange(e){this._activeTab=e,this._error=""}_renderContent(){switch(this._activeTab){case"children":return this._renderChildrenSection();case"tasks":return this._renderTasksSection();case"habits":return this._renderHabitsSection();case"rewards":return this._renderRewardsSection();case"cosmetics":return this._renderCosmeticsSection();default:return j``}}_renderChildrenSection(){if(!this._store)return j`<div class="loading">Initialisation du store...</div>`;const e=this._store.getState();if(e.loading)return j`<div class="loading">Chargement des données...</div>`;if(e.error)return j`
        <div class="section">
          <div class="error-banner">
            <span>Erreur: ${e.error}</span>
            <button class="btn btn-text" @click="${()=>this._store?.refresh()}">Réessayer</button>
          </div>
        </div>
      `;const t=e.children;return j`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Enfants</h2>
          <button class="btn btn-primary" @click="${()=>this._openChildDialog("create")}">
            + Ajouter un enfant
          </button>
        </div>

        ${0===t.length?j`<p class="empty-message">Aucun enfant enregistré</p>`:j`
              <div class="items-list">
                ${t.map(e=>this._renderChildCard(e))}
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
    `}_openChildDialog(e,t){this._dialogMode=e,this._selectedItem=t,this._formData=t?{name:t.name,person_entity:t.person_entity,avatar_photo_url:t.avatar.photo_url}:{name:"",person_entity:"",avatar_photo_url:""},this._showDialog=!0,this.requestUpdate()}async _handleSaveChild(){if(this._store)try{this._loading=!0,this._error="","create"===this._dialogMode?await this._store.createChild({name:this._formData.name,person_entity:this._formData.person_entity,avatar_photo_url:this._formData.avatar_photo_url||void 0}):this._selectedItem&&await this._store.updateChild(this._selectedItem.id,{name:this._formData.name,person_entity:this._formData.person_entity,avatar:{...this._selectedItem.avatar,photo_url:this._formData.avatar_photo_url}}),this._showDialog=!1,this._formData={}}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la sauvegarde"}finally{this._loading=!1}}async _handleDeleteChild(e){if(this._store&&confirm(`Supprimer l'enfant "${e.name}" ?`))try{this._loading=!0,this._error="",await this._store.deleteChild(e.id)}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la suppression"}finally{this._loading=!1}}_renderTasksSection(){if(!this._store)return j`<div class="loading">Initialisation du store...</div>`;const e=this._store.getState();if(e.loading)return j`<div class="loading">Chargement des données...</div>`;if(e.error)return j`
        <div class="section">
          <div class="error-banner">
            <span>Erreur: ${e.error}</span>
            <button class="btn btn-text" @click="${()=>this._store?.refresh()}">Réessayer</button>
          </div>
        </div>
      `;const t=e.tasks;return j`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Tâches</h2>
          <button class="btn btn-primary" @click="${()=>this._openTaskDialog("create")}">
            + Ajouter une tâche
          </button>
        </div>

        ${0===t.length?j`<p class="empty-message">Aucune tâche créée</p>`:j`
              <div class="items-list">
                ${t.map(e=>this._renderTaskCard(e))}
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
    `}_openTaskDialog(e,t){this._dialogMode=e,this._selectedItem=t,this._formData=t?{title:t.title,description:t.description,type:t.type,assigned_to:t.assigned_to,schedule_type:t.schedule.type,schedule_days:t.schedule.days||[],schedule_time:t.schedule.time||"",schedule_specific_date:t.schedule.specific_date||"",rewards_points:t.rewards.points,rewards_coins:t.rewards.coins,rewards_experience:t.rewards.experience,penalties_points:t.penalties.points,penalties_coins:t.penalties.coins,icon:t.icon,color:t.color,difficulty:t.difficulty,estimated_duration:t.estimated_duration,category:t.category}:{title:"",description:"",type:"mandatory",assigned_to:[],schedule_type:"daily",schedule_days:[],schedule_time:"",schedule_specific_date:"",rewards_points:10,rewards_coins:5,rewards_experience:10,penalties_points:5,penalties_coins:2,icon:"✅",color:"#03a9f4",difficulty:1,estimated_duration:15,category:"chores"},this._showDialog=!0}async _handleSaveTask(){if(this._store)try{this._loading=!0,this._error="";const e={title:this._formData.title,description:this._formData.description,type:this._formData.type,assigned_to:this._formData.assigned_to,schedule:{type:this._formData.schedule_type,days:this._formData.schedule_days.length>0?this._formData.schedule_days:void 0,time:this._formData.schedule_time||void 0,specific_date:this._formData.schedule_specific_date||void 0},rewards:{points:Number(this._formData.rewards_points),coins:Number(this._formData.rewards_coins),experience:Number(this._formData.rewards_experience)},penalties:{points:Number(this._formData.penalties_points),coins:Number(this._formData.penalties_coins)},icon:this._formData.icon,color:this._formData.color,difficulty:Number(this._formData.difficulty),estimated_duration:Number(this._formData.estimated_duration),category:this._formData.category,active:!0};"create"===this._dialogMode?await this._store.createTask(e):this._selectedItem&&await this._store.updateTask(this._selectedItem.id,e),this._showDialog=!1,this._formData={}}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la sauvegarde"}finally{this._loading=!1}}async _handleDeleteTask(e){if(this._store&&confirm(`Supprimer la tâche "${e.title}" ?`))try{this._loading=!0,this._error="",await this._store.deleteTask(e.id)}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la suppression"}finally{this._loading=!1}}_renderHabitsSection(){if(!this._store)return j`<div class="loading">Initialisation du store...</div>`;const e=this._store.getState();if(e.loading)return j`<div class="loading">Chargement des données...</div>`;if(e.error)return j`
        <div class="section">
          <div class="error-banner">
            <span>Erreur: ${e.error}</span>
            <button class="btn btn-text" @click="${()=>this._store?.refresh()}">Réessayer</button>
          </div>
        </div>
      `;const t=e.habits;return j`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Habitudes</h2>
          <button class="btn btn-primary" @click="${()=>this._openHabitDialog("create")}">
            + Ajouter une habitude
          </button>
        </div>

        ${0===t.length?j`<p class="empty-message">Aucune habitude créée</p>`:j`
              <div class="items-list">
                ${t.map(e=>this._renderHabitCard(e))}
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
    `}_openHabitDialog(e,t){this._dialogMode=e,this._selectedItem=t,this._formData=t?{title:t.title,description:t.description,frequency:t.frequency,assigned_to:t.assigned_to,rewards_points:t.rewards.points,rewards_coins:t.rewards.coins,rewards_experience:t.rewards.experience,streak_bonus_enabled:t.rewards.streak_bonus.enabled,streak_bonus_type:t.rewards.streak_bonus.type,streak_bonus_multiplier:t.rewards.streak_bonus.multiplier,icon:t.icon,color:t.color}:{title:"",description:"",frequency:"daily",assigned_to:[],rewards_points:5,rewards_coins:2,rewards_experience:5,streak_bonus_enabled:!0,streak_bonus_type:"progressive",streak_bonus_multiplier:1.1,icon:"🔄",color:"#4caf50"},this._showDialog=!0}async _handleSaveHabit(){if(this._store)try{this._loading=!0,this._error="";const e={title:this._formData.title,description:this._formData.description,frequency:this._formData.frequency,assigned_to:this._formData.assigned_to,rewards:{points:Number(this._formData.rewards_points),coins:Number(this._formData.rewards_coins),experience:Number(this._formData.rewards_experience),streak_bonus:{enabled:Boolean(this._formData.streak_bonus_enabled),type:this._formData.streak_bonus_type,multiplier:Number(this._formData.streak_bonus_multiplier)}},icon:this._formData.icon,color:this._formData.color,active:!0};"create"===this._dialogMode?await this._store.createHabit(e):this._selectedItem&&await this._store.updateHabit(this._selectedItem.id,e),this._showDialog=!1,this._formData={}}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la sauvegarde"}finally{this._loading=!1}}async _handleDeleteHabit(e){if(this._store&&confirm(`Supprimer l'habitude "${e.title}" ?`))try{this._loading=!0,this._error="",await this._store.deleteHabit(e.id)}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la suppression"}finally{this._loading=!1}}_renderRewardsSection(){if(!this._store)return j`<div class="loading">Initialisation du store...</div>`;const e=this._store.getState();if(e.loading)return j`<div class="loading">Chargement des données...</div>`;if(e.error)return j`
        <div class="section">
          <div class="error-banner">
            <span>Erreur: ${e.error}</span>
            <button class="btn btn-text" @click="${()=>this._store?.refresh()}">Réessayer</button>
          </div>
        </div>
      `;const t=e.rewards;return j`
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Récompenses</h2>
          <button class="btn btn-primary" @click="${()=>this._openRewardDialog("create")}">
            + Ajouter une récompense
          </button>
        </div>

        ${0===t.length?j`<p class="empty-message">Aucune récompense créée</p>`:j`
              <div class="items-list">
                ${t.map(e=>this._renderRewardCard(e))}
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
          label="Points (récompense)"
          .value="${String(this._formData.rewards_points||10)}"
          type="number"
          min="0"
          required
          @value-changed="${e=>this._formData.rewards_points=e.detail.value}"
        ></hm-form-input>

        <hm-form-input
          label="Pièces (récompense)"
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
          label="Points (pénalité)"
          .value="${String(this._formData.penalties_points||5)}"
          type="number"
          min="0"
          required
          helper="Points perdus si la tâche échoue"
          @value-changed="${e=>this._formData.penalties_points=e.detail.value}"
        ></hm-form-input>

        <hm-form-input
          label="Pièces (pénalité)"
          .value="${String(this._formData.penalties_coins||2)}"
          type="number"
          min="0"
          required
          helper="Pièces perdues si la tâche échoue"
          @value-changed="${e=>this._formData.penalties_coins=e.detail.value}"
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
    `}_renderCosmeticsSection(){if(!this._store)return j`<div class="loading">Initialisation du store...</div>`;const e=this._store.getState();if(e.loading)return j`<div class="loading">Chargement des données...</div>`;if(e.error)return j`
        <div class="section">
          <div class="error-banner">
            <span>Erreur: ${e.error}</span>
            <button class="btn btn-text" @click="${()=>this._store?.refresh()}">Réessayer</button>
          </div>
        </div>
      `;const t=e.cosmetics;return j`
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

        ${0===t.length?j`
              <div class="empty-message">
                <p>Aucun cosmétique disponible</p>
                <p style="font-size: 14px; margin-top: 8px;">
                  Les cosmétiques par défaut seront chargés au démarrage du système.
                </p>
              </div>
            `:j`
              <div class="items-list">
                ${t.map(e=>this._renderCosmeticCard(e))}
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
    `}_openCosmeticDialog(e,t){this._dialogMode=e,this._selectedItem=t,this._formData=t?{...t}:{name:"",description:"",category:Ge.CLOTHES,subcategory:"",rarity:Ke.COMMON,cost_coins:10,preview_image:"",unlock_requirements:null,active:!0},this._showDialog=!0}async _saveCosmeticDialog(){if(this._store){this._loading=!0,this._error="";try{"create"===this._dialogMode&&await this._store.createCosmetic({name:this._formData.name,description:this._formData.description,category:this._formData.category,subcategory:this._formData.subcategory,rarity:this._formData.rarity,cost_coins:parseInt(this._formData.cost_coins),preview_image:this._formData.preview_image,unlock_requirements:this._formData.unlock_min_level?{min_level:parseInt(this._formData.unlock_min_level)}:null,active:!1!==this._formData.active}),this._showDialog=!1,this._formData={},this._selectedItem=void 0}catch(e){this._error=e instanceof Error?e.message:"Erreur lors de la sauvegarde"}finally{this._loading=!1}}}_formatCategory(e){return{chores:"Tâches ménagères",homework:"Devoirs",personal:"Personnel",other:"Autre"}[e]||e}_formatFrequency(e){return{daily:"Quotidien",weekly:"Hebdomadaire",monthly:"Mensuel"}[e]||e}_formatRewardType(e){return{screen_time:"Temps d'écran",meal_choice:"Choix de repas",activity:"Activité",other:"Autre"}[e]||e}_formatCosmeticCategory(e){return{clothes:"Vêtements",accessory:"Accessoires",pet:"Animaux",theme:"Thèmes",badge:"Badges",animation:"Animations"}[e]||e}_formatRarity(e){return{common:"Commun",rare:"Rare",epic:"Épique",legendary:"Légendaire"}[e]||e}_getRarityColor(e){return{common:"#9E9E9E",rare:"#2196F3",epic:"#9C27B0",legendary:"#FF9800"}[e]||"#9E9E9E"}};rt.styles=ze,e([de({attribute:!1})],rt.prototype,"hass",void 0),e([he()],rt.prototype,"_config",void 0),e([he()],rt.prototype,"_store",void 0),e([he()],rt.prototype,"_activeTab",void 0),e([he()],rt.prototype,"_showDialog",void 0),e([he()],rt.prototype,"_dialogMode",void 0),e([he()],rt.prototype,"_selectedItem",void 0),e([he()],rt.prototype,"_loading",void 0),e([he()],rt.prototype,"_error",void 0),e([he()],rt.prototype,"_formData",void 0),rt=e([(e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)})("habits-manager-card")],rt),window.customCards=window.customCards||[],window.customCards.push({type:"habits-manager-card",name:"Habits Manager",description:"Carte de gestion pour configurer les enfants, tâches et récompenses"});export{rt as HabitsManagerCard};
