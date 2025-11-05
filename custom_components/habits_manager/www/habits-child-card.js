function t(t,e,s,i){var r,n=arguments.length,o=n<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,s,o):r(e,s))||o);return n>3&&o&&Object.defineProperty(e,s,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(e,t))}return t}toString(){return this.cssText}};const o=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,_=u.trustedTypes,g=_?_.emptyScript:"",m=u.reactiveElementPolyfillSupport,f=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);r?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),r=e.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i;const n=r.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const i=this.constructor,r=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??v)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[f("elementProperties")]=new Map,y[f("finalized")]=new Map,m?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.1");const x=globalThis,A=x.trustedTypes,w=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,k=`<${C}>`,P=document,U=()=>P.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,H="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,z=/>/g,N=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,I=/"/g,D=/^(?:script|style|textarea|title)$/i,L=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),B=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),W=new WeakMap,F=P.createTreeWalker(P,129);function V(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==w?w.createHTML(e):e}const Y=(t,e)=>{const s=t.length-1,i=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=M;for(let e=0;e<s;e++){const s=t[e];let a,c,l=-1,d=0;for(;d<s.length&&(o.lastIndex=d,c=o.exec(s),null!==c);)d=o.lastIndex,o===M?"!--"===c[1]?o=R:void 0!==c[1]?o=z:void 0!==c[2]?(D.test(c[2])&&(r=RegExp("</"+c[2],"g")),o=N):void 0!==c[3]&&(o=N):o===N?">"===c[0]?(o=r??M,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?N:'"'===c[3]?I:j):o===I||o===j?o=N:o===R||o===z?o=M:(o=N,r=void 0);const h=o===N&&t[e+1].startsWith("/>")?" ":"";n+=o===M?s+k:l>=0?(i.push(a),s.slice(0,l)+S+s.slice(l)+E+h):s+E+(-2===l?e:h)}return[V(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class X{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[c,l]=Y(t,e);if(this.el=X.createElement(c,s),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=F.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=l[n++],s=i.getAttribute(t).split(E),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:s,ctor:"."===o[1]?Q:"?"===o[1]?tt:"@"===o[1]?et:G}),i.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(D.test(i.tagName)){const t=i.textContent.split(E),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],U()),F.nextNode(),a.push({type:2,index:++r});i.append(t[e],U())}}}else if(8===i.nodeType)if(i.data===C)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(E,t+1));)a.push({type:7,index:r}),t+=E.length-1}r++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function J(t,e,s=t,i){if(e===B)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const n=T(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=J(t,r._$AS(t,e.values),r,i)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);F.currentNode=i;let r=F.nextNode(),n=0,o=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Z(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new st(r,this,t)),this._$AV.push(e),a=s[++o]}n!==a?.index&&(r=F.nextNode(),n++)}return F.currentNode=P,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),T(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=X.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new K(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new X(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new Z(this.O(U()),this.O(U()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class G{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,i){const r=this.strings;let n=!1;if(void 0===r)t=J(this,t,e,0),n=!T(t)||t!==this._$AH&&t!==B,n&&(this._$AH=t);else{const i=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=J(this,i[s+o],e,o),a===B&&(a=this._$AH[o]),n||=!T(a)||a!==this._$AH[o],a===q?t=q:t!==q&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!i&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Q extends G{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class tt extends G{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class et extends G{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??q)===B)return;const s=this._$AH,i=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const it=x.litHtmlPolyfillSupport;it?.(X,Z),(x.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;class nt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new Z(e.insertBefore(U(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const ot=rt.litElementPolyfillSupport;ot?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.1");const at={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:v},ct=(t=at,e,s)=>{const{kind:i,metadata:r}=s;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),n.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const r=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,r,t)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];e.call(this,s),this.requestUpdate(i,r,t)}}throw Error("Unsupported decorator location: "+i)};function lt(t){return(e,s)=>"object"==typeof s?ct(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function dt(t){return lt({...t,state:!0,attribute:!1})}const ht="habits_manager",pt="create_child",ut="update_child",_t="delete_child",gt="create_task",mt="update_task",ft="delete_task",$t="mark_task_completed",vt="validate_task",bt="refuse_task",yt="validate_penalty",xt="create_habit",At="update_habit",wt="delete_habit",St="complete_habit",Et="create_reward",Ct="claim_reward",kt="approve_claim",Pt="create_cosmetic",Ut="purchase_cosmetic";class Tt{constructor(t){this.hass=t}async callService(t,e={}){return this.hass.callService(ht,t,e)}async createChild(t){return this.callService(pt,t)}async updateChild(t,e){return this.callService(ut,{child_id:t,...e})}async deleteChild(t){return this.callService(_t,{child_id:t})}async createTask(t){return this.callService(gt,t)}async updateTask(t,e){return this.callService(mt,{task_id:t,...e})}async deleteTask(t){return this.callService(ft,{task_id:t})}async markTaskCompleted(t,e){return this.callService($t,{instance_id:t,child_id:e})}async validateTask(t,e,s){return this.callService(vt,{instance_id:t,validator_id:e,note:s})}async refuseTask(t,e,s=!1,i){return this.callService(bt,{instance_id:t,validator_id:e,apply_penalty:s,note:i})}async validatePenalty(t,e){return this.callService(yt,{instance_id:t,validator_id:e})}async createHabit(t){return this.callService(xt,t)}async updateHabit(t,e){return this.callService(At,{habit_id:t,...e})}async deleteHabit(t){return this.callService(wt,{habit_id:t})}async completeHabit(t,e){return this.callService(St,{habit_id:t,child_id:e})}async createReward(t){return this.callService(Et,t)}async claimReward(t,e){return this.callService(Ct,{reward_id:t,child_id:e})}async approveClaim(t,e){return this.callService(kt,{claim_id:t,approver_id:e})}async createCosmetic(t){return this.callService(Pt,t)}async purchaseCosmetic(t,e){return this.callService(Ut,{cosmetic_id:t,child_id:e})}getChildren(){const t=[],e=Object.values(this.hass.states).filter(t=>t.entity_id.startsWith(`sensor.${ht}_`)&&t.entity_id.endsWith("_points"));for(const s of e){const e=s.attributes.child_id;if(e){const s=this.getChildData(e);s&&t.push(s)}}return t}getChildData(t){const e=this.hass.states[`sensor.${ht}_${t}_points`];if(!e)return null;const s=this.hass.states[`sensor.${ht}_${t}_coins`],i=this.hass.states[`sensor.${ht}_${t}_level`],r=this.hass.states[`sensor.${ht}_${t}_experience`];return{id:t,name:e.attributes.child_name||"Unknown",person_entity:e.attributes.person_entity||"",points:parseInt(e.state)||0,coins:s&&parseInt(s.state)||0,level:i&&parseInt(i.state)||1,experience:r&&parseInt(r.state)||0,experience_to_next_level:r?.attributes.experience_to_next_level||100,avatar:e.attributes.avatar||{photo_url:"",customization:{clothes:null,accessory:null,pet:null,theme:"default"}},badges:e.attributes.badges||[],owned_cosmetics:e.attributes.owned_cosmetics||[],created_at:e.attributes.created_at||(new Date).toISOString(),updated_at:e.attributes.updated_at||(new Date).toISOString()}}getTaskCounts(t){const e=this.hass.states[`sensor.${ht}_${t}_tasks_pending`],s=this.hass.states[`sensor.${ht}_${t}_tasks_completed_waiting`];return{pending:e&&parseInt(e.state)||0,waiting:s&&parseInt(s.state)||0}}getHabitStats(t){const e=this.hass.states[`sensor.${ht}_${t}_habits_count`],s=this.hass.states[`sensor.${ht}_${t}_longest_streak`];return{count:e&&parseInt(e.state)||0,longest_streak:s&&parseInt(s.state)||0}}async subscribeToUpdates(t){return this.hass.connection.subscribeEvents(t,`${ht}_update`)}}const Ot=((t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(s,t,i)})`
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
`;let Ht=class extends nt{setConfig(t){if(!t)throw new Error("Invalid configuration");if(!t.child_id)throw new Error("child_id is required");this._config=t}getCardSize(){return 4}updated(t){super.updated(t),t.has("hass")&&this.hass&&(this._api||(this._api=new Tt(this.hass),this._subscribeToUpdates()),this._loadChild())}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe&&this._unsubscribe()}async _subscribeToUpdates(){this._api&&(this._unsubscribe=await this._api.subscribeToUpdates(t=>{t.child_id===this._config?.child_id&&this._loadChild(),this.requestUpdate()}))}_loadChild(){this._api&&this._config&&(this._child=this._api.getChildData(this._config.child_id))}_renderProgressBar(t,e){const s=Math.min(100,t/e*100);return L`
      <div style="
        width: 100%;
        height: 8px;
        background: var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 4px;
        overflow: hidden;
        margin-top: 4px;
      ">
        <div style="
          width: ${s}%;
          height: 100%;
          background: var(--primary-color, #03a9f4);
          transition: width 0.3s ease;
        "></div>
      </div>
    `}render(){if(!this._config||!this.hass)return L``;if(!this._child)return L`
        <ha-card>
          <div class="card">
            <div class="loading">
              <p>Chargement...</p>
            </div>
          </div>
        </ha-card>
      `;const t=this._config.title||`Bonjour ${this._child.name}!`,e=this._api?.getTaskCounts(this._child.id)||{pending:0},s=this._api?.getHabitStats(this._child.id)||{count:0,longest_streak:0};return L`
      <ha-card>
        <div class="card">
          <div class="card-header">
            <h1 class="card-title">${t}</h1>
          </div>

          <!-- Stats Section -->
          <div class="section">
            <div class="grid grid-2">
              <div class="item-card text-center">
                <ha-icon icon="mdi:star" class="icon-large" style="color: #FFC107;"></ha-icon>
                <h3>${this._child.points}</h3>
                <p>Points</p>
              </div>
              <div class="item-card text-center">
                <ha-icon icon="mdi:coin" class="icon-large" style="color: #FF9800;"></ha-icon>
                <h3>${this._child.coins}</h3>
                <p>Pièces</p>
              </div>
            </div>
          </div>

          <!-- Level Section -->
          <div class="section">
            <div class="item-card">
              <div class="flex flex-between mb-sm">
                <span><strong>Niveau ${this._child.level}</strong></span>
                <span>${this._child.experience} / ${this._child.experience_to_next_level} XP</span>
              </div>
              ${this._renderProgressBar(this._child.experience,this._child.experience_to_next_level)}
            </div>
          </div>

          <!-- Tasks Section -->
          <div class="section">
            <h2 class="section-title">Mes Tâches (${e.pending})</h2>
            ${e.pending>0?L`<p>Liste des tâches à faire (à implémenter)</p>`:L`
                  <div class="empty-state">
                    <ha-icon icon="mdi:check-all"></ha-icon>
                    <p>Aucune tâche en attente</p>
                  </div>
                `}
          </div>

          <!-- Habits Section -->
          <div class="section">
            <h2 class="section-title">Mes Habitudes (${s.count})</h2>
            ${s.longest_streak>0?L`
                  <div class="item-card">
                    <div class="flex flex-center">
                      <ha-icon icon="mdi:fire" style="color: #FF5722;"></ha-icon>
                      <span class="ml-sm">Série la plus longue: ${s.longest_streak} jours</span>
                    </div>
                  </div>
                `:L`<p>Commence tes habitudes pour construire une série!</p>`}
          </div>

          <!-- Badges Section -->
          ${this._child.badges.length>0?L`
                <div class="section">
                  <h2 class="section-title">Mes Badges (${this._child.badges.length})</h2>
                  <p>Liste des badges (à implémenter)</p>
                </div>
              `:""}
        </div>
      </ha-card>
    `}};Ht.styles=Ot,t([lt({attribute:!1})],Ht.prototype,"hass",void 0),t([dt()],Ht.prototype,"_config",void 0),t([dt()],Ht.prototype,"_api",void 0),t([dt()],Ht.prototype,"_child",void 0),t([dt()],Ht.prototype,"_unsubscribe",void 0),Ht=t([(t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("habits-child-card")],Ht),window.customCards=window.customCards||[],window.customCards.push({type:"habits-child-card",name:"Habits Child",description:"Carte pour enfants pour voir leurs tâches et progresser",preview:!0});export{Ht as HabitsChildCard};
