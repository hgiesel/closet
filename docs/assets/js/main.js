!function(){"use strict";
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */function t(t,e){var r,n,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;s;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,n=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!(i=s.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){s=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){s.label=o[1];break}if(6===o[0]&&s.label<i[1]){s.label=i[1],i=o;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(o);break}i[2]&&s.ops.pop(),s.trys.pop();continue}o=e.call(t,s)}catch(t){o=[6,t],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}}function e(t){var e="function"==typeof Symbol&&Symbol.iterator,r=e&&t[e],n=0;if(r)return r.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function r(t,e){var r="function"==typeof Symbol&&t[Symbol.iterator];if(!r)return t;var n,i,o=r.call(t),s=[];try{for(;(void 0===e||e-- >0)&&!(n=o.next()).done;)s.push(n.value)}catch(t){i={error:t}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return s}function n(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(r(arguments[e]));return t}var i=function(t,e,r,n){var i=r<0?Math.min(0,t.length+r):r;return t.slice(0,i)+e+t.slice(n)},o=function(t,e,r){return t.length-(r-e)},s=function(){function t(t){this.rootTag=t,this.zoom=[]}return t.prototype.traverse=function(t){var r,n;void 0===t&&(t=this.zoom);var i=this.rootTag;try{for(var o=e(t),s=o.next();!s.done;s=o.next()){var a=s.value;if(!i.innerTags[a])return null;i=i.innerTags[a]}}catch(t){r={error:t}}finally{try{s&&!s.done&&(n=o.return)&&n.call(o)}finally{if(r)throw r.error}}return i},t.prototype.exists=function(t){return void 0===t&&(t=this.zoom),!!this.traverse(t)},t.prototype.getTagInfo=function(t){return void 0===t&&(t=this.zoom),this.traverse(t)},t.prototype.getTag=function(t){void 0===t&&(t=this.zoom);var e=this.traverse(t);return e?e.data:null},t.prototype.getOffsets=function(t){void 0===t&&(t=this.zoom);var e=this.traverse(t);return e?[0,e.start]:null},t.prototype.setZoom=function(t){this.zoom=t},t}(),a="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function u(t,e){return t(e={exports:{}},e.exports),e.exports}var l=u((function(t){var e,r;e=a,r=function(){function t(e,r,n){return this.id=++t.highestId,this.name=e,this.symbols=r,this.postprocess=n,this}function e(t,e,r,n){this.rule=t,this.dot=e,this.reference=r,this.data=[],this.wantedBy=n,this.isComplete=this.dot===t.symbols.length}function r(t,e){this.grammar=t,this.index=e,this.states=[],this.wants={},this.scannable=[],this.completed={}}function n(t,e){this.rules=t,this.start=e||this.rules[0].name;var r=this.byName={};this.rules.forEach((function(t){r.hasOwnProperty(t.name)||(r[t.name]=[]),r[t.name].push(t)}))}function i(){this.reset("")}function o(t,e,o){if(t instanceof n){var s=t;o=e}else s=n.fromCompiled(t,e);for(var a in this.grammar=s,this.options={keepHistory:!1,lexer:s.lexer||new i},o||{})this.options[a]=o[a];this.lexer=this.options.lexer,this.lexerState=void 0;var u=new r(s,0);this.table=[u],u.wants[s.start]=[],u.predict(s.start),u.process(),this.current=0}return t.highestId=0,t.prototype.toString=function(t){function e(t){return t.literal?JSON.stringify(t.literal):t.type?"%"+t.type:t.toString()}var r=void 0===t?this.symbols.map(e).join(" "):this.symbols.slice(0,t).map(e).join(" ")+" ● "+this.symbols.slice(t).map(e).join(" ");return this.name+" → "+r},e.prototype.toString=function(){return"{"+this.rule.toString(this.dot)+"}, from: "+(this.reference||0)},e.prototype.nextState=function(t){var r=new e(this.rule,this.dot+1,this.reference,this.wantedBy);return r.left=this,r.right=t,r.isComplete&&(r.data=r.build(),r.right=void 0),r},e.prototype.build=function(){var t=[],e=this;do{t.push(e.right.data),e=e.left}while(e.left);return t.reverse(),t},e.prototype.finish=function(){this.rule.postprocess&&(this.data=this.rule.postprocess(this.data,this.reference,o.fail))},r.prototype.process=function(t){for(var e=this.states,r=this.wants,n=this.completed,i=0;i<e.length;i++){var s=e[i];if(s.isComplete){if(s.finish(),s.data!==o.fail){for(var a=s.wantedBy,u=a.length;u--;){var l=a[u];this.complete(l,s)}if(s.reference===this.index){var f=s.rule.name;(this.completed[f]=this.completed[f]||[]).push(s)}}}else{if("string"!=typeof(f=s.rule.symbols[s.dot])){this.scannable.push(s);continue}if(r[f]){if(r[f].push(s),n.hasOwnProperty(f)){var h=n[f];for(u=0;u<h.length;u++){var c=h[u];this.complete(s,c)}}}else r[f]=[s],this.predict(f)}}},r.prototype.predict=function(t){for(var r=this.grammar.byName[t]||[],n=0;n<r.length;n++){var i=r[n],o=this.wants[t],s=new e(i,0,this.index,o);this.states.push(s)}},r.prototype.complete=function(t,e){var r=t.nextState(e);this.states.push(r)},n.fromCompiled=function(e,r){var i=e.Lexer;e.ParserStart&&(r=e.ParserStart,e=e.ParserRules);var o=new n(e=e.map((function(e){return new t(e.name,e.symbols,e.postprocess)})),r);return o.lexer=i,o},i.prototype.reset=function(t,e){this.buffer=t,this.index=0,this.line=e?e.line:1,this.lastLineBreak=e?-e.col:0},i.prototype.next=function(){if(this.index<this.buffer.length){var t=this.buffer[this.index++];return"\n"===t&&(this.line+=1,this.lastLineBreak=this.index),{value:t}}},i.prototype.save=function(){return{line:this.line,col:this.index-this.lastLineBreak}},i.prototype.formatError=function(t,e){var r=this.buffer;if("string"==typeof r){var n=r.indexOf("\n",this.index);-1===n&&(n=r.length);var i=r.substring(this.lastLineBreak,n),o=this.index-this.lastLineBreak;return e+=" at line "+this.line+" col "+o+":\n\n",e+="  "+i+"\n",e+="  "+Array(o).join(" ")+"^"}return e+" at index "+(this.index-1)},o.fail={},o.prototype.feed=function(t){var e,n=this.lexer;for(n.reset(t,this.lexerState);e=n.next();){var o=this.table[this.current];this.options.keepHistory||delete this.table[this.current-1];var s=this.current+1,a=new r(this.grammar,s);this.table.push(a);for(var u=void 0!==e.text?e.text:e.value,l=n.constructor===i?e.value:e,f=o.scannable,h=f.length;h--;){var c=f[h],p=c.rule.symbols[c.dot];if(p.test?p.test(l):p.type?p.type===e.type:p.literal===u){var y=c.nextState({data:l,token:e,isToken:!0,reference:s-1});a.states.push(y)}}if(a.process(),0===a.states.length){var d=new Error(this.reportError(e));throw d.offset=this.current,d.token=e,d}this.options.keepHistory&&(o.lexerState=n.save()),this.current++}return o&&(this.lexerState=n.save()),this.results=this.finish(),this},o.prototype.reportError=function(t){var e=[],r=(t.type?t.type+" token: ":"")+JSON.stringify(void 0!==t.value?t.value:t);e.push(this.lexer.formatError(t,"Syntax error")),e.push("Unexpected "+r+". Instead, I was expecting to see one of the following:\n");var n=this.table.length-2;return this.table[n].states.filter((function(t){var e=t.rule.symbols[t.dot];return e&&"string"!=typeof e})).map((function(t){return this.buildFirstStateStack(t,[])||[t]}),this).forEach((function(t){var r=t[0],n=r.rule.symbols[r.dot],i=this.getSymbolDisplay(n);e.push("A "+i+" based on:"),this.displayStateStack(t,e)}),this),e.push(""),e.join("\n")},o.prototype.displayStateStack=function(t,e){for(var r,n=0,i=0;i<t.length;i++){var o=t[i],s=o.rule.toString(o.dot);s===r?n++:(n>0&&e.push("    ⬆ ︎"+n+" more lines identical to this"),n=0,e.push("    "+s)),r=s}},o.prototype.getSymbolDisplay=function(t){var e=typeof t;if("string"===e)return t;if("object"===e&&t.literal)return JSON.stringify(t.literal);if("object"===e&&t instanceof RegExp)return"character matching "+t;if("object"===e&&t.type)return t.type+" token";throw new Error("Unknown symbol type: "+t)},o.prototype.buildFirstStateStack=function(t,e){if(-1!==e.indexOf(t))return null;if(0===t.wantedBy.length)return[t];var r=t.wantedBy[0],n=[t].concat(e),i=this.buildFirstStateStack(r,n);return null===i?null:[t].concat(i)},o.prototype.save=function(){var t=this.table[this.current];return t.lexerState=this.lexerState,t},o.prototype.restore=function(t){var e=t.index;this.current=e,this.table[e]=t,this.table.splice(e+1),this.lexerState=t.lexerState,this.results=this.finish()},o.prototype.rewind=function(t){if(!this.options.keepHistory)throw new Error("set option `keepHistory` to enable rewinding");this.restore(this.table[t])},o.prototype.finish=function(){var t=[],e=this.grammar.start;return this.table[this.table.length-1].states.forEach((function(r){r.rule.name===e&&r.dot===r.rule.symbols.length&&0===r.reference&&r.data!==o.fail&&t.push(r)})),t.map((function(t){return t.data}))},{Parser:o,Grammar:n,Rule:t}},t.exports?t.exports=r():e.nearley=r()})),f=u((function(t){var e,r;e=a,r=function(){var t=Object.prototype.hasOwnProperty,e=Object.prototype.toString,r="boolean"==typeof(new RegExp).sticky;function n(t){return t&&"[object RegExp]"===e.call(t)}function i(t){return t&&"object"==typeof t&&!n(t)&&!Array.isArray(t)}function o(t){return"("+t+")"}function s(t){return t.length?"(?:"+t.map((function(t){return"(?:"+t+")"})).join("|")+")":"(?!)"}function a(t){if("string"==typeof t)return"(?:"+t.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")+")";if(n(t)){if(t.ignoreCase)throw new Error("RegExp /i flag not allowed");if(t.global)throw new Error("RegExp /g flag is implied");if(t.sticky)throw new Error("RegExp /y flag is implied");if(t.multiline)throw new Error("RegExp /m flag is implied");return t.source}throw new Error("Not a pattern: "+t)}function u(e,r){if(i(r)||(r={match:r}),r.include)throw new Error("Matching rules cannot also include states");var o={defaultType:e,lineBreaks:!!r.error||!!r.fallback,pop:!1,next:null,push:null,error:!1,fallback:!1,value:null,type:null,shouldThrow:!1};for(var s in r)t.call(r,s)&&(o[s]=r[s]);if("string"==typeof o.type&&e!==o.type)throw new Error("Type transform cannot be a string (type '"+o.type+"' for token '"+e+"')");var a=o.match;return o.match=Array.isArray(a)?a:a?[a]:[],o.match.sort((function(t,e){return n(t)&&n(e)?0:n(e)?-1:n(t)?1:e.length-t.length})),o}function l(t){return Array.isArray(t)?function(t){for(var e=[],r=0;r<t.length;r++){var n=t[r];if(n.include)for(var i=[].concat(n.include),o=0;o<i.length;o++)e.push({include:i[o]});else{if(!n.type)throw new Error("Rule has no type: "+JSON.stringify(n));e.push(u(n.type,n))}}return e}(t):function(t){for(var e=Object.getOwnPropertyNames(t),r=[],n=0;n<e.length;n++){var o=e[n],s=t[o],a=[].concat(s);if("include"!==o){var l=[];a.forEach((function(t){i(t)?(l.length&&r.push(u(o,l)),r.push(u(o,t)),l=[]):l.push(t)})),l.length&&r.push(u(o,l))}else for(var f=0;f<a.length;f++)r.push({include:a[f]})}return r}(t)}var f=u("error",{lineBreaks:!0,shouldThrow:!0});function h(t,e){for(var i=null,u=Object.create(null),l=!0,h=null,c=[],p=[],y=0;y<t.length;y++)t[y].fallback&&(l=!1);for(y=0;y<t.length;y++){var d=t[y];if(d.include)throw new Error("Inheritance is not allowed in stateless lexers");if(d.error||d.fallback){if(i)throw!d.fallback==!i.fallback?new Error("Multiple "+(d.fallback?"fallback":"error")+" rules not allowed (for token '"+d.defaultType+"')"):new Error("fallback and error are mutually exclusive (for token '"+d.defaultType+"')");i=d}var g=d.match.slice();if(l)for(;g.length&&"string"==typeof g[0]&&1===g[0].length;)u[g.shift().charCodeAt(0)]=d;if(d.pop||d.push||d.next){if(!e)throw new Error("State-switching options are not allowed in stateless lexers (for token '"+d.defaultType+"')");if(d.fallback)throw new Error("State-switching options are not allowed on fallback tokens (for token '"+d.defaultType+"')")}if(0!==g.length){l=!1,c.push(d);for(var v=0;v<g.length;v++){var m=g[v];if(n(m))if(null===h)h=m.unicode;else if(h!==m.unicode&&!1===d.fallback)throw new Error("If one rule is /u then all must be")}var b=s(g.map(a)),w=new RegExp(b);if(w.test(""))throw new Error("RegExp matches empty string: "+w);if(new RegExp("|"+b).exec("").length-1>0)throw new Error("RegExp has capture groups: "+w+"\nUse (?: … ) instead");if(!d.lineBreaks&&w.test("\n"))throw new Error("Rule should declare lineBreaks: "+w);p.push(o(b))}}var x=i&&i.fallback,k=r&&!x?"ym":"gm",$=r||x?"":"|";return!0===h&&(k+="u"),{regexp:new RegExp(s(p)+$,k),groups:c,fast:u,error:i||f}}function c(t,e,r){var n=t&&(t.push||t.next);if(n&&!r[n])throw new Error("Missing state '"+n+"' (in token '"+t.defaultType+"' of state '"+e+"')");if(t&&t.pop&&1!=+t.pop)throw new Error("pop must be 1 (in token '"+t.defaultType+"' of state '"+e+"')")}var p=function(t,e){this.startState=e,this.states=t,this.buffer="",this.stack=[],this.reset()};p.prototype.reset=function(t,e){return this.buffer=t||"",this.index=0,this.line=e?e.line:1,this.col=e?e.col:1,this.queuedToken=e?e.queuedToken:null,this.queuedThrow=e?e.queuedThrow:null,this.setState(e?e.state:this.startState),this.stack=e&&e.stack?e.stack.slice():[],this},p.prototype.save=function(){return{line:this.line,col:this.col,state:this.state,stack:this.stack.slice(),queuedToken:this.queuedToken,queuedThrow:this.queuedThrow}},p.prototype.setState=function(t){if(t&&this.state!==t){this.state=t;var e=this.states[t];this.groups=e.groups,this.error=e.error,this.re=e.regexp,this.fast=e.fast}},p.prototype.popState=function(){this.setState(this.stack.pop())},p.prototype.pushState=function(t){this.stack.push(this.state),this.setState(t)};var y=r?function(t,e){return t.exec(e)}:function(t,e){var r=t.exec(e);return 0===r[0].length?null:r};function d(){return this.value}if(p.prototype._getGroup=function(t){for(var e=this.groups.length,r=0;r<e;r++)if(void 0!==t[r+1])return this.groups[r];throw new Error("Cannot find token type for matched text")},p.prototype.next=function(){var t=this.index;if(this.queuedGroup){var e=this._token(this.queuedGroup,this.queuedText,t);return this.queuedGroup=null,this.queuedText="",e}var r=this.buffer;if(t!==r.length){if(s=this.fast[r.charCodeAt(t)])return this._token(s,r.charAt(t),t);var n=this.re;n.lastIndex=t;var i=y(n,r),o=this.error;if(null==i)return this._token(o,r.slice(t,r.length),t);var s=this._getGroup(i),a=i[0];return o.fallback&&i.index!==t?(this.queuedGroup=s,this.queuedText=a,this._token(o,r.slice(t,i.index),t)):this._token(s,a,t)}},p.prototype._token=function(t,e,r){var n=0;if(t.lineBreaks){var i=/\n/g,o=1;if("\n"===e)n=1;else for(;i.exec(e);)n++,o=i.lastIndex}var s={type:"function"==typeof t.type&&t.type(e)||t.defaultType,value:"function"==typeof t.value?t.value(e):e,text:e,toString:d,offset:r,lineBreaks:n,line:this.line,col:this.col},a=e.length;if(this.index+=a,this.line+=n,0!==n?this.col=a-o+1:this.col+=a,t.shouldThrow)throw new Error(this.formatError(s,"invalid syntax"));return t.pop?this.popState():t.push?this.pushState(t.push):t.next&&this.setState(t.next),s},"undefined"!=typeof Symbol&&Symbol.iterator){var g=function(t){this.lexer=t};g.prototype.next=function(){var t=this.lexer.next();return{value:t,done:!t}},g.prototype[Symbol.iterator]=function(){return this},p.prototype[Symbol.iterator]=function(){return new g(this)}}return p.prototype.formatError=function(t,e){if(null==t){var r=this.buffer.slice(this.index);t={text:r,offset:this.index,lineBreaks:-1===r.indexOf("\n")?0:1,line:this.line,col:this.col}}var n=Math.max(0,t.offset-t.col+1),i=t.lineBreaks?t.text.indexOf("\n"):t.text.length,o=this.buffer.substring(n,t.offset+i);return e+=" at line "+t.line+" col "+t.col+":\n\n",e+="  "+o+"\n",e+="  "+Array(t.col).join(" ")+"^"},p.prototype.clone=function(){return new p(this.states,this.state)},p.prototype.has=function(t){return!0},{compile:function(t){var e=h(l(t));return new p({start:e},"start")},states:function(t,e){var r=t.$all?l(t.$all):[];delete t.$all;var n=Object.getOwnPropertyNames(t);e||(e=n[0]);for(var i=Object.create(null),o=0;o<n.length;o++)i[b=n[o]]=l(t[b]).concat(r);for(o=0;o<n.length;o++)for(var s=i[b=n[o]],a=Object.create(null),u=0;u<s.length;u++){var f=s[u];if(f.include){var y=[u,1];if(f.include!==b&&!a[f.include]){a[f.include]=!0;var d=i[f.include];if(!d)throw new Error("Cannot include nonexistent state '"+f.include+"' (in state '"+b+"')");for(var g=0;g<d.length;g++){var v=d[g];-1===s.indexOf(v)&&y.push(v)}}s.splice.apply(s,y),u--}}var m=Object.create(null);for(o=0;o<n.length;o++){var b;m[b=n[o]]=h(i[b],!0)}for(o=0;o<n.length;o++){var w=n[o],x=m[w],k=x.groups;for(u=0;u<k.length;u++)c(k[u],w,m);var $=Object.getOwnPropertyNames(x.fast);for(u=0;u<$.length;u++)c(x.fast[$[u]],w,m)}return new p(m,e)},error:Object.freeze({error:!0}),fallback:Object.freeze({fallback:!0}),keywords:function(t){for(var e=Object.create(null),r=Object.create(null),n=Object.getOwnPropertyNames(t),i=0;i<n.length;i++){var o=n[i],s=t[o];(Array.isArray(s)?s:[s]).forEach((function(t){if((r[t.length]=r[t.length]||[]).push(t),"string"!=typeof t)throw new Error("keyword must be string (in keyword '"+o+"')");e[t]=o}))}function a(t){return JSON.stringify(t)}var u="";for(var l in u+="switch (value.length) {\n",r){var f=r[l];u+="case "+l+":\n",u+="switch (value) {\n",f.forEach((function(t){var r=e[t];u+="case "+a(t)+": return "+a(r)+"\n"})),u+="}\n"}return u+="}\n",Function("value",u)}}},t.exports?t.exports=r():e.moo=r()})).states({main:{tagstart:{match:"[[",push:"key"},EOF:{match:/\$$/u},text:{match:/[\s\S]+?(?=\[\[|\$$)/u,lineBreaks:!0}},key:{keyname:{match:/[a-zA-Z]+\d*/u},sep:{match:"::",next:"intag"},tagend:{match:"]]",pop:1}},intag:{tagstart:{match:"[[",push:"key"},tagend:{match:"]]",pop:1},valuestext:{match:/[\s\S]+?(?=\[\[|\]\])/u,lineBreaks:!0}}}),h=function(){function t(t,e,r,n,i,o,s){this.fullKey=t,this.key=e,this.num=r,this.valuesRaw=n,this.values=function(t){return null===t?[]:t.split("::").map((function(t){return t.split("||")}))}(n),this.fullOccur=i,this.occur=o,this.path=s}return t.prototype.shadowValuesRaw=function(e){return new t(this.fullKey,this.key,this.num,e,this.fullOccur,this.occur,this.path)},t.prototype.makeMemoizerKey=function(){return this.key+":"+this.num+":"+this.valuesRaw},t.prototype.getDefaultRepresentation=function(){return null===this.valuesRaw?"[["+this.fullKey+"]]":"[["+this.fullKey+"::"+this.valuesRaw+"]]"},t.prototype.getRawRepresentation=function(){var t;return null!==(t=this.valuesRaw)&&void 0!==t?t:""},t.prototype.getFilterKey=function(){return this.key},t}(),c=function(){function t(t){this.start=t,this._ready=!1,this.innerTags=[]}return t.prototype.close=function(t,e,r){this._end=t,this._data=e,this._naked=r},Object.defineProperty(t.prototype,"end",{get:function(){return this._end},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"data",{get:function(){return this._data},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"naked",{get:function(){return this._naked},enumerable:!0,configurable:!0}),t.prototype.isReady=function(){return this._ready},t.prototype.isReadyRecursive=function(){return this._ready&&this.innerTags.map((function(t){return t.isReadyRecursive()}))},t.prototype.setReady=function(t){this._ready=t},t.prototype.addInnerTag=function(t){this.innerTags.push(t)},t}(),p=/^([^0-9]+)([0-9]*)$/u,y=function(){function t(){this.tagCounter=new Map}return t.prototype.getAndInc=function(t){var e=this.tagCounter.has(t)?this.tagCounter.get(t)+1:0;return this.tagCounter.set(t,e),e},t.prototype.makeTag=function(t,e,r){var n=t.match(p),i=n[1],o=0===n[2].length?null:Number(n[2]),s=this.getAndInc(t),a=t===i?s:this.getAndInc(i);return new h(t,i,o,e,s,a,r)},t}(),d=function(){var r,i,o,s,a,u,l,f,h,p,d,g;return t(this,(function(t){switch(t.label){case 0:r=new y,i=new c(0),o=function(t){var r,n,o=i;try{for(var s=e(t),a=s.next();!a.done;a=s.next()){var u=a.value;o=o.innerTags[u]}}catch(t){r={error:t}}finally{try{a&&!a.done&&(n=s.return)&&n.call(s)}finally{if(r)throw r.error}}return o},s=[],a=0,t.label=1;case 1:return[4,s];case 2:if((u=t.sent())[0]>=0)l=u[0],o(s).addInnerTag(new c(l)),s.push(a),a=0;else{if(f=Math.abs(u[0]),h=u[1],p=null!==(g=u[2])&&void 0!==g?g:null,d=u[3],o(s).close(f,r.makeTag(h,p,n(s)),d),0===s.length)return[2,i];a=s.pop()+1}return[3,1];case 3:return[2]}}))};function g(t){return t[0]}var v=new(function(){function t(){this.tk=d(),this.tk.next()}return t.prototype.startToken=function(t){return this.tk.next([t])},t.prototype.endToken=function(t,e,r,n){return void 0===n&&(n=!1),this.tk.next([-t,e,r,n])},t.prototype.restart=function(){this.tk=d(),this.tk.next()},t}()),m={Lexer:f,ParserRules:[{name:"start",symbols:["content",f.has("EOF")?{type:"EOF"}:EOF],postprocess:function(){return v}},{name:"content$ebnf$1",symbols:[]},{name:"content$ebnf$1$subexpression$1",symbols:["tag","_"]},{name:"content$ebnf$1",symbols:["content$ebnf$1","content$ebnf$1$subexpression$1"],postprocess:function(t){return t[0].concat([t[1]])}},{name:"content",symbols:["_","content$ebnf$1"]},{name:"tag",symbols:["tagstart","inner",f.has("tagend")?{type:"tagend"}:tagend],postprocess:function(t){var e=r(t,3),n=r(e[1],2),i=n[0],o=n[1],s=e[2];return[["[[",i+"::"+o,"]]"],v.endToken(s.offset+"]]".length,i,o)]}},{name:"tagstart",symbols:[f.has("tagstart")?{type:"tagstart"}:tagstart],postprocess:function(t){var e=r(t,1)[0];return[e.value,v.startToken(e.offset+e.value.length-"[[".length)]}},{name:"inner$ebnf$1$subexpression$1$ebnf$1",symbols:[]},{name:"inner$ebnf$1$subexpression$1$ebnf$1$subexpression$1",symbols:["tag","_values"]},{name:"inner$ebnf$1$subexpression$1$ebnf$1",symbols:["inner$ebnf$1$subexpression$1$ebnf$1","inner$ebnf$1$subexpression$1$ebnf$1$subexpression$1"],postprocess:function(t){return t[0].concat([t[1]])}},{name:"inner$ebnf$1$subexpression$1",symbols:[f.has("sep")?{type:"sep"}:sep,"_values","inner$ebnf$1$subexpression$1$ebnf$1"]},{name:"inner$ebnf$1",symbols:["inner$ebnf$1$subexpression$1"],postprocess:g},{name:"inner$ebnf$1",symbols:[],postprocess:function(){return null}},{name:"inner",symbols:[f.has("keyname")?{type:"keyname"}:keyname,"inner$ebnf$1"],postprocess:function(t){var e=r(t,2),n=e[0],i=e[1];return i?[n.value,i[1]+i[2].map((function(t){var e=r(t,2),n=e[0],i=e[1];return g(n).join("")+i}))]:[n.value]}},{name:"_values$ebnf$1",symbols:[]},{name:"_values$ebnf$1",symbols:["_values$ebnf$1",f.has("valuestext")?{type:"valuestext"}:valuestext],postprocess:function(t){return t[0].concat([t[1]])}},{name:"_values",symbols:["_values$ebnf$1"],postprocess:function(t){return r(t,1)[0].map((function(t){return t.value})).join("")}},{name:"_$ebnf$1",symbols:[]},{name:"_$ebnf$1",symbols:["_$ebnf$1",f.has("text")?{type:"text"}:text],postprocess:function(t){return t[0].concat([t[1]])}},{name:"_",symbols:["_$ebnf$1"],postprocess:function(){return null}}],ParserStart:"start"},b=function(t){var e=new l.Parser(l.Grammar.fromCompiled(m)).feed(t+"$").results;e.length>1||e.length;var r=e[0].endToken(t.length,"base",t,!0).value;return e[0].restart(),r},w=function(t,e,n){var s=function(t,e){var a=r(t,3),u=a[0],l=a[1],f=a[2];l.push(l[l.length-1]);var h=r(e.innerTags.reduce(s,[u,l,!0]),3),c=h[0],p=h[1],y=h[2];p.push(p.pop()-p[p.length-1]);var d=p.pop(),g=p.pop(),v=r(function(t,e,r,n){return[t+r,e+r+n]}(e.start,e.end,g,d),2),m=v[0],b=v[1],w=c.slice(m+(e.naked?0:"[[".length+e.data.fullKey.length+"::".length),b-(e.naked?0:"]]".length)),x=e.data.shadowValuesRaw(w),k=n(x,{ready:y}),$=r(k.ready?function(t,e,r,n){return[i(t,e,r,n),o(e,r,n)]}(c,k.result,m,b):[c,0],2),E=$[0],S=d+g+$[1];return p.push(S),[E,p,f&&k.ready]};return s([t,[0,0],!0],e)},x=new Map,k={hasItem:function(t){return x.has(t.makeMemoizerKey())},getItem:function(t){return x.get(t.makeMemoizerKey())},setItem:function(t,e){return x.set(t.makeMemoizerKey(),e)},removeItem:function(t){return x.delete(t.makeMemoizerKey())},clear:function(){return x.clear()}},$=function(){function t(){this.store=new Map}return t.prototype.set=function(t,e){this.store.set(t,e)},t.prototype.has=function(t){return this.store.has(t)},t.prototype.get=function(t,e){return void 0===e&&(e=null),this.has(t)?this.store.get(t):e},t.prototype.fold=function(t,e,r){this.set(t,e(this.get(t,r)))},t.prototype.over=function(t,e,r){this.has(t)?e(this.get(t,r)):(e(r),this.set(t,r))},t.prototype.delete=function(t){this.store.delete(t)},t.prototype.clear=function(){this.store.clear()},t}(),E=function(t){return{result:t,memoize:!1}},S=function(t){return function(e,r){var n,i=t(e,r);switch(typeof i){case"string":return E(i);case"object":return{result:i.result,memoize:null!==(n=i.memoize)&&void 0!==n&&n};default:return{result:null,memoize:!1}}}},T=function(t,e){return e.ready?E(t.getRawRepresentation()):void 0},_=function(t){return E(t.getRawRepresentation())},O=function(t){return E(t.getDefaultRepresentation())},R=function(){function t(){this.filters=new Map}return t.prototype.register=function(t,e){this.filters.set(t,e)},t.prototype.has=function(t){return"raw"===t||"base"===t||this.filters.has(t)},t.prototype.get=function(t){return"base"===t?T:"raw"===t?_:this.filters.has(t)?S(this.filters.get(t)):null},t.prototype.getOrDefault=function(t){var e=this.get(t);return e||O},t.prototype.unregisterFilter=function(t){this.filters.delete(t)},t.prototype.clearFilters=function(){this.filters.clear()},t.prototype.execute=function(t,e){return S(this.getOrDefault(t.getFilterKey()))(t,e)},t}(),j=function(t){return(t+1>>>1)-1},z=function(t){return 1+(t<<1)},I=function(t){return t+1<<1},A=function(){function t(t){void 0===t&&(t=function(t,e){return t>e}),this._heap=[],this._comparator=t}return t.prototype.greater=function(t,e){return this._comparator(this._heap[t],this._heap[e])},t.prototype.swap=function(t,e){var n;n=r([this._heap[e],this._heap[t]],2),this._heap[t]=n[0],this._heap[e]=n[1]},t.prototype.siftUp=function(){for(var t=this.size()-1;t>0&&this.greater(t,j(t));)this.swap(t,j(t)),t=j(t)},t.prototype.siftDown=function(){for(var t=0;z(t)<this.size()&&this.greater(z(t),t)||I(t)<this.size()&&this.greater(I(t),t);){var e=I(t)<this.size()&&this.greater(I(t),z(t))?I(t):z(t);this.swap(t,e),t=e}},t.prototype.size=function(){return this._heap.length},t.prototype.isEmpty=function(){return 0===this.size()},t.prototype.peek=function(){return this._heap[0]},t.prototype.push=function(){for(var t=this,e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return e.forEach((function(e){t._heap.push(e),t.siftUp()})),this.size()},t.prototype.pop=function(){var t=this.peek(),e=this.size()-1;return e>0&&this.swap(0,e),this._heap.pop(),this.siftDown(),t},t.prototype.forEach=function(t){for(var e=this.pop();e;)t(e),e=this.pop()},t}(),B=function(t,e){return t.priority<e.priority},N=function(){function t(){this._deferred=new Map}return t.prototype.register=function(t,e,r){void 0===r&&(r=50),this._deferred.set(t,{keyword:t,procedure:e,priority:r})},t.prototype.registerIfNotExists=function(t,e,r){void 0===r&&(r=50),this.has(t)||this.register(t,e,r)},t.prototype.has=function(t){return this._deferred.has(t)},t.prototype.unregister=function(t){this._deferred.delete(t)},t.prototype.clear=function(){this._deferred.clear()},t.prototype.executeEach=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=new A(B);r.push.apply(r,n(this._deferred.values())),r.forEach((function(e){var r=e.procedure,i=e.keyword;return r.apply(void 0,n([i],t))}))},t}(),M={result:null,ready:!1},P=function(){function t(t,e){void 0===t&&(t={}),void 0===e&&(e=k),this.filters=new R,this.deferred=new N,this.preset=t,this.store=new $,this.memoizer=e}return t.prototype.filterProcessor=function(t){var e=this;return function(r,n){if(e.memoizer.hasItem(r))return{result:e.memoizer.getItem(r).result,ready:!0};var i=Object.assign(e.preset,t,n,{store:e.store,filters:e.filters,deferred:e.deferred}),o=e.filters.execute(r,i);return null===o.result?M:(o.memoize&&e.memoizer.setItem(r,o),{result:o.result,ready:!0})}},t.prototype.executeAndClearDeferred=function(){this.deferred.executeEach(),this.deferred.clear()},t.prototype.reset=function(){this.store.clear()},t.prototype.addRecipe=function(t){t(this.filters)},t}(),C=function(t){return t},q={shuffling:function(t,e,r,n){return void 0===r&&(r=C),void 0===n&&(n=C),function(i){var o=function(t){for(var e=t.slice(0),r=t.length,n=null,i=null;0!==r;)i=Math.floor(Math.random()*r),n=e[r-=1],e[r]=e[i],e[i]=n;return e},s=function(t){return n(t.map(r).join(e))};i.register(t,(function(t,e){var r=t.fullKey,n=t.num,i=t.fullOccur,a=t.values,u=e.store,l=e.deferred,f=e.ready,h=r+":"+i,c=r+":waitingList",p=h+":apply";if(u.get(p,!1)){if(u.get(c,new Set).size>0)return;for(var y=[],d=u.get(r,[]),g=0;g<a[0].length;g++)y.push(d.pop());return s(y)}if(f){if(!n)return s(o(a[0]));u.fold(r,(function(t){return t.concat(a[0])}),[]),l.registerIfNotExists(p,(function(){u.set(p,!0),u.over(c,(function(t){return t.delete(h)}),new Set)}));var v=r+":mix";l.registerIfNotExists(v,(function(){u.fold(r,o,[])}))}else u.over(c,(function(t){return t.add(h)}),new Set)}))}},ordering:function(t){return function(e){e.register(t,(function(t,e){}))}},cloze:function(t){return function(e){e.register(t,(function(t,e){}))}},multipleChoice:function(t){return function(e){e.register(t,(function(t,e){}))}},debug:function(t){t.register("tagpath",(function(t){return t.path.join(":")})),t.register("never",(function(){})),t.register("empty",(function(){return""})),t.register("key",(function(t){return t.key})),t.register("test",(function(t,e){var r=e.deferred;return r.registerIfNotExists("foobar",(function(){}),50),r.registerIfNotExists("mehbar",(function(){}),20),r.registerIfNotExists("echbar",(function(){}),20),r.registerIfNotExists("gehbar",(function(){}),200),""}))}};globalThis.renderTemplate=function(t,e){for(var n=t,i=!1,o=0;o<50&&!i;o++){var a=b(n),u=new s(a),l=r(w(n,a,e.filterProcessor({iteration:{index:o},template:u})),3),f=l[0];l[1];i=l[2],n=f,e.executeAndClearDeferred()}return n},globalThis.FilterManager=P,globalThis.filterRecipes=q}();