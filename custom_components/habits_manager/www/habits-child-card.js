function t(t,e,i,s){var r,a=arguments.length,o=a<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(o=(a<3?r(o):a>3?r(e,i,o):r(e,i))||o);return a>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let a=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new a(i,t,s)},n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:d,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,v=m?m.emptyScript:"",b=g.reactiveElementPolyfillSupport,y=(t,e)=>t,f={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!c(t,e),_={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&d(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);r?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:f;this._$Em=s;const a=r.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??x)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==r||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[y("elementProperties")]=new Map,w[y("finalized")]=new Map,b?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.1");const $=globalThis,C=$.trustedTypes,k=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+E,T=`<${S}>`,z=document,P=()=>z.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,I="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,U=/>/g,N=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),V=new WeakMap,Y=z.createTreeWalker(z,129);function W(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let r,a=2===e?"<svg>":3===e?"<math>":"",o=H;for(let e=0;e<i;e++){const i=t[e];let n,c,d=-1,l=0;for(;l<i.length&&(o.lastIndex=l,c=o.exec(i),null!==c);)l=o.lastIndex,o===H?"!--"===c[1]?o=M:void 0!==c[1]?o=U:void 0!==c[2]?(j.test(c[2])&&(r=RegExp("</"+c[2],"g")),o=N):void 0!==c[3]&&(o=N):o===N?">"===c[0]?(o=r??H,d=-1):void 0===c[1]?d=-2:(d=o.lastIndex-c[2].length,n=c[1],o=void 0===c[3]?N:'"'===c[3]?L:D):o===L||o===D?o=N:o===M||o===U?o=H:(o=N,r=void 0);const h=o===N&&t[e+1].startsWith("/>")?" ":"";a+=o===H?i+T:d>=0?(s.push(n),i.slice(0,d)+A+i.slice(d)+E+h):i+E+(-2===d?e:h)}return[W(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,a=0;const o=t.length-1,n=this.parts,[c,d]=G(t,e);if(this.el=J.createElement(c,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Y.nextNode())&&n.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=d[a++],i=s.getAttribute(t).split(E),o=/([.?@])?(.*)/.exec(e);n.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:Q}),s.removeAttribute(t)}else t.startsWith(E)&&(n.push({type:6,index:r}),s.removeAttribute(t));if(j.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=C?C.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),Y.nextNode(),n.push({type:2,index:++r});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===S)n.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)n.push({type:7,index:r}),t+=E.length-1}r++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===q)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const a=O(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=K(t,r._$AS(t,e.values),r,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);Y.currentNode=s;let r=Y.nextNode(),a=0,o=0,n=i[0];for(;void 0!==n;){if(a===n.index){let e;2===n.type?e=new Z(r,r.nextSibling,this,t):1===n.type?e=new n.ctor(r,n.name,n.strings,this,t):6===n.type&&(e=new st(r,this,t)),this._$AV.push(e),n=i[++o]}a!==n?.index&&(r=Y.nextNode(),a++)}return Y.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),O(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(W(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new J(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Z(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const r=this.strings;let a=!1;if(void 0===r)t=K(this,t,e,0),a=!O(t)||t!==this._$AH&&t!==q,a&&(this._$AH=t);else{const s=t;let o,n;for(t=r[0],o=0;o<r.length-1;o++)n=K(this,s[i+o],e,o),n===q&&(n=this._$AH[o]),a||=!O(n)||n!==this._$AH[o],n===F?t=F:t!==F&&(t+=(n??"")+r[o+1]),this._$AH[o]=n}a&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class it extends Q{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??F)===q)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const rt=$.litHtmlPolyfillSupport;rt?.(J,Z),($.litHtmlVersions??=[]).push("3.3.1");const at=globalThis;class ot extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Z(e.insertBefore(P(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ot._$litElement$=!0,ot.finalized=!0,at.litElementHydrateSupport?.({LitElement:ot});const nt=at.litElementPolyfillSupport;nt?.({LitElement:ot}),(at.litElementVersions??=[]).push("4.2.1");const ct={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:x},dt=(t=ct,e,i)=>{const{kind:s,metadata:r}=i;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),a.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t)}}throw Error("Unsupported decorator location: "+s)};function lt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ht(t){return lt({...t,state:!0,attribute:!1})}const pt="habits_manager",ut="create_child",gt="update_child",mt="delete_child",vt="create_task",bt="update_task",yt="delete_task",ft="mark_task_completed",xt="validate_task",_t="refuse_task",wt="validate_penalty",$t="create_habit",Ct="update_habit",kt="delete_habit",At="complete_habit",Et="create_reward",St="claim_reward",Tt="approve_claim",zt="create_cosmetic",Pt="purchase_cosmetic",Ot="list_children",Rt="list_tasks",It="list_habits",Ht="list_rewards",Mt="list_cosmetics";class Ut{constructor(t){this.hass=t}async callService(t,e={}){return this.hass.callService(pt,t,e)}async callServiceWithResponse(t,e={}){return this.hass.connection.sendMessagePromise({type:"call_service",domain:pt,service:t,service_data:e,return_response:!0})}async createChild(t){return this.callService(ut,t)}async updateChild(t,e){return this.callService(gt,{child_id:t,...e})}async deleteChild(t){return this.callService(mt,{child_id:t})}async createTask(t){return this.callService(vt,t)}async updateTask(t,e){return this.callService(bt,{task_id:t,...e})}async deleteTask(t){return this.callService(yt,{task_id:t})}async markTaskCompleted(t,e){return this.callService(ft,{instance_id:t,child_id:e})}async validateTask(t,e,i){return this.callService(xt,{instance_id:t,validator_id:e,note:i})}async refuseTask(t,e,i=!1,s){return this.callService(_t,{instance_id:t,validator_id:e,apply_penalty:i,note:s})}async validatePenalty(t,e){return this.callService(wt,{instance_id:t,validator_id:e})}async createHabit(t){return this.callService($t,t)}async updateHabit(t,e){return this.callService(Ct,{habit_id:t,...e})}async deleteHabit(t){return this.callService(kt,{habit_id:t})}async completeHabit(t,e){return this.callService(At,{habit_id:t,child_id:e})}async createReward(t){return this.callService(Et,t)}async claimReward(t,e){return this.callService(St,{reward_id:t,child_id:e})}async approveClaim(t,e){return this.callService(Tt,{claim_id:t,approver_id:e})}async createCosmetic(t){return this.callService(zt,t)}async purchaseCosmetic(t,e){return this.callService(Pt,{cosmetic_id:t,child_id:e})}getChildren(){const t=[],e=Object.values(this.hass.states).filter(t=>t.entity_id.startsWith(`sensor.${pt}_`)&&t.entity_id.endsWith("_points"));for(const i of e){const e=i.attributes.child_id;if(e){const i=this.getChildData(e);i&&t.push(i)}}return t}getChildData(t){const e=this.hass.states[`sensor.${pt}_${t}_points`];if(!e)return null;const i=this.hass.states[`sensor.${pt}_${t}_coins`],s=this.hass.states[`sensor.${pt}_${t}_level`],r=this.hass.states[`sensor.${pt}_${t}_experience`];return{id:t,name:e.attributes.child_name||"Unknown",person_entity:e.attributes.person_entity||"",points:parseInt(e.state)||0,coins:i&&parseInt(i.state)||0,level:s&&parseInt(s.state)||1,experience:r&&parseInt(r.state)||0,experience_to_next_level:r?.attributes.experience_to_next_level||100,avatar:e.attributes.avatar||{photo_url:"",customization:{clothes:null,accessory:null,pet:null,theme:"default"}},badges:e.attributes.badges||[],owned_cosmetics:e.attributes.owned_cosmetics||[],created_at:e.attributes.created_at||(new Date).toISOString(),updated_at:e.attributes.updated_at||(new Date).toISOString()}}getTaskCounts(t){const e=this.hass.states[`sensor.${pt}_${t}_tasks_pending`],i=this.hass.states[`sensor.${pt}_${t}_tasks_completed_waiting`];return{pending:e&&parseInt(e.state)||0,waiting:i&&parseInt(i.state)||0}}getHabitStats(t){const e=this.hass.states[`sensor.${pt}_${t}_habits_count`],i=this.hass.states[`sensor.${pt}_${t}_longest_streak`];return{count:e&&parseInt(e.state)||0,longest_streak:i&&parseInt(i.state)||0}}getCosmetics(){const t=this.hass.states[`sensor.${pt}_cosmetics`];return t&&t.attributes.cosmetics?t.attributes.cosmetics:[]}async subscribeToUpdates(t){return this.hass.connection.subscribeEvents(t,`${pt}_update`)}async listChildren(){try{return(await this.callServiceWithResponse(Ot,{})).children||[]}catch(t){throw t}}async listTasks(t){try{return(await this.callServiceWithResponse(Rt,t||{})).tasks||[]}catch(t){throw t}}async listHabits(t){try{return(await this.callServiceWithResponse(It,t||{})).habits||[]}catch(t){throw t}}async listRewards(t){try{return(await this.callServiceWithResponse(Ht,t||{})).rewards||[]}catch(t){throw t}}async listCosmetics(t){try{return(await this.callServiceWithResponse(Mt,t||{})).cosmetics||[]}catch(t){throw t}}}class Nt{constructor(t){this.listeners=new Set,this.state={children:[],tasks:[],taskInstances:[],habits:[],habitStreaks:[],rewards:[],rewardClaims:[],cosmetics:[],loading:!0,error:null},this.hass=t,this.api=new Ut(t),this.initialize()}async initialize(){try{const t=setTimeout(()=>{},1e4);await this.loadAllData(),clearTimeout(t),this.unsubscribe=await this.api.subscribeToUpdates(t=>{this.handleUpdate(t)}),this.state.loading=!1,this.notifyListeners()}catch(t){this.state.error=t instanceof Error?t.message:"Unknown error",this.state.loading=!1,this.notifyListeners()}}async loadAllData(){const t=await Promise.allSettled([this.api.listChildren(),this.api.listTasks(),this.api.listHabits(),this.api.listRewards(),this.api.listCosmetics({active_only:!0})]);"fulfilled"===t[0].status?this.state.children=t[0].value:this.state.children=[],"fulfilled"===t[1].status?this.state.tasks=t[1].value:this.state.tasks=[],"fulfilled"===t[2].status?this.state.habits=t[2].value:this.state.habits=[],"fulfilled"===t[3].status?this.state.rewards=t[3].value:this.state.rewards=[],"fulfilled"===t[4].status?this.state.cosmetics=t[4].value:this.state.cosmetics=[]}handleUpdate(t){const{update_type:e}=t;switch(e){case"child_created":case"child_updated":case"child_deleted":case"reward_claimed":case"reward_approved":case"cosmetic_purchased":case"level_up":case"badge_earned":case"points_changed":case"coins_changed":this.state.children=this.api.getChildren();break;case"task_completed":case"task_validated":case"task_refused":case"task_failed":case"habit_completed":case"streak_increased":case"streak_broken":t.child_id&&(this.state.children=this.api.getChildren())}this.notifyListeners()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notifyListeners(){this.listeners.forEach(t=>t())}getState(){return{...this.state}}async refresh(){this.state.loading=!0,this.notifyListeners();try{await this.loadAllData(),this.state.loading=!1,this.state.error=null}catch(t){this.state.error=t instanceof Error?t.message:"Unknown error",this.state.loading=!1}this.notifyListeners()}getChildren(){return this.state.children}getChild(t){return this.state.children.find(e=>e.id===t)}async createChild(t){try{await this.api.createChild(t),await this.refresh()}catch(t){throw t}}async updateChild(t,e){try{await this.api.updateChild(t,e),await this.refresh()}catch(t){throw t}}async deleteChild(t){try{await this.api.deleteChild(t),await this.refresh()}catch(t){throw t}}getTasks(){return this.state.tasks}getTask(t){return this.state.tasks.find(e=>e.id===t)}getTaskCounts(t){return this.api.getTaskCounts(t)}async createTask(t){try{await this.api.createTask(t),await this.refresh()}catch(t){throw t}}async updateTask(t,e){try{await this.api.updateTask(t,e),await this.refresh()}catch(t){throw t}}async deleteTask(t){try{await this.api.deleteTask(t),await this.refresh()}catch(t){throw t}}async markTaskCompleted(t,e){try{await this.api.markTaskCompleted(t,e),await this.refresh()}catch(t){throw t}}async validateTask(t,e,i){try{await this.api.validateTask(t,e,i),await this.refresh()}catch(t){throw t}}async refuseTask(t,e,i,s){try{await this.api.refuseTask(t,e,i,s),await this.refresh()}catch(t){throw t}}getHabits(){return this.state.habits}getHabit(t){return this.state.habits.find(e=>e.id===t)}getHabitStats(t){return this.api.getHabitStats(t)}async createHabit(t){try{await this.api.createHabit(t),await this.refresh()}catch(t){throw t}}async updateHabit(t,e){try{await this.api.updateHabit(t,e),await this.refresh()}catch(t){throw t}}async deleteHabit(t){try{await this.api.deleteHabit(t),await this.refresh()}catch(t){throw t}}async completeHabit(t,e){try{await this.api.completeHabit(t,e),await this.refresh()}catch(t){throw t}}getRewards(){return this.state.rewards}getReward(t){return this.state.rewards.find(e=>e.id===t)}async createReward(t){try{await this.api.createReward(t),await this.refresh()}catch(t){throw t}}async claimReward(t,e){try{await this.api.claimReward(t,e),await this.refresh()}catch(t){throw t}}async approveClaim(t,e){try{await this.api.approveClaim(t,e),await this.refresh()}catch(t){throw t}}getCosmetics(){return this.state.cosmetics}getOwnedCosmetics(t){const e=this.getChild(t);return e?this.state.cosmetics.filter(t=>e.owned_cosmetics.includes(t.id)):[]}getAvailableCosmetics(t){const e=this.getChild(t);return e?this.state.cosmetics.filter(t=>{if(e.owned_cosmetics.includes(t.id))return!1;if(t.unlock_requirements){const i=t.unlock_requirements;if(i.level&&e.level<i.level)return!1;if(i.badge&&!e.badges.includes(i.badge))return!1}return!0}):[]}async createCosmetic(t){try{await this.api.createCosmetic(t),await this.refresh()}catch(t){throw t}}async purchaseCosmetic(t,e){try{await this.api.purchaseCosmetic(t,e),await this.refresh()}catch(t){throw t}}destroy(){this.unsubscribe&&this.unsubscribe(),this.listeners.clear()}}const Dt=o`
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
`;var Lt,jt,Bt,qt,Ft,Vt,Yt,Wt,Gt,Jt,Kt;!function(t){t.MANDATORY="mandatory",t.BONUS="bonus"}(Lt||(Lt={})),function(t){t.DAILY="daily",t.WEEKLY="weekly",t.MONTHLY="monthly",t.SPECIFIC_DATE="specific_date"}(jt||(jt={})),function(t){t.CHORES="chores",t.HOMEWORK="homework",t.PERSONAL="personal",t.OTHER="other"}(Bt||(Bt={})),function(t){t.PENDING="pending",t.COMPLETED_WAITING="completed_waiting",t.VALIDATED="validated",t.REFUSED="refused",t.FAILED="failed"}(qt||(qt={})),function(t){t.DAILY="daily",t.WEEKLY="weekly",t.MONTHLY="monthly"}(Ft||(Ft={})),function(t){t.PROGRESSIVE="progressive",t.FIXED="fixed"}(Vt||(Vt={})),function(t){t.SCREEN_TIME="screen_time",t.MEAL_CHOICE="meal_choice",t.ACTIVITY="activity",t.OTHER="other"}(Yt||(Yt={})),function(t){t.PENDING="pending",t.APPROVED="approved",t.USED="used",t.EXPIRED="expired"}(Wt||(Wt={})),function(t){t.CLOTHES="clothes",t.ACCESSORY="accessory",t.PET="pet",t.THEME="theme",t.BADGE="badge",t.ANIMATION="animation"}(Gt||(Gt={})),function(t){t.COMMON="common",t.RARE="rare",t.EPIC="epic",t.LEGENDARY="legendary"}(Jt||(Jt={})),function(t){t.FIRST_TASK="first_task",t.TASKS_COUNT="tasks_count",t.STREAK_DAYS="streak_days",t.LEVEL_REACHED="level_reached",t.POINTS_EARNED="points_earned"}(Kt||(Kt={}));const Xt={[Jt.COMMON]:"#9E9E9E",[Jt.RARE]:"#2196F3",[Jt.EPIC]:"#9C27B0",[Jt.LEGENDARY]:"#FF9800"};Lt.MANDATORY,Lt.BONUS;class Zt extends ot{constructor(){super(...arguments),this.icon="",this.iconColor="",this.clickable=!1,this.selected=!1}handleClick(){this.clickable&&this.dispatchEvent(new CustomEvent("item-click",{bubbles:!0,composed:!0}))}render(){return B`
      <div
        class="card ${this.clickable?"clickable":""} ${this.selected?"selected":""}"
        @click="${this.handleClick}"
      >
        ${this.icon?B`
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
    `}}Zt.styles=o`
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
  `,t([lt({type:String})],Zt.prototype,"icon",void 0),t([lt({type:String})],Zt.prototype,"iconColor",void 0),t([lt({type:Boolean})],Zt.prototype,"clickable",void 0),t([lt({type:Boolean})],Zt.prototype,"selected",void 0),customElements.get("hm-item-card")||customElements.define("hm-item-card",Zt);class Qt extends ot{constructor(){super(...arguments),this.open=!1,this.title="",this.hideActions=!1,this.confirmText="Confirmer",this.cancelText="Annuler",this.hideCancel=!1,this.loading=!1}handleOverlayClick(t){t.target===t.currentTarget&&this.close()}handleCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0})),this.close()}handleConfirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}close(){this.open=!1}render(){return this.open?B`
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

          ${this.hideActions?"":B`
                <div class="dialog-actions">
                  ${this.hideCancel?"":B`
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
                    ${this.loading?B`<span class="loading-spinner"></span>`:""}${this.confirmText}
                  </button>
                </div>
              `}
        </div>
      </div>
    `:B``}}Qt.styles=o`
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
  `,t([lt({type:Boolean,reflect:!0})],Qt.prototype,"open",void 0),t([lt({type:String})],Qt.prototype,"title",void 0),t([lt({type:Boolean})],Qt.prototype,"hideActions",void 0),t([lt({type:String})],Qt.prototype,"confirmText",void 0),t([lt({type:String})],Qt.prototype,"cancelText",void 0),t([lt({type:Boolean})],Qt.prototype,"hideCancel",void 0),t([lt({type:Boolean})],Qt.prototype,"loading",void 0),customElements.get("hm-dialog")||customElements.define("hm-dialog",Qt);class te extends ot{constructor(){super(...arguments),this.availableCosmetics=[],this.allCosmetics=[],this.selectedCategory="all",this.showPurchaseDialog=!1}getCategoryIcon(t){return{all:"🛍️",clothes:"👕",accessory:"🎩",pet:"🐕",theme:"🎨",badge:"🏆",animation:"✨"}[t]||"🛍️"}getCategoryLabel(t){return{all:"Tout",clothes:"Vêtements",accessory:"Accessoires",pet:"Animaux",theme:"Thèmes",badge:"Badges",animation:"Animations"}[t]||"Tout"}getRarityLabel(t){return{common:"Commun",rare:"Rare",epic:"Épique",legendary:"Légendaire"}[t]}getItemStatus(t){if(this.child.owned_cosmetics.includes(t.id))return"owned";if(t.unlock_requirements){const e=t.unlock_requirements;if(e.level&&this.child.level<e.level)return"locked";if(e.badge&&!this.child.badges.includes(e.badge))return"locked"}return"available"}getUnlockRequirementsText(t){if(!t.unlock_requirements)return"";const e=t.unlock_requirements,i=[];return e.level&&i.push(`Niveau ${e.level} requis`),e.badge&&i.push("Badge requis"),i.join(" • ")}getFilteredCosmetics(){let t=this.allCosmetics;return"all"!==this.selectedCategory&&(t=t.filter(t=>t.category===this.selectedCategory)),t.sort((t,e)=>{const i=this.getItemStatus(t),s=this.getItemStatus(e);if("owned"===i&&"owned"!==s)return 1;if("owned"!==i&&"owned"===s)return-1;if("locked"===i&&"locked"!==s)return 1;if("locked"!==i&&"locked"===s)return-1;const r={common:0,rare:1,epic:2,legendary:3},a=r[e.rarity]-r[t.rarity];return 0!==a?a:t.cost_coins-e.cost_coins})}handleCosmeticClick(t){"available"===this.getItemStatus(t)&&(this.selectedCosmetic=t,this.showPurchaseDialog=!0)}async handlePurchase(){if(!this.selectedCosmetic)return;const t=new CustomEvent("purchase-cosmetic",{detail:{cosmeticId:this.selectedCosmetic.id,childId:this.child.id},bubbles:!0,composed:!0});this.dispatchEvent(t),this.showPurchaseDialog=!1,this.selectedCosmetic=void 0}handleCancelPurchase(){this.showPurchaseDialog=!1,this.selectedCosmetic=void 0}render(){const t=this.getFilteredCosmetics();return B`
      <div class="shop-header">
        <h2 class="shop-title">Boutique de Cosmétiques</h2>
        <div class="coins-display">
          <span class="coin-icon">🪙</span>
          <span>${this.child.coins} pièces</span>
        </div>
      </div>

      <div class="category-tabs">
        <div
          class="category-tab ${"all"===this.selectedCategory?"selected":""}"
          @click="${()=>this.selectedCategory="all"}"
        >
          ${this.getCategoryIcon("all")} ${this.getCategoryLabel("all")}
        </div>
        ${Object.values(Gt).map(t=>B`
          <div
            class="category-tab ${this.selectedCategory===t?"selected":""}"
            @click="${()=>this.selectedCategory=t}"
          >
            ${this.getCategoryIcon(t)} ${this.getCategoryLabel(t)}
          </div>
        `)}
      </div>

      ${0===t.length?B`
        <div class="empty-message">
          <p>Aucun cosmétique disponible dans cette catégorie</p>
        </div>
      `:B`
        <div class="cosmetics-grid">
          ${t.map(t=>{const e=this.getItemStatus(t),i=this.getUnlockRequirementsText(t);return B`
              <div
                class="cosmetic-card ${e}"
                @click="${()=>this.handleCosmeticClick(t)}"
              >
                <div
                  class="rarity-badge"
                  style="background-color: ${Xt[t.rarity]}"
                >
                  ${this.getRarityLabel(t.rarity)}
                </div>

                ${"owned"===e?B`
                  <div class="status-badge">✅ Possédé</div>
                `:"locked"===e?B`
                  <div class="status-badge">🔒 Verrouillé</div>
                `:""}

                <div class="preview-container">
                  ${t.preview_image}
                </div>

                <h3 class="cosmetic-name">${t.name}</h3>
                <p class="cosmetic-description">${t.description}</p>

                ${i?B`
                  <div class="unlock-requirements">
                    🔒 ${i}
                  </div>
                `:""}

                <div class="cosmetic-price">
                  <span class="price-amount">
                    <span>🪙</span>
                    <span>${t.cost_coins}</span>
                  </span>
                  ${"available"===e?B`
                    <span style="color: var(--primary-color)">🛒 Acheter</span>
                  `:""}
                </div>
              </div>
            `})}
        </div>
      `}

      ${this.showPurchaseDialog&&this.selectedCosmetic?B`
        <hm-dialog
          .open="${this.showPurchaseDialog}"
          @dialog-closed="${this.handleCancelPurchase}"
        >
          <div slot="header">Confirmer l'achat</div>
          <div slot="content" class="purchase-dialog-content">
            <div class="purchase-preview">
              <div class="purchase-preview-icon">${this.selectedCosmetic.preview_image}</div>
              <h3>${this.selectedCosmetic.name}</h3>
              <p>${this.selectedCosmetic.description}</p>
            </div>

            <div class="purchase-info">
              <div class="purchase-info-row">
                <span>Prix:</span>
                <span><strong>🪙 ${this.selectedCosmetic.cost_coins}</strong></span>
              </div>
              <div class="purchase-info-row">
                <span>Tes pièces:</span>
                <span>🪙 ${this.child.coins}</span>
              </div>
              <div class="purchase-info-row">
                <span>Après achat:</span>
                <span>🪙 ${this.child.coins-this.selectedCosmetic.cost_coins}</span>
              </div>
            </div>

            ${this.child.coins<this.selectedCosmetic.cost_coins?B`
              <div style="color: var(--error-color); text-align: center; margin-top: 16px;">
                ⚠️ Pas assez de pièces!
              </div>
            `:""}
          </div>
          <div slot="actions" class="purchase-actions">
            <button class="btn btn-secondary" @click="${this.handleCancelPurchase}">
              Annuler
            </button>
            <button
              class="btn btn-primary"
              @click="${this.handlePurchase}"
              ?disabled="${this.child.coins<this.selectedCosmetic.cost_coins}"
            >
              Acheter
            </button>
          </div>
        </hm-dialog>
      `:""}
    `}}te.styles=o`
    :host {
      display: block;
      padding: 16px;
    }

    .shop-header {
      margin-bottom: 24px;
    }

    .shop-title {
      font-size: 24px;
      font-weight: 500;
      margin: 0 0 8px 0;
    }

    .coins-display {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .coin-icon {
      font-size: 24px;
    }

    .category-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .category-tab {
      padding: 8px 16px;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      background: var(--card-background-color);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      white-space: nowrap;
    }

    .category-tab:hover {
      background: var(--secondary-background-color);
    }

    .category-tab.selected {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .cosmetics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .cosmetic-card {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 16px;
      border: 2px solid transparent;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .cosmetic-card.available {
      border-color: var(--divider-color);
      cursor: pointer;
    }

    .cosmetic-card.available:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .cosmetic-card.owned {
      opacity: 0.7;
      border-color: var(--success-color);
      background: var(--success-color-light, rgba(76, 175, 80, 0.05));
    }

    .cosmetic-card.locked {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .rarity-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: white;
    }

    .status-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      background: white;
      border: 1px solid var(--divider-color);
    }

    .preview-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;
      font-size: 64px;
      margin-bottom: 12px;
    }

    .cosmetic-name {
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 4px 0;
    }

    .cosmetic-description {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin: 0 0 12px 0;
      min-height: 32px;
    }

    .cosmetic-price {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }

    .price-amount {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 16px;
      font-weight: 600;
    }

    .unlock-requirements {
      font-size: 12px;
      color: var(--warning-color);
      margin-top: 8px;
      padding: 8px;
      background: var(--warning-color-light, rgba(255, 152, 0, 0.1));
      border-radius: 4px;
    }

    .empty-message {
      text-align: center;
      padding: 48px 16px;
      color: var(--secondary-text-color);
    }

    .purchase-dialog-content {
      padding: 16px;
    }

    .purchase-preview {
      text-align: center;
      padding: 24px;
    }

    .purchase-preview-icon {
      font-size: 80px;
      margin-bottom: 16px;
    }

    .purchase-info {
      margin: 16px 0;
    }

    .purchase-info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
    }

    .purchase-actions {
      display: flex;
      gap: 8px;
      margin-top: 24px;
    }

    .btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }

    .btn-secondary {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .btn-secondary:hover {
      background: var(--divider-color);
    }
  `,t([lt({type:Object})],te.prototype,"child",void 0),t([lt({type:Array})],te.prototype,"availableCosmetics",void 0),t([lt({type:Array})],te.prototype,"allCosmetics",void 0),t([ht()],te.prototype,"selectedCategory",void 0),t([ht()],te.prototype,"selectedCosmetic",void 0),t([ht()],te.prototype,"showPurchaseDialog",void 0),customElements.get("hm-dialog")||customElements.define("hm-cosmetics-shop",te);class ee extends ot{constructor(){super(),this.ownedCosmetics=[],this.selectedCategory=null,this.editingAvatar={photo_url:"",customization:{clothes:null,accessory:null,pet:null,theme:"default"}}}connectedCallback(){super.connectedCallback(),this.child&&(this.editingAvatar=JSON.parse(JSON.stringify(this.child.avatar)))}updated(t){t.has("child")&&this.child&&(this.editingAvatar=JSON.parse(JSON.stringify(this.child.avatar)))}getCategoryIcon(t){return{clothes:"👕",accessory:"🎩",pet:"🐕",theme:"🎨",badge:"🏆",animation:"✨"}[t]||""}getCategoryLabel(t){return{clothes:"Vêtements",accessory:"Accessoires",pet:"Animaux",theme:"Thèmes",badge:"Badges",animation:"Animations"}[t]||""}getCustomizableCategories(){return[Gt.CLOTHES,Gt.ACCESSORY,Gt.PET,Gt.THEME]}getCosmeticsForCategory(t){return this.ownedCosmetics.filter(e=>e.category===t)}getSelectedCosmeticId(t){const e=this.editingAvatar.customization;switch(t){case Gt.CLOTHES:return e.clothes;case Gt.ACCESSORY:return e.accessory;case Gt.PET:return e.pet;case Gt.THEME:return e.theme;default:return null}}selectCosmetic(t,e){const i={...this.editingAvatar.customization};switch(t){case Gt.CLOTHES:i.clothes=e;break;case Gt.ACCESSORY:i.accessory=e;break;case Gt.PET:i.pet=e;break;case Gt.THEME:i.theme=e}this.editingAvatar={...this.editingAvatar,customization:i},this.requestUpdate()}removeCosmetic(t){const e={...this.editingAvatar.customization};switch(t){case Gt.CLOTHES:e.clothes=null;break;case Gt.ACCESSORY:e.accessory=null;break;case Gt.PET:e.pet=null;break;case Gt.THEME:e.theme="default"}this.editingAvatar={...this.editingAvatar,customization:e},this.requestUpdate()}getCosmeticById(t){return t&&this.ownedCosmetics.find(e=>e.id===t)||null}handleSave(){const t=new CustomEvent("avatar-updated",{detail:{childId:this.child.id,avatar:this.editingAvatar},bubbles:!0,composed:!0});this.dispatchEvent(t)}handleReset(){this.editingAvatar=JSON.parse(JSON.stringify(this.child.avatar)),this.requestUpdate()}renderAvatarPreview(){const{customization:t}=this.editingAvatar,e=this.getCosmeticById(t.clothes),i=this.getCosmeticById(t.accessory),s=this.getCosmeticById(t.pet),r=this.getCosmeticById(t.theme);return B`
      <div class="avatar-preview">
        <!-- Base avatar (person photo or default) -->
        <div class="avatar-base">
          ${this.child.avatar.photo_url?B`
            <img src="${this.child.avatar.photo_url}" alt="Avatar" />
          `:B`
            <span>👤</span>
          `}
        </div>

        <!-- Cosmetic layers -->
        ${e?B`
          <div class="avatar-layer clothes">${e.preview_image}</div>
        `:""}

        ${i?B`
          <div class="avatar-layer accessory">${i.preview_image}</div>
        `:""}

        ${s?B`
          <div class="avatar-layer pet">${s.preview_image}</div>
        `:""}
      </div>

      ${r?B`
        <div class="current-theme">
          <strong>Thème:</strong> ${r.preview_image} ${r.name}
        </div>
      `:""}
    `}render(){const t=this.getCustomizableCategories();return B`
      <div class="customizer-container">
        <!-- Preview Section -->
        <div class="preview-section">
          <h3 class="preview-title">Aperçu de ton avatar</h3>
          ${this.renderAvatarPreview()}
          <div class="actions">
            <button class="btn btn-secondary" @click="${this.handleReset}">
              Réinitialiser
            </button>
            <button class="btn btn-primary" @click="${this.handleSave}">
              Sauvegarder
            </button>
          </div>
        </div>

        <!-- Selector Section -->
        <div class="selector-section">
          <h3 class="selector-title">Personnalise ton avatar</h3>

          <div class="category-buttons">
            ${t.map(t=>B`
              <button
                class="category-btn ${this.selectedCategory===t?"selected":""}"
                @click="${()=>this.selectedCategory=t}"
              >
                ${this.getCategoryIcon(t)} ${this.getCategoryLabel(t)}
              </button>
            `)}
          </div>

          ${this.selectedCategory?B`
            ${0===this.getCosmeticsForCategory(this.selectedCategory).length?B`
              <div class="no-cosmetics">
                <p>Tu ne possèdes aucun cosmétique dans cette catégorie</p>
                <p style="margin-top: 8px; font-size: 14px;">
                  Va dans la boutique pour en acheter! 🛍️
                </p>
              </div>
            `:B`
              <div class="cosmetics-list">
                <!-- Remove option -->
                <div class="remove-option" @click="${()=>this.removeCosmetic(this.selectedCategory)}">
                  <span>🗑️</span>
                  <span class="remove-label">Retirer</span>
                </div>

                <!-- Cosmetic options -->
                ${this.getCosmeticsForCategory(this.selectedCategory).map(t=>{const e=this.getSelectedCosmeticId(this.selectedCategory)===t.id;return B`
                    <div
                      class="cosmetic-option ${e?"selected":""}"
                      @click="${()=>this.selectCosmetic(this.selectedCategory,t.id)}"
                      title="${t.name}"
                    >
                      ${t.preview_image}
                    </div>
                  `})}
              </div>
            `}
          `:B`
            <div class="no-cosmetics">
              <p>Sélectionne une catégorie pour commencer</p>
            </div>
          `}
        </div>
      </div>
    `}}ee.styles=o`
    :host {
      display: block;
      padding: 16px;
    }

    .customizer-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 768px) {
      .customizer-container {
        grid-template-columns: 1fr;
      }
    }

    .preview-section {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
    }

    .preview-title {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 24px 0;
    }

    .avatar-preview {
      position: relative;
      width: 200px;
      height: 200px;
      margin: 0 auto 24px;
      border-radius: 50%;
      overflow: hidden;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-base {
      width: 100%;
      height: 100%;
      object-fit: cover;
      font-size: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-layer {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 80px;
      pointer-events: none;
    }

    .avatar-layer.clothes {
      z-index: 1;
    }

    .avatar-layer.accessory {
      z-index: 2;
    }

    .avatar-layer.pet {
      z-index: 3;
      top: auto;
      bottom: 10px;
      left: auto;
      right: 10px;
      transform: none;
      font-size: 40px;
    }

    .current-theme {
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 8px;
      margin-top: 16px;
    }

    .selector-section {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 24px;
    }

    .selector-title {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 16px 0;
    }

    .category-buttons {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .category-btn {
      padding: 8px 16px;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      background: var(--card-background-color);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
    }

    .category-btn:hover {
      background: var(--secondary-background-color);
    }

    .category-btn.selected {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .cosmetics-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 12px;
      max-height: 400px;
      overflow-y: auto;
      padding: 8px;
    }

    .cosmetic-option {
      aspect-ratio: 1;
      border: 2px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      position: relative;
    }

    .cosmetic-option:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: scale(1.05);
    }

    .cosmetic-option.selected {
      border-color: var(--primary-color);
      background: var(--primary-color-light, rgba(3, 169, 244, 0.1));
    }

    .cosmetic-option.selected::after {
      content: '✓';
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 16px;
      color: var(--primary-color);
      background: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-option {
      aspect-ratio: 1;
      border: 2px dashed var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      gap: 4px;
    }

    .remove-option:hover {
      background: var(--divider-color);
    }

    .remove-label {
      font-size: 10px;
      color: var(--secondary-text-color);
    }

    .no-cosmetics {
      text-align: center;
      padding: 32px;
      color: var(--secondary-text-color);
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }

    .btn-secondary {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .btn-secondary:hover {
      background: var(--divider-color);
    }
  `,t([lt({type:Object})],ee.prototype,"child",void 0),t([lt({type:Array})],ee.prototype,"ownedCosmetics",void 0),t([ht()],ee.prototype,"editingAvatar",void 0),t([ht()],ee.prototype,"selectedCategory",void 0),customElements.get("hm-avatar-customizer")||customElements.define("hm-avatar-customizer",ee);let ie=class extends ot{constructor(){super(...arguments),this._viewMode="overview"}setConfig(t){if(!t)throw new Error("Invalid configuration");if(!t.child_id)throw new Error("child_id is required");this._config=t}getCardSize(){return 4}updated(t){var e;super.updated(t),t.has("hass")&&this.hass&&(this._store||(this._store=(e=this.hass,new Nt(e)),this._unsubscribe=this._store.subscribe(()=>{this._loadChild(),this.requestUpdate()}),this.requestUpdate()),this._loadChild())}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe&&this._unsubscribe(),this._store&&this._store.destroy()}_loadChild(){this._store&&this._config&&(this._child=this._store.getChild(this._config.child_id))}render(){if(!this._config||!this.hass)return B``;if(!this._store)return B`
        <ha-card>
          <div class="card">
            <div class="loading">Initialisation du store...</div>
          </div>
        </ha-card>
      `;const t=this._store.getState();if(t.loading)return B`
        <ha-card>
          <div class="card">
            <div class="loading">Chargement des données...</div>
          </div>
        </ha-card>
      `;if(t.error)return B`
        <ha-card>
          <div class="card">
            <div class="error-banner">
              <span>Erreur: ${t.error}</span>
              <button class="btn btn-text" @click="${()=>this._store?.refresh()}">Réessayer</button>
            </div>
          </div>
        </ha-card>
      `;if(!this._child)return B`
        <ha-card>
          <div class="card">
            <div class="empty-state">
              <ha-icon icon="mdi:account-child"></ha-icon>
              <p>Enfant non trouvé (ID: ${this._config.child_id})</p>
            </div>
          </div>
        </ha-card>
      `;const e=this._config.title||`Bonjour ${this._child.name}!`;return B`
      <ha-card>
        <div class="card">
          <!-- Header -->
          <div class="card-header">
            <h1 class="card-title">${e}</h1>
          </div>

          <!-- View Tabs -->
          <div class="view-tabs">
            <button
              class="view-tab ${"overview"===this._viewMode?"active":""}"
              @click="${()=>this._viewMode="overview"}"
            >
              📊 Accueil
            </button>
            <button
              class="view-tab ${"shop"===this._viewMode?"active":""}"
              @click="${()=>this._viewMode="shop"}"
            >
              🛍️ Boutique
            </button>
            <button
              class="view-tab ${"customizer"===this._viewMode?"active":""}"
              @click="${()=>this._viewMode="customizer"}"
            >
              ✨ Mon Avatar
            </button>
          </div>

          <!-- View Content -->
          ${this._renderViewContent()}
        </div>
      </ha-card>
    `}_renderViewContent(){switch(this._viewMode){case"overview":return this._renderOverviewView();case"shop":return this._renderShopView();case"customizer":return this._renderCustomizerView();default:return B``}}_renderOverviewView(){const t=this._store?.getTaskCounts(this._child.id)||{pending:0,waiting:0},e=this._store?.getHabitStats(this._child.id)||{count:0,longest_streak:0};return B`
      <!-- Stats Grid -->
      ${this._renderStatsGrid()}

      <!-- Level Progress -->
      ${this._renderLevelProgress()}

      <!-- Tasks Section -->
      ${this._renderTasksSection(t)}

      <!-- Habits Section -->
      ${this._renderHabitsSection(e)}

      <!-- Badges Section -->
      ${this._child.badges.length>0?this._renderBadgesSection():""}
    `}_renderShopView(){if(!this._store||!this._child)return B``;const t=this._store.getCosmetics();return B`
      <hm-cosmetics-shop
        .child="${this._child}"
        .allCosmetics="${t}"
        @purchase-cosmetic="${this._handlePurchaseCosmetic}"
      ></hm-cosmetics-shop>
    `}_renderCustomizerView(){if(!this._store||!this._child)return B``;const t=this._store.getOwnedCosmetics(this._child.id);return B`
      <hm-avatar-customizer
        .child="${this._child}"
        .ownedCosmetics="${t}"
        @avatar-updated="${this._handleAvatarUpdated}"
      ></hm-avatar-customizer>
    `}async _handlePurchaseCosmetic(t){const{cosmeticId:e,childId:i}=t.detail;if(this._store)try{await this._store.purchaseCosmetic(e,i)}catch(t){}}async _handleAvatarUpdated(t){const{childId:e,avatar:i}=t.detail;if(this._store)try{await this._store.updateChild(e,{avatar:i})}catch(t){}}_renderStatsGrid(){return B`
      <div class="section">
        <div class="grid grid-2">
          <hm-item-card>
            <div class="text-center">
              <div style="font-size: 40px; color: #FFC107;">⭐</div>
              <h3>${this._child.points}</h3>
              <p>Points</p>
            </div>
          </hm-item-card>
          <hm-item-card>
            <div class="text-center">
              <div style="font-size: 40px; color: #FF9800;">🪙</div>
              <h3>${this._child.coins}</h3>
              <p>Pièces</p>
            </div>
          </hm-item-card>
        </div>
      </div>
    `}_renderLevelProgress(){const t=this._child,e=Math.min(100,t.experience/t.experience_to_next_level*100),i=function(t){const e=["#9E9E9E","#03A9F4","#2196F3","#9C27B0","#FF9800"];return e[Math.min(Math.floor((t-1)/5),e.length-1)]}(t.level);return B`
      <div class="section">
        <hm-item-card>
          <div>
            <div class="flex flex-between mb-sm">
              <span><strong>Niveau ${t.level}</strong></span>
              <span>${t.experience} / ${t.experience_to_next_level} XP</span>
            </div>
            <div style="
              width: 100%;
              height: 8px;
              background: var(--divider-color);
              border-radius: 4px;
              overflow: hidden;
            ">
              <div style="
                width: ${e}%;
                height: 100%;
                background: ${i};
                transition: width 0.3s ease;
              "></div>
            </div>
          </div>
        </hm-item-card>
      </div>
    `}_renderTasksSection(t){return B`
      <div class="section">
        <h2 class="section-title">Mes Tâches</h2>
        ${t.pending>0?B`
              <hm-item-card>
                <div>
                  <p><strong>✨ ${t.pending} tâche(s) à faire aujourd'hui</strong></p>
                  <p style="font-size: 12px; color: var(--secondary-text-color); margin-top: 8px;">
                    Demande à tes parents de te montrer la liste complète sur leur écran de gestion.
                  </p>
                </div>
              </hm-item-card>
            `:B`
              <div class="empty-state">
                <div style="font-size: 48px;">✅</div>
                <p><strong>Aucune tâche en attente</strong></p>
                <p style="font-size: 12px; margin-top: 8px;">Bravo! Tu as tout terminé!</p>
              </div>
            `}
      </div>
    `}_renderHabitsSection(t){const e=0===(i=t.longest_streak)?"#9E9E9E":i<7?"#4CAF50":i<30?"#2196F3":i<90?"#9C27B0":"#FF9800";var i;return B`
      <div class="section">
        <h2 class="section-title">Mes Habitudes</h2>
        ${t.longest_streak>0?B`
              <hm-item-card>
                <div>
                  <div class="flex flex-center" style="gap: 8px;">
                    <span style="font-size: 24px;">🔥</span>
                    <div>
                      <p><strong>Série record: ${t.longest_streak} jours</strong></p>
                      <p style="font-size: 12px; color: ${e};">Continue comme ça!</p>
                    </div>
                  </div>
                  ${t.count>0?B`<p style="font-size: 12px; margin-top: 8px; color: var(--secondary-text-color);">
                        ${t.count} habitude(s) en cours
                      </p>`:""}
                  <p style="font-size: 12px; margin-top: 8px; color: var(--secondary-text-color);">
                    Demande à tes parents de valider tes habitudes sur leur écran.
                  </p>
                </div>
              </hm-item-card>
            `:B`
              <hm-item-card>
                <div>
                  <p><strong>Commence tes habitudes pour construire une série!</strong></p>
                  <p style="font-size: 12px; color: var(--secondary-text-color); margin-top: 8px;">
                    Demande à tes parents de t'aider à démarrer.
                  </p>
                </div>
              </hm-item-card>
            `}
      </div>
    `}_renderBadgesSection(){return B`
      <div class="section">
        <h2 class="section-title">Mes Badges (${this._child.badges.length})</h2>
        <div class="grid grid-3">
          ${this._child.badges.map(t=>B`
              <hm-item-card>
                <div class="text-center">
                  <div style="font-size: 32px;">🏆</div>
                  <p style="font-size: 12px; margin-top: 4px;">${t}</p>
                </div>
              </hm-item-card>
            `)}
        </div>
      </div>
    `}};ie.styles=[Dt,o`
      .view-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        border-bottom: 2px solid var(--divider-color);
      }

      .view-tab {
        padding: 12px 24px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        color: var(--secondary-text-color);
        transition: all 0.2s ease;
        margin-bottom: -2px;
      }

      .view-tab:hover {
        color: var(--primary-text-color);
      }

      .view-tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }

      @media (max-width: 600px) {
        .view-tab {
          padding: 8px 12px;
          font-size: 14px;
        }
      }
    `],t([lt({attribute:!1})],ie.prototype,"hass",void 0),t([ht()],ie.prototype,"_config",void 0),t([ht()],ie.prototype,"_store",void 0),t([ht()],ie.prototype,"_child",void 0),t([ht()],ie.prototype,"_unsubscribe",void 0),t([ht()],ie.prototype,"_viewMode",void 0),ie=t([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("habits-child-card")],ie),window.customCards=window.customCards||[],window.customCards.push({type:"habits-child-card",name:"Habits Child",description:"Carte pour enfants pour voir leurs tâches et progresser",preview:!0});export{ie as HabitsChildCard};
