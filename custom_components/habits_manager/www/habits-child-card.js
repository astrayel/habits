function t(t,e,i,s){var o,r=arguments.length,a=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,s);else for(var n=t.length-1;n>=0;n--)(o=t[n])&&(a=(r<3?o(a):r>3?o(e,i,a):o(e,i))||a);return r>3&&a&&Object.defineProperty(e,i,a),a}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)},n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:d,getOwnPropertyDescriptor:l,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:g}=Object,u=globalThis,m=u.trustedTypes,v=m?m.emptyScript:"",b=u.reactiveElementPolyfillSupport,f=(t,e)=>t,x={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!c(t,e),_={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&d(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);o?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:x).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:x;this._$Em=s;const r=o.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,o=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??y)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[f("elementProperties")]=new Map,$[f("finalized")]=new Map,b?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.1");const w=globalThis,C=w.trustedTypes,A=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+E,P=`<${S}>`,I=document,z=()=>I.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,R="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,N=/>/g,U=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),V=new WeakMap,Y=I.createTreeWalker(I,129);function W(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let o,r=2===e?"<svg>":3===e?"<math>":"",a=M;for(let e=0;e<i;e++){const i=t[e];let n,c,d=-1,l=0;for(;l<i.length&&(a.lastIndex=l,c=a.exec(i),null!==c);)l=a.lastIndex,a===M?"!--"===c[1]?a=H:void 0!==c[1]?a=N:void 0!==c[2]?(j.test(c[2])&&(o=RegExp("</"+c[2],"g")),a=U):void 0!==c[3]&&(a=U):a===U?">"===c[0]?(a=o??M,d=-1):void 0===c[1]?d=-2:(d=a.lastIndex-c[2].length,n=c[1],a=void 0===c[3]?U:'"'===c[3]?L:D):a===L||a===D?a=U:a===H||a===N?a=M:(a=U,o=void 0);const p=a===U&&t[e+1].startsWith("/>")?" ":"";r+=a===M?i+P:d>=0?(s.push(n),i.slice(0,d)+k+i.slice(d)+E+p):i+E+(-2===d?e:p)}return[W(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,r=0;const a=t.length-1,n=this.parts,[c,d]=G(t,e);if(this.el=J.createElement(c,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Y.nextNode())&&n.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(k)){const e=d[r++],i=s.getAttribute(t).split(E),a=/([.?@])?(.*)/.exec(e);n.push({type:1,index:o,name:a[2],strings:i,ctor:"."===a[1]?tt:"?"===a[1]?et:"@"===a[1]?it:Q}),s.removeAttribute(t)}else t.startsWith(E)&&(n.push({type:6,index:o}),s.removeAttribute(t));if(j.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=C?C.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],z()),Y.nextNode(),n.push({type:2,index:++o});s.append(t[e],z())}}}else if(8===s.nodeType)if(s.data===S)n.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)n.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const i=I.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===q)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=T(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=K(t,o._$AS(t,e.values),o,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??I).importNode(e,!0);Y.currentNode=s;let o=Y.nextNode(),r=0,a=0,n=i[0];for(;void 0!==n;){if(r===n.index){let e;2===n.type?e=new Z(o,o.nextSibling,this,t):1===n.type?e=new n.ctor(o,n.name,n.strings,this,t):6===n.type&&(e=new st(o,this,t)),this._$AV.push(e),n=i[++a]}r!==n?.index&&(o=Y.nextNode(),r++)}return Y.currentNode=I,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),T(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(W(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new J(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Z(this.O(z()),this.O(z()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const o=this.strings;let r=!1;if(void 0===o)t=K(this,t,e,0),r=!T(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const s=t;let a,n;for(t=o[0],a=0;a<o.length-1;a++)n=K(this,s[i+a],e,a),n===q&&(n=this._$AH[a]),r||=!T(n)||n!==this._$AH[a],n===F?t=F:t!==F&&(t+=(n??"")+o[a+1]),this._$AH[a]=n}r&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class it extends Q{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??F)===q)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const ot=w.litHtmlPolyfillSupport;ot?.(J,Z),(w.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;class at extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new Z(e.insertBefore(z(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const nt=rt.litElementPolyfillSupport;nt?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.1");const ct={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:y},dt=(t=ct,e,i)=>{const{kind:s,metadata:o}=i;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t)}}throw Error("Unsupported decorator location: "+s)};function lt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return lt({...t,state:!0,attribute:!1})}const ht="habits_manager";class gt{constructor(t,e){this.hass=t,this.childId=e}updateHass(t){this.hass=t}getChild(){const t=`sensor.${ht}_${this.childId}_points`,e=`sensor.habits_${this.childId}_points`,i=Object.keys(this.hass.states).filter(t=>t.startsWith("sensor.habits")||t.includes("habits_manager"));console.log("[ChildAPI] Looking for child sensors:",{childId:this.childId,trying:[t,e],allHabitsSensors:i.slice(0,20)});let s=this.hass.states[t]||this.hass.states[e];if(!s)return console.error(`[ChildAPI] ❌ Child sensor not found for ${this.childId}`),console.error("[ChildAPI] All available habits sensors:",i),console.error("[ChildAPI] Please check your card config 'child_id' matches the actual sensor ID"),null;const o=s.entity_id.startsWith("sensor.habits_manager_")?ht:"habits",r=this.hass.states[`sensor.${o}_${this.childId}_coins`],a=this.hass.states[`sensor.${o}_${this.childId}_level`],n=this.hass.states[`sensor.${o}_${this.childId}_experience`];return console.log(`[ChildAPI] Using sensor prefix: ${o}`),{id:this.childId,name:s.attributes.child_name||"Unknown",person_entity:s.attributes.person_entity||"",points:parseInt(s.state)||0,coins:r&&parseInt(r.state)||0,level:a&&parseInt(a.state)||1,experience:n&&parseInt(n.state)||0,experience_to_next_level:n?.attributes.experience_to_next_level||100,avatar:s.attributes.avatar||{photo_url:"",customization:{}},badges:s.attributes.badges||[],owned_cosmetics:s.attributes.owned_cosmetics||[]}}getSensorPrefix(){const t=`sensor.${ht}_${this.childId}_points`,e=`sensor.habits_${this.childId}_points`;return this.hass.states[t]?ht:this.hass.states[e]?"habits":ht}getTaskCounts(){const t=this.getSensorPrefix(),e=this.hass.states[`sensor.${t}_${this.childId}_tasks_pending`],i=this.hass.states[`sensor.${t}_${this.childId}_tasks_completed_waiting`];return{pending:e&&parseInt(e.state)||0,waiting:i&&parseInt(i.state)||0}}getTasksWaitingValidation(){const t=this.hass.states[`sensor.habits_${this.childId}_tasks_waiting_validation_list`];return t&&t.attributes.instances?t.attributes.instances:[]}getHabitStats(){const t=this.getSensorPrefix(),e=this.hass.states[`sensor.${t}_${this.childId}_habits_count`],i=this.hass.states[`sensor.${t}_${this.childId}_longest_streak`];return{count:e&&parseInt(e.state)||0,longest_streak:i&&parseInt(i.state)||0}}async markTaskCompleted(t){console.log(`[ChildAPI] Marking task completed: ${t}`),await this.hass.callService(ht,"mark_task_completed",{instance_id:t,child_id:this.childId})}async completeHabit(t){console.log(`[ChildAPI] Completing habit: ${t}`),await this.hass.callService(ht,"complete_habit",{habit_id:t,child_id:this.childId})}async claimReward(t){console.log(`[ChildAPI] Claiming reward: ${t}`),await this.hass.callService(ht,"claim_reward",{reward_id:t,child_id:this.childId})}async subscribeToUpdates(t){return await this.hass.connection.subscribeEvents(e=>{console.log("[ChildAPI] Received HA event:",e),t()},`${ht}_update`)}}const ut=a`
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
`;var mt,vt,bt,ft,xt,yt,_t,$t,wt,Ct,At;!function(t){t.MANDATORY="mandatory",t.BONUS="bonus"}(mt||(mt={})),function(t){t.DAILY="daily",t.WEEKLY="weekly",t.MONTHLY="monthly",t.SPECIFIC_DATE="specific_date"}(vt||(vt={})),function(t){t.CHORES="chores",t.HOMEWORK="homework",t.PERSONAL="personal",t.OTHER="other"}(bt||(bt={})),function(t){t.PENDING="pending",t.COMPLETED_WAITING="completed_waiting",t.VALIDATED="validated",t.REFUSED="refused",t.FAILED="failed"}(ft||(ft={})),function(t){t.DAILY="daily",t.WEEKLY="weekly",t.MONTHLY="monthly"}(xt||(xt={})),function(t){t.PROGRESSIVE="progressive",t.FIXED="fixed"}(yt||(yt={})),function(t){t.SCREEN_TIME="screen_time",t.MEAL_CHOICE="meal_choice",t.ACTIVITY="activity",t.OTHER="other"}(_t||(_t={})),function(t){t.PENDING="pending",t.APPROVED="approved",t.USED="used",t.EXPIRED="expired"}($t||($t={})),function(t){t.CLOTHES="clothes",t.ACCESSORY="accessory",t.PET="pet",t.THEME="theme",t.BADGE="badge",t.ANIMATION="animation"}(wt||(wt={})),function(t){t.COMMON="common",t.RARE="rare",t.EPIC="epic",t.LEGENDARY="legendary"}(Ct||(Ct={})),function(t){t.FIRST_TASK="first_task",t.TASKS_COUNT="tasks_count",t.STREAK_DAYS="streak_days",t.LEVEL_REACHED="level_reached",t.POINTS_EARNED="points_earned"}(At||(At={}));const kt={[Ct.COMMON]:"#9E9E9E",[Ct.RARE]:"#2196F3",[Ct.EPIC]:"#9C27B0",[Ct.LEGENDARY]:"#FF9800"};mt.MANDATORY,mt.BONUS;class Et extends at{constructor(){super(...arguments),this.icon="",this.iconColor="",this.clickable=!1,this.selected=!1}handleClick(){this.clickable&&this.dispatchEvent(new CustomEvent("item-click",{bubbles:!0,composed:!0}))}render(){return B`
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
    `}}Et.styles=a`
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
  `,t([lt({type:String})],Et.prototype,"icon",void 0),t([lt({type:String})],Et.prototype,"iconColor",void 0),t([lt({type:Boolean})],Et.prototype,"clickable",void 0),t([lt({type:Boolean})],Et.prototype,"selected",void 0),customElements.get("hm-item-card")||customElements.define("hm-item-card",Et);class St extends at{constructor(){super(...arguments),this.open=!1,this.title="",this.hideActions=!1,this.confirmText="Confirmer",this.cancelText="Annuler",this.hideCancel=!1,this.loading=!1}handleOverlayClick(t){t.target===t.currentTarget&&this.close()}handleCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0})),this.close()}handleConfirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}close(){this.open=!1}render(){return this.open?B`
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
    `:B``}}St.styles=a`
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
  `,t([lt({type:Boolean,reflect:!0})],St.prototype,"open",void 0),t([lt({type:String})],St.prototype,"title",void 0),t([lt({type:Boolean})],St.prototype,"hideActions",void 0),t([lt({type:String})],St.prototype,"confirmText",void 0),t([lt({type:String})],St.prototype,"cancelText",void 0),t([lt({type:Boolean})],St.prototype,"hideCancel",void 0),t([lt({type:Boolean})],St.prototype,"loading",void 0),customElements.get("hm-dialog")||customElements.define("hm-dialog",St);class Pt extends at{constructor(){super(...arguments),this.availableCosmetics=[],this.allCosmetics=[],this.selectedCategory="all",this.showPurchaseDialog=!1}getCategoryIcon(t){return{all:"🛍️",clothes:"👕",accessory:"🎩",pet:"🐕",theme:"🎨",badge:"🏆",animation:"✨"}[t]||"🛍️"}getCategoryLabel(t){return{all:"Tout",clothes:"Vêtements",accessory:"Accessoires",pet:"Animaux",theme:"Thèmes",badge:"Badges",animation:"Animations"}[t]||"Tout"}getRarityLabel(t){return{common:"Commun",rare:"Rare",epic:"Épique",legendary:"Légendaire"}[t]}getItemStatus(t){if(this.child.owned_cosmetics.includes(t.id))return"owned";if(t.unlock_requirements){const e=t.unlock_requirements;if(e.level&&this.child.level<e.level)return"locked";if(e.badge&&!this.child.badges.includes(e.badge))return"locked"}return"available"}getUnlockRequirementsText(t){if(!t.unlock_requirements)return"";const e=t.unlock_requirements,i=[];return e.level&&i.push(`Niveau ${e.level} requis`),e.badge&&i.push("Badge requis"),i.join(" • ")}getFilteredCosmetics(){let t=this.allCosmetics;return"all"!==this.selectedCategory&&(t=t.filter(t=>t.category===this.selectedCategory)),t.sort((t,e)=>{const i=this.getItemStatus(t),s=this.getItemStatus(e);if("owned"===i&&"owned"!==s)return 1;if("owned"!==i&&"owned"===s)return-1;if("locked"===i&&"locked"!==s)return 1;if("locked"!==i&&"locked"===s)return-1;const o={common:0,rare:1,epic:2,legendary:3},r=o[e.rarity]-o[t.rarity];return 0!==r?r:t.cost_coins-e.cost_coins})}handleCosmeticClick(t){"available"===this.getItemStatus(t)&&(this.selectedCosmetic=t,this.showPurchaseDialog=!0)}async handlePurchase(){if(!this.selectedCosmetic)return;const t=new CustomEvent("purchase-cosmetic",{detail:{cosmeticId:this.selectedCosmetic.id,childId:this.child.id},bubbles:!0,composed:!0});this.dispatchEvent(t),this.showPurchaseDialog=!1,this.selectedCosmetic=void 0}handleCancelPurchase(){this.showPurchaseDialog=!1,this.selectedCosmetic=void 0}render(){const t=this.getFilteredCosmetics();return B`
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
        ${Object.values(wt).map(t=>B`
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
                  style="background-color: ${kt[t.rarity]}"
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
    `}}Pt.styles=a`
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
  `,t([lt({type:Object})],Pt.prototype,"child",void 0),t([lt({type:Array})],Pt.prototype,"availableCosmetics",void 0),t([lt({type:Array})],Pt.prototype,"allCosmetics",void 0),t([pt()],Pt.prototype,"selectedCategory",void 0),t([pt()],Pt.prototype,"selectedCosmetic",void 0),t([pt()],Pt.prototype,"showPurchaseDialog",void 0),customElements.get("hm-dialog")||customElements.define("hm-cosmetics-shop",Pt);class It extends at{constructor(){super(),this.ownedCosmetics=[],this.selectedCategory=null,this.editingAvatar={photo_url:"",customization:{clothes:null,accessory:null,pet:null,theme:"default"}}}connectedCallback(){super.connectedCallback(),this.child&&(this.editingAvatar=JSON.parse(JSON.stringify(this.child.avatar)))}updated(t){t.has("child")&&this.child&&(this.editingAvatar=JSON.parse(JSON.stringify(this.child.avatar)))}getCategoryIcon(t){return{clothes:"👕",accessory:"🎩",pet:"🐕",theme:"🎨",badge:"🏆",animation:"✨"}[t]||""}getCategoryLabel(t){return{clothes:"Vêtements",accessory:"Accessoires",pet:"Animaux",theme:"Thèmes",badge:"Badges",animation:"Animations"}[t]||""}getCustomizableCategories(){return[wt.CLOTHES,wt.ACCESSORY,wt.PET,wt.THEME]}getCosmeticsForCategory(t){return this.ownedCosmetics.filter(e=>e.category===t)}getSelectedCosmeticId(t){const e=this.editingAvatar.customization;switch(t){case wt.CLOTHES:return e.clothes;case wt.ACCESSORY:return e.accessory;case wt.PET:return e.pet;case wt.THEME:return e.theme;default:return null}}selectCosmetic(t,e){const i={...this.editingAvatar.customization};switch(t){case wt.CLOTHES:i.clothes=e;break;case wt.ACCESSORY:i.accessory=e;break;case wt.PET:i.pet=e;break;case wt.THEME:i.theme=e}this.editingAvatar={...this.editingAvatar,customization:i},this.requestUpdate()}removeCosmetic(t){const e={...this.editingAvatar.customization};switch(t){case wt.CLOTHES:e.clothes=null;break;case wt.ACCESSORY:e.accessory=null;break;case wt.PET:e.pet=null;break;case wt.THEME:e.theme="default"}this.editingAvatar={...this.editingAvatar,customization:e},this.requestUpdate()}getCosmeticById(t){return t&&this.ownedCosmetics.find(e=>e.id===t)||null}handleSave(){const t=new CustomEvent("avatar-updated",{detail:{childId:this.child.id,avatar:this.editingAvatar},bubbles:!0,composed:!0});this.dispatchEvent(t)}handleReset(){this.editingAvatar=JSON.parse(JSON.stringify(this.child.avatar)),this.requestUpdate()}renderAvatarPreview(){const{customization:t}=this.editingAvatar,e=this.getCosmeticById(t.clothes),i=this.getCosmeticById(t.accessory),s=this.getCosmeticById(t.pet),o=this.getCosmeticById(t.theme);return B`
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

      ${o?B`
        <div class="current-theme">
          <strong>Thème:</strong> ${o.preview_image} ${o.name}
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
    `}}It.styles=a`
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
  `,t([lt({type:Object})],It.prototype,"child",void 0),t([lt({type:Array})],It.prototype,"ownedCosmetics",void 0),t([pt()],It.prototype,"editingAvatar",void 0),t([pt()],It.prototype,"selectedCategory",void 0),customElements.get("hm-avatar-customizer")||customElements.define("hm-avatar-customizer",It);let zt=class extends at{constructor(){super(...arguments),this._tasks=[],this._viewMode="overview",this._loading=!0}setConfig(t){if(!t)throw new Error("Invalid configuration");if(!t.child_id)throw new Error("child_id is required");this._config=t,console.log("%c╔═══════════════════════════════════════════════════════╗","color: #4caf50; font-weight: bold"),console.log("%c║  👶 Habits Child Card                                ║","color: #4caf50; font-weight: bold"),console.log("%c║  Version: 2025-11-07T19:30:00Z                ║","color: #4caf50; font-weight: bold"),console.log("%c║  API Version: 2025-11-07T19:30:00Z         ║","color: #4caf50; font-weight: bold"),console.log(`%c║  Child ID: ${t.child_id.padEnd(39," ")}║`,"color: #4caf50; font-weight: bold"),console.log("%c╚═══════════════════════════════════════════════════════╝","color: #4caf50; font-weight: bold")}getCardSize(){return 4}updated(t){super.updated(t),t.has("hass")&&this.hass&&this._config&&(this._api?this._api.updateHass(this.hass):(console.log("[Child Card] Initializing lightweight API for child:",this._config.child_id),this._api=new gt(this.hass,this._config.child_id),this._api.subscribeToUpdates(()=>{console.log("[Child Card] Received update, refreshing data"),this._loadData()}).then(t=>{this._unsubscribe=t}),this._loadData()))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe&&this._unsubscribe()}_loadData(){this._api&&(console.log("[Child Card] Loading child data from sensors..."),this._child=this._api.getChild(),this._tasks=this._api.getTasksWaitingValidation(),this._loading=!1,console.log("[Child Card] Data loaded:",{child:this._child?.name,tasks:this._tasks.length}))}render(){if(!this._config||!this.hass)return B``;if(this._loading||!this._api)return B`
        <ha-card>
          <div class="card">
            <div class="loading">Chargement...</div>
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
      `;const t=this._config.title||`Bonjour ${this._child.name}!`;return B`
      <ha-card>
        <div class="card">
          <!-- Header -->
          <div class="card-header">
            <h1 class="card-title">${t}</h1>
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
    `}_renderViewContent(){switch(this._viewMode){case"overview":return this._renderOverviewView();case"shop":return this._renderShopView();case"customizer":return this._renderCustomizerView();default:return B``}}_renderOverviewView(){const t=this._api?.getTaskCounts()||{pending:0,waiting:0},e=this._api?.getHabitStats()||{count:0,longest_streak:0};return B`
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
    `}_renderShopView(){return B`
      <div class="empty-state">
        <p>Boutique cosmétiques - En cours de développement</p>
      </div>
    `}_renderCustomizerView(){return B`
      <div class="empty-state">
        <p>Personnalisation avatar - En cours de développement</p>
      </div>
    `}async _handlePurchaseCosmetic(t){const{cosmeticId:e,childId:i}=t.detail;if(this._store)try{await this._store.purchaseCosmetic(e,i)}catch(t){console.error("Failed to purchase cosmetic:",t)}}async _handleAvatarUpdated(t){const{childId:e,avatar:i}=t.detail;if(this._store)try{await this._store.updateChild(e,{avatar:i})}catch(t){console.error("Failed to update avatar:",t)}}_renderStatsGrid(){return B`
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
        <h2 class="section-title">
          Mes Tâches
          ${t.pending>0?B`<span class="badge badge-primary">${t.pending} à faire</span>`:""}
          ${t.waiting>0?B`<span class="badge badge-warning">${t.waiting} en attente</span>`:""}
        </h2>

        ${0===t.pending&&0===t.waiting?B`
              <div class="empty-state">
                <div style="font-size: 48px;">✅</div>
                <p><strong>Aucune tâche en attente</strong></p>
                <p style="font-size: 12px; margin-top: 8px;">Bravo! Tu as tout terminé!</p>
              </div>
            `:B`
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${this._tasks.length>0?B`
                      <p style="font-size: 13px; color: var(--secondary-text-color); margin-bottom: 8px;">
                        <strong>En attente de validation (${this._tasks.length})</strong>
                      </p>
                      ${this._tasks.map(t=>B`
                          <hm-item-card .icon=${"⏳"} .iconColor=${"var(--warning-color, #ff9800)"}>
                            <div style="flex: 1;">
                              <h4 style="margin: 0; font-size: 15px;">${t.task_title}</h4>
                              <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--secondary-text-color);">
                                Complétée • En attente de validation par un parent
                              </p>
                              <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--success-color);">
                                +${t.rewards.points} pts, +${t.rewards.coins} 💰, +${t.rewards.experience} XP
                              </p>
                            </div>
                          </hm-item-card>
                        `)}
                    `:""}
                ${t.pending>0?B`
                      <hm-item-card>
                        <div>
                          <p><strong>✨ ${t.pending} tâche(s) à compléter</strong></p>
                          <p style="font-size: 12px; color: var(--secondary-text-color); margin-top: 8px;">
                            Complète tes tâches pour gagner des récompenses !
                          </p>
                        </div>
                      </hm-item-card>
                    `:""}
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
    `}};zt.styles=[ut,a`
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
    `],t([lt({attribute:!1})],zt.prototype,"hass",void 0),t([pt()],zt.prototype,"_config",void 0),t([pt()],zt.prototype,"_api",void 0),t([pt()],zt.prototype,"_child",void 0),t([pt()],zt.prototype,"_tasks",void 0),t([pt()],zt.prototype,"_unsubscribe",void 0),t([pt()],zt.prototype,"_viewMode",void 0),t([pt()],zt.prototype,"_loading",void 0),zt=t([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("habits-child-card")],zt),window.customCards=window.customCards||[],window.customCards.push({type:"habits-child-card",name:"Habits Child",description:"Carte pour enfants pour voir leurs tâches et progresser",preview:!0});export{zt as HabitsChildCard};
