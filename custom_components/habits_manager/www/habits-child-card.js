function t(t,e,s,i){var r,a=arguments.length,n=a<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var o=t.length-1;o>=0;o--)(r=t[o])&&(n=(a<3?r(n):a>3?r(e,s,n):r(e,s))||n);return a>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let a=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new a(s,t,i)},o=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:c,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:l,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",f=_.reactiveElementPolyfillSupport,y=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&d(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const a=i?.call(this);r?.call(this,e),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...l(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),r=e.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=i;const a=r.fromAttribute(e,t.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const i=this.constructor,r=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??b)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},a){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==r||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[y("elementProperties")]=new Map,x[y("finalized")]=new Map,f?.({ReactiveElement:x}),(_.reactiveElementVersions??=[]).push("2.1.1");const w=globalThis,A=w.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+C,T=`<${k}>`,P=document,O=()=>P.createComment(""),H=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,U="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,I=/>/g,D=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),F=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),W=new WeakMap,V=P.createTreeWalker(P,129);function G(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const q=(t,e)=>{const s=t.length-1,i=[];let r,a=2===e?"<svg>":3===e?"<math>":"",n=M;for(let e=0;e<s;e++){const s=t[e];let o,c,d=-1,h=0;for(;h<s.length&&(n.lastIndex=h,c=n.exec(s),null!==c);)h=n.lastIndex,n===M?"!--"===c[1]?n=N:void 0!==c[1]?n=I:void 0!==c[2]?(j.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=D):void 0!==c[3]&&(n=D):n===D?">"===c[0]?(n=r??M,d=-1):void 0===c[1]?d=-2:(d=n.lastIndex-c[2].length,o=c[1],n=void 0===c[3]?D:'"'===c[3]?L:z):n===L||n===z?n=D:n===N||n===I?n=M:(n=D,r=void 0);const l=n===D&&t[e+1].startsWith("/>")?" ":"";a+=n===M?s+T:d>=0?(i.push(o),s.slice(0,d)+S+s.slice(d)+C+l):s+C+(-2===d?e:l)}return[G(t,a+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,a=0;const n=t.length-1,o=this.parts,[c,d]=q(t,e);if(this.el=K.createElement(c,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&o.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=d[a++],s=i.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);o.push({type:1,index:r,name:n[2],strings:s,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?st:Q}),i.removeAttribute(t)}else t.startsWith(C)&&(o.push({type:6,index:r}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),V.nextNode(),o.push({type:2,index:++r});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===k)o.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)o.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function X(t,e,s=t,i){if(e===F)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const a=H(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=X(t,r._$AS(t,e.values),r,i)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);V.currentNode=i;let r=V.nextNode(),a=0,n=0,o=s[0];for(;void 0!==o;){if(a===o.index){let e;2===o.type?e=new Z(r,r.nextSibling,this,t):1===o.type?e=new o.ctor(r,o.name,o.strings,this,t):6===o.type&&(e=new it(r,this,t)),this._$AV.push(e),o=s[++n]}a!==o?.index&&(r=V.nextNode(),a++)}return V.currentNode=P,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),H(t)?t===Y||null==t||""===t?(this._$AH!==Y&&this._$AR(),this._$AH=Y):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Y&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(G(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new J(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new K(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new Z(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=Y}_$AI(t,e=this,s,i){const r=this.strings;let a=!1;if(void 0===r)t=X(this,t,e,0),a=!H(t)||t!==this._$AH&&t!==F,a&&(this._$AH=t);else{const i=t;let n,o;for(t=r[0],n=0;n<r.length-1;n++)o=X(this,i[s+n],e,n),o===F&&(o=this._$AH[n]),a||=!H(o)||o!==this._$AH[n],o===Y?t=Y:t!==Y&&(t+=(o??"")+r[n+1]),this._$AH[n]=o}a&&!i&&this.j(t)}j(t){t===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Y?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Y)}}class st extends Q{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??Y)===F)return;const s=this._$AH,i=t===Y&&s!==Y||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==Y&&(s===Y||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(K,Z),(w.litHtmlVersions??=[]).push("3.3.1");const at=globalThis;class nt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new Z(e.insertBefore(O(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}nt._$litElement$=!0,nt.finalized=!0,at.litElementHydrateSupport?.({LitElement:nt});const ot=at.litElementPolyfillSupport;ot?.({LitElement:nt}),(at.litElementVersions??=[]).push("4.2.1");const ct=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},ht=(t=dt,e,s)=>{const{kind:i,metadata:r}=s;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),a.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const r=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,r,t)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];e.call(this,s),this.requestUpdate(i,r,t)}}throw Error("Unsupported decorator location: "+i)};function lt(t){return(e,s)=>"object"==typeof s?ht(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function pt(t){return lt({...t,state:!0,attribute:!1})}const ut="habits_manager",_t="create_child",gt="update_child",mt="delete_child",ft="create_task",yt="update_task",vt="delete_task",bt="mark_task_completed",$t="validate_task",xt="refuse_task",wt="validate_penalty",At="create_habit",Et="update_habit",St="delete_habit",Ct="complete_habit",kt="create_reward",Tt="claim_reward",Pt="approve_claim",Ot="create_cosmetic",Ht="purchase_cosmetic";class Rt{constructor(t){this.hass=t}async callService(t,e={}){return this.hass.callService(ut,t,e)}async createChild(t){return this.callService(_t,t)}async updateChild(t,e){return this.callService(gt,{child_id:t,...e})}async deleteChild(t){return this.callService(mt,{child_id:t})}async createTask(t){return this.callService(ft,t)}async updateTask(t,e){return this.callService(yt,{task_id:t,...e})}async deleteTask(t){return this.callService(vt,{task_id:t})}async markTaskCompleted(t,e){return this.callService(bt,{instance_id:t,child_id:e})}async validateTask(t,e,s){return this.callService($t,{instance_id:t,validator_id:e,note:s})}async refuseTask(t,e,s=!1,i){return this.callService(xt,{instance_id:t,validator_id:e,apply_penalty:s,note:i})}async validatePenalty(t,e){return this.callService(wt,{instance_id:t,validator_id:e})}async createHabit(t){return this.callService(At,t)}async updateHabit(t,e){return this.callService(Et,{habit_id:t,...e})}async deleteHabit(t){return this.callService(St,{habit_id:t})}async completeHabit(t,e){return this.callService(Ct,{habit_id:t,child_id:e})}async createReward(t){return this.callService(kt,t)}async claimReward(t,e){return this.callService(Tt,{reward_id:t,child_id:e})}async approveClaim(t,e){return this.callService(Pt,{claim_id:t,approver_id:e})}async createCosmetic(t){return this.callService(Ot,t)}async purchaseCosmetic(t,e){return this.callService(Ht,{cosmetic_id:t,child_id:e})}getChildren(){const t=[],e=Object.values(this.hass.states).filter(t=>t.entity_id.startsWith(`sensor.${ut}_`)&&t.entity_id.endsWith("_points"));for(const s of e){const e=s.attributes.child_id;if(e){const s=this.getChildData(e);s&&t.push(s)}}return t}getChildData(t){const e=this.hass.states[`sensor.${ut}_${t}_points`];if(!e)return null;const s=this.hass.states[`sensor.${ut}_${t}_coins`],i=this.hass.states[`sensor.${ut}_${t}_level`],r=this.hass.states[`sensor.${ut}_${t}_experience`];return{id:t,name:e.attributes.child_name||"Unknown",person_entity:e.attributes.person_entity||"",points:parseInt(e.state)||0,coins:s&&parseInt(s.state)||0,level:i&&parseInt(i.state)||1,experience:r&&parseInt(r.state)||0,experience_to_next_level:r?.attributes.experience_to_next_level||100,avatar:e.attributes.avatar||{photo_url:"",customization:{clothes:null,accessory:null,pet:null,theme:"default"}},badges:e.attributes.badges||[],owned_cosmetics:e.attributes.owned_cosmetics||[],created_at:e.attributes.created_at||(new Date).toISOString(),updated_at:e.attributes.updated_at||(new Date).toISOString()}}getTaskCounts(t){const e=this.hass.states[`sensor.${ut}_${t}_tasks_pending`],s=this.hass.states[`sensor.${ut}_${t}_tasks_completed_waiting`];return{pending:e&&parseInt(e.state)||0,waiting:s&&parseInt(s.state)||0}}getHabitStats(t){const e=this.hass.states[`sensor.${ut}_${t}_habits_count`],s=this.hass.states[`sensor.${ut}_${t}_longest_streak`];return{count:e&&parseInt(e.state)||0,longest_streak:s&&parseInt(s.state)||0}}async subscribeToUpdates(t){return this.hass.connection.subscribeEvents(t,`${ut}_update`)}}class Ut{constructor(t){this.listeners=new Set,this.state={children:[],tasks:[],taskInstances:[],habits:[],habitStreaks:[],rewards:[],rewardClaims:[],cosmetics:[],loading:!0,error:null},this.hass=t,this.api=new Rt(t),this.initialize()}async initialize(){try{await this.loadAllData(),this.unsubscribe=await this.api.subscribeToUpdates(t=>{this.handleUpdate(t)}),this.state.loading=!1,this.notifyListeners()}catch(t){this.state.error=t instanceof Error?t.message:"Unknown error",this.state.loading=!1,this.notifyListeners()}}async loadAllData(){this.state.children=this.api.getChildren()}handleUpdate(t){const{update_type:e}=t;switch(e){case"child_created":case"child_updated":case"child_deleted":case"reward_claimed":case"reward_approved":case"cosmetic_purchased":case"level_up":case"badge_earned":case"points_changed":case"coins_changed":this.state.children=this.api.getChildren();break;case"task_completed":case"task_validated":case"task_refused":case"task_failed":case"habit_completed":case"streak_increased":case"streak_broken":t.child_id&&(this.state.children=this.api.getChildren())}this.notifyListeners()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notifyListeners(){this.listeners.forEach(t=>t())}getState(){return{...this.state}}async refresh(){this.state.loading=!0,this.notifyListeners();try{await this.loadAllData(),this.state.loading=!1,this.state.error=null}catch(t){this.state.error=t instanceof Error?t.message:"Unknown error",this.state.loading=!1}this.notifyListeners()}getChildren(){return this.state.children}getChild(t){return this.state.children.find(e=>e.id===t)}async createChild(t){try{await this.api.createChild(t),await this.refresh()}catch(t){throw t}}async updateChild(t,e){try{await this.api.updateChild(t,e),await this.refresh()}catch(t){throw t}}async deleteChild(t){try{await this.api.deleteChild(t),await this.refresh()}catch(t){throw t}}getTaskCounts(t){return this.api.getTaskCounts(t)}async createTask(t){try{await this.api.createTask(t),await this.refresh()}catch(t){throw t}}async updateTask(t,e){try{await this.api.updateTask(t,e),await this.refresh()}catch(t){throw t}}async deleteTask(t){try{await this.api.deleteTask(t),await this.refresh()}catch(t){throw t}}async markTaskCompleted(t,e){try{await this.api.markTaskCompleted(t,e),await this.refresh()}catch(t){throw t}}async validateTask(t,e,s){try{await this.api.validateTask(t,e,s),await this.refresh()}catch(t){throw t}}async refuseTask(t,e,s,i){try{await this.api.refuseTask(t,e,s,i),await this.refresh()}catch(t){throw t}}getHabitStats(t){return this.api.getHabitStats(t)}async createHabit(t){try{await this.api.createHabit(t),await this.refresh()}catch(t){throw t}}async updateHabit(t,e){try{await this.api.updateHabit(t,e),await this.refresh()}catch(t){throw t}}async deleteHabit(t){try{await this.api.deleteHabit(t),await this.refresh()}catch(t){throw t}}async completeHabit(t,e){try{await this.api.completeHabit(t,e),await this.refresh()}catch(t){throw t}}async createReward(t){try{await this.api.createReward(t),await this.refresh()}catch(t){throw t}}async claimReward(t,e){try{await this.api.claimReward(t,e),await this.refresh()}catch(t){throw t}}async approveClaim(t,e){try{await this.api.approveClaim(t,e),await this.refresh()}catch(t){throw t}}async createCosmetic(t){try{await this.api.createCosmetic(t),await this.refresh()}catch(t){throw t}}async purchaseCosmetic(t,e){try{await this.api.purchaseCosmetic(t,e),await this.refresh()}catch(t){throw t}}destroy(){this.unsubscribe&&this.unsubscribe(),this.listeners.clear()}}const Mt=n`
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
`;var Nt,It,Dt,zt,Lt,jt,Bt,Ft,Yt,Wt,Vt;!function(t){t.MANDATORY="mandatory",t.BONUS="bonus"}(Nt||(Nt={})),function(t){t.DAILY="daily",t.WEEKLY="weekly",t.MONTHLY="monthly",t.SPECIFIC_DATE="specific_date"}(It||(It={})),function(t){t.CHORES="chores",t.HOMEWORK="homework",t.PERSONAL="personal",t.OTHER="other"}(Dt||(Dt={})),function(t){t.PENDING="pending",t.COMPLETED_WAITING="completed_waiting",t.VALIDATED="validated",t.REFUSED="refused",t.FAILED="failed"}(zt||(zt={})),function(t){t.DAILY="daily",t.WEEKLY="weekly",t.MONTHLY="monthly"}(Lt||(Lt={})),function(t){t.PROGRESSIVE="progressive",t.FIXED="fixed"}(jt||(jt={})),function(t){t.SCREEN_TIME="screen_time",t.MEAL_CHOICE="meal_choice",t.ACTIVITY="activity",t.OTHER="other"}(Bt||(Bt={})),function(t){t.PENDING="pending",t.APPROVED="approved",t.USED="used",t.EXPIRED="expired"}(Ft||(Ft={})),function(t){t.CLOTHES="clothes",t.ACCESSORY="accessory",t.PET="pet",t.THEME="theme",t.BADGE="badge",t.ANIMATION="animation"}(Yt||(Yt={})),function(t){t.COMMON="common",t.RARE="rare",t.EPIC="epic",t.LEGENDARY="legendary"}(Wt||(Wt={})),function(t){t.FIRST_TASK="first_task",t.TASKS_COUNT="tasks_count",t.STREAK_DAYS="streak_days",t.LEVEL_REACHED="level_reached",t.POINTS_EARNED="points_earned"}(Vt||(Vt={})),Wt.COMMON,Wt.RARE,Wt.EPIC,Wt.LEGENDARY,Nt.MANDATORY,Nt.BONUS;let Gt=class extends nt{constructor(){super(...arguments),this.icon="",this.iconColor="",this.clickable=!1,this.selected=!1}handleClick(){this.clickable&&this.dispatchEvent(new CustomEvent("item-click",{bubbles:!0,composed:!0}))}render(){return B`
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
    `}};Gt.styles=n`
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
  `,t([lt({type:String})],Gt.prototype,"icon",void 0),t([lt({type:String})],Gt.prototype,"iconColor",void 0),t([lt({type:Boolean})],Gt.prototype,"clickable",void 0),t([lt({type:Boolean})],Gt.prototype,"selected",void 0),Gt=t([ct("hm-item-card")],Gt);let qt=class extends nt{setConfig(t){if(!t)throw new Error("Invalid configuration");if(!t.child_id)throw new Error("child_id is required");this._config=t}getCardSize(){return 4}updated(t){var e;super.updated(t),t.has("hass")&&this.hass&&(this._store||(this._store=(e=this.hass,new Ut(e)),this._unsubscribe=this._store.subscribe(()=>{this._loadChild(),this.requestUpdate()})),this._loadChild())}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe&&this._unsubscribe(),this._store&&this._store.destroy()}_loadChild(){this._store&&this._config&&(this._child=this._store.getChild(this._config.child_id))}render(){if(!this._config||!this.hass)return B``;if(!this._child)return B`
        <ha-card>
          <div class="card">
            <div class="loading">Chargement...</div>
          </div>
        </ha-card>
      `;const t=this._config.title||`Bonjour ${this._child.name}!`,e=this._store?.getTaskCounts(this._child.id)||{pending:0,waiting:0},s=this._store?.getHabitStats(this._child.id)||{count:0,longest_streak:0};return B`
      <ha-card>
        <div class="card">
          <!-- Header -->
          <div class="card-header">
            <h1 class="card-title">${t}</h1>
          </div>

          <!-- Stats Grid -->
          ${this._renderStatsGrid()}

          <!-- Level Progress -->
          ${this._renderLevelProgress()}

          <!-- Tasks Section -->
          ${this._renderTasksSection(e)}

          <!-- Habits Section -->
          ${this._renderHabitsSection(s)}

          <!-- Badges Section -->
          ${this._child.badges.length>0?this._renderBadgesSection():""}
        </div>
      </ha-card>
    `}_renderStatsGrid(){return B`
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
    `}_renderLevelProgress(){const t=this._child,e=Math.min(100,t.experience/t.experience_to_next_level*100),s=function(t){const e=["#9E9E9E","#03A9F4","#2196F3","#9C27B0","#FF9800"];return e[Math.min(Math.floor((t-1)/5),e.length-1)]}(t.level);return B`
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
                background: ${s};
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
    `}_renderHabitsSection(t){const e=0===(s=t.longest_streak)?"#9E9E9E":s<7?"#4CAF50":s<30?"#2196F3":s<90?"#9C27B0":"#FF9800";var s;return B`
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
    `}};qt.styles=Mt,t([lt({attribute:!1})],qt.prototype,"hass",void 0),t([pt()],qt.prototype,"_config",void 0),t([pt()],qt.prototype,"_store",void 0),t([pt()],qt.prototype,"_child",void 0),t([pt()],qt.prototype,"_unsubscribe",void 0),qt=t([ct("habits-child-card")],qt),window.customCards=window.customCards||[],window.customCards.push({type:"habits-child-card",name:"Habits Child",description:"Carte pour enfants pour voir leurs tâches et progresser",preview:!0});export{qt as HabitsChildCard};
