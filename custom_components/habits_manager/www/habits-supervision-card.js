function t(t,e,i,s){var r,a=arguments.length,o=a<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(o=(a<3?r(o):a>3?r(e,i,o):r(e,i))||o);return a>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let a=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new a(i,t,s)},n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",v=g.reactiveElementPolyfillSupport,y=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},_=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);r?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const a=r.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??_)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==r||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[y("elementProperties")]=new Map,$[y("finalized")]=new Map,v?.({ReactiveElement:$}),(g.reactiveElementVersions??=[]).push("2.1.1");const w=globalThis,k=w.trustedTypes,C=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+S,T=`<${E}>`,z=document,P=()=>z.createComment(""),I=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,D="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,H=/>/g,O=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,M=/"/g,L=/^(?:script|style|textarea|title)$/i,V=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),W=new WeakMap,Y=z.createTreeWalker(z,129);function X(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const F=(t,e)=>{const i=t.length-1,s=[];let r,a=2===e?"<svg>":3===e?"<math>":"",o=U;for(let e=0;e<i;e++){const i=t[e];let n,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===U?"!--"===l[1]?o=N:void 0!==l[1]?o=H:void 0!==l[2]?(L.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=O):void 0!==l[3]&&(o=O):o===O?">"===l[0]?(o=r??U,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,n=l[1],o=void 0===l[3]?O:'"'===l[3]?M:j):o===M||o===j?o=O:o===N||o===H?o=U:(o=O,r=void 0);const h=o===O&&t[e+1].startsWith("/>")?" ":"";a+=o===U?i+T:c>=0?(s.push(n),i.slice(0,c)+A+i.slice(c)+S+h):i+S+(-2===c?e:h)}return[X(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,a=0;const o=t.length-1,n=this.parts,[l,c]=F(t,e);if(this.el=J.createElement(l,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Y.nextNode())&&n.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=c[a++],i=s.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);n.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:Q}),s.removeAttribute(t)}else t.startsWith(S)&&(n.push({type:6,index:r}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),Y.nextNode(),n.push({type:2,index:++r});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===E)n.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)n.push({type:7,index:r}),t+=S.length-1}r++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===q)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const a=I(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=K(t,r._$AS(t,e.values),r,s)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);Y.currentNode=s;let r=Y.nextNode(),a=0,o=0,n=i[0];for(;void 0!==n;){if(a===n.index){let e;2===n.type?e=new G(r,r.nextSibling,this,t):1===n.type?e=new n.ctor(r,n.name,n.strings,this,t):6===n.type&&(e=new st(r,this,t)),this._$AV.push(e),n=i[++o]}a!==n?.index&&(r=Y.nextNode(),a++)}return Y.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class G{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),I(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Z(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new J(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new G(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const r=this.strings;let a=!1;if(void 0===r)t=K(this,t,e,0),a=!I(t)||t!==this._$AH&&t!==q,a&&(this._$AH=t);else{const s=t;let o,n;for(t=r[0],o=0;o<r.length-1;o++)n=K(this,s[i+o],e,o),n===q&&(n=this._$AH[o]),a||=!I(n)||n!==this._$AH[o],n===B?t=B:t!==B&&(t+=(n??"")+r[o+1]),this._$AH[o]=n}a&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class it extends Q{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??B)===q)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(J,G),(w.litHtmlVersions??=[]).push("3.3.1");const at=globalThis;class ot extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new G(e.insertBefore(P(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ot._$litElement$=!0,ot.finalized=!0,at.litElementHydrateSupport?.({LitElement:ot});const nt=at.litElementPolyfillSupport;nt?.({LitElement:ot}),(at.litElementVersions??=[]).push("4.2.1");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ct={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:_},dt=(t=ct,e,i)=>{const{kind:s,metadata:r}=i;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),a.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t)}}throw Error("Unsupported decorator location: "+s)};function ht(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ht({...t,state:!0,attribute:!1})}const ut="habits_manager",gt="create_child",mt="update_child",ft="delete_child",vt="create_task",yt="update_task",bt="delete_task",_t="mark_task_completed",xt="validate_task",$t="refuse_task",wt="validate_penalty",kt="create_habit",Ct="update_habit",At="delete_habit",St="complete_habit",Et="create_reward",Tt="claim_reward",zt="approve_claim",Pt="create_cosmetic",It="purchase_cosmetic";class Rt{constructor(t){this.hass=t}async callService(t,e={}){return this.hass.callService(ut,t,e)}async createChild(t){return this.callService(gt,t)}async updateChild(t,e){return this.callService(mt,{child_id:t,...e})}async deleteChild(t){return this.callService(ft,{child_id:t})}async createTask(t){return this.callService(vt,t)}async updateTask(t,e){return this.callService(yt,{task_id:t,...e})}async deleteTask(t){return this.callService(bt,{task_id:t})}async markTaskCompleted(t,e){return this.callService(_t,{instance_id:t,child_id:e})}async validateTask(t,e,i){return this.callService(xt,{instance_id:t,validator_id:e,note:i})}async refuseTask(t,e,i=!1,s){return this.callService($t,{instance_id:t,validator_id:e,apply_penalty:i,note:s})}async validatePenalty(t,e){return this.callService(wt,{instance_id:t,validator_id:e})}async createHabit(t){return this.callService(kt,t)}async updateHabit(t,e){return this.callService(Ct,{habit_id:t,...e})}async deleteHabit(t){return this.callService(At,{habit_id:t})}async completeHabit(t,e){return this.callService(St,{habit_id:t,child_id:e})}async createReward(t){return this.callService(Et,t)}async claimReward(t,e){return this.callService(Tt,{reward_id:t,child_id:e})}async approveClaim(t,e){return this.callService(zt,{claim_id:t,approver_id:e})}async createCosmetic(t){return this.callService(Pt,t)}async purchaseCosmetic(t,e){return this.callService(It,{cosmetic_id:t,child_id:e})}getChildren(){const t=[],e=Object.values(this.hass.states).filter(t=>t.entity_id.startsWith(`sensor.${ut}_`)&&t.entity_id.endsWith("_points"));for(const i of e){const e=i.attributes.child_id;if(e){const i=this.getChildData(e);i&&t.push(i)}}return t}getChildData(t){const e=this.hass.states[`sensor.${ut}_${t}_points`];if(!e)return null;const i=this.hass.states[`sensor.${ut}_${t}_coins`],s=this.hass.states[`sensor.${ut}_${t}_level`],r=this.hass.states[`sensor.${ut}_${t}_experience`];return{id:t,name:e.attributes.child_name||"Unknown",person_entity:e.attributes.person_entity||"",points:parseInt(e.state)||0,coins:i&&parseInt(i.state)||0,level:s&&parseInt(s.state)||1,experience:r&&parseInt(r.state)||0,experience_to_next_level:r?.attributes.experience_to_next_level||100,avatar:e.attributes.avatar||{photo_url:"",customization:{clothes:null,accessory:null,pet:null,theme:"default"}},badges:e.attributes.badges||[],owned_cosmetics:e.attributes.owned_cosmetics||[],created_at:e.attributes.created_at||(new Date).toISOString(),updated_at:e.attributes.updated_at||(new Date).toISOString()}}getTaskCounts(t){const e=this.hass.states[`sensor.${ut}_${t}_tasks_pending`],i=this.hass.states[`sensor.${ut}_${t}_tasks_completed_waiting`];return{pending:e&&parseInt(e.state)||0,waiting:i&&parseInt(i.state)||0}}getHabitStats(t){const e=this.hass.states[`sensor.${ut}_${t}_habits_count`],i=this.hass.states[`sensor.${ut}_${t}_longest_streak`];return{count:e&&parseInt(e.state)||0,longest_streak:i&&parseInt(i.state)||0}}getCosmetics(){const t=this.hass.states[`sensor.${ut}_cosmetics`];return t&&t.attributes.cosmetics?t.attributes.cosmetics:[]}async subscribeToUpdates(t){return this.hass.connection.subscribeEvents(t,`${ut}_update`)}}class Dt{constructor(t){this.listeners=new Set,this.state={children:[],tasks:[],taskInstances:[],habits:[],habitStreaks:[],rewards:[],rewardClaims:[],cosmetics:[],loading:!0,error:null},this.hass=t,this.api=new Rt(t),this.initialize()}async initialize(){try{await this.loadAllData(),this.unsubscribe=await this.api.subscribeToUpdates(t=>{this.handleUpdate(t)}),this.state.loading=!1,this.notifyListeners()}catch(t){this.state.error=t instanceof Error?t.message:"Unknown error",this.state.loading=!1,this.notifyListeners()}}async loadAllData(){this.state.children=this.api.getChildren(),this.state.cosmetics=this.api.getCosmetics()}handleUpdate(t){const{update_type:e}=t;switch(e){case"child_created":case"child_updated":case"child_deleted":case"reward_claimed":case"reward_approved":case"cosmetic_purchased":case"level_up":case"badge_earned":case"points_changed":case"coins_changed":this.state.children=this.api.getChildren();break;case"task_completed":case"task_validated":case"task_refused":case"task_failed":case"habit_completed":case"streak_increased":case"streak_broken":t.child_id&&(this.state.children=this.api.getChildren())}this.notifyListeners()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notifyListeners(){this.listeners.forEach(t=>t())}getState(){return{...this.state}}async refresh(){this.state.loading=!0,this.notifyListeners();try{await this.loadAllData(),this.state.loading=!1,this.state.error=null}catch(t){this.state.error=t instanceof Error?t.message:"Unknown error",this.state.loading=!1}this.notifyListeners()}getChildren(){return this.state.children}getChild(t){return this.state.children.find(e=>e.id===t)}async createChild(t){try{await this.api.createChild(t),await this.refresh()}catch(t){throw t}}async updateChild(t,e){try{await this.api.updateChild(t,e),await this.refresh()}catch(t){throw t}}async deleteChild(t){try{await this.api.deleteChild(t),await this.refresh()}catch(t){throw t}}getTaskCounts(t){return this.api.getTaskCounts(t)}async createTask(t){try{await this.api.createTask(t),await this.refresh()}catch(t){throw t}}async updateTask(t,e){try{await this.api.updateTask(t,e),await this.refresh()}catch(t){throw t}}async deleteTask(t){try{await this.api.deleteTask(t),await this.refresh()}catch(t){throw t}}async markTaskCompleted(t,e){try{await this.api.markTaskCompleted(t,e),await this.refresh()}catch(t){throw t}}async validateTask(t,e,i){try{await this.api.validateTask(t,e,i),await this.refresh()}catch(t){throw t}}async refuseTask(t,e,i,s){try{await this.api.refuseTask(t,e,i,s),await this.refresh()}catch(t){throw t}}getHabitStats(t){return this.api.getHabitStats(t)}async createHabit(t){try{await this.api.createHabit(t),await this.refresh()}catch(t){throw t}}async updateHabit(t,e){try{await this.api.updateHabit(t,e),await this.refresh()}catch(t){throw t}}async deleteHabit(t){try{await this.api.deleteHabit(t),await this.refresh()}catch(t){throw t}}async completeHabit(t,e){try{await this.api.completeHabit(t,e),await this.refresh()}catch(t){throw t}}async createReward(t){try{await this.api.createReward(t),await this.refresh()}catch(t){throw t}}async claimReward(t,e){try{await this.api.claimReward(t,e),await this.refresh()}catch(t){throw t}}async approveClaim(t,e){try{await this.api.approveClaim(t,e),await this.refresh()}catch(t){throw t}}getCosmetics(){return this.state.cosmetics}getOwnedCosmetics(t){const e=this.getChild(t);return e?this.state.cosmetics.filter(t=>e.owned_cosmetics.includes(t.id)):[]}getAvailableCosmetics(t){const e=this.getChild(t);return e?this.state.cosmetics.filter(t=>{if(e.owned_cosmetics.includes(t.id))return!1;if(t.unlock_requirements){const i=t.unlock_requirements;if(i.level&&e.level<i.level)return!1;if(i.badge&&!e.badges.includes(i.badge))return!1}return!0}):[]}async createCosmetic(t){try{await this.api.createCosmetic(t),await this.refresh()}catch(t){throw t}}async purchaseCosmetic(t,e){try{await this.api.purchaseCosmetic(t,e),await this.refresh()}catch(t){throw t}}destroy(){this.unsubscribe&&this.unsubscribe(),this.listeners.clear()}}const Ut=o`
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
`;let Nt=class extends ot{constructor(){super(...arguments),this.open=!1,this.title="",this.hideActions=!1,this.confirmText="Confirmer",this.cancelText="Annuler",this.hideCancel=!1,this.loading=!1}handleOverlayClick(t){t.target===t.currentTarget&&this.close()}handleCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0})),this.close()}handleConfirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}close(){this.open=!1}render(){return this.open?V`
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
    `:V``}};Nt.styles=o`
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
  `,t([ht({type:Boolean})],Nt.prototype,"open",void 0),t([ht({type:String})],Nt.prototype,"title",void 0),t([ht({type:Boolean})],Nt.prototype,"hideActions",void 0),t([ht({type:String})],Nt.prototype,"confirmText",void 0),t([ht({type:String})],Nt.prototype,"cancelText",void 0),t([ht({type:Boolean})],Nt.prototype,"hideCancel",void 0),t([ht({type:Boolean})],Nt.prototype,"loading",void 0),Nt=t([lt("hm-dialog")],Nt);let Ht=class extends ot{constructor(){super(...arguments),this.icon="",this.iconColor="",this.clickable=!1,this.selected=!1}handleClick(){this.clickable&&this.dispatchEvent(new CustomEvent("item-click",{bubbles:!0,composed:!0}))}render(){return V`
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
    `}};Ht.styles=o`
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
  `,t([ht({type:String})],Ht.prototype,"icon",void 0),t([ht({type:String})],Ht.prototype,"iconColor",void 0),t([ht({type:Boolean})],Ht.prototype,"clickable",void 0),t([ht({type:Boolean})],Ht.prototype,"selected",void 0),Ht=t([lt("hm-item-card")],Ht);let Ot=class extends ot{constructor(){super(...arguments),this.label="",this.value="",this.placeholder="",this.required=!1,this.disabled=!1,this.rows=3,this.error="",this.helper=""}handleInput(t){const e=t.target;this.value=e.value,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return V`
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
    `}};Ot.styles=o`
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
  `,t([ht({type:String})],Ot.prototype,"label",void 0),t([ht({type:String})],Ot.prototype,"value",void 0),t([ht({type:String})],Ot.prototype,"placeholder",void 0),t([ht({type:Boolean})],Ot.prototype,"required",void 0),t([ht({type:Boolean})],Ot.prototype,"disabled",void 0),t([ht({type:Number})],Ot.prototype,"rows",void 0),t([ht({type:Number})],Ot.prototype,"maxlength",void 0),t([ht({type:String})],Ot.prototype,"error",void 0),t([ht({type:String})],Ot.prototype,"helper",void 0),Ot=t([lt("hm-form-textarea")],Ot);let jt=class extends ot{constructor(){super(...arguments),this.label="",this.checked=!1,this.disabled=!1,this.helper=""}handleChange(t){const e=t.target;this.checked=e.checked,this.dispatchEvent(new CustomEvent("checked-changed",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}render(){return V`
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
    `}};jt.styles=o`
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
  `,t([ht({type:String})],jt.prototype,"label",void 0),t([ht({type:Boolean})],jt.prototype,"checked",void 0),t([ht({type:Boolean})],jt.prototype,"disabled",void 0),t([ht({type:String})],jt.prototype,"helper",void 0),jt=t([lt("hm-form-checkbox")],jt);let Mt=class extends ot{constructor(){super(...arguments),this._children=[],this._showValidateDialog=!1,this._showRefuseDialog=!1,this._showApproveClaimDialog=!1,this._validationNote="",this._refuseNote="",this._applyPenalty=!1,this._loading=!1}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config=t}getCardSize(){return 3}updated(t){var e;super.updated(t),t.has("hass")&&this.hass&&(this._store||(this._store=(e=this.hass,new Dt(e)),this._unsubscribe=this._store.subscribe(()=>{this._loadData(),this.requestUpdate()}),this._loadData()))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe&&this._unsubscribe(),this._store&&this._store.destroy()}_loadData(){this._store&&(this._children=this._store.getChildren())}render(){if(!this._config||!this.hass)return V``;const t=this._config.title||"Supervision";return V`
      <ha-card>
        <div class="card">
          <div class="card-header">
            <h1 class="card-title">${t}</h1>
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
          ${this._children.map(t=>this._renderChildCard(t))}
        </div>
      </div>
    `}_renderChildCard(t){const e=this._store?.getTaskCounts(t.id)||{pending:0,waiting:0},i=this._store?.getHabitStats(t.id)||{longest_streak:0};return V`
      <hm-item-card
        .icon=${"👤"}
        .iconColor=${"var(--primary-color, #03a9f4)"}
        .clickable=${!0}
        @item-click=${()=>this._handleChildClick(t.id)}
      >
        <div>
          <h3>${t.name}</h3>
          <p style="margin: 4px 0; font-size: 14px; color: var(--secondary-text-color);">
            Niveau ${t.level} • ${t.points} pts • ${t.coins} 💰
          </p>
          <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
            ${e.pending>0?V`<span class="badge badge-primary">${e.pending} à faire</span>`:""}
            ${e.waiting>0?V`<span class="badge badge-warning">${e.waiting} à valider</span>`:""}
            ${i.longest_streak>0?V`<span class="badge badge-success">🔥 ${i.longest_streak} jours</span>`:""}
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
          @value-changed=${t=>{this._validationNote=t.detail.value}}
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
          @value-changed=${t=>{this._refuseNote=t.detail.value}}
        ></hm-form-textarea>

        <hm-form-checkbox
          label="Appliquer la pénalité"
          .checked=${this._applyPenalty}
          helper="Si activé, l'enfant perdra les points/pièces définis comme pénalité"
          @checked-changed=${t=>{this._applyPenalty=t.detail.checked}}
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
    `}_handleChildClick(t){}_handleValidateTaskDemo(t){this._selectedInstanceId=t,this._validationNote="",this._showValidateDialog=!0}_handleRefuseTaskDemo(t){this._selectedInstanceId=t,this._refuseNote="",this._applyPenalty=!1,this._showRefuseDialog=!0}_handleApproveClaimDemo(t){this._selectedClaimId=t,this._showApproveClaimDialog=!0}async _handleConfirmValidate(){if(this._selectedInstanceId&&this._store){this._loading=!0;try{await this._store.validateTask(this._selectedInstanceId,void 0,this._validationNote||void 0),this._showValidateDialog=!1,this._validationNote="",this._selectedInstanceId=void 0,alert("✓ Tâche validée avec succès!")}catch(t){alert("❌ Erreur lors de la validation de la tâche")}finally{this._loading=!1}}}_handleCancelValidate(){this._showValidateDialog=!1,this._validationNote="",this._selectedInstanceId=void 0}async _handleConfirmRefuse(){if(this._selectedInstanceId&&this._store)if(this._refuseNote.trim()){this._loading=!0;try{await this._store.refuseTask(this._selectedInstanceId,void 0,this._applyPenalty,this._refuseNote),this._showRefuseDialog=!1,this._refuseNote="",this._applyPenalty=!1,this._selectedInstanceId=void 0,alert("✓ Tâche refusée")}catch(t){alert("❌ Erreur lors du refus de la tâche")}finally{this._loading=!1}}else alert("⚠️ Veuillez fournir une raison pour le refus")}_handleCancelRefuse(){this._showRefuseDialog=!1,this._refuseNote="",this._applyPenalty=!1,this._selectedInstanceId=void 0}async _handleConfirmApproveClaim(){if(this._selectedClaimId&&this._store){this._loading=!0;try{await this._store.approveClaim(this._selectedClaimId,void 0),this._showApproveClaimDialog=!1,this._selectedClaimId=void 0,alert("✓ Réclamation approuvée avec succès!")}catch(t){alert("❌ Erreur lors de l'approbation de la réclamation")}finally{this._loading=!1}}}_handleCancelApproveClaim(){this._showApproveClaimDialog=!1,this._selectedClaimId=void 0}};Mt.styles=Ut,t([ht({attribute:!1})],Mt.prototype,"hass",void 0),t([pt()],Mt.prototype,"_config",void 0),t([pt()],Mt.prototype,"_store",void 0),t([pt()],Mt.prototype,"_children",void 0),t([pt()],Mt.prototype,"_unsubscribe",void 0),t([pt()],Mt.prototype,"_showValidateDialog",void 0),t([pt()],Mt.prototype,"_showRefuseDialog",void 0),t([pt()],Mt.prototype,"_showApproveClaimDialog",void 0),t([pt()],Mt.prototype,"_selectedInstanceId",void 0),t([pt()],Mt.prototype,"_selectedClaimId",void 0),t([pt()],Mt.prototype,"_validationNote",void 0),t([pt()],Mt.prototype,"_refuseNote",void 0),t([pt()],Mt.prototype,"_applyPenalty",void 0),t([pt()],Mt.prototype,"_loading",void 0),Mt=t([lt("habits-supervision-card")],Mt),window.customCards=window.customCards||[],window.customCards.push({type:"habits-supervision-card",name:"Habits Supervision",description:"Carte de supervision pour valider les tâches et suivre les enfants"});export{Mt as HabitsSupervisionCard};
