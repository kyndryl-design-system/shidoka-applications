try{
(()=>{var _t=__STORYBOOK_TYPES__,{Addon_TypesEnum:se}=__STORYBOOK_TYPES__;var xt=__STORYBOOK_API__,{ActiveTabs:kt,Consumer:wt,ManagerContext:Pt,Provider:Ft,addons:D,combineParameters:At,controlOrMetaKey:Dt,controlOrMetaSymbol:It,eventMatchesShortcut:Nt,eventToShortcut:Ht,isMacLike:Bt,isShortcutTaken:Lt,keyToSymbol:jt,merge:Mt,mockChannel:ie,optionOrAltSymbol:Yt,shortcutMatchesShortcut:Gt,shortcutToHumanString:Ut,types:zt,useAddonState:$t,useArgTypes:Wt,useArgs:Kt,useChannel:qt,useGlobalTypes:Xt,useGlobals:Jt,useParameter:Qt,useSharedState:Zt,useStoryPrepared:Vt,useStorybookApi:er,useStorybookState:tr}=__STORYBOOK_API__;var dr=__STORYBOOK_CHANNELS__,{Channel:K,PostMessageTransport:pr,WebsocketTransport:fr,createBrowserChannel:cr}=__STORYBOOK_CHANNELS__;var S=(()=>{let e;return typeof window<"u"?e=window:typeof globalThis<"u"?e=globalThis:typeof window<"u"?e=window:typeof self<"u"?e=self:e={},e})();var _r=__STORYBOOK_CLIENT_LOGGER__,{deprecate:Or,logger:I,once:Tr,pretty:Rr}=__STORYBOOK_CLIENT_LOGGER__;var Pr=__STORYBOOK_CORE_EVENTS__,{CHANNEL_CREATED:Fr,CHANNEL_WS_DISCONNECT:Ar,CONFIG_ERROR:Dr,CURRENT_STORY_WAS_SET:Ir,DOCS_PREPARED:Nr,DOCS_RENDERED:Hr,FORCE_REMOUNT:Br,FORCE_RE_RENDER:ue,GLOBALS_UPDATED:Lr,NAVIGATE_URL:jr,PLAY_FUNCTION_THREW_EXCEPTION:Mr,PRELOAD_ENTRIES:Yr,PREVIEW_BUILDER_PROGRESS:Gr,PREVIEW_KEYDOWN:Ur,REGISTER_SUBSCRIPTION:zr,REQUEST_WHATS_NEW_DATA:$r,RESET_STORY_ARGS:le,RESULT_WHATS_NEW_DATA:Wr,SELECT_STORY:Kr,SET_CONFIG:qr,SET_CURRENT_STORY:Xr,SET_GLOBALS:Jr,SET_INDEX:Qr,SET_STORIES:Zr,SET_WHATS_NEW_CACHE:Vr,SHARED_STATE_CHANGED:en,SHARED_STATE_SET:tn,STORIES_COLLAPSE_ALL:rn,STORIES_EXPAND_ALL:nn,STORY_ARGS_UPDATED:an,STORY_CHANGED:on,STORY_ERRORED:sn,STORY_INDEX_INVALIDATED:un,STORY_MISSING:ln,STORY_PREPARED:dn,STORY_RENDERED:de,STORY_RENDER_PHASE_CHANGED:pn,STORY_SPECIFIED:fn,STORY_THREW_EXCEPTION:cn,STORY_UNCHANGED:hn,TELEMETRY_ERROR:mn,TOGGLE_WHATS_NEW_NOTIFICATIONS:gn,UNHANDLED_ERRORS_WHILE_PLAYING:bn,UPDATE_GLOBALS:pe,UPDATE_QUERY_PARAMS:yn,UPDATE_STORY_ARGS:fe}=__STORYBOOK_CORE_EVENTS__;function q(){let e={setHandler:()=>{},send:()=>{}};return new K({transport:e})}var X=class{constructor(){this.getChannel=()=>{if(!this.channel){let e=q();return this.setChannel(e),e}return this.channel},this.getServerChannel=()=>{if(!this.serverChannel)throw new Error("Accessing non-existent serverChannel");return this.serverChannel},this.ready=()=>this.promise,this.hasChannel=()=>!!this.channel,this.hasServerChannel=()=>!!this.serverChannel,this.setChannel=e=>{this.channel=e,this.resolve()},this.setServerChannel=e=>{this.serverChannel=e},this.promise=new Promise(e=>{this.resolve=()=>e(this.getChannel())})}},N="__STORYBOOK_ADDONS_PREVIEW";function ce(){return S[N]||(S[N]=new X),S[N]}var he=ce();function v(){return v=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},v.apply(this,arguments)}function we(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function E(e,t){return E=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,n){return r.__proto__=n,r},E(e,t)}function Pe(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,E(e,t)}function Y(e){return Y=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},Y(e)}function Fe(e){try{return Function.toString.call(e).indexOf("[native code]")!==-1}catch{return typeof e=="function"}}function Ae(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function R(e,t,r){return Ae()?R=Reflect.construct.bind():R=function(n,a,o){var s=[null];s.push.apply(s,a);var u=Function.bind.apply(n,s),l=new u;return o&&E(l,o.prototype),l},R.apply(null,arguments)}function G(e){var t=typeof Map=="function"?new Map:void 0;return G=function(r){if(r===null||!Fe(r))return r;if(typeof r!="function")throw new TypeError("Super expression must either be null or a function");if(typeof t<"u"){if(t.has(r))return t.get(r);t.set(r,n)}function n(){return R(r,arguments,Y(this).constructor)}return n.prototype=Object.create(r.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),E(n,r)},G(e)}var De={1:`Passed invalid arguments to hsl, please pass multiple numbers e.g. hsl(360, 0.75, 0.4) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75 }).

`,2:`Passed invalid arguments to hsla, please pass multiple numbers e.g. hsla(360, 0.75, 0.4, 0.7) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75, alpha: 0.7 }).

`,3:`Passed an incorrect argument to a color function, please pass a string representation of a color.

`,4:`Couldn't generate valid rgb string from %s, it returned %s.

`,5:`Couldn't parse the color string. Please provide the color as a string in hex, rgb, rgba, hsl or hsla notation.

`,6:`Passed invalid arguments to rgb, please pass multiple numbers e.g. rgb(255, 205, 100) or an object e.g. rgb({ red: 255, green: 205, blue: 100 }).

`,7:`Passed invalid arguments to rgba, please pass multiple numbers e.g. rgb(255, 205, 100, 0.75) or an object e.g. rgb({ red: 255, green: 205, blue: 100, alpha: 0.75 }).

`,8:`Passed invalid argument to toColorString, please pass a RgbColor, RgbaColor, HslColor or HslaColor object.

`,9:`Please provide a number of steps to the modularScale helper.

`,10:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,11:`Invalid value passed as base to modularScale, expected number or em string but got "%s"

`,12:`Expected a string ending in "px" or a number passed as the first argument to %s(), got "%s" instead.

`,13:`Expected a string ending in "px" or a number passed as the second argument to %s(), got "%s" instead.

`,14:`Passed invalid pixel value ("%s") to %s(), please pass a value like "12px" or 12.

`,15:`Passed invalid base value ("%s") to %s(), please pass a value like "12px" or 12.

`,16:`You must provide a template to this method.

`,17:`You passed an unsupported selector state to this method.

`,18:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,19:`fromSize and toSize must be provided as stringified numbers with the same units.

`,20:`expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,21:"expects the objects in the first argument array to have the properties `prop`, `fromSize`, and `toSize`.\n\n",22:"expects the first argument object to have the properties `prop`, `fromSize`, and `toSize`.\n\n",23:`fontFace expects a name of a font-family.

`,24:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,25:`fontFace expects localFonts to be an array.

`,26:`fontFace expects fileFormats to be an array.

`,27:`radialGradient requries at least 2 color-stops to properly render.

`,28:`Please supply a filename to retinaImage() as the first argument.

`,29:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,30:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",31:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation

`,32:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])
To pass a single animation please supply them in simple values, e.g. animation('rotate', '2s')

`,33:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation

`,34:`borderRadius expects a radius value as a string or number as the second argument.

`,35:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,36:`Property must be a string value.

`,37:`Syntax Error at %s.

`,38:`Formula contains a function that needs parentheses at %s.

`,39:`Formula is missing closing parenthesis at %s.

`,40:`Formula has too many closing parentheses at %s.

`,41:`All values in a formula must have the same unit or be unitless.

`,42:`Please provide a number of steps to the modularScale helper.

`,43:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,44:`Invalid value passed as base to modularScale, expected number or em/rem string but got %s.

`,45:`Passed invalid argument to hslToColorString, please pass a HslColor or HslaColor object.

`,46:`Passed invalid argument to rgbToColorString, please pass a RgbColor or RgbaColor object.

`,47:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,48:`fromSize and toSize must be provided as stringified numbers with the same units.

`,49:`Expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,50:`Expects the objects in the first argument array to have the properties prop, fromSize, and toSize.

`,51:`Expects the first argument object to have the properties prop, fromSize, and toSize.

`,52:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,53:`fontFace expects localFonts to be an array.

`,54:`fontFace expects fileFormats to be an array.

`,55:`fontFace expects a name of a font-family.

`,56:`linearGradient requries at least 2 color-stops to properly render.

`,57:`radialGradient requries at least 2 color-stops to properly render.

`,58:`Please supply a filename to retinaImage() as the first argument.

`,59:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,60:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",61:`Property must be a string value.

`,62:`borderRadius expects a radius value as a string or number as the second argument.

`,63:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,64:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation.

`,65:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])\\nTo pass a single animation please supply them in simple values, e.g. animation('rotate', '2s').

`,66:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation.

`,67:`You must provide a template to this method.

`,68:`You passed an unsupported selector state to this method.

`,69:`Expected a string ending in "px" or a number passed as the first argument to %s(), got %s instead.

`,70:`Expected a string ending in "px" or a number passed as the second argument to %s(), got %s instead.

`,71:`Passed invalid pixel value %s to %s(), please pass a value like "12px" or 12.

`,72:`Passed invalid base value %s to %s(), please pass a value like "12px" or 12.

`,73:`Please provide a valid CSS variable.

`,74:`CSS variable not found and no default was provided.

`,75:`important requires a valid style object, got a %s instead.

`,76:`fromSize and toSize must be provided as stringified numbers with the same units as minScreen and maxScreen.

`,77:`remToPx expects a value in "rem" but you provided it in "%s".

`,78:`base must be set in "px" or "%" but you set it in "%s".
`};function Ie(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],a=[],o;for(o=1;o<t.length;o+=1)a.push(t[o]);return a.forEach(function(s){n=n.replace(/%[a-z]/,s)}),n}var h=function(e){Pe(t,e);function t(r){for(var n,a=arguments.length,o=new Array(a>1?a-1:0),s=1;s<a;s++)o[s-1]=arguments[s];return n=e.call(this,Ie.apply(void 0,[De[r]].concat(o)))||this,we(n)}return t}(G(Error));function H(e){return Math.round(e*255)}function Ne(e,t,r){return H(e)+","+H(t)+","+H(r)}function _(e,t,r,n){if(n===void 0&&(n=Ne),t===0)return n(r,r,r);var a=(e%360+360)%360/60,o=(1-Math.abs(2*r-1))*t,s=o*(1-Math.abs(a%2-1)),u=0,l=0,c=0;a>=0&&a<1?(u=o,l=s):a>=1&&a<2?(u=s,l=o):a>=2&&a<3?(l=o,c=s):a>=3&&a<4?(l=s,c=o):a>=4&&a<5?(u=s,c=o):a>=5&&a<6&&(u=o,c=s);var b=r-o/2,y=u+b,m=l+b,A=c+b;return n(y,m,A)}var J={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"639",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"};function He(e){if(typeof e!="string")return e;var t=e.toLowerCase();return J[t]?"#"+J[t]:e}var Be=/^#[a-fA-F0-9]{6}$/,Le=/^#[a-fA-F0-9]{8}$/,je=/^#[a-fA-F0-9]{3}$/,Me=/^#[a-fA-F0-9]{4}$/,B=/^rgb\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*\)$/i,Ye=/^rgb(?:a)?\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i,Ge=/^hsl\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i,Ue=/^hsl(?:a)?\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;function w(e){if(typeof e!="string")throw new h(3);var t=He(e);if(t.match(Be))return{red:parseInt(""+t[1]+t[2],16),green:parseInt(""+t[3]+t[4],16),blue:parseInt(""+t[5]+t[6],16)};if(t.match(Le)){var r=parseFloat((parseInt(""+t[7]+t[8],16)/255).toFixed(2));return{red:parseInt(""+t[1]+t[2],16),green:parseInt(""+t[3]+t[4],16),blue:parseInt(""+t[5]+t[6],16),alpha:r}}if(t.match(je))return{red:parseInt(""+t[1]+t[1],16),green:parseInt(""+t[2]+t[2],16),blue:parseInt(""+t[3]+t[3],16)};if(t.match(Me)){var n=parseFloat((parseInt(""+t[4]+t[4],16)/255).toFixed(2));return{red:parseInt(""+t[1]+t[1],16),green:parseInt(""+t[2]+t[2],16),blue:parseInt(""+t[3]+t[3],16),alpha:n}}var a=B.exec(t);if(a)return{red:parseInt(""+a[1],10),green:parseInt(""+a[2],10),blue:parseInt(""+a[3],10)};var o=Ye.exec(t.substring(0,50));if(o)return{red:parseInt(""+o[1],10),green:parseInt(""+o[2],10),blue:parseInt(""+o[3],10),alpha:parseFloat(""+o[4])>1?parseFloat(""+o[4])/100:parseFloat(""+o[4])};var s=Ge.exec(t);if(s){var u=parseInt(""+s[1],10),l=parseInt(""+s[2],10)/100,c=parseInt(""+s[3],10)/100,b="rgb("+_(u,l,c)+")",y=B.exec(b);if(!y)throw new h(4,t,b);return{red:parseInt(""+y[1],10),green:parseInt(""+y[2],10),blue:parseInt(""+y[3],10)}}var m=Ue.exec(t.substring(0,50));if(m){var A=parseInt(""+m[1],10),ae=parseInt(""+m[2],10)/100,oe=parseInt(""+m[3],10)/100,W="rgb("+_(A,ae,oe)+")",T=B.exec(W);if(!T)throw new h(4,t,W);return{red:parseInt(""+T[1],10),green:parseInt(""+T[2],10),blue:parseInt(""+T[3],10),alpha:parseFloat(""+m[4])>1?parseFloat(""+m[4])/100:parseFloat(""+m[4])}}throw new h(5)}function ze(e){var t=e.red/255,r=e.green/255,n=e.blue/255,a=Math.max(t,r,n),o=Math.min(t,r,n),s=(a+o)/2;if(a===o)return e.alpha!==void 0?{hue:0,saturation:0,lightness:s,alpha:e.alpha}:{hue:0,saturation:0,lightness:s};var u,l=a-o,c=s>.5?l/(2-a-o):l/(a+o);switch(a){case t:u=(r-n)/l+(r<n?6:0);break;case r:u=(n-t)/l+2;break;default:u=(t-r)/l+4;break}return u*=60,e.alpha!==void 0?{hue:u,saturation:c,lightness:s,alpha:e.alpha}:{hue:u,saturation:c,lightness:s}}function V(e){return ze(w(e))}var $e=function(e){return e.length===7&&e[1]===e[2]&&e[3]===e[4]&&e[5]===e[6]?"#"+e[1]+e[3]+e[5]:e},U=$e;function g(e){var t=e.toString(16);return t.length===1?"0"+t:t}function L(e){return g(Math.round(e*255))}function We(e,t,r){return U("#"+L(e)+L(t)+L(r))}function x(e,t,r){return _(e,t,r,We)}function Ke(e,t,r){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number")return x(e,t,r);if(typeof e=="object"&&t===void 0&&r===void 0)return x(e.hue,e.saturation,e.lightness);throw new h(1)}function qe(e,t,r,n){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number"&&typeof n=="number")return n>=1?x(e,t,r):"rgba("+_(e,t,r)+","+n+")";if(typeof e=="object"&&t===void 0&&r===void 0&&n===void 0)return e.alpha>=1?x(e.hue,e.saturation,e.lightness):"rgba("+_(e.hue,e.saturation,e.lightness)+","+e.alpha+")";throw new h(2)}function z(e,t,r){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number")return U("#"+g(e)+g(t)+g(r));if(typeof e=="object"&&t===void 0&&r===void 0)return U("#"+g(e.red)+g(e.green)+g(e.blue));throw new h(6)}function O(e,t,r,n){if(typeof e=="string"&&typeof t=="number"){var a=w(e);return"rgba("+a.red+","+a.green+","+a.blue+","+t+")"}else{if(typeof e=="number"&&typeof t=="number"&&typeof r=="number"&&typeof n=="number")return n>=1?z(e,t,r):"rgba("+e+","+t+","+r+","+n+")";if(typeof e=="object"&&t===void 0&&r===void 0&&n===void 0)return e.alpha>=1?z(e.red,e.green,e.blue):"rgba("+e.red+","+e.green+","+e.blue+","+e.alpha+")"}throw new h(7)}var Xe=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},Je=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&typeof e.alpha=="number"},Qe=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},Ze=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&typeof e.alpha=="number"};function ee(e){if(typeof e!="object")throw new h(8);if(Je(e))return O(e);if(Xe(e))return z(e);if(Ze(e))return qe(e);if(Qe(e))return Ke(e);throw new h(8)}function te(e,t,r){return function(){var n=r.concat(Array.prototype.slice.call(arguments));return n.length>=t?e.apply(this,n):te(e,t,n)}}function P(e){return te(e,e.length,[])}function F(e,t,r){return Math.max(e,Math.min(t,r))}function Ve(e,t){if(t==="transparent")return t;var r=V(t);return ee(v({},r,{lightness:F(0,1,r.lightness-parseFloat(e))}))}var et=P(Ve),tt=et;function rt(e,t){if(t==="transparent")return t;var r=V(t);return ee(v({},r,{lightness:F(0,1,r.lightness+parseFloat(e))}))}var nt=P(rt),at=nt;function ot(e,t){if(t==="transparent")return t;var r=w(t),n=typeof r.alpha=="number"?r.alpha:1,a=v({},r,{alpha:F(0,1,(n*100+parseFloat(e)*100)/100)});return O(a)}var Kn=P(ot);function st(e,t){if(t==="transparent")return t;var r=w(t),n=typeof r.alpha=="number"?r.alpha:1,a=v({},r,{alpha:F(0,1,+(n*100-parseFloat(e)*100).toFixed(2)/100)});return O(a)}var it=P(st),ut=it,i={primary:"#FF4785",secondary:"#029CFD",tertiary:"#FAFBFC",ancillary:"#22a699",orange:"#FC521F",gold:"#FFAE00",green:"#66BF3C",seafoam:"#37D5D3",purple:"#6F2CAC",ultraviolet:"#2A0481",lightest:"#FFFFFF",lighter:"#F7FAFC",light:"#EEF3F6",mediumlight:"#ECF4F9",medium:"#D9E8F2",mediumdark:"#73828C",dark:"#5C6870",darker:"#454E54",darkest:"#2E3438",border:"hsla(203, 50%, 30%, 0.15)",positive:"#66BF3C",negative:"#FF4400",warning:"#E69D00",critical:"#FFFFFF",defaultText:"#2E3438",inverseText:"#FFFFFF",positiveText:"#448028",negativeText:"#D43900",warningText:"#A15C20"},Q={app:"#F6F9FC",bar:i.lightest,content:i.lightest,preview:i.lightest,gridCellSize:10,hoverable:ut(.9,i.secondary),positive:"#E1FFD4",negative:"#FEDED2",warning:"#FFF5CF",critical:"#FF4400"},k={fonts:{base:['"Nunito Sans"',"-apple-system",'".SFNSText-Regular"','"San Francisco"',"BlinkMacSystemFont",'"Segoe UI"','"Helvetica Neue"',"Helvetica","Arial","sans-serif"].join(", "),mono:["ui-monospace","Menlo","Monaco",'"Roboto Mono"','"Oxygen Mono"','"Ubuntu Monospace"','"Source Code Pro"','"Droid Sans Mono"','"Courier New"',"monospace"].join(", ")},weight:{regular:400,bold:700},size:{s1:12,s2:14,s3:16,m1:20,m2:24,m3:28,l1:32,l2:40,l3:48,code:90}},lt={base:"light",colorPrimary:"#FF4785",colorSecondary:"#029CFD",appBg:Q.app,appContentBg:i.lightest,appPreviewBg:i.lightest,appBorderColor:i.border,appBorderRadius:4,fontBase:k.fonts.base,fontCode:k.fonts.mono,textColor:i.darkest,textInverseColor:i.lightest,textMutedColor:i.dark,barTextColor:i.mediumdark,barHoverColor:i.secondary,barSelectedColor:i.secondary,barBg:i.lightest,buttonBg:Q.app,buttonBorder:i.medium,booleanBg:i.mediumlight,booleanSelectedBg:i.lightest,inputBg:i.lightest,inputBorder:i.border,inputTextColor:i.darkest,inputBorderRadius:4},Z=lt,dt={base:"dark",colorPrimary:"#FF4785",colorSecondary:"#029CFD",appBg:"#222425",appContentBg:"#1B1C1D",appPreviewBg:i.lightest,appBorderColor:"rgba(255,255,255,.1)",appBorderRadius:4,fontBase:k.fonts.base,fontCode:k.fonts.mono,textColor:"#C9CDCF",textInverseColor:"#222425",textMutedColor:"#798186",barTextColor:i.mediumdark,barHoverColor:i.secondary,barSelectedColor:i.secondary,barBg:"#292C2E",buttonBg:"#222425",buttonBorder:"rgba(255,255,255,.1)",booleanBg:"#222425",booleanSelectedBg:"#2E3438",inputBg:"#1B1C1D",inputBorder:"rgba(255,255,255,.1)",inputTextColor:i.lightest,inputBorderRadius:4},pt=dt,{window:j}=S;var ft=e=>typeof e!="string"?(I.warn(`Color passed to theme object should be a string. Instead ${e}(${typeof e}) was passed.`),!1):!0,ct=e=>!/(gradient|var|calc)/.test(e),ht=(e,t)=>e==="darken"?O(`${tt(1,t)}`,.95):e==="lighten"?O(`${at(1,t)}`,.95):t,re=e=>t=>{if(!ft(t)||!ct(t))return t;try{return ht(e,t)}catch{return t}},qn=re("lighten"),Xn=re("darken"),mt=()=>!j||!j.matchMedia?"light":j.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",C={light:Z,dark:pt,normal:Z},M=mt(),$=(e={base:M},t)=>{let r={...C[M],...C[e.base]||{},...e,base:C[e.base]?e.base:M};return{...t,...r,barSelectedColor:e.barSelectedColor||r.colorSecondary}};var ne=$({base:"dark",brandTitle:"Shidoka",brandImage:"ShidokaLogo.png"});D.setConfig({theme:ne});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
