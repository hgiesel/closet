(function () {
    'use strict';

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
    ***************************************************************************** */

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    var SlangType;
    (function (SlangType) {
        SlangType["Unit"] = "unit";
        SlangType["Bool"] = "bool";
        SlangType["Number"] = "number";
        SlangType["String"] = "string";
        SlangType["Regex"] = "regex";
        SlangType["Symbol"] = "symbol";
        SlangType["Keyword"] = "keyword";
        SlangType["Quoted"] = "quoted";
        SlangType["Optional"] = "optional";
        SlangType["Atom"] = "atom";
        SlangType["Either"] = "either";
        SlangType["List"] = "list";
        SlangType["Vector"] = "vector";
        SlangType["Map"] = "map";
        SlangType["MapEntry"] = "mapentry";
        SlangType["Function"] = "fun";
        SlangType["ShcutFunction"] = "shcutfun";
        SlangType["ArmedFunction"] = "armedfun";
        SlangType["Optic"] = "optic";
        // Statement blocks
        SlangType["Def"] = "def";
        SlangType["If"] = "if";
        SlangType["Do"] = "do";
        SlangType["Let"] = "let";
        SlangType["Cond"] = "cond";
        SlangType["Case"] = "case";
        SlangType["For"] = "for";
        SlangType["Doseq"] = "doseq";
        SlangType["ThreadFirst"] = "threadfirst";
        SlangType["ThreadLast"] = "threadlast";
    })(SlangType || (SlangType = {}));
    var OpticType;
    (function (OpticType) {
        OpticType["Setter"] = "setter";
        OpticType["Fold"] = "fold";
        OpticType["Traversal"] = "traversal";
        OpticType["Affine"] = "affine";
        OpticType["Getter"] = "getter";
        OpticType["Lens"] = "lens";
        OpticType["Prism"] = "prism";
        OpticType["Iso"] = "iso";
    })(OpticType || (OpticType = {}));
    //# sourceMappingURL=types.js.map

    var getValue = function (v) { return v.value; };
    ////////// CONSTRUCTORS FOR BASIC TYPES
    var mkUnit = function () { return ({
        kind: SlangType.Unit,
    }); };
    var mkBool = function (v) { return ({
        kind: SlangType.Bool,
        value: v,
    }); };
    var mkNumber = function (re) { return ({
        kind: SlangType.Number,
        value: Number(re),
    }); };
    var mkSymbol = function (x) { return ({
        kind: SlangType.Symbol,
        value: x,
    }); };
    var mkKeyword = function (x) { return ({
        kind: SlangType.Keyword,
        value: x,
    }); };
    var mkString = function (x) { return ({
        kind: SlangType.String,
        value: x,
    }); };
    var mkRegex = function (x) { return ({
        kind: SlangType.Regex,
        value: new RegExp(x),
    }); };
    ////////// CONSTRUCTORS FOR RECURSIVE TYPES
    var toMapKey = function (v) { return v.kind === SlangType.String
        ? v.value
        : Symbol.for(v.value); };
    var fromMapKey = function (v) { return typeof v === 'string'
        ? mkString(v)
        //@ts-ignore
        : mkKeyword(v.description); };
    var mkQuoted = function (x) { return ({
        kind: SlangType.Quoted,
        quoted: x,
    }); };
    var mkOptional = function (x) { return ({
        kind: SlangType.Optional,
        boxed: x !== null && x !== void 0 ? x : null,
    }); };
    var mkAtom = function (x) { return ({
        kind: SlangType.Atom,
        atom: x,
    }); };
    var mkLeft = function (e) { return ({
        kind: SlangType.Either,
        ok: false,
        error: e,
    }); };
    var mkRight = function (val) { return ({
        kind: SlangType.Either,
        ok: true,
        value: val,
    }); };
    var mkList = function (head, tail) { return ({
        kind: SlangType.List,
        head: head,
        tail: tail,
    }); };
    var mkVector = function (members) { return ({
        kind: SlangType.Vector,
        members: members,
    }); };
    var mkMap = function (vs) {
        var e_1, _a;
        var theMap = new Map();
        try {
            for (var vs_1 = __values(vs), vs_1_1 = vs_1.next(); !vs_1_1.done; vs_1_1 = vs_1.next()) {
                var _b = __read(vs_1_1.value, 2), key = _b[0], value = _b[1];
                theMap.set(toMapKey(key), value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (vs_1_1 && !vs_1_1.done && (_a = vs_1.return)) _a.call(vs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return {
            kind: SlangType.Map,
            table: theMap,
        };
    };
    var mkMapDirect = function (table) { return ({
        kind: SlangType.Map,
        table: table,
    }); };
    //////////////////// Functions
    var mkFunction = function (name, params, body) { return ({
        kind: SlangType.Function,
        name: name,
        params: params,
        body: body,
    }); };
    var mkOptic = function (opticType, name, zooms) { return ({
        kind: SlangType.Optic,
        subkind: opticType,
        name: name,
        zooms: zooms,
    }); };
    var mkShcutFunction = function (name, params, body) { return ({
        kind: SlangType.ShcutFunction,
        name: name,
        params: params,
        body: body,
    }); };
    var mkArmedFunction = function (name, app) { return ({
        kind: SlangType.ArmedFunction,
        name: name,
        apply: app,
    }); };
    ///////////////// Bindings
    var mkDo = function (exprs) { return ({
        kind: SlangType.Do,
        expressions: exprs,
    }); };
    var mkDef = function (id, val) { return ({
        kind: SlangType.Def,
        identifier: id,
        value: val,
    }); };
    var mkLet = function (vs, body) {
        var e_2, _a;
        var theBindings = new Map();
        try {
            for (var vs_2 = __values(vs), vs_2_1 = vs_2.next(); !vs_2_1.done; vs_2_1 = vs_2.next()) {
                var v = vs_2_1.value;
                theBindings.set(getValue(v[0]), v[1]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (vs_2_1 && !vs_2_1.done && (_a = vs_2.return)) _a.call(vs_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return {
            kind: SlangType.Let,
            bindings: theBindings,
            body: body,
        };
    };
    //////////////////// Conditionals
    var mkIf = function (condition, thenClause, elseClause) { return ({
        kind: SlangType.If,
        condition: condition,
        thenClause: thenClause,
        elseClause: elseClause,
    }); };
    var mkCond = function (tests) { return ({
        kind: SlangType.Cond,
        tests: tests,
    }); };
    var mkCase = function (variable, tests) { return ({
        kind: SlangType.Case,
        variable: variable,
        tests: tests,
    }); };
    //////////////////// Iteration
    var mkFor = function (vs, body) {
        var e_3, _a;
        var theBindings = new Map();
        try {
            for (var vs_3 = __values(vs), vs_3_1 = vs_3.next(); !vs_3_1.done; vs_3_1 = vs_3.next()) {
                var v = vs_3_1.value;
                theBindings.set(getValue(v[0]), v[1]);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (vs_3_1 && !vs_3_1.done && (_a = vs_3.return)) _a.call(vs_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return {
            kind: SlangType.For,
            bindings: theBindings,
            body: body,
        };
    };
    var mkDoseq = function (vs, body) {
        var e_4, _a;
        var theBindings = new Map();
        try {
            for (var vs_4 = __values(vs), vs_4_1 = vs_4.next(); !vs_4_1.done; vs_4_1 = vs_4.next()) {
                var v = vs_4_1.value;
                theBindings.set(getValue(v[0]), v[1]);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (vs_4_1 && !vs_4_1.done && (_a = vs_4.return)) _a.call(vs_4);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return {
            kind: SlangType.Doseq,
            bindings: theBindings,
            body: body,
        };
    };
    var mkThreadFirst = function (value, pipes) { return ({
        kind: SlangType.ThreadFirst,
        value: value,
        pipes: pipes,
    }); };
    var mkThreadLast = function (value, pipes) { return ({
        kind: SlangType.ThreadLast,
        value: value,
        pipes: pipes,
    }); };
    //# sourceMappingURL=constructors.js.map

    var isUnit = function (val) { return val.kind === SlangType.Unit; };
    var isBool = function (val) { return val.kind === SlangType.Bool; };
    var isNumber = function (val) { return val.kind === SlangType.Number; };
    var isSymbol = function (val) { return val.kind === SlangType.Symbol; };
    var isKeyword = function (val) { return val.kind === SlangType.Keyword; };
    var isString = function (val) { return val.kind === SlangType.String; };
    var isRegex = function (val) { return val.kind === SlangType.Regex; };
    var isQuoted = function (val) { return val.kind === SlangType.Quoted; };
    var isOptional = function (val) { return val.kind === SlangType.Optional; };
    var isAtom = function (val) { return val.kind === SlangType.Atom; };
    var isEither = function (val) { return val.kind === SlangType.Either; };
    var isOk = function (val) { return val.ok; };
    var isList = function (val) { return val.kind === SlangType.List; };
    var isVector = function (val) { return val.kind === SlangType.Vector; };
    var isMap = function (val) { return val.kind === SlangType.Map; };
    var isFunction = function (val) { return val.kind === SlangType.Function; };
    var isShcutFunction = function (val) { return val.kind === SlangType.ShcutFunction; };
    var isArmedFunction = function (val) { return val.kind === SlangType.ArmedFunction; };
    var isOptic = function (val) { return val.kind === SlangType.Optic; };
    var isOpticCoercable = function (val) { return (isOptic(val) ||
        isNumber(val) ||
        isString(val) ||
        isKeyword(val)); };
    var isExecutable = function (val) { return (isFunction(val) ||
        isShcutFunction(val) ||
        isArmedFunction(val) ||
        isNumber(val) ||
        isMapKey(val)); };
    var isMapKey = function (val) { return (isString(val) ||
        isKeyword(val)); };
    //# sourceMappingURL=reflection.js.map

    var pureToBool = function (val) {
        if (isBool(val)) {
            return val.value;
        }
        return true;
    };
    var toBool = function (val) {
        return mkBool(pureToBool(val));
    };
    var pureToString = function (val) {
        if (isUnit(val)) {
            return '()';
        }
        else if (isBool(val)) {
            return val.value
                ? '#true'
                : '#false';
        }
        else if (isString(val)) {
            return "\"" + val.value + "\"";
        }
        else if (isRegex(val)) {
            return "#\"" + val.value.toString().slice(1, -1) + "\"";
        }
        else if (isNumber(val)) {
            return Number.isNaN(val.value)
                ? '#nan'
                : val.value === Infinity
                    ? '#inf'
                    : val.value === -Infinity
                        ? '#-inf'
                        : String(val.value);
        }
        else if (isSymbol(val)) {
            return val.value;
        }
        else if (isKeyword(val)) {
            return ":" + val.value;
        }
        else if (isQuoted(val)) {
            return "'" + pureToString(val.quoted);
        }
        else if (isAtom(val)) {
            return "(atom " + pureToString(val.atom) + ")";
        }
        else if (isOptional(val)) {
            if (val.boxed) {
                return "&" + pureToString(val.boxed);
            }
            return "#none";
        }
        else if (isVector(val)) {
            return "[" + val.members.map(pureToString).join(' ') + "]";
        }
        else if (isList(val)) {
            return "(" + pureToString(val.head) + val.tail.map(function (v) { return " " + pureToString(v); }).join('') + ")";
        }
        else if (isMap(val)) {
            var mapStrings_1 = [];
            val.table.forEach(function (v, k) {
                mapStrings_1.push([
                    typeof k === 'symbol'
                        //@ts-ignore
                        ? ":" + k.description
                        : "\"" + k + "\"",
                    pureToString(v),
                ]);
            });
            return "{" + mapStrings_1.map(function (v) { return v.join(' '); }).join(', ') + "}";
        }
        else if (isFunction(val)) {
            return "fn<" + val.name + ">(" + val.params.map(pureToString).join(',') + ") " + pureToString(val.body);
        }
        else if (isShcutFunction(val)) {
            return "fn<" + val.name + ">(" + val.params + ") " + pureToString(val.body);
        }
        else if (isArmedFunction(val)) {
            return "fn<" + val.name + ">";
        }
        else if (isOptic(val)) {
            return "optic<" + val.subkind + ":" + val.name + ">";
        }
    };
    var toString = function (val) {
        return mkString(pureToString(val));
    };
    //# sourceMappingURL=coerce.js.map

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var nearley = createCommonjsModule(function (module) {
    (function(root, factory) {
        if ( module.exports) {
            module.exports = factory();
        } else {
            root.nearley = factory();
        }
    }(commonjsGlobal, function() {

        function Rule(name, symbols, postprocess) {
            this.id = ++Rule.highestId;
            this.name = name;
            this.symbols = symbols;        // a list of literal | regex class | nonterminal
            this.postprocess = postprocess;
            return this;
        }
        Rule.highestId = 0;

        Rule.prototype.toString = function(withCursorAt) {
            function stringifySymbolSequence (e) {
                return e.literal ? JSON.stringify(e.literal) :
                       e.type ? '%' + e.type : e.toString();
            }
            var symbolSequence = (typeof withCursorAt === "undefined")
                                 ? this.symbols.map(stringifySymbolSequence).join(' ')
                                 : (   this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ')
                                     + " ● "
                                     + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ')     );
            return this.name + " → " + symbolSequence;
        };


        // a State is a rule at a position from a given starting point in the input stream (reference)
        function State(rule, dot, reference, wantedBy) {
            this.rule = rule;
            this.dot = dot;
            this.reference = reference;
            this.data = [];
            this.wantedBy = wantedBy;
            this.isComplete = this.dot === rule.symbols.length;
        }

        State.prototype.toString = function() {
            return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
        };

        State.prototype.nextState = function(child) {
            var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
            state.left = this;
            state.right = child;
            if (state.isComplete) {
                state.data = state.build();
                // Having right set here will prevent the right state and its children
                // form being garbage collected
                state.right = undefined;
            }
            return state;
        };

        State.prototype.build = function() {
            var children = [];
            var node = this;
            do {
                children.push(node.right.data);
                node = node.left;
            } while (node.left);
            children.reverse();
            return children;
        };

        State.prototype.finish = function() {
            if (this.rule.postprocess) {
                this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
            }
        };


        function Column(grammar, index) {
            this.grammar = grammar;
            this.index = index;
            this.states = [];
            this.wants = {}; // states indexed by the non-terminal they expect
            this.scannable = []; // list of states that expect a token
            this.completed = {}; // states that are nullable
        }


        Column.prototype.process = function(nextColumn) {
            var states = this.states;
            var wants = this.wants;
            var completed = this.completed;

            for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
                var state = states[w];

                if (state.isComplete) {
                    state.finish();
                    if (state.data !== Parser.fail) {
                        // complete
                        var wantedBy = state.wantedBy;
                        for (var i = wantedBy.length; i--; ) { // this line is hot
                            var left = wantedBy[i];
                            this.complete(left, state);
                        }

                        // special-case nullables
                        if (state.reference === this.index) {
                            // make sure future predictors of this rule get completed.
                            var exp = state.rule.name;
                            (this.completed[exp] = this.completed[exp] || []).push(state);
                        }
                    }

                } else {
                    // queue scannable states
                    var exp = state.rule.symbols[state.dot];
                    if (typeof exp !== 'string') {
                        this.scannable.push(state);
                        continue;
                    }

                    // predict
                    if (wants[exp]) {
                        wants[exp].push(state);

                        if (completed.hasOwnProperty(exp)) {
                            var nulls = completed[exp];
                            for (var i = 0; i < nulls.length; i++) {
                                var right = nulls[i];
                                this.complete(state, right);
                            }
                        }
                    } else {
                        wants[exp] = [state];
                        this.predict(exp);
                    }
                }
            }
        };

        Column.prototype.predict = function(exp) {
            var rules = this.grammar.byName[exp] || [];

            for (var i = 0; i < rules.length; i++) {
                var r = rules[i];
                var wantedBy = this.wants[exp];
                var s = new State(r, 0, this.index, wantedBy);
                this.states.push(s);
            }
        };

        Column.prototype.complete = function(left, right) {
            var copy = left.nextState(right);
            this.states.push(copy);
        };


        function Grammar(rules, start) {
            this.rules = rules;
            this.start = start || this.rules[0].name;
            var byName = this.byName = {};
            this.rules.forEach(function(rule) {
                if (!byName.hasOwnProperty(rule.name)) {
                    byName[rule.name] = [];
                }
                byName[rule.name].push(rule);
            });
        }

        // So we can allow passing (rules, start) directly to Parser for backwards compatibility
        Grammar.fromCompiled = function(rules, start) {
            var lexer = rules.Lexer;
            if (rules.ParserStart) {
              start = rules.ParserStart;
              rules = rules.ParserRules;
            }
            var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
            var g = new Grammar(rules, start);
            g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
            return g;
        };


        function StreamLexer() {
          this.reset("");
        }

        StreamLexer.prototype.reset = function(data, state) {
            this.buffer = data;
            this.index = 0;
            this.line = state ? state.line : 1;
            this.lastLineBreak = state ? -state.col : 0;
        };

        StreamLexer.prototype.next = function() {
            if (this.index < this.buffer.length) {
                var ch = this.buffer[this.index++];
                if (ch === '\n') {
                  this.line += 1;
                  this.lastLineBreak = this.index;
                }
                return {value: ch};
            }
        };

        StreamLexer.prototype.save = function() {
          return {
            line: this.line,
            col: this.index - this.lastLineBreak,
          }
        };

        StreamLexer.prototype.formatError = function(token, message) {
            // nb. this gets called after consuming the offending token,
            // so the culprit is index-1
            var buffer = this.buffer;
            if (typeof buffer === 'string') {
                var nextLineBreak = buffer.indexOf('\n', this.index);
                if (nextLineBreak === -1) nextLineBreak = buffer.length;
                var line = buffer.substring(this.lastLineBreak, nextLineBreak);
                var col = this.index - this.lastLineBreak;
                message += " at line " + this.line + " col " + col + ":\n\n";
                message += "  " + line + "\n";
                message += "  " + Array(col).join(" ") + "^";
                return message;
            } else {
                return message + " at index " + (this.index - 1);
            }
        };


        function Parser(rules, start, options) {
            if (rules instanceof Grammar) {
                var grammar = rules;
                var options = start;
            } else {
                var grammar = Grammar.fromCompiled(rules, start);
            }
            this.grammar = grammar;

            // Read options
            this.options = {
                keepHistory: false,
                lexer: grammar.lexer || new StreamLexer,
            };
            for (var key in (options || {})) {
                this.options[key] = options[key];
            }

            // Setup lexer
            this.lexer = this.options.lexer;
            this.lexerState = undefined;

            // Setup a table
            var column = new Column(grammar, 0);
            var table = this.table = [column];

            // I could be expecting anything.
            column.wants[grammar.start] = [];
            column.predict(grammar.start);
            // TODO what if start rule is nullable?
            column.process();
            this.current = 0; // token index
        }

        // create a reserved token for indicating a parse fail
        Parser.fail = {};

        Parser.prototype.feed = function(chunk) {
            var lexer = this.lexer;
            lexer.reset(chunk, this.lexerState);

            var token;
            while (token = lexer.next()) {
                // We add new states to table[current+1]
                var column = this.table[this.current];

                // GC unused states
                if (!this.options.keepHistory) {
                    delete this.table[this.current - 1];
                }

                var n = this.current + 1;
                var nextColumn = new Column(this.grammar, n);
                this.table.push(nextColumn);

                // Advance all tokens that expect the symbol
                var literal = token.text !== undefined ? token.text : token.value;
                var value = lexer.constructor === StreamLexer ? token.value : token;
                var scannable = column.scannable;
                for (var w = scannable.length; w--; ) {
                    var state = scannable[w];
                    var expect = state.rule.symbols[state.dot];
                    // Try to consume the token
                    // either regex or literal
                    if (expect.test ? expect.test(value) :
                        expect.type ? expect.type === token.type
                                    : expect.literal === literal) {
                        // Add it
                        var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});
                        nextColumn.states.push(next);
                    }
                }

                // Next, for each of the rules, we either
                // (a) complete it, and try to see if the reference row expected that
                //     rule
                // (b) predict the next nonterminal it expects by adding that
                //     nonterminal's start state
                // To prevent duplication, we also keep track of rules we have already
                // added

                nextColumn.process();

                // If needed, throw an error:
                if (nextColumn.states.length === 0) {
                    // No states at all! This is not good.
                    var err = new Error(this.reportError(token));
                    err.offset = this.current;
                    err.token = token;
                    throw err;
                }

                // maybe save lexer state
                if (this.options.keepHistory) {
                  column.lexerState = lexer.save();
                }

                this.current++;
            }
            if (column) {
              this.lexerState = lexer.save();
            }

            // Incrementally keep track of results
            this.results = this.finish();

            // Allow chaining, for whatever it's worth
            return this;
        };

        Parser.prototype.reportError = function(token) {
            var lines = [];
            var tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== undefined ? token.value : token);
            lines.push(this.lexer.formatError(token, "Syntax error"));
            lines.push('Unexpected ' + tokenDisplay + '. Instead, I was expecting to see one of the following:\n');
            var lastColumnIndex = this.table.length - 2;
            var lastColumn = this.table[lastColumnIndex];
            var expectantStates = lastColumn.states
                .filter(function(state) {
                    var nextSymbol = state.rule.symbols[state.dot];
                    return nextSymbol && typeof nextSymbol !== "string";
                });

            // Display a "state stack" for each expectant state
            // - which shows you how this state came to be, step by step.
            // If there is more than one derivation, we only display the first one.
            var stateStacks = expectantStates
                .map(function(state) {
                    return this.buildFirstStateStack(state, []);
                }, this);
            // Display each state that is expecting a terminal symbol next.
            stateStacks.forEach(function(stateStack) {
                var state = stateStack[0];
                var nextSymbol = state.rule.symbols[state.dot];
                var symbolDisplay = this.getSymbolDisplay(nextSymbol);
                lines.push('A ' + symbolDisplay + ' based on:');
                this.displayStateStack(stateStack, lines);
            }, this);

            lines.push("");
            return lines.join("\n");
        };

        Parser.prototype.displayStateStack = function(stateStack, lines) {
            var lastDisplay;
            var sameDisplayCount = 0;
            for (var j = 0; j < stateStack.length; j++) {
                var state = stateStack[j];
                var display = state.rule.toString(state.dot);
                if (display === lastDisplay) {
                    sameDisplayCount++;
                } else {
                    if (sameDisplayCount > 0) {
                        lines.push('    ⬆ ︎' + sameDisplayCount + ' more lines identical to this');
                    }
                    sameDisplayCount = 0;
                    lines.push('    ' + display);
                }
                lastDisplay = display;
            }
        };

        Parser.prototype.getSymbolDisplay = function(symbol) {
            var type = typeof symbol;
            if (type === "string") {
                return symbol;
            } else if (type === "object" && symbol.literal) {
                return JSON.stringify(symbol.literal);
            } else if (type === "object" && symbol instanceof RegExp) {
                return 'character matching ' + symbol;
            } else if (type === "object" && symbol.type) {
                return symbol.type + ' token';
            } else {
                throw new Error('Unknown symbol type: ' + symbol);
            }
        };

        /*
        Builds a the first state stack. You can think of a state stack as the call stack
        of the recursive-descent parser which the Nearley parse algorithm simulates.
        A state stack is represented as an array of state objects. Within a
        state stack, the first item of the array will be the starting
        state, with each successive item in the array going further back into history.

        This function needs to be given a starting state and an empty array representing
        the visited states, and it returns an single state stack.

        */
        Parser.prototype.buildFirstStateStack = function(state, visited) {
            if (visited.indexOf(state) !== -1) {
                // Found cycle, return null
                // to eliminate this path from the results, because
                // we don't know how to display it meaningfully
                return null;
            }
            if (state.wantedBy.length === 0) {
                return [state];
            }
            var prevState = state.wantedBy[0];
            var childVisited = [state].concat(visited);
            var childResult = this.buildFirstStateStack(prevState, childVisited);
            if (childResult === null) {
                return null;
            }
            return [state].concat(childResult);
        };

        Parser.prototype.save = function() {
            var column = this.table[this.current];
            column.lexerState = this.lexerState;
            return column;
        };

        Parser.prototype.restore = function(column) {
            var index = column.index;
            this.current = index;
            this.table[index] = column;
            this.table.splice(index + 1);
            this.lexerState = column.lexerState;

            // Incrementally keep track of results
            this.results = this.finish();
        };

        // nb. deprecated: use save/restore instead!
        Parser.prototype.rewind = function(index) {
            if (!this.options.keepHistory) {
                throw new Error('set option `keepHistory` to enable rewinding')
            }
            // nb. recall column (table) indicies fall between token indicies.
            //        col 0   --   token 0   --   col 1
            this.restore(this.table[index]);
        };

        Parser.prototype.finish = function() {
            // Return the possible parsings
            var considerations = [];
            var start = this.grammar.start;
            var column = this.table[this.table.length - 1];
            column.states.forEach(function (t) {
                if (t.rule.name === start
                        && t.dot === t.rule.symbols.length
                        && t.reference === 0
                        && t.data !== Parser.fail) {
                    considerations.push(t);
                }
            });
            return considerations.map(function(c) {return c.data; });
        };

        return {
            Parser: Parser,
            Grammar: Grammar,
            Rule: Rule,
        };

    }));
    });

    var shcutParam = /^%([1-9][0-9]*)?$/u;
    var shcutFuncArity = function (v, currentMax) {
        if (currentMax === void 0) { currentMax = 0; }
        switch (v.kind) {
            case SlangType.Symbol:
                var m = v.value.match(shcutParam);
                if (m) {
                    if (!m[1]) {
                        return Math.max(currentMax, 1);
                    }
                    return Math.max(currentMax, Number(m[1]));
                }
                return currentMax;
            case SlangType.List:
                var headMax_1 = shcutFuncArity(v.head, currentMax);
                var tailMaxes = v.tail.map(function (t) { return shcutFuncArity(t, headMax_1); });
                return Math.max.apply(Math, __spread(tailMaxes));
            case SlangType.Vector:
                var vmaxes = v.members.map(function (m) { return shcutFuncArity(m, currentMax); });
                return Math.max.apply(Math, __spread(vmaxes));
            case SlangType.Map:
                var mmaxes_1 = [];
                v.table.forEach(function (v) {
                    mmaxes_1.push(shcutFuncArity(v, currentMax));
                });
                return Math.max.apply(Math, __spread(mmaxes_1));
            case SlangType.Do:
                var dmaxes = v.expressions.map(function (e) { return shcutFuncArity(e, currentMax); });
                return Math.max.apply(Math, __spread(dmaxes));
            case SlangType.If:
                return Math.max(shcutFuncArity(v.condition, currentMax), shcutFuncArity(v.thenClause, currentMax), shcutFuncArity(v.elseClause, currentMax));
            case SlangType.Let:
                var lmax_1 = shcutFuncArity(v.body, currentMax);
                var lmaxes = [];
                v.bindings.forEach(function (v) {
                    mmaxes_1.push(shcutFuncArity(v, lmax_1));
                });
                return Math.max.apply(Math, __spread(lmaxes));
            case SlangType.Def:
                return shcutFuncArity(v.value, currentMax);
            case SlangType.Case:
                var cmax_1 = shcutFuncArity(v.variable);
                return Math.max.apply(Math, __spread(v.tests.map(function (pair) { return Math.max(shcutFuncArity(pair[0], cmax_1), shcutFuncArity(pair[1], cmax_1)); })));
            case SlangType.Cond:
                return Math.max.apply(Math, __spread(v.tests.map(function (pair) { return Math.max(shcutFuncArity(pair[0], currentMax), shcutFuncArity(pair[1], currentMax)); })));
            default:
                return currentMax;
        }
    };
    //# sourceMappingURL=utils.js.map

    var moo = createCommonjsModule(function (module) {
    (function(root, factory) {
      if ( module.exports) {
        module.exports = factory();
      } else {
        root.moo = factory();
      }
    }(commonjsGlobal, function() {

      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var toString = Object.prototype.toString;
      var hasSticky = typeof new RegExp().sticky === 'boolean';

      /***************************************************************************/

      function isRegExp(o) { return o && toString.call(o) === '[object RegExp]' }
      function isObject(o) { return o && typeof o === 'object' && !isRegExp(o) && !Array.isArray(o) }

      function reEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      }
      function reGroups(s) {
        var re = new RegExp('|' + s);
        return re.exec('').length - 1
      }
      function reCapture(s) {
        return '(' + s + ')'
      }
      function reUnion(regexps) {
        if (!regexps.length) return '(?!)'
        var source =  regexps.map(function(s) {
          return "(?:" + s + ")"
        }).join('|');
        return "(?:" + source + ")"
      }

      function regexpOrLiteral(obj) {
        if (typeof obj === 'string') {
          return '(?:' + reEscape(obj) + ')'

        } else if (isRegExp(obj)) {
          // TODO: consider /u support
          if (obj.ignoreCase) throw new Error('RegExp /i flag not allowed')
          if (obj.global) throw new Error('RegExp /g flag is implied')
          if (obj.sticky) throw new Error('RegExp /y flag is implied')
          if (obj.multiline) throw new Error('RegExp /m flag is implied')
          return obj.source

        } else {
          throw new Error('Not a pattern: ' + obj)
        }
      }

      function objectToRules(object) {
        var keys = Object.getOwnPropertyNames(object);
        var result = [];
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var thing = object[key];
          var rules = [].concat(thing);
          if (key === 'include') {
            for (var j = 0; j < rules.length; j++) {
              result.push({include: rules[j]});
            }
            continue
          }
          var match = [];
          rules.forEach(function(rule) {
            if (isObject(rule)) {
              if (match.length) result.push(ruleOptions(key, match));
              result.push(ruleOptions(key, rule));
              match = [];
            } else {
              match.push(rule);
            }
          });
          if (match.length) result.push(ruleOptions(key, match));
        }
        return result
      }

      function arrayToRules(array) {
        var result = [];
        for (var i = 0; i < array.length; i++) {
          var obj = array[i];
          if (obj.include) {
            var include = [].concat(obj.include);
            for (var j = 0; j < include.length; j++) {
              result.push({include: include[j]});
            }
            continue
          }
          if (!obj.type) {
            throw new Error('Rule has no type: ' + JSON.stringify(obj))
          }
          result.push(ruleOptions(obj.type, obj));
        }
        return result
      }

      function ruleOptions(type, obj) {
        if (!isObject(obj)) {
          obj = { match: obj };
        }
        if (obj.include) {
          throw new Error('Matching rules cannot also include states')
        }

        // nb. error and fallback imply lineBreaks
        var options = {
          defaultType: type,
          lineBreaks: !!obj.error || !!obj.fallback,
          pop: false,
          next: null,
          push: null,
          error: false,
          fallback: false,
          value: null,
          type: null,
          shouldThrow: false,
        };

        // Avoid Object.assign(), so we support IE9+
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            options[key] = obj[key];
          }
        }

        // type transform cannot be a string
        if (typeof options.type === 'string' && type !== options.type) {
          throw new Error("Type transform cannot be a string (type '" + options.type + "' for token '" + type + "')")
        }

        // convert to array
        var match = options.match;
        options.match = Array.isArray(match) ? match : match ? [match] : [];
        options.match.sort(function(a, b) {
          return isRegExp(a) && isRegExp(b) ? 0
               : isRegExp(b) ? -1 : isRegExp(a) ? +1 : b.length - a.length
        });
        return options
      }

      function toRules(spec) {
        return Array.isArray(spec) ? arrayToRules(spec) : objectToRules(spec)
      }

      var defaultErrorRule = ruleOptions('error', {lineBreaks: true, shouldThrow: true});
      function compileRules(rules, hasStates) {
        var errorRule = null;
        var fast = Object.create(null);
        var fastAllowed = true;
        var unicodeFlag = null;
        var groups = [];
        var parts = [];

        // If there is a fallback rule, then disable fast matching
        for (var i = 0; i < rules.length; i++) {
          if (rules[i].fallback) {
            fastAllowed = false;
          }
        }

        for (var i = 0; i < rules.length; i++) {
          var options = rules[i];

          if (options.include) {
            // all valid inclusions are removed by states() preprocessor
            throw new Error('Inheritance is not allowed in stateless lexers')
          }

          if (options.error || options.fallback) {
            // errorRule can only be set once
            if (errorRule) {
              if (!options.fallback === !errorRule.fallback) {
                throw new Error("Multiple " + (options.fallback ? "fallback" : "error") + " rules not allowed (for token '" + options.defaultType + "')")
              } else {
                throw new Error("fallback and error are mutually exclusive (for token '" + options.defaultType + "')")
              }
            }
            errorRule = options;
          }

          var match = options.match.slice();
          if (fastAllowed) {
            while (match.length && typeof match[0] === 'string' && match[0].length === 1) {
              var word = match.shift();
              fast[word.charCodeAt(0)] = options;
            }
          }

          // Warn about inappropriate state-switching options
          if (options.pop || options.push || options.next) {
            if (!hasStates) {
              throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.defaultType + "')")
            }
            if (options.fallback) {
              throw new Error("State-switching options are not allowed on fallback tokens (for token '" + options.defaultType + "')")
            }
          }

          // Only rules with a .match are included in the RegExp
          if (match.length === 0) {
            continue
          }
          fastAllowed = false;

          groups.push(options);

          // Check unicode flag is used everywhere or nowhere
          for (var j = 0; j < match.length; j++) {
            var obj = match[j];
            if (!isRegExp(obj)) {
              continue
            }

            if (unicodeFlag === null) {
              unicodeFlag = obj.unicode;
            } else if (unicodeFlag !== obj.unicode && options.fallback === false) {
              throw new Error('If one rule is /u then all must be')
            }
          }

          // convert to RegExp
          var pat = reUnion(match.map(regexpOrLiteral));

          // validate
          var regexp = new RegExp(pat);
          if (regexp.test("")) {
            throw new Error("RegExp matches empty string: " + regexp)
          }
          var groupCount = reGroups(pat);
          if (groupCount > 0) {
            throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead")
          }

          // try and detect rules matching newlines
          if (!options.lineBreaks && regexp.test('\n')) {
            throw new Error('Rule should declare lineBreaks: ' + regexp)
          }

          // store regex
          parts.push(reCapture(pat));
        }


        // If there's no fallback rule, use the sticky flag so we only look for
        // matches at the current index.
        //
        // If we don't support the sticky flag, then fake it using an irrefutable
        // match (i.e. an empty pattern).
        var fallbackRule = errorRule && errorRule.fallback;
        var flags = hasSticky && !fallbackRule ? 'ym' : 'gm';
        var suffix = hasSticky || fallbackRule ? '' : '|';

        if (unicodeFlag === true) flags += "u";
        var combined = new RegExp(reUnion(parts) + suffix, flags);
        return {regexp: combined, groups: groups, fast: fast, error: errorRule || defaultErrorRule}
      }

      function compile(rules) {
        var result = compileRules(toRules(rules));
        return new Lexer({start: result}, 'start')
      }

      function checkStateGroup(g, name, map) {
        var state = g && (g.push || g.next);
        if (state && !map[state]) {
          throw new Error("Missing state '" + state + "' (in token '" + g.defaultType + "' of state '" + name + "')")
        }
        if (g && g.pop && +g.pop !== 1) {
          throw new Error("pop must be 1 (in token '" + g.defaultType + "' of state '" + name + "')")
        }
      }
      function compileStates(states, start) {
        var all = states.$all ? toRules(states.$all) : [];
        delete states.$all;

        var keys = Object.getOwnPropertyNames(states);
        if (!start) start = keys[0];

        var ruleMap = Object.create(null);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          ruleMap[key] = toRules(states[key]).concat(all);
        }
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var rules = ruleMap[key];
          var included = Object.create(null);
          for (var j = 0; j < rules.length; j++) {
            var rule = rules[j];
            if (!rule.include) continue
            var splice = [j, 1];
            if (rule.include !== key && !included[rule.include]) {
              included[rule.include] = true;
              var newRules = ruleMap[rule.include];
              if (!newRules) {
                throw new Error("Cannot include nonexistent state '" + rule.include + "' (in state '" + key + "')")
              }
              for (var k = 0; k < newRules.length; k++) {
                var newRule = newRules[k];
                if (rules.indexOf(newRule) !== -1) continue
                splice.push(newRule);
              }
            }
            rules.splice.apply(rules, splice);
            j--;
          }
        }

        var map = Object.create(null);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          map[key] = compileRules(ruleMap[key], true);
        }

        for (var i = 0; i < keys.length; i++) {
          var name = keys[i];
          var state = map[name];
          var groups = state.groups;
          for (var j = 0; j < groups.length; j++) {
            checkStateGroup(groups[j], name, map);
          }
          var fastKeys = Object.getOwnPropertyNames(state.fast);
          for (var j = 0; j < fastKeys.length; j++) {
            checkStateGroup(state.fast[fastKeys[j]], name, map);
          }
        }

        return new Lexer(map, start)
      }

      function keywordTransform(map) {
        var reverseMap = Object.create(null);
        var byLength = Object.create(null);
        var types = Object.getOwnPropertyNames(map);
        for (var i = 0; i < types.length; i++) {
          var tokenType = types[i];
          var item = map[tokenType];
          var keywordList = Array.isArray(item) ? item : [item];
          keywordList.forEach(function(keyword) {
            (byLength[keyword.length] = byLength[keyword.length] || []).push(keyword);
            if (typeof keyword !== 'string') {
              throw new Error("keyword must be string (in keyword '" + tokenType + "')")
            }
            reverseMap[keyword] = tokenType;
          });
        }

        // fast string lookup
        // https://jsperf.com/string-lookups
        function str(x) { return JSON.stringify(x) }
        var source = '';
        source += 'switch (value.length) {\n';
        for (var length in byLength) {
          var keywords = byLength[length];
          source += 'case ' + length + ':\n';
          source += 'switch (value) {\n';
          keywords.forEach(function(keyword) {
            var tokenType = reverseMap[keyword];
            source += 'case ' + str(keyword) + ': return ' + str(tokenType) + '\n';
          });
          source += '}\n';
        }
        source += '}\n';
        return Function('value', source) // type
      }

      /***************************************************************************/

      var Lexer = function(states, state) {
        this.startState = state;
        this.states = states;
        this.buffer = '';
        this.stack = [];
        this.reset();
      };

      Lexer.prototype.reset = function(data, info) {
        this.buffer = data || '';
        this.index = 0;
        this.line = info ? info.line : 1;
        this.col = info ? info.col : 1;
        this.queuedToken = info ? info.queuedToken : null;
        this.queuedThrow = info ? info.queuedThrow : null;
        this.setState(info ? info.state : this.startState);
        this.stack = info && info.stack ? info.stack.slice() : [];
        return this
      };

      Lexer.prototype.save = function() {
        return {
          line: this.line,
          col: this.col,
          state: this.state,
          stack: this.stack.slice(),
          queuedToken: this.queuedToken,
          queuedThrow: this.queuedThrow,
        }
      };

      Lexer.prototype.setState = function(state) {
        if (!state || this.state === state) return
        this.state = state;
        var info = this.states[state];
        this.groups = info.groups;
        this.error = info.error;
        this.re = info.regexp;
        this.fast = info.fast;
      };

      Lexer.prototype.popState = function() {
        this.setState(this.stack.pop());
      };

      Lexer.prototype.pushState = function(state) {
        this.stack.push(this.state);
        this.setState(state);
      };

      var eat = hasSticky ? function(re, buffer) { // assume re is /y
        return re.exec(buffer)
      } : function(re, buffer) { // assume re is /g
        var match = re.exec(buffer);
        // will always match, since we used the |(?:) trick
        if (match[0].length === 0) {
          return null
        }
        return match
      };

      Lexer.prototype._getGroup = function(match) {
        var groupCount = this.groups.length;
        for (var i = 0; i < groupCount; i++) {
          if (match[i + 1] !== undefined) {
            return this.groups[i]
          }
        }
        throw new Error('Cannot find token type for matched text')
      };

      function tokenToString() {
        return this.value
      }

      Lexer.prototype.next = function() {
        var index = this.index;

        // If a fallback token matched, we don't need to re-run the RegExp
        if (this.queuedGroup) {
          var token = this._token(this.queuedGroup, this.queuedText, index);
          this.queuedGroup = null;
          this.queuedText = "";
          return token
        }

        var buffer = this.buffer;
        if (index === buffer.length) {
          return // EOF
        }

        // Fast matching for single characters
        var group = this.fast[buffer.charCodeAt(index)];
        if (group) {
          return this._token(group, buffer.charAt(index), index)
        }

        // Execute RegExp
        var re = this.re;
        re.lastIndex = index;
        var match = eat(re, buffer);

        // Error tokens match the remaining buffer
        var error = this.error;
        if (match == null) {
          return this._token(error, buffer.slice(index, buffer.length), index)
        }

        var group = this._getGroup(match);
        var text = match[0];

        if (error.fallback && match.index !== index) {
          this.queuedGroup = group;
          this.queuedText = text;

          // Fallback tokens contain the unmatched portion of the buffer
          return this._token(error, buffer.slice(index, match.index), index)
        }

        return this._token(group, text, index)
      };

      Lexer.prototype._token = function(group, text, offset) {
        // count line breaks
        var lineBreaks = 0;
        if (group.lineBreaks) {
          var matchNL = /\n/g;
          var nl = 1;
          if (text === '\n') {
            lineBreaks = 1;
          } else {
            while (matchNL.exec(text)) { lineBreaks++; nl = matchNL.lastIndex; }
          }
        }

        var token = {
          type: (typeof group.type === 'function' && group.type(text)) || group.defaultType,
          value: typeof group.value === 'function' ? group.value(text) : text,
          text: text,
          toString: tokenToString,
          offset: offset,
          lineBreaks: lineBreaks,
          line: this.line,
          col: this.col,
        };
        // nb. adding more props to token object will make V8 sad!

        var size = text.length;
        this.index += size;
        this.line += lineBreaks;
        if (lineBreaks !== 0) {
          this.col = size - nl + 1;
        } else {
          this.col += size;
        }

        // throw, if no rule with {error: true}
        if (group.shouldThrow) {
          throw new Error(this.formatError(token, "invalid syntax"))
        }

        if (group.pop) this.popState();
        else if (group.push) this.pushState(group.push);
        else if (group.next) this.setState(group.next);

        return token
      };

      if (typeof Symbol !== 'undefined' && Symbol.iterator) {
        var LexerIterator = function(lexer) {
          this.lexer = lexer;
        };

        LexerIterator.prototype.next = function() {
          var token = this.lexer.next();
          return {value: token, done: !token}
        };

        LexerIterator.prototype[Symbol.iterator] = function() {
          return this
        };

        Lexer.prototype[Symbol.iterator] = function() {
          return new LexerIterator(this)
        };
      }

      Lexer.prototype.formatError = function(token, message) {
        if (token == null) {
          // An undefined token indicates EOF
          var text = this.buffer.slice(this.index);
          var token = {
            text: text,
            offset: this.index,
            lineBreaks: text.indexOf('\n') === -1 ? 0 : 1,
            line: this.line,
            col: this.col,
          };
        }
        var start = Math.max(0, token.offset - token.col + 1);
        var eol = token.lineBreaks ? token.text.indexOf('\n') : token.text.length;
        var firstLine = this.buffer.substring(start, token.offset + eol);
        message += " at line " + token.line + " col " + token.col + ":\n\n";
        message += "  " + firstLine + "\n";
        message += "  " + Array(token.col).join(" ") + "^";
        return message
      };

      Lexer.prototype.clone = function() {
        return new Lexer(this.states, this.state)
      };

      Lexer.prototype.has = function(tokenType) {
        return true
      };


      return {
        compile: compile,
        states: compileStates,
        error: Object.freeze({error: true}),
        fallback: Object.freeze({fallback: true}),
        keywords: keywordTransform,
      }

    }));
    });

    var lexer = moo.compile({
        ws: {
            match: /(?:&nbsp;|,|<[^>]*?>|[ \t\n]|\/\*.*\*\/)+/u,
            lineBreaks: true,
        },
        lparen: '(',
        hashParen: '#(',
        rparen: ')',
        lbracket: '[',
        rbracket: ']',
        lbrace: '{',
        rbrace: '}',
        quote: '\'',
        amp: '&',
        at: '@',
        string: {
            match: /"(?:\\["\\rn]|[^"\\\n])*?"/u,
            value: function (x) { return x.slice(1, -1); },
        },
        number: [
            /[+-]?(?:(?:0|[1-9][0-9]*)\.[0-9]+)/u,
            /[+-]?(?:(?:0|[1-9][0-9]*)?\.[0-9]+)/u,
            /[+-]?(?:(?:0|[1-9][0-9]*)\.[0-9]*)/u,
            /[+-]?(?:0|[1-9][0-9]*)/u,
        ],
        symbol: {
            match: /(?:[-_.!?+*/<=>%|~^a-zA-Z]|&lt;|&gt;)(?:[-_.!?+*/<=>%|~^a-zA-Z0-9]|&lt;|&gt;)*/u,
            type: moo.keywords({
                'defSym': 'def',
                'fnSym': 'fn',
                'defnSym': 'defn',
                'doSym': 'do',
                'letSym': 'let',
                'ifSym': 'if',
                'condSym': 'cond',
                'caseSym': 'case',
                'forSym': 'for',
                'doseqSym': 'doseq',
                'arrowSym': '->',
                'darrowSym': '->>',
            }),
        },
        keyword: {
            match: /:(?:[-_.!?+*/<=>%|~^a-zA-Z]|&lt;|&gt;)(?:[-_.!?+*/<=>%|~^a-zA-Z0-9]|&lt;|&gt;)*/u,
            value: function (x) { return x.slice(1); },
        },
        dispatch: {
            match: /#(?:[-_.!?+*/<=>%|~^a-zA-Z]|&lt;|&gt;)(?:[-_.!?+*/<=>%|~^a-zA-Z0-9]|&lt;|&gt;)*/u,
            type: moo.keywords({
                'trueLit': '#true',
                'falseLit': '#false',
                'nilLit': '#none',
                'infLit': '#inf',
                'negInfLit': '#-inf',
                'nanLit': '#nan',
            }),
            value: function (x) { return x.slice(1); },
        },
        regex: {
            match: /#"[\s\S]*"/u,
            value: function (x) { return x.slice(2, -1); },
        },
    });
    //# sourceMappingURL=tokenizer.js.map

    // Generated automatically by nearley, version 2.19.2
    // http://github.com/Hardmath123/nearley
    // Bypasses TS6133. Allow declared but unused functions.
    // @ts-ignore
    function id(d) { return d[0]; }
    var grammar = {
        Lexer: lexer,
        ParserRules: [
            { "name": "start", "symbols": ["prog"], "postprocess": id },
            { "name": "prog$ebnf$1", "symbols": [] },
            { "name": "prog$ebnf$1$subexpression$1", "symbols": ["expr", "_"] },
            { "name": "prog$ebnf$1", "symbols": ["prog$ebnf$1", "prog$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "prog", "symbols": ["_", "prog$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 2), vals = _b[1];
                    return mkDo(vals.map(id));
                }
            },
            { "name": "expr", "symbols": ["lit"], "postprocess": id },
            { "name": "expr", "symbols": ["shCutFn"], "postprocess": id },
            { "name": "lit$macrocall$2", "symbols": ["list"] },
            { "name": "lit$macrocall$1", "symbols": [(lexer.has("lparen") ? { type: "lparen" } : lparen), "_", "lit$macrocall$2", (lexer.has("rparen") ? { type: "rparen" } : rparen)] },
            { "name": "lit", "symbols": ["lit$macrocall$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 1), _c = __read(_b[0], 3), _d = __read(_c[2], 1), val = _d[0];
                    return val;
                } },
            { "name": "lit", "symbols": ["vector"], "postprocess": id },
            { "name": "lit", "symbols": ["map"], "postprocess": id },
            { "name": "lit", "symbols": ["quoted"], "postprocess": id },
            { "name": "lit", "symbols": ["optional"], "postprocess": id },
            { "name": "lit", "symbols": ["deref"], "postprocess": id },
            { "name": "lit", "symbols": ["number"], "postprocess": id },
            { "name": "lit", "symbols": ["string"], "postprocess": id },
            { "name": "lit", "symbols": ["regex"], "postprocess": id },
            { "name": "lit", "symbols": ["symbol"], "postprocess": id },
            { "name": "lit", "symbols": ["keyword"], "postprocess": id },
            { "name": "lit", "symbols": ["bool"], "postprocess": id },
            { "name": "vector$macrocall$2$ebnf$1", "symbols": [] },
            { "name": "vector$macrocall$2$ebnf$1$subexpression$1", "symbols": ["expr", "_"] },
            { "name": "vector$macrocall$2$ebnf$1", "symbols": ["vector$macrocall$2$ebnf$1", "vector$macrocall$2$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "vector$macrocall$2", "symbols": ["vector$macrocall$2$ebnf$1"] },
            { "name": "vector$macrocall$1", "symbols": [(lexer.has("lbracket") ? { type: "lbracket" } : lbracket), "_", "vector$macrocall$2", (lexer.has("rbracket") ? { type: "rbracket" } : rbracket)] },
            { "name": "vector", "symbols": ["vector$macrocall$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 1), _c = __read(_b[0], 3), _d = __read(_c[2], 1), vals = _d[0];
                    return mkVector(vals.map(id));
                }
            },
            { "name": "map$macrocall$2$ebnf$1", "symbols": [] },
            { "name": "map$macrocall$2$ebnf$1$subexpression$1", "symbols": ["mapIdentifier", "_", "expr", "_"] },
            { "name": "map$macrocall$2$ebnf$1", "symbols": ["map$macrocall$2$ebnf$1", "map$macrocall$2$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "map$macrocall$2", "symbols": ["map$macrocall$2$ebnf$1"] },
            { "name": "map$macrocall$1", "symbols": [(lexer.has("lbrace") ? { type: "lbrace" } : lbrace), "_", "map$macrocall$2", (lexer.has("rbrace") ? { type: "rbrace" } : rbrace)] },
            { "name": "map", "symbols": ["map$macrocall$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 1), _c = __read(_b[0], 3), _d = __read(_c[2], 1), vals = _d[0];
                    return mkMap(vals.map(function (v) { return [v[0], v[2]]; }));
                }
            },
            { "name": "mapIdentifier", "symbols": ["string"], "postprocess": id },
            { "name": "mapIdentifier", "symbols": ["keyword"], "postprocess": id },
            { "name": "mapIdentifier", "symbols": ["number"], "postprocess": id },
            { "name": "optional", "symbols": [(lexer.has("nilLit") ? { type: "nilLit" } : nilLit)], "postprocess": function () { return mkOptional(null); } },
            { "name": "optional", "symbols": [(lexer.has("amp") ? { type: "amp" } : amp), "expr"], "postprocess": function (_a) {
                    var _b = __read(_a, 2), val = _b[1];
                    return mkOptional(val);
                } },
            { "name": "quoted", "symbols": [(lexer.has("quote") ? { type: "quote" } : quote), "expr"], "postprocess": function (_a) {
                    var _b = __read(_a, 2), quot = _b[1];
                    return mkQuoted(quot);
                } },
            { "name": "deref", "symbols": [(lexer.has("at") ? { type: "at" } : at), "expr"], "postprocess": function (_a) {
                    var _b = __read(_a, 2), expr = _b[1];
                    return mkList(mkSymbol('deref'), [expr]);
                } },
            { "name": "bool", "symbols": [(lexer.has("trueLit") ? { type: "trueLit" } : trueLit)], "postprocess": function () { return mkBool(true); } },
            { "name": "bool", "symbols": [(lexer.has("falseLit") ? { type: "falseLit" } : falseLit)], "postprocess": function () { return mkBool(false); } },
            { "name": "number", "symbols": [(lexer.has("number") ? { type: "number" } : number)], "postprocess": function (_a) {
                    var _b = __read(_a, 1), num = _b[0];
                    return mkNumber(num.value);
                } },
            { "name": "number", "symbols": [(lexer.has("infLit") ? { type: "infLit" } : infLit)], "postprocess": function (_a) {
                    var _b = __read(_a, 1), num = _b[0];
                    return mkNumber(Infinity);
                } },
            { "name": "number", "symbols": [(lexer.has("negInfLit") ? { type: "negInfLit" } : negInfLit)], "postprocess": function (_a) {
                    var _b = __read(_a, 1), num = _b[0];
                    return mkNumber(-Infinity);
                } },
            { "name": "number", "symbols": [(lexer.has("nanLit") ? { type: "nanLit" } : nanLit)], "postprocess": function (_a) {
                    var _b = __read(_a, 1), num = _b[0];
                    return mkNumber(NaN);
                } },
            { "name": "string", "symbols": [(lexer.has("string") ? { type: "string" } : string)], "postprocess": function (_a) {
                    var _b = __read(_a, 1), str = _b[0];
                    return mkString(str.value);
                } },
            { "name": "symbol", "symbols": [(lexer.has("symbol") ? { type: "symbol" } : symbol)], "postprocess": function (_a) {
                    var _b = __read(_a, 1), sym = _b[0];
                    return mkSymbol(sym.value);
                } },
            { "name": "keyword", "symbols": [(lexer.has("keyword") ? { type: "keyword" } : keyword)], "postprocess": function (_a) {
                    var _b = __read(_a, 1), kw = _b[0];
                    return mkKeyword(kw.value);
                } },
            { "name": "regex", "symbols": [(lexer.has("regex") ? { type: "regex" } : regex)], "postprocess": function (_a) {
                    var _b = __read(_a, 1), re = _b[0];
                    return mkRegex(re.value);
                } },
            { "name": "list", "symbols": ["def"], "postprocess": id },
            { "name": "list", "symbols": ["fn"], "postprocess": id },
            { "name": "list", "symbols": ["defn"], "postprocess": id },
            { "name": "list", "symbols": ["do"], "postprocess": id },
            { "name": "list", "symbols": ["let"], "postprocess": id },
            { "name": "list", "symbols": ["if"], "postprocess": id },
            { "name": "list", "symbols": ["case"], "postprocess": id },
            { "name": "list", "symbols": ["cond"], "postprocess": id },
            { "name": "list", "symbols": ["for"], "postprocess": id },
            { "name": "list", "symbols": ["doseq"], "postprocess": id },
            { "name": "list", "symbols": ["threadfirst"], "postprocess": id },
            { "name": "list", "symbols": ["threadlast"], "postprocess": id },
            { "name": "list", "symbols": ["op"], "postprocess": id },
            { "name": "list", "symbols": ["unit"], "postprocess": id },
            { "name": "def", "symbols": [(lexer.has("defSym") ? { type: "defSym" } : defSym), "_", "symbol", "_", "expr", "_"], "postprocess": function (_a) {
                    var _b = __read(_a, 5), ident = _b[2], val = _b[4];
                    return mkDef(ident, val);
                }
            },
            { "name": "fn$macrocall$2$ebnf$1", "symbols": [] },
            { "name": "fn$macrocall$2$ebnf$1$subexpression$1", "symbols": ["symbol", "_"] },
            { "name": "fn$macrocall$2$ebnf$1", "symbols": ["fn$macrocall$2$ebnf$1", "fn$macrocall$2$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "fn$macrocall$2", "symbols": ["fn$macrocall$2$ebnf$1"] },
            { "name": "fn$macrocall$1", "symbols": [(lexer.has("lbracket") ? { type: "lbracket" } : lbracket), "_", "fn$macrocall$2", (lexer.has("rbracket") ? { type: "rbracket" } : rbracket)] },
            { "name": "fn", "symbols": [(lexer.has("fnSym") ? { type: "fnSym" } : fnSym), "_", "fn$macrocall$1", "_", "expr", "_"], "postprocess": function (_a) {
                    var _b = __read(_a, 5), _c = __read(_b[2], 3), params = _c[2], body = _b[4];
                    return mkFunction("fn_" + Math.floor(Math.random() * 2e6), params[0].map(id), body);
                }
            },
            { "name": "defn$macrocall$2$ebnf$1", "symbols": [] },
            { "name": "defn$macrocall$2$ebnf$1$subexpression$1", "symbols": ["symbol", "_"] },
            { "name": "defn$macrocall$2$ebnf$1", "symbols": ["defn$macrocall$2$ebnf$1", "defn$macrocall$2$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "defn$macrocall$2", "symbols": ["defn$macrocall$2$ebnf$1"] },
            { "name": "defn$macrocall$1", "symbols": [(lexer.has("lbracket") ? { type: "lbracket" } : lbracket), "_", "defn$macrocall$2", (lexer.has("rbracket") ? { type: "rbracket" } : rbracket)] },
            { "name": "defn", "symbols": [(lexer.has("defnSym") ? { type: "defnSym" } : defnSym), "_", "symbol", "_", "defn$macrocall$1", "_", "expr", "_"], "postprocess": function (_a) {
                    var _b = __read(_a, 7), ident = _b[2], _c = __read(_b[4], 3), params = _c[2], body = _b[6];
                    return mkDef(ident, mkFunction(ident, params[0].map(id), body));
                }
            },
            { "name": "do$ebnf$1", "symbols": [] },
            { "name": "do$ebnf$1$subexpression$1", "symbols": ["expr", "_"] },
            { "name": "do$ebnf$1", "symbols": ["do$ebnf$1", "do$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "do", "symbols": [(lexer.has("doSym") ? { type: "doSym" } : doSym), "_", "do$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 3), vals = _b[2];
                    return mkDo(vals.map(id));
                }
            },
            { "name": "let$macrocall$2$ebnf$1", "symbols": [] },
            { "name": "let$macrocall$2$ebnf$1$subexpression$1", "symbols": ["symbol", "_", "expr", "_"] },
            { "name": "let$macrocall$2$ebnf$1", "symbols": ["let$macrocall$2$ebnf$1", "let$macrocall$2$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "let$macrocall$2", "symbols": ["let$macrocall$2$ebnf$1"] },
            { "name": "let$macrocall$1", "symbols": [(lexer.has("lbracket") ? { type: "lbracket" } : lbracket), "_", "let$macrocall$2", (lexer.has("rbracket") ? { type: "rbracket" } : rbracket)] },
            { "name": "let$ebnf$1", "symbols": [] },
            { "name": "let$ebnf$1$subexpression$1", "symbols": ["expr", "_"] },
            { "name": "let$ebnf$1", "symbols": ["let$ebnf$1", "let$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "let", "symbols": [(lexer.has("letSym") ? { type: "letSym" } : letSym), "_", "let$macrocall$1", "_", "let$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 5), _c = __read(_b[2], 3), _d = __read(_c[2], 1), params = _d[0], body = _b[4];
                    return mkLet(params.map(function (v) { return [v[0], v[2]]; }), mkDo(body.map(function (v) { return v[0]; })));
                }
            },
            { "name": "if$ebnf$1$subexpression$1", "symbols": ["expr", "_"] },
            { "name": "if$ebnf$1", "symbols": ["if$ebnf$1$subexpression$1"], "postprocess": id },
            { "name": "if$ebnf$1", "symbols": [], "postprocess": function () { return null; } },
            { "name": "if", "symbols": [(lexer.has("ifSym") ? { type: "ifSym" } : ifSym), "_", "expr", "_", "expr", "_", "if$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 7), pred = _b[2], thenClause = _b[4], maybeElseClause = _b[6];
                    return mkIf(pred, thenClause, maybeElseClause
                        ? maybeElseClause[0]
                        : mkUnit());
                }
            },
            { "name": "cond$ebnf$1", "symbols": [] },
            { "name": "cond$ebnf$1$subexpression$1", "symbols": ["expr", "_", "expr", "_"] },
            { "name": "cond$ebnf$1", "symbols": ["cond$ebnf$1", "cond$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "cond", "symbols": [(lexer.has("condSym") ? { type: "condSym" } : condSym), "_", "cond$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 3), vals = _b[2];
                    return mkCond(vals.map(function (v) { return [v[0], v[2]]; }));
                }
            },
            { "name": "case$ebnf$1", "symbols": [] },
            { "name": "case$ebnf$1$subexpression$1", "symbols": ["expr", "_", "expr", "_"] },
            { "name": "case$ebnf$1", "symbols": ["case$ebnf$1", "case$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "case", "symbols": [(lexer.has("caseSym") ? { type: "caseSym" } : caseSym), "_", "symbol", "_", "case$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 5), sym = _b[2], vals = _b[4];
                    return mkCase(sym, vals.map(function (v) { return [v[0], v[2]]; }));
                }
            },
            { "name": "for$macrocall$2$ebnf$1", "symbols": [] },
            { "name": "for$macrocall$2$ebnf$1$subexpression$1", "symbols": ["symbol", "_", "expr", "_"] },
            { "name": "for$macrocall$2$ebnf$1", "symbols": ["for$macrocall$2$ebnf$1", "for$macrocall$2$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "for$macrocall$2", "symbols": ["for$macrocall$2$ebnf$1"] },
            { "name": "for$macrocall$1", "symbols": [(lexer.has("lbracket") ? { type: "lbracket" } : lbracket), "_", "for$macrocall$2", (lexer.has("rbracket") ? { type: "rbracket" } : rbracket)] },
            { "name": "for", "symbols": [(lexer.has("forSym") ? { type: "forSym" } : forSym), "_", "for$macrocall$1", "_", "expr", "_"], "postprocess": function (_a) {
                    var _b = __read(_a, 5), _c = __read(_b[2], 3), _d = __read(_c[2], 1), params = _d[0], body = _b[4];
                    return mkFor(params.map(function (v) { return [v[0], v[2]]; }), body);
                }
            },
            { "name": "doseq$macrocall$2$ebnf$1", "symbols": [] },
            { "name": "doseq$macrocall$2$ebnf$1$subexpression$1", "symbols": ["symbol", "_", "expr", "_"] },
            { "name": "doseq$macrocall$2$ebnf$1", "symbols": ["doseq$macrocall$2$ebnf$1", "doseq$macrocall$2$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "doseq$macrocall$2", "symbols": ["doseq$macrocall$2$ebnf$1"] },
            { "name": "doseq$macrocall$1", "symbols": [(lexer.has("lbracket") ? { type: "lbracket" } : lbracket), "_", "doseq$macrocall$2", (lexer.has("rbracket") ? { type: "rbracket" } : rbracket)] },
            { "name": "doseq", "symbols": [(lexer.has("doseqSym") ? { type: "doseqSym" } : doseqSym), "_", "doseq$macrocall$1", "_", "expr", "_"], "postprocess": function (_a) {
                    var _b = __read(_a, 5), _c = __read(_b[2], 3), _d = __read(_c[2], 1), params = _d[0], body = _b[4];
                    return mkDoseq(params.map(function (v) { return [v[0], v[2]]; }), body);
                }
            },
            { "name": "threadfirst$ebnf$1", "symbols": [] },
            { "name": "threadfirst$ebnf$1$subexpression$1", "symbols": ["expr", "_"] },
            { "name": "threadfirst$ebnf$1", "symbols": ["threadfirst$ebnf$1", "threadfirst$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "threadfirst", "symbols": [(lexer.has("arrowSym") ? { type: "arrowSym" } : arrowSym), "_", "expr", "_", "threadfirst$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 5), val = _b[2], pipes = _b[4];
                    return mkThreadFirst(val, pipes.map(id));
                }
            },
            { "name": "threadlast$ebnf$1", "symbols": [] },
            { "name": "threadlast$ebnf$1$subexpression$1", "symbols": ["expr", "_"] },
            { "name": "threadlast$ebnf$1", "symbols": ["threadlast$ebnf$1", "threadlast$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "threadlast", "symbols": [(lexer.has("darrowSym") ? { type: "darrowSym" } : darrowSym), "_", "expr", "_", "threadlast$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 5), val = _b[2], pipes = _b[4];
                    return mkThreadLast(val, pipes.map(id));
                }
            },
            { "name": "op$ebnf$1$subexpression$1", "symbols": ["expr", "_"] },
            { "name": "op$ebnf$1", "symbols": ["op$ebnf$1$subexpression$1"] },
            { "name": "op$ebnf$1$subexpression$2", "symbols": ["expr", "_"] },
            { "name": "op$ebnf$1", "symbols": ["op$ebnf$1", "op$ebnf$1$subexpression$2"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "op", "symbols": ["op$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 1), vals = _b[0];
                    return mkList(id(id(vals)), vals.slice(1).map(id));
                }
            },
            { "name": "unit", "symbols": ["_"], "postprocess": function () { return mkUnit(); }
            },
            { "name": "shCutFn$ebnf$1$subexpression$1", "symbols": ["lit", "_"] },
            { "name": "shCutFn$ebnf$1", "symbols": ["shCutFn$ebnf$1$subexpression$1"] },
            { "name": "shCutFn$ebnf$1$subexpression$2", "symbols": ["lit", "_"] },
            { "name": "shCutFn$ebnf$1", "symbols": ["shCutFn$ebnf$1", "shCutFn$ebnf$1$subexpression$2"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "shCutFn", "symbols": [(lexer.has("hashParen") ? { type: "hashParen" } : hashParen), "_", "shCutFn$ebnf$1", (lexer.has("rparen") ? { type: "rparen" } : rparen)], "postprocess": function (_a) {
                    var _b = __read(_a, 3), vals = _b[2];
                    var lst = mkList(vals[0][0], vals.slice(1).map(id));
                    return mkShcutFunction("fn_" + Math.floor(Math.random() * 2e6), shcutFuncArity(lst), lst);
                }
            },
            { "name": "_$ebnf$1", "symbols": [] },
            { "name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "_", "symbols": ["_$ebnf$1"], "postprocess": function () { return null; } },
            { "name": "__$ebnf$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)] },
            { "name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "__", "symbols": ["__$ebnf$1"], "postprocess": function () { return null; } }
        ],
        ParserStart: "start",
    };
    //# sourceMappingURL=slang.js.map

    var parseCode = function (code) {
        var p = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        var result = p.feed(code).results;
        if (result.length > 1) {
            console.error('Ambiguous closet grammar', result);
        }
        else if (result.length < 1) {
            console.error('Closet grammar does not match');
        }
        return result[0];
    };
    //# sourceMappingURL=index.js.map

    var mkTypeError = function (types, position) { return ({
        kind: 'TypeError',
        types: types,
        position: position,
    }); };
    var mkArityError = function (argc) { return ({
        kind: 'ArityError',
        argc: argc,
    }); };
    var mkNotExecutableError = function (valueType) { return ({
        kind: 'NotExecutableError',
        valueType: valueType,
    }); };
    var throwException = function (name, e) {
        switch (e.kind) {
            case 'ArityError':
                throw new TypeError([
                    e.kind,
                    name,
                    "Wrong amount of arguments (" + e.argc + ") passed.",
                ].join(': '));
            case 'TypeError':
                throw new TypeError([
                    e.kind,
                    name,
                    "Wrong type(s) of arguments (" + e.types + ") passed for " + e.position + ".",
                ].join(': '));
            case 'NotExecutableError':
                throw new TypeError([
                    e.kind,
                    name,
                    "Value of type (" + e.valueType + ") cannot be executed.",
                ].join(': '));
        }
    };
    var typecheck = function (_a) {
        var f = _a.f, inf = _a.inf, argc = _a.argc, arg0 = _a.arg0, arg1 = _a.arg1, arg2 = _a.arg2, arg3 = _a.arg3, arg4 = _a.arg4, arg5 = _a.arg5, args = _a.args;
        return function (argums, ctx) {
            if (argc && !argc(argums.length)) {
                return mkLeft(mkArityError(argums.length));
            }
            if (arg0 && !arg0(argums[0])) {
                return mkLeft(mkTypeError(argums[0].kind, 1));
            }
            if (arg1 && !arg1(argums[1])) {
                return mkLeft(mkTypeError(argums[1].kind, 2));
            }
            if (arg2 && !arg2(argums[2])) {
                return mkLeft(mkTypeError(argums[2].kind, 3));
            }
            if (arg3 && !arg3(argums[3])) {
                return mkLeft(mkTypeError(argums[3].kind, 4));
            }
            if (arg4 && !arg4(argums[4])) {
                return mkLeft(mkTypeError(argums[4].kind, 5));
            }
            if (arg5 && !arg5(argums[5])) {
                return mkLeft(mkTypeError(argums[5].kind, 6));
            }
            if (args && !args(argums)) {
                return mkLeft(mkTypeError("(" + argums.map(function (v) { return v.kind; }).join(', ') + ")", '*'));
            }
            var exec = inf
                ? inf(argums)
                : f;
            return mkRight(exec(argums, ctx));
        };
    };
    var notExecutable = function (kind) {
        return mkNotExecutableError(kind);
    };
    //# sourceMappingURL=exception.js.map

    var Map$1;
    (function (Map) {
        Map.getFunc = function (_a) {
            var _b = __read(_a, 3), mapArg = _b[0], idx = _b[1], defaultValue = _b[2];
            var key = isString(idx)
                ? idx.value
                //@ts-ignore
                : Symbol.for(idx.value);
            var result = mapArg.table.has(key)
                ? mapArg.table.get(key)
                : defaultValue;
            return result;
        };
        Map.take = function (_a) {
            var _b = __read(_a, 2), count = _b[0], mapArg = _b[1];
            var taken = [];
            mapArg.table.forEach(function (v, k) {
                if (taken.length < count.value) {
                    taken.push([k, v]);
                }
            });
            return mkMap(taken);
        };
        Map.takeWhile = function (_a, ctx) {
            var _b = __read(_a, 2), pred = _b[0], mapArg = _b[1];
            var taken = [];
            var cont = true;
            mapArg.table.forEach(function (v, k) {
                if (cont) {
                    var result = pureToBool(apply(pred, [mkVector([fromMapKey(k), v])], ctx));
                    if (result) {
                        taken.push([k, v]);
                    }
                    else {
                        cont = false;
                    }
                }
            });
            return mkMap(taken);
        };
        Map.drop = function (_a) {
            var _b = __read(_a, 2), count = _b[0], mapArg = _b[1];
            var dropped = [];
            var innerCount = 0;
            mapArg.table.forEach(function (v, k) {
                if (innerCount < count.value) {
                    innerCount++;
                }
                else {
                    dropped.push([k, v]);
                }
            });
            return mkMap(dropped);
        };
        Map.dropWhile = function (_a, ctx) {
            var _b = __read(_a, 2), pred = _b[0], mapArg = _b[1];
            var dropped = [];
            var start = false;
            mapArg.table.forEach(function (v, k) {
                if (start) {
                    dropped.push([k, v]);
                }
                else {
                    start = pureToBool(apply(pred, [mkVector([fromMapKey(k), v])], ctx));
                }
            });
            return mkMap(dropped);
        };
        Map.count = function (_a) {
            var _b = __read(_a, 1), mapArg = _b[0];
            return mkNumber(mapArg.table.size);
        };
        Map.emptyQ = function (_a) {
            var _b = __read(_a, 1), mapArg = _b[0];
            return mkBool(mapArg.table.size === 0);
        };
        Map.anyQ = function (_a, ctx) {
            var _b = __read(_a, 2), pred = _b[0], mapArg = _b[1];
            var result = false;
            mapArg.table.forEach(function (v, k) {
                result = result || pureToBool(apply(pred, [mkVector([fromMapKey(k), v])], ctx));
            });
            return mkBool(result);
        };
        Map.everyQ = function (_a, ctx) {
            var _b = __read(_a, 2), pred = _b[0], mapArg = _b[1];
            var result = true;
            mapArg.table.forEach(function (v, k) {
                result = result && pureToBool(apply(pred, [mkVector([fromMapKey(k), v])], ctx));
            });
            return mkBool(result);
        };
        Map.map = function (_a, ctx) {
            var _b = __read(_a), func = _b[0], headMap = _b[1], otherMaps = _b.slice(2);
            var result = [];
            headMap.table.forEach(function (v, k) {
                var e_1, _a;
                var allHaveKey = true;
                try {
                    for (var otherMaps_1 = __values(otherMaps), otherMaps_1_1 = otherMaps_1.next(); !otherMaps_1_1.done; otherMaps_1_1 = otherMaps_1.next()) {
                        var m = otherMaps_1_1.value;
                        allHaveKey = allHaveKey && m.table.has(k);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (otherMaps_1_1 && !otherMaps_1_1.done && (_a = otherMaps_1.return)) _a.call(otherMaps_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (allHaveKey) {
                    var theKey_1 = fromMapKey(k);
                    result.push([theKey_1, apply(func, __spread([
                            mkVector([theKey_1, v])
                        ], otherMaps.map(function (m) { return mkVector([theKey_1, m.table.get(k)]); })), ctx)]);
                }
            });
            return mkMap(result);
        };
        Map.filter = function (_a, ctx) {
            var _b = __read(_a, 2), func = _b[0], map = _b[1];
            var result = [];
            map.table.forEach(function (v, k) {
                var theKey = fromMapKey(k);
                if (pureToBool(apply(func, [mkVector([theKey, v])], ctx))) {
                    result.push([theKey, v]);
                }
            });
            return mkMap(result);
        };
        Map.foldl = function (_a, ctx) {
            var e_2, _b;
            var _c = __read(_a, 3), func = _c[0], accu = _c[1], map = _c[2];
            var result = accu;
            try {
                for (var _d = __values(map.table), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = __read(_e.value, 2), key = _f[0], value = _f[1];
                    var theKey = fromMapKey(key);
                    result = apply(func, [result, mkVector([theKey, value])], ctx);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return result;
        };
        Map.foldr = function (_a, ctx) {
            var _b = __read(_a, 3), func = _b[0], accu = _b[1], map = _b[2];
            var iterator = map.table[Symbol.iterator]();
            var pureFoldr = function (it) {
                var nextValue = it.next();
                if (nextValue.done) {
                    return accu;
                }
                else {
                    var _a = __read(nextValue.value, 2), key = _a[0], value = _a[1];
                    return apply(func, [mkVector([fromMapKey(key), value]), pureFoldr(it)], ctx);
                }
            };
            //@ts-ignore
            var result = pureFoldr(iterator);
            return result;
        };
    })(Map$1 || (Map$1 = {}));
    var Vector;
    (function (Vector) {
        Vector.getFunc = function (_a) {
            var _b = __read(_a, 3), seqArg = _b[0], idx = _b[1], defaultValue = _b[2];
            var _c;
            var result = (_c = seqArg.members[idx.value]) !== null && _c !== void 0 ? _c : defaultValue;
            return result;
        };
        Vector.vector = function (_a) {
            var _b = __read(_a), values = _b.slice(0);
            return mkVector(values);
        };
        Vector.take = function (_a) {
            var _b = __read(_a, 2), count = _b[0], vectorArg = _b[1];
            var taken = [];
            for (var i = 0; i < count.value; i++) {
                if (vectorArg.members[i]) {
                    taken.push(vectorArg.members[i]);
                }
            }
            return mkVector(taken);
        };
        Vector.takeWhile = function (_a, ctx) {
            var _b = __read(_a, 2), pred = _b[0], vectorArg = _b[1];
            var taken = [];
            var cont = true;
            for (var i = 0; i < vectorArg.members.length && cont; i++) {
                if (pureToBool(apply(pred, [vectorArg.members[i]], ctx))) {
                    taken.push(vectorArg.members[i]);
                }
                else {
                    cont = false;
                }
            }
            return mkVector(taken);
        };
        Vector.drop = function (_a) {
            var _b = __read(_a, 2), count = _b[0], vectorArg = _b[1];
            var dropped = [];
            for (var i = 0; i < vectorArg.members.length; i++) {
                if (i >= count.value) {
                    dropped.push(vectorArg.members[i]);
                }
            }
            return mkVector(dropped);
        };
        Vector.dropWhile = function (_a, ctx) {
            var _b = __read(_a, 2), pred = _b[0], vectorArg = _b[1];
            var dropped = [];
            var start = false;
            for (var i = 0; i < vectorArg.members.length; i++) {
                if (start) {
                    dropped.push(vectorArg.members[i]);
                }
                else {
                    if (!pureToBool(apply(pred, [vectorArg.members[i]], ctx))) {
                        dropped.push(vectorArg.members[i]);
                        start = true;
                    }
                }
            }
            return mkVector(dropped);
        };
        Vector.count = function (_a) {
            var _b = __read(_a, 1), vectorArg = _b[0];
            return mkNumber(vectorArg.members.length);
        };
        Vector.emptyQ = function (_a) {
            var _b = __read(_a, 1), vectorArg = _b[0];
            return mkBool(vectorArg.members.length === 0);
        };
        Vector.anyQ = function (_a, ctx) {
            var e_3, _b;
            var _c = __read(_a, 2), pred = _c[0], vectorArg = _c[1];
            var result = false;
            try {
                for (var _d = __values(vectorArg.members), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var m = _e.value;
                    result = result || pureToBool(apply(pred, [m], ctx));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return mkBool(result);
        };
        Vector.everyQ = function (_a, ctx) {
            var e_4, _b;
            var _c = __read(_a, 2), pred = _c[0], vectorArg = _c[1];
            var result = true;
            try {
                for (var _d = __values(vectorArg.members), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var m = _e.value;
                    result = result && pureToBool(apply(pred, [m], ctx));
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return mkBool(result);
        };
        Vector.map = function (_a, ctx) {
            var e_5, _b;
            var _c = __read(_a), func = _c[0], headVector = _c[1], otherVectors = _c.slice(2);
            var result = [];
            var _loop_1 = function (i, entry) {
                var e_6, _a;
                var allHaveKey = true;
                try {
                    for (var otherVectors_1 = (e_6 = void 0, __values(otherVectors)), otherVectors_1_1 = otherVectors_1.next(); !otherVectors_1_1.done; otherVectors_1_1 = otherVectors_1.next()) {
                        var v = otherVectors_1_1.value;
                        allHaveKey = allHaveKey && (v.members.length >= i);
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (otherVectors_1_1 && !otherVectors_1_1.done && (_a = otherVectors_1.return)) _a.call(otherVectors_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                if (allHaveKey) {
                    result.push(apply(func, __spread([entry], otherVectors.map(function (v) { return v.members[i]; })), ctx));
                }
            };
            try {
                for (var _d = __values(headVector.members.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = __read(_e.value, 2), i = _f[0], entry = _f[1];
                    _loop_1(i, entry);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return mkVector(result);
        };
        Vector.filter = function (_a, ctx) {
            var e_7, _b;
            var _c = __read(_a, 2), func = _c[0], vector = _c[1];
            var result = [];
            try {
                for (var _d = __values(vector.members), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var v = _e.value;
                    if (pureToBool(apply(func, [v], ctx))) {
                        result.push(v);
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_7) throw e_7.error; }
            }
            return mkVector(result);
        };
        Vector.foldl = function (_a, ctx) {
            var e_8, _b;
            var _c = __read(_a, 3), func = _c[0], accu = _c[1], vector = _c[2];
            var result = accu;
            try {
                for (var _d = __values(vector.members), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var value = _e.value;
                    result = apply(func, [result, value], ctx);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_8) throw e_8.error; }
            }
            return result;
        };
        Vector.foldr = function (_a, ctx) {
            var _b = __read(_a, 3), func = _b[0], accu = _b[1], vector = _b[2];
            var iterator = vector.members[Symbol.iterator]();
            var pureFoldr = function (it) {
                var nextValue = it.next();
                return nextValue.done
                    ? accu
                    : apply(func, [nextValue.value, pureFoldr(it)], ctx);
            };
            var result = pureFoldr(iterator);
            return result;
        };
        Vector.fzip = function (_a) {
            var _b = __read(_a), vectors = _b.slice(0);
            return Vector.flat([mkVector(vectors)]);
        };
        Vector.flat = function (_a) {
            var e_9, _b;
            var _c = __read(_a, 1), vector = _c[0];
            var results = [];
            try {
                for (var _d = __values(vector.members), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var value = _e.value;
                    if (isVector(value)) {
                        results.push.apply(results, __spread(value.members));
                    }
                    else {
                        results.push(value);
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_9) throw e_9.error; }
            }
            return mkVector(results);
        };
        Vector.bind = function (_a, ctx) {
            var _b = __read(_a), func = _b[0], headVector = _b[1], otherVectors = _b.slice(2);
            var arg = otherVectors.length === 0
                ? headVector
                : Vector.fzip(__spread([headVector], otherVectors));
            return Vector.flat([Vector.map([func, arg], ctx)]);
        };
    })(Vector || (Vector = {}));
    var List;
    (function (List) {
        List.getFunc = function (_a) {
            var _b = __read(_a, 3), seqArg = _b[0], idx = _b[1], defaultValue = _b[2];
            var _c;
            return idx.value === 0
                ? seqArg.head
                //@ts-ignore
                : ((_c = seqArg.tail[idx.value - 1]) !== null && _c !== void 0 ? _c : defaultValue);
        };
        List.list = function (_a) {
            var _b = __read(_a), head = _b[0], values = _b.slice(1);
            return mkList(head, values);
        };
        List.take = function (_a) {
            var _b = __read(_a, 2), count = _b[0], listArg = _b[1];
            var taken = [];
            if (count.value <= 0) {
                return mkUnit();
            }
            else {
                taken.push(listArg.head);
                for (var i = 0; i < count.value - 1; i++) {
                    if (listArg.tail[i]) {
                        taken.push(listArg.tail[i]);
                    }
                }
            }
            return mkList(taken[0], taken.slice(1));
        };
        List.takeWhile = function (_a, ctx) {
            var _b = __read(_a, 2), pred = _b[0], listArg = _b[1];
            var taken = [];
            var cont = true;
            if (!pureToBool(apply(pred, [listArg.head], ctx))) {
                return mkUnit();
            }
            else {
                taken.push(listArg.head);
                for (var i = 0; i < listArg.tail.length && cont; i++) {
                    if (pureToBool(apply(pred, [listArg.tail[i]], ctx))) {
                        taken.push(listArg.tail[i]);
                    }
                    else {
                        cont = false;
                    }
                }
            }
            return mkList(taken[0], taken.slice(1));
        };
        List.drop = function (_a) {
            var _b = __read(_a, 2), count = _b[0], listArg = _b[1];
            var dropped = [];
            if (count.value === 0) {
                dropped.push(listArg.head);
            }
            for (var i = 0; i < listArg.tail.length; i++) {
                if (i >= count.value - 1) {
                    dropped.push(listArg.tail[i]);
                }
            }
            return dropped.length === 0
                ? mkUnit()
                : mkList(dropped[0], dropped.slice(1));
        };
        List.dropWhile = function (_a, ctx) {
            var _b = __read(_a, 2), pred = _b[0], listArg = _b[1];
            var dropped = [];
            var start = false;
            if (!pureToBool(apply(pred, [listArg.head], ctx))) {
                dropped.push(listArg.head);
                start = true;
            }
            for (var i = 0; i < listArg.tail.length; i++) {
                if (start) {
                    dropped.push(listArg.tail[i]);
                }
                else {
                    if (!pureToBool(apply(pred, [listArg.tail[i]], ctx))) {
                        dropped.push(listArg.tail[i]);
                        start = true;
                    }
                }
            }
            return dropped.length === 0
                ? mkUnit()
                : mkList(dropped[0], dropped.slice(1));
        };
        List.count = function (_a) {
            var _b = __read(_a, 1), listArg = _b[0];
            return mkNumber(listArg.tail.length);
        };
        List.emptyQ = function (_a) {
            var _b = __read(_a, 1), listArg = _b[0];
            return mkBool(listArg.tail.length === 0);
        };
        List.anyQ = function (_a, ctx) {
            var e_10, _b;
            var _c = __read(_a, 2), pred = _c[0], listArg = _c[1];
            var result = false;
            try {
                for (var _d = __values(listArg.tail), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var m = _e.value;
                    result = result || pureToBool(apply(pred, [m], ctx));
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_10) throw e_10.error; }
            }
            return mkBool(result);
        };
        List.everyQ = function (_a, ctx) {
            var e_11, _b;
            var _c = __read(_a, 2), pred = _c[0], listArg = _c[1];
            var result = true;
            try {
                for (var _d = __values(listArg.tail), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var m = _e.value;
                    result = result && pureToBool(apply(pred, [m], ctx));
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_11) throw e_11.error; }
            }
            return mkBool(result);
        };
        List.map = function (_a, ctx) {
            var e_12, _b;
            var _c = __read(_a), func = _c[0], headList = _c[1], otherLists = _c.slice(2);
            var result = [];
            var _loop_2 = function (i, entry) {
                var e_13, _a;
                var allHaveKey = true;
                try {
                    for (var otherLists_1 = (e_13 = void 0, __values(otherLists)), otherLists_1_1 = otherLists_1.next(); !otherLists_1_1.done; otherLists_1_1 = otherLists_1.next()) {
                        var v = otherLists_1_1.value;
                        allHaveKey = allHaveKey && (v.tail.length >= i);
                    }
                }
                catch (e_13_1) { e_13 = { error: e_13_1 }; }
                finally {
                    try {
                        if (otherLists_1_1 && !otherLists_1_1.done && (_a = otherLists_1.return)) _a.call(otherLists_1);
                    }
                    finally { if (e_13) throw e_13.error; }
                }
                if (allHaveKey) {
                    result.push(apply(func, __spread([entry], otherLists.map(function (v) { return v.tail[i]; })), ctx));
                }
            };
            try {
                for (var _d = __values(headList.tail.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = __read(_e.value, 2), i = _f[0], entry = _f[1];
                    _loop_2(i, entry);
                }
            }
            catch (e_12_1) { e_12 = { error: e_12_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_12) throw e_12.error; }
            }
            return mkList(headList.head, result);
        };
        List.filter = function (_a, ctx) {
            var e_14, _b;
            var _c = __read(_a, 2), func = _c[0], list = _c[1];
            var result = [];
            try {
                for (var _d = __values(list.tail), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var v = _e.value;
                    if (pureToBool(apply(func, [v], ctx))) {
                        result.push(v);
                    }
                }
            }
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_14) throw e_14.error; }
            }
            return mkList(list.head, result);
        };
        List.foldl = function (_a, ctx) {
            var e_15, _b;
            var _c = __read(_a, 3), func = _c[0], accu = _c[1], list = _c[2];
            var result = accu;
            try {
                for (var _d = __values(list.tail), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var value = _e.value;
                    result = apply(func, [result, value], ctx);
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_15) throw e_15.error; }
            }
            return result;
        };
        List.foldr = function (_a, ctx) {
            var _b = __read(_a, 3), func = _b[0], accu = _b[1], list = _b[2];
            var iterator = list.tail[Symbol.iterator]();
            var pureFoldr = function (it) {
                var nextValue = it.next();
                return nextValue.done
                    ? accu
                    : apply(func, [nextValue.value, pureFoldr(it)], ctx);
            };
            var result = pureFoldr(iterator);
            return result;
        };
        List.flat = function (_a) {
            var e_16, _b;
            var _c = __read(_a, 1), list = _c[0];
            var results = [];
            try {
                for (var _d = __values(list.tail), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var value = _e.value;
                    if (isList(value)) {
                        results.push.apply(results, __spread(value.tail));
                    }
                    else {
                        results.push(value);
                    }
                }
            }
            catch (e_16_1) { e_16 = { error: e_16_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_16) throw e_16.error; }
            }
            return mkList(list.head, results);
        };
    })(List || (List = {}));
    var Optional;
    (function (Optional) {
        Optional.getFunc = function (_a) {
            var _b = __read(_a, 3), seqArg = _b[0], idx = _b[1], defaultValue = _b[2];
            var _c;
            return idx.value
                ? (_c = seqArg.boxed) !== null && _c !== void 0 ? _c : defaultValue : defaultValue;
        };
        Optional.optional = function (_a) {
            var _b = __read(_a), values = _b.slice(0);
            var _c;
            return mkOptional((_c = values[0]) !== null && _c !== void 0 ? _c : null);
        };
        Optional.count = function (_a) {
            var _b = __read(_a, 1), optionalArg = _b[0];
            return mkNumber(optionalArg.boxed === null ? 0 : 1);
        };
        Optional.emptyQ = function (_a) {
            var _b = __read(_a, 1), optionalArg = _b[0];
            return mkBool(optionalArg.boxed === null);
        };
        Optional.anyQ = function (_a, ctx) {
            var _b = __read(_a, 2), pred = _b[0], optionalArg = _b[1];
            var result = false;
            if (optionalArg.boxed) {
                result = result || pureToBool(apply(pred, [optionalArg.boxed], ctx));
            }
            return mkBool(result);
        };
        Optional.everyQ = function (_a, ctx) {
            var _b = __read(_a, 2), pred = _b[0], optionalArg = _b[1];
            var result = true;
            if (optionalArg.boxed) {
                result = result && pureToBool(apply(pred, [optionalArg.boxed], ctx));
            }
            return mkBool(result);
        };
        Optional.map = function (_a, ctx) {
            var e_17, _b;
            var _c = __read(_a), func = _c[0], headOptional = _c[1], otherOptionals = _c.slice(2);
            var result = null;
            if (headOptional.boxed) {
                var allHaveKey = true;
                try {
                    for (var otherOptionals_1 = __values(otherOptionals), otherOptionals_1_1 = otherOptionals_1.next(); !otherOptionals_1_1.done; otherOptionals_1_1 = otherOptionals_1.next()) {
                        var v = otherOptionals_1_1.value;
                        allHaveKey = allHaveKey && (v.boxed !== null);
                    }
                }
                catch (e_17_1) { e_17 = { error: e_17_1 }; }
                finally {
                    try {
                        if (otherOptionals_1_1 && !otherOptionals_1_1.done && (_b = otherOptionals_1.return)) _b.call(otherOptionals_1);
                    }
                    finally { if (e_17) throw e_17.error; }
                }
                if (allHaveKey) {
                    result = apply(func, __spread([headOptional.boxed], otherOptionals.map(function (v) { return v.boxed; })), ctx);
                }
            }
            return mkOptional(result);
        };
        Optional.filter = function (_a, ctx) {
            var _b = __read(_a, 2), func = _b[0], optional = _b[1];
            var result = null;
            if (optional.boxed) {
                if (pureToBool(apply(func, [optional.boxed], ctx))) {
                    result = optional.boxed;
                }
            }
            return mkOptional(result);
        };
        Optional.foldl = function (_a, ctx) {
            var _b = __read(_a, 3), func = _b[0], accu = _b[1], optional = _b[2];
            var result = accu;
            if (optional.boxed) {
                result = apply(func, [result, optional.boxed], ctx);
            }
            return result;
        };
        Optional.foldr = function (_a, ctx) {
            var _b = __read(_a, 3), func = _b[0], accu = _b[1], optional = _b[2];
            var result = accu;
            if (optional.boxed) {
                result = apply(func, [optional.boxed, result], ctx);
            }
            return result;
        };
        Optional.fzip = function (_a) {
            var e_18, _b;
            var _c = __read(_a), optionals = _c.slice(0);
            var result = mkVector([]);
            try {
                for (var optionals_1 = __values(optionals), optionals_1_1 = optionals_1.next(); !optionals_1_1.done; optionals_1_1 = optionals_1.next()) {
                    var opt = optionals_1_1.value;
                    if (!opt.boxed) {
                        result = null;
                        break;
                    }
                    result.members.push(opt.boxed);
                }
            }
            catch (e_18_1) { e_18 = { error: e_18_1 }; }
            finally {
                try {
                    if (optionals_1_1 && !optionals_1_1.done && (_b = optionals_1.return)) _b.call(optionals_1);
                }
                finally { if (e_18) throw e_18.error; }
            }
            return mkOptional(result);
        };
        Optional.flat = function (_a) {
            var _b = __read(_a, 1), optional = _b[0];
            return optional.boxed && isOptional(optional.boxed)
                ? optional.boxed
                : optional;
        };
        Optional.bind = function (_a, ctx) {
            var _b = __read(_a), func = _b[0], headOptional = _b[1], otherOptionals = _b.slice(2);
            var arg = otherOptionals.length === 0
                ? headOptional
                : Optional.fzip(__spread([headOptional], otherOptionals));
            return Optional.flat([Optional.map([func, arg], ctx)]);
        };
    })(Optional || (Optional = {}));
    var indexing = function (_a) {
        var _b = __read(_a, 2), listArg = _b[0], idx = _b[1];
        var _c;
        return mkOptional((_c = listArg.members[idx.value]) !== null && _c !== void 0 ? _c : null);
    };
    //# sourceMappingURL=seq.js.map

    var reshape = function (arr, columnSize) {
        var currIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currIndex = 0;
                    _a.label = 1;
                case 1:
                    if (!(arr.length >= currIndex + columnSize)) return [3 /*break*/, 3];
                    return [4 /*yield*/, arr.slice(currIndex, currIndex + columnSize)];
                case 2:
                    _a.sent();
                    currIndex += columnSize;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    //# sourceMappingURL=utils.js.map

    var indexing$1 = function (_a) {
        var _b = __read(_a, 2), mapArg = _b[0], idx = _b[1];
        var key = isString(idx)
            ? idx.value
            : Symbol.for(idx.value);
        var maybeResult = mapArg.table.get(key);
        return mkOptional(maybeResult !== null && maybeResult !== void 0 ? maybeResult : null);
    };
    var containsQ = function (_a) {
        var _b = __read(_a, 2), mapArg = _b[0], idx = _b[1];
        var key = isString(idx)
            ? idx.value
            : Symbol.for(idx.value);
        var result = mkBool(mapArg.table.has(key));
        return result;
    };
    var find = function (_a) {
        var _b = __read(_a, 2), mapArg = _b[0], idx = _b[1];
        var key = isString(idx)
            ? idx.value
            : Symbol.for(idx.value);
        return mapArg.table.has(key)
            ? mkOptional(mkVector([idx, mapArg.table.get(key)]))
            : mkOptional(null);
    };
    var keys = function (_a) {
        var _b = __read(_a, 1), mapArg = _b[0];
        var keys = [];
        mapArg.table.forEach(function (_v, k) {
            if (typeof k === 'symbol') {
                //@ts-ignore
                keys.push(mkKeyword(k.description));
            }
            else if (typeof k === 'string') {
                keys.push(mkString(k));
            }
        });
        return mkVector(keys);
    };
    var vals = function (_a) {
        var _b = __read(_a, 1), mapArg = _b[0];
        var keys = [];
        mapArg.table.forEach(function (v, _k) {
            keys.push(v);
        });
        return mkVector(keys);
    };
    var merge = function (_a) {
        var e_1, _b, e_2, _c;
        var _d = __read(_a), maps = _d.slice(0);
        var newMap = new Map();
        try {
            for (var maps_1 = __values(maps), maps_1_1 = maps_1.next(); !maps_1_1.done; maps_1_1 = maps_1.next()) {
                var map = maps_1_1.value;
                try {
                    for (var _e = (e_2 = void 0, __values(map.table)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var _g = __read(_f.value, 2), key = _g[0], value = _g[1];
                        newMap.set(key, value);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (maps_1_1 && !maps_1_1.done && (_b = maps_1.return)) _b.call(maps_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return mkMapDirect(newMap);
    };
    var mergeWith = function (_a, ctx) {
        var e_3, _b, e_4, _c, e_5, _d;
        var _e = __read(_a), func = _e[0], headMap = _e[1], args = _e.slice(2);
        var newMap = new Map();
        try {
            for (var _f = __values(headMap.table), _g = _f.next(); !_g.done; _g = _f.next()) {
                var _h = __read(_g.value, 2), key = _h[0], value = _h[1];
                newMap.set(key, value);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                var map = args_1_1.value;
                try {
                    for (var _j = (e_5 = void 0, __values(map.table)), _l = _j.next(); !_l.done; _l = _j.next()) {
                        var _m = __read(_l.value, 2), key = _m[0], value = _m[1];
                        if (newMap.has(key)) {
                            newMap.set(key, apply(func, [newMap.get(key), value], ctx));
                        }
                        else {
                            newMap.set(key, value);
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_l && !_l.done && (_d = _j.return)) _d.call(_j);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (args_1_1 && !args_1_1.done && (_c = args_1.return)) _c.call(args_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return mkMapDirect(newMap);
    };
    var assoc = function (_a) {
        var e_6, _b, e_7, _c;
        var _d = __read(_a), headMap = _d[0], args = _d.slice(1);
        var newMap = new Map();
        try {
            for (var _e = __values(headMap.table), _f = _e.next(); !_f.done; _f = _e.next()) {
                var _g = __read(_f.value, 2), key = _g[0], value = _g[1];
                newMap.set(key, value);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_6) throw e_6.error; }
        }
        try {
            for (var _h = __values(reshape(args, 2)), _j = _h.next(); !_j.done; _j = _h.next()) {
                var _l = __read(_j.value, 2), key = _l[0], value = _l[1];
                newMap.set(toMapKey(key), value);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return mkMapDirect(newMap);
    };
    var dissoc = function (_a) {
        var e_8, _b;
        var _c = __read(_a), headMap = _c[0], args = _c.slice(1);
        var newMap = new Map();
        var badKeys = args.map(function (a) { return toMapKey(a); });
        var _loop_1 = function (key, value) {
            if (!badKeys.some(function (bk) { return bk === key; })) {
                newMap.set(key, value);
            }
        };
        try {
            for (var _d = __values(headMap.table), _e = _d.next(); !_e.done; _e = _d.next()) {
                var _f = __read(_e.value, 2), key = _f[0], value = _f[1];
                _loop_1(key, value);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
            }
            finally { if (e_8) throw e_8.error; }
        }
        return mkMapDirect(newMap);
    };
    var hashMap = function (_a) {
        var e_9, _b;
        var _c = __read(_a), args = _c.slice(0);
        var newMap = new Map();
        try {
            for (var _d = __values(reshape(args, 2)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var _f = __read(_e.value, 2), key = _f[0], value = _f[1];
                newMap.set(toMapKey(key), value);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return mkMapDirect(newMap);
    };
    //# sourceMappingURL=map.js.map

    var apply = function (func, args, ctx) {
        var result = func.apply(args, ctx);
        if (isOk(result)) {
            return result.value;
        }
        throwException(func.name, result.error);
    };
    var adapt = function (sl) {
        return isEither(sl)
            ? sl
            : mkRight(sl);
    };
    var wrap = function (name, func) { return function (ctx) { return (mkArmedFunction(name, function (args) { return adapt(func(args.map(function (t) { return execute(t, ctx); }), ctx)); })); }; };
    var armFunc = function (func, creationCtx) { return (mkArmedFunction(func.name, typecheck({
        f: function (args) { return execute(func.body, joinEnvs(creationCtx, createEnv(func.params, args.map(function (t) { return execute(t, creationCtx); })))); },
        argc: function (count) { return count === func.params.length; },
    }))); };
    var armShcut = function (func, creationCtx) { return (mkArmedFunction(func.name, typecheck({
        f: function (args) { return execute(func.body, joinEnvs(creationCtx, createNumberedEnv(args.map(function (t) { return execute(t, creationCtx); })))); },
        argc: function (count) { return count === func.params; },
    }))); };
    var armNumber = function (num) {
        return mkArmedFunction('number-index', typecheck({
            f: function (_a) {
                var _b = __read(_a, 1), val = _b[0];
                return indexing([val, num]);
            },
            argc: function (count) { return count === 1; },
            arg0: function (s) { return isVector(s); },
        }));
    };
    var armMapKey = function (mk) {
        return mkArmedFunction('keyword-index', typecheck({
            f: function (_a) {
                var _b = __read(_a, 1), val = _b[0];
                return indexing$1([val, mk]);
            },
            argc: function (count) { return count === 1; },
            arg0: function (s) { return isMap(s); },
        }));
    };
    var arm = function (exec, ctx) { return (isArmedFunction(exec)
        ? exec
        : isFunction(exec)
            ? armFunc(exec, ctx)
            : isShcutFunction(exec)
                ? armShcut(exec, ctx)
                : isNumber(exec)
                    ? armNumber(exec)
                    : isMapKey(exec)
                        ? armMapKey(exec)
                        // : isVector(exec)
                        // ? armVector(exec)
                        // : isMap(exec)
                        // ? armMap(exec)
                        : throwException('list', notExecutable(exec.kind))); };
    var fire = function (exec, ctx, args) {
        return apply(arm(exec, ctx), args, ctx);
    };
    //# sourceMappingURL=functions.js.map

    var identity = function (_a) {
        var _b = __read(_a, 1), val = _b[0];
        return val;
    };
    var constant2 = function (_a) {
        var _b = __read(_a, 2), val = _b[0], _throwaway = _b[1];
        return val;
    };
    var constant1 = function (_a, ctx) {
        var _b = __read(_a, 1), val = _b[0];
        return arm(wrap('constant1', function () { return val; })(ctx), ctx);
    };
    var wrappedIdentity = wrap('identity', typecheck({
        f: identity,
        argc: function (count) { return count === 1; },
    }));
    var wrappedConstant = wrap('constant', typecheck({
        inf: function (args) { return args.length == 2
            ? constant2
            : constant1; },
        argc: function (count) { return count <= 2; },
    }));
    //# sourceMappingURL=combinators.js.map

    var twoValueCompare = function (val1, val2) {
        if (val1.kind !== val2.kind) {
            return false;
        }
        else if (val1.kind == SlangType.Unit) {
            return true;
        }
        else if (val1.kind === SlangType.Bool ||
            val1.kind === SlangType.Number ||
            val1.kind === SlangType.Symbol ||
            val1.kind === SlangType.Keyword ||
            val1.kind === SlangType.String) {
            //@ts-ignore
            return val1.value === val2.value;
        }
        else if (val1.kind === SlangType.List) {
            //@ts-ignore
            if (val1.tail.length !== val2.tail.length) {
                return false;
            }
            //@ts-ignore
            var check = twoValueCompare(val1.head, val2.head);
            for (var i = 0; i < val1.tail.length; i++) {
                if (!check) {
                    return false;
                }
                //@ts-ignore
                check = twoValueCompare(val1.tail[i], val2.tail[i]);
            }
            return check;
        }
        else if (val1.kind === SlangType.Vector) {
            //@ts-ignore
            if (val1.members.length !== val2.members.length) {
                return false;
            }
            //@ts-ignore
            var check = true;
            for (var i = 0; i < val1.members.length; i++) {
                if (!check) {
                    return false;
                }
                //@ts-ignore
                check = twoValueCompare(val1.members[i], val2.members[i]);
            }
            return check;
        }
        else if (val1.kind === SlangType.Map) {
            //@ts-ignore
            if (val1.table.size !== val2.table.size) {
                return false;
            }
            var result_1 = true;
            val1.table.forEach(function (value, key) {
                //@ts-ignore
                if (!val2.table.has(key)) {
                    result_1 = false;
                }
                //@ts-ignore
                result_1 = result_1 && twoValueCompare(val2.table.get(key), value);
            });
            return result_1;
        }
        else if (val1.kind === SlangType.Quoted) {
            //@ts-ignore
            return twoValueCompare(val1.quoted, val2.quoted);
        }
        else if (val1.kind === SlangType.Optional) {
            if (val1.boxed === null) {
                //@ts-ignore
                if (val2.boxed === null) {
                    return true;
                }
                return false;
            }
            //@ts-ignore
            return twoValueCompare(val1.boxed, val2.boxed);
        }
        else /* val1.kind === SlangType.Function */ {
            return false;
        }
    };
    var equality = function (vals) {
        var e_1, _a;
        var headValue = vals.shift();
        var result = true;
        try {
            for (var vals_1 = __values(vals), vals_1_1 = vals_1.next(); !vals_1_1.done; vals_1_1 = vals_1.next()) {
                var val = vals_1_1.value;
                result = result && twoValueCompare(headValue, val);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (vals_1_1 && !vals_1_1.done && (_a = vals_1.return)) _a.call(vals_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return mkBool(result);
    };
    var unequality = function (vals) {
        var e_2, _a;
        var headValue = vals.shift();
        var result = false;
        try {
            for (var vals_2 = __values(vals), vals_2_1 = vals_2.next(); !vals_2_1.done; vals_2_1 = vals_2.next()) {
                var val = vals_2_1.value;
                result = result || twoValueCompare(headValue, val);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (vals_2_1 && !vals_2_1.done && (_a = vals_2.return)) _a.call(vals_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return mkBool(result);
    };
    //# sourceMappingURL=equality.js.map

    var and = function (args) {
        var e_1, _a;
        var conj = true;
        try {
            for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                var arg = args_1_1.value;
                conj = conj && toBool(arg).value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return mkBool(conj);
    };
    var or = function (args) {
        var e_2, _a;
        var disj = false;
        try {
            for (var args_2 = __values(args), args_2_1 = args_2.next(); !args_2_1.done; args_2_1 = args_2.next()) {
                var arg = args_2_1.value;
                disj = disj || toBool(arg).value;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (args_2_1 && !args_2_1.done && (_a = args_2.return)) _a.call(args_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return mkBool(disj);
    };
    var not = function (args) {
        var headArg = args[0];
        return mkBool(!toBool(headArg).value);
    };
    //# sourceMappingURL=bool.js.map

    var addition = function (args) {
        var e_1, _a;
        var sum = 0;
        try {
            for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                var arg = args_1_1.value;
                sum += arg.value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return mkNumber(sum);
    };
    var subtraction = function (_a) {
        var e_2, _b;
        var _c = __read(_a), headArg = _c[0], args = _c.slice(1);
        var diff = headArg.value;
        try {
            for (var args_2 = __values(args), args_2_1 = args_2.next(); !args_2_1.done; args_2_1 = args_2.next()) {
                var arg = args_2_1.value;
                diff -= arg.value;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (args_2_1 && !args_2_1.done && (_b = args_2.return)) _b.call(args_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return mkNumber(diff);
    };
    var multiplication = function (args) {
        var e_3, _a;
        var prod = 1;
        try {
            for (var args_3 = __values(args), args_3_1 = args_3.next(); !args_3_1.done; args_3_1 = args_3.next()) {
                var arg = args_3_1.value;
                prod *= arg.value;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (args_3_1 && !args_3_1.done && (_a = args_3.return)) _a.call(args_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return mkNumber(prod);
    };
    var division = function (_a) {
        var e_4, _b;
        var _c = __read(_a), headArg = _c[0], args = _c.slice(1);
        var quot = headArg.value;
        try {
            for (var _d = __values(args.slice(1)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var arg = _e.value;
                quot /= arg.value;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return mkNumber(quot);
    };
    var ge = function (_a) {
        var e_5, _b;
        var _c = __read(_a), headArg = _c[0], args = _c.slice(1);
        var result = true;
        try {
            for (var args_4 = __values(args), args_4_1 = args_4.next(); !args_4_1.done; args_4_1 = args_4.next()) {
                var arg = args_4_1.value;
                result = result && (headArg.value >= arg.value);
                headArg = arg;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (args_4_1 && !args_4_1.done && (_b = args_4.return)) _b.call(args_4);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return mkBool(result);
    };
    var gt = function (_a) {
        var e_6, _b;
        var _c = __read(_a), headArg = _c[0], args = _c.slice(1);
        var result = true;
        try {
            for (var args_5 = __values(args), args_5_1 = args_5.next(); !args_5_1.done; args_5_1 = args_5.next()) {
                var arg = args_5_1.value;
                result = result && (headArg.value > arg.value);
                headArg = arg;
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (args_5_1 && !args_5_1.done && (_b = args_5.return)) _b.call(args_5);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return mkBool(result);
    };
    var le = function (_a) {
        var e_7, _b;
        var _c = __read(_a), headArg = _c[0], args = _c.slice(1);
        var result = true;
        try {
            for (var args_6 = __values(args), args_6_1 = args_6.next(); !args_6_1.done; args_6_1 = args_6.next()) {
                var arg = args_6_1.value;
                result = result && (headArg.value <= arg.value);
                headArg = arg;
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (args_6_1 && !args_6_1.done && (_b = args_6.return)) _b.call(args_6);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return mkBool(result);
    };
    var lt = function (_a) {
        var e_8, _b;
        var _c = __read(_a), headArg = _c[0], args = _c.slice(1);
        var result = true;
        try {
            for (var args_7 = __values(args), args_7_1 = args_7.next(); !args_7_1.done; args_7_1 = args_7.next()) {
                var arg = args_7_1.value;
                result = result && (headArg.value < arg.value);
                headArg = arg;
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (args_7_1 && !args_7_1.done && (_b = args_7.return)) _b.call(args_7);
            }
            finally { if (e_8) throw e_8.error; }
        }
        return mkBool(result);
    };
    var evenQ = function (_a) {
        var _b = __read(_a, 1), headArg = _b[0];
        return mkBool(headArg.value % 2 === 0);
    };
    var oddQ = function (_a) {
        var _b = __read(_a, 1), headArg = _b[0];
        return mkBool(headArg.value % 2 === 1);
    };
    var posQ = function (_a) {
        var _b = __read(_a, 1), headArg = _b[0];
        return mkBool(headArg.value >= 0);
    };
    var negQ = function (_a) {
        var _b = __read(_a, 1), headArg = _b[0];
        return mkBool(headArg.value < 0);
    };
    var round = function (_a) {
        var _b = __read(_a, 1), headArg = _b[0];
        return mkNumber(Math.round(headArg.value));
    };
    var floor = function (_a) {
        var _b = __read(_a, 1), headArg = _b[0];
        return mkNumber(Math.floor(headArg.value));
    };
    var ceil = function (_a) {
        var _b = __read(_a, 1), headArg = _b[0];
        return mkNumber(Math.ceil(headArg.value));
    };
    var min = function (_a) {
        var _b = __read(_a), args = _b.slice(0);
        return mkNumber(args.length === 0
            ? Number.MAX_SAFE_INTEGER
            : Math.min.apply(Math, __spread(args.map(function (a) { return a.value; }))));
    };
    var max = function (_a) {
        var _b = __read(_a), args = _b.slice(0);
        return mkNumber(args.length === 0
            ? Number.MIN_SAFE_INTEGER
            : Math.max.apply(Math, __spread(args.map(function (a) { return a.value; }))));
    };
    //# sourceMappingURL=math.js.map

    var atom = function (_a) {
        var _b = __read(_a, 1), value = _b[0];
        return mkAtom(value);
    };
    var deref = function (_a) {
        var _b = __read(_a, 1), atom = _b[0];
        return atom.atom;
    };
    var swapX = function (_a, ctx) {
        var _b = __read(_a), atom = _b[0], headComp = _b[1], otherComps = _b.slice(2);
        var args = __spread([deref([atom])], otherComps);
        var result = apply(headComp, args, ctx);
        atom.atom = result;
        return atom;
    };
    var resetX = function (_a) {
        var _b = __read(_a, 2), atom = _b[0], val = _b[1];
        atom.atom = val;
        return atom;
    };
    //# sourceMappingURL=atoms.js.map

    var rand = function (_a) {
        var _b = __read(_a), props = _b.slice(0);
        switch (props.length) {
            case 0:
                return mkNumber(Math.random());
            case 1:
                return mkNumber(Math.random() * props[0].value);
            case 2:
            default:
                return mkNumber(props[0].value + Math.random() * props[1].value);
        }
    };
    var randInt = function (_a) {
        var _b = __read(_a), props = _b.slice(0);
        switch (props.length) {
            case 0:
                return mkNumber(0);
            case 1:
                return mkNumber(Math.floor(Math.random() * props[0].value));
            case 2:
            default:
                return mkNumber(Math.floor(props[0].value + Math.random() * props[1].value));
        }
    };
    var randNth = function (_a) {
        var _b = __read(_a, 1), vec = _b[0];
        var randomIndex = Math.floor(Math.random() * vec.members.length);
        return vec.members[randomIndex];
    };
    var shuffleArray = function (array) {
        var _a;
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = __read([array[j], array[i]], 2), array[i] = _a[0], array[j] = _a[1];
        }
    };
    var safeShuffle = function (array) {
        var e_1, _a;
        var result = [];
        var indexArray = __spread(Array(array.length).keys());
        shuffleArray(indexArray);
        try {
            for (var indexArray_1 = __values(indexArray), indexArray_1_1 = indexArray_1.next(); !indexArray_1_1.done; indexArray_1_1 = indexArray_1.next()) {
                var idx = indexArray_1_1.value;
                result.push(array[idx]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (indexArray_1_1 && !indexArray_1_1.done && (_a = indexArray_1.return)) _a.call(indexArray_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    var shuffle = function (_a) {
        var _b = __read(_a, 1), vec = _b[0];
        return mkVector(safeShuffle(vec.members));
    };
    //# sourceMappingURL=random.js.map

    var String$1;
    (function (String) {
        String.startsWithQ = function (_a) {
            var _b = __read(_a, 2), prefix = _b[0], str = _b[1];
            return mkBool(str.value.startsWith(prefix.value));
        };
        String.endsWithQ = function (_a) {
            var _b = __read(_a, 2), suffix = _b[0], str = _b[1];
            return mkBool(str.value.endsWith(suffix.value));
        };
        String.includesQ = function (_a) {
            var _b = __read(_a, 2), infix = _b[0], str = _b[1];
            return mkBool(str.value.includes(infix.value));
        };
        String.reverse = function (_a) {
            var _b = __read(_a, 1), str = _b[0];
            return mkString(str.value.split('').reverse().join(''));
        };
        String.join = function (_a) {
            var _b = __read(_a, 2), sep = _b[0], list = _b[1];
            return mkString(list.members.map(function (v) { return pureToString(v); }).join(sep.value));
        };
        String.blankQ = function (_a) {
            var _b = __read(_a, 1), str = _b[0];
            return mkBool(str.value.length === 0);
        };
        String.capitalize = function (_a) {
            var _b = __read(_a, 1), str = _b[0];
            return mkString(str.value.length === 0
                ? ''
                : str.value[0].toLocaleUpperCase + str.value.slice(1).toLocaleLowerCase());
        };
        String.lowerCase = function (_a) {
            var _b = __read(_a, 1), str = _b[0];
            return mkString(str.value.toLocaleLowerCase());
        };
        String.upperCase = function (_a) {
            var _b = __read(_a, 1), str = _b[0];
            return mkString(str.value.toLocaleUpperCase());
        };
        String.trim = function (_a) {
            var _b = __read(_a, 1), str = _b[0];
            return mkString(str.value.trim());
        };
        String.triml = function (_a) {
            var _b = __read(_a, 1), str = _b[0];
            return mkString(str.value.trimLeft());
        };
        String.trimr = function (_a) {
            var _b = __read(_a, 1), str = _b[0];
            return mkString(str.value.trimRight());
        };
    })(String$1 || (String$1 = {}));
    var Vector$1;
    (function (Vector) {
        Vector.startsWithQ = function (_a) {
            var e_1, _b;
            var _c = __read(_a, 2), prefix = _c[0], vec = _c[1];
            var result = true;
            if (prefix.members.length > vec.members.length) {
                result = false;
            }
            try {
                for (var _d = __values(prefix.members.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = __read(_e.value, 2), idx = _f[0], m = _f[1];
                    result = result && twoValueCompare(vec.members[idx], m);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return mkBool(result);
        };
        Vector.endsWithQ = function (_a) {
            var _b = __read(_a, 2), suffix = _b[0], vec = _b[1];
            var result = true;
            if (suffix.members.length > vec.members.length) {
                result = false;
            }
            for (var i = 0; i < suffix.members.length; i++) {
                result = result && twoValueCompare(vec.members[vec.members.length - (i + 1)], suffix.members[suffix.members.length - (i + 1)]);
            }
            return mkBool(result);
        };
        Vector.includesQ = function (_a) {
            var _b = __read(_a, 2), infix = _b[0], vec = _b[1];
            var result = false;
            if (infix.members.length <= vec.members.length) {
                for (var idx = 0; !result && idx < vec.members.length; idx++) {
                    // can still fit
                    if (idx + infix.members.length <= vec.members.length) {
                        var fail = false;
                        for (var uptoIndex = 0; !fail && uptoIndex !== infix.members.length; uptoIndex++) {
                            if (!twoValueCompare(vec.members[idx + uptoIndex], infix.members[uptoIndex])) {
                                fail = true;
                            }
                        }
                        result = !fail;
                    }
                }
            }
            return mkBool(result);
        };
        Vector.reverse = function (_a) {
            var _b = __read(_a, 1), vec = _b[0];
            return mkVector(vec.members.slice().reverse());
        };
    })(Vector$1 || (Vector$1 = {}));
    //# sourceMappingURL=strings.js.map

    var opticSupremum = function (type1, type2) {
        switch (type1) {
            case OpticType.Setter:
                switch (type2) {
                    case OpticType.Fold:
                    case OpticType.Getter:
                        return null;
                    default:
                        return type1;
                }
            case OpticType.Fold:
                switch (type2) {
                    case OpticType.Setter:
                        return null;
                    default:
                        return type1;
                }
            case OpticType.Traversal:
                switch (type2) {
                    case OpticType.Setter:
                    case OpticType.Fold:
                        return type2;
                    case OpticType.Getter:
                        return OpticType.Setter;
                    default:
                        return type1;
                }
            case OpticType.Affine:
                switch (type2) {
                    case OpticType.Setter:
                    case OpticType.Fold:
                    case OpticType.Traversal:
                        return type2;
                    case OpticType.Getter:
                        return OpticType.Setter;
                    default:
                        return type1;
                }
            case OpticType.Getter:
                switch (type2) {
                    case OpticType.Setter:
                        return null;
                    case OpticType.Fold:
                    case OpticType.Traversal:
                    case OpticType.Affine:
                    case OpticType.Prism:
                        return OpticType.Fold;
                    default:
                        return type1;
                }
            case OpticType.Lens:
                switch (type2) {
                    case OpticType.Fold:
                    case OpticType.Traversal:
                    case OpticType.Affine:
                    case OpticType.Setter:
                        return type2;
                    case OpticType.Prism:
                        return OpticType.Affine;
                    default:
                        return type1;
                }
            case OpticType.Prism:
                switch (type2) {
                    case OpticType.Fold:
                    case OpticType.Traversal:
                    case OpticType.Affine:
                    case OpticType.Setter:
                        return type2;
                    case OpticType.Lens:
                        return OpticType.Affine;
                    default:
                        return type1;
                }
            case OpticType.Iso:
                return type2;
        }
    };
    var opticLE = function (type1, type2) {
        return opticSupremum(type1, type2) === type1;
    };
    var dimap = function (l, r, f) { return function (x) { return r(f(l(x))); }; };
    var lmap = function (l, f) { return function (x) { return f(l(x)); }; };
    // const rmap = (r: (x: unknown) => unknown, f: (y: unknown) => unknown) => (x: unknown) => r(f(x))
    var forgetDimap = function (l, _r, f) { return lmap(l, f); };
    var wander = function (self) { return function (xs) {
        // console.log('foof', self, xs)
        // console.log('foof2', mkVector(xs.members.map(self)))
        return isVector(xs)
            ? mkVector(xs.members.map(self))
            : xs.boxed
                ? mkOptional(self(xs.boxed))
                : xs;
    }; };
    var dictSetter = {
        dimap: dimap,
        first: function (self) { return function (p) { return [self(p[0]), p[1]]; }; },
        right: function (self) { return function (x) { return (console.log('eju', self, x), [x[0].boxed ? self(x[0].boxed) : x[0], x[1]]); }; },
        wander: wander,
    };
    var dictGetter = {
        dimap: forgetDimap,
        first: function (self) { return function (x) { return self(x[0]); }; },
        wander: wander,
    };
    var dictAffine = {
        dimap: forgetDimap,
        first: function (self) { return function (x) { return self(x[0]); }; },
        //  basically fmap @Maybe
        right: function (self) { return function (x) { return x[0].boxed ? self(x[0].boxed) : x[0]; }; },
        wander: wander,
    };
    var dictTraversal = dictAffine;
    var run = function (zooms, dict, f) {
        var e_1, _a;
        console.log(zooms);
        debugger;
        try {
            for (var _b = __values(zooms.reverse()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var z = _c.value;
                f = z(dict, f);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return f;
    };
    //# sourceMappingURL=optic-helper.js.map

    var optic = function (_a) {
        var _b = __read(_a), headOptic = _b[0], optics = _b.slice(1);
        return optics.map(coerceOptic).reduce(mergeOptic, coerceOptic(headOptic));
    };
    var mergeOptic = function (op1, op2) {
        var newName = op1.name + '.' + op2.name;
        var newSubkind = opticSupremum(op1.subkind, op2.subkind);
        // @ts-ignore
        return mkOptic(newSubkind, newName, [op1.zooms, op2.zooms].flat());
    };
    var coerceOptic = function (val) {
        if (isOptic(val)) {
            return val;
        }
        else if (isNumber(val)) {
            return ix([val]);
        }
        else if (isMapKey(val)) {
            return key([val]);
        }
        else {
            throw 'cannot be coerced';
        }
    };
    var ix = function (_a) {
        var _b = __read(_a, 1), i = _b[0];
        var getter = function (s) {
            var _a;
            if (!isVector(s)) {
                throw 'needs to be vector';
            }
            var result = (_a = s.members[i.value]) !== null && _a !== void 0 ? _a : null;
            return [mkOptional(result), s];
        };
        var setter = function (_a) {
            var _b = __read(_a, 2), val = _b[0], orig = _b[1];
            var result = orig;
            if (orig.members[i.value]) {
                var copy = mkVector(__spread(orig.members));
                copy.members[i.value] = val;
                result = copy;
            }
            return result;
        };
        return mkOptic(OpticType.Affine, 'ix', [function (dict, f0) {
                var f1 = dict.right(f0);
                var f2 = dict.dimap(getter, setter, f1);
                return f2;
            }]);
    };
    var key = function (_a) {
        var _b = __read(_a, 1), k = _b[0];
        var theKey = toMapKey(k);
        var getter = function (s) {
            var _a;
            if (!isMap(s)) {
                throw 'needs to be map';
            }
            var holeTable = new Map(s.table);
            holeTable.delete(theKey);
            var result = (_a = s.table.get(theKey)) !== null && _a !== void 0 ? _a : null;
            return [mkOptional(result), mkMapDirect(holeTable)];
        };
        var setter = function (_a) {
            var _b = __read(_a, 2), val = _b[0], orig = _b[1];
            var copy = new Map(orig.table);
            if (val.boxed) {
                copy.set(theKey, val.boxed);
            }
            return mkMapDirect(copy);
        };
        return mkOptic(OpticType.Lens, 'key', [function (dict, f0) {
                var f1 = dict.first(f0);
                var f2 = dict.dimap(getter, setter, f1);
                return f2;
            }]);
    };
    var traversedCached = mkOptic(OpticType.Traversal, 'traversed', [function (dict, f0) {
            return dict.wander(f0);
        }]);
    var traversed = function (_a) { return traversedCached; };
    //////////// CONSUMING OPTICS
    var get = function (_a) {
        var _b = __read(_a, 2), lens = _b[0], value = _b[1];
        var f = run(lens.zooms, dictGetter, function (x) { return identity([x]); });
        var result = f(value);
        return result;
    };
    var tryGet = function (_a) {
        var _b = __read(_a, 2), affine = _b[0], value = _b[1];
        var f = run(affine.zooms, dictAffine, function (x) { return mkOptional(x); });
        var result = f(value);
        return result;
    };
    var getAll = function (_a) {
        var _b = __read(_a, 2), traversal = _b[0], value = _b[1];
        var f = run(traversal.zooms, dictTraversal, function (x) { return identity([x]); });
        var result = f(value);
        return result;
    };
    var set = function (_a) {
        var _b = __read(_a, 3), setter = _b[0], d = _b[1], value = _b[2];
        var f = run(setter.zooms, dictSetter, function (x) { return constant2([d, x]); });
        return f(value);
    };
    var over = function (_a, ctx) {
        var _b = __read(_a, 3), setter = _b[0], g = _b[1], value = _b[2];
        var f = run(setter.zooms, dictSetter, function (x) { return apply(g, [x], ctx); });
        return f(value);
    };
    //# sourceMappingURL=optic.js.map

    var fixedTable = {
        /////////////////// COMBINATORS
        'identity': wrappedIdentity,
        'constant': wrappedConstant,
        /////////////////// EQUALITY
        '=': wrap('=', typecheck({
            f: equality,
            argc: function (count) { return count > 0; },
        })),
        'not=': wrap('not=', typecheck({
            f: unequality,
            argc: function (count) { return count > 0; },
        })),
        /////////////////// EQUALITY
        'not': wrap('not', typecheck({
            f: not,
            argc: function (count) { return count === 1; },
        })),
        'and': wrap('and', and),
        'or': wrap('or', or),
        '+': wrap('+', typecheck({
            f: addition,
            args: function (args) { return args.every(isNumber); },
        })),
        '-': wrap('-', typecheck({
            f: subtraction,
            argc: function (count) { return count > 0; },
            args: function (args) { return args.every(isNumber); },
        })),
        '*': wrap('*', typecheck({
            f: multiplication,
            args: function (args) { return args.every(isNumber); },
        })),
        '/': wrap('/', typecheck({
            f: division,
            argc: function (count) { return count > 0; },
            args: function (args) { return args.every(isNumber); },
        })),
        '<': wrap('<', typecheck({
            f: lt,
            argc: function (count) { return count > 0; },
            args: function (args) { return args.every(isNumber); },
        })),
        '<=': wrap('<=', typecheck({
            f: le,
            argc: function (count) { return count > 0; },
            args: function (args) { return args.every(isNumber); },
        })),
        '>': wrap('>', typecheck({
            f: gt,
            argc: function (count) { return count > 0; },
            args: function (args) { return args.every(isNumber); },
        })),
        '>=': wrap('>=', typecheck({
            f: ge,
            argc: function (count) { return count > 0; },
            args: function (args) { return args.every(isNumber); },
        })),
        'min': wrap('min', typecheck({
            f: min,
            argc: function (count) { return count > 0; },
            args: function (args) { return args.every(isNumber); },
        })),
        'max': wrap('max', typecheck({
            f: max,
            argc: function (count) { return count > 0; },
            args: function (args) { return args.every(isNumber); },
        })),
        'round': wrap('round', typecheck({
            f: round,
            argc: function (count) { return count === 1; },
            args: function (args) { return isNumber(args[0]); },
        })),
        'floor': wrap('floor', typecheck({
            f: floor,
            argc: function (count) { return count === 1; },
            args: function (args) { return isNumber(args[0]); },
        })),
        'ceil': wrap('ceil', typecheck({
            f: ceil,
            argc: function (count) { return count === 1; },
            args: function (args) { return isNumber(args[0]); },
        })),
        'even?': wrap('even?', typecheck({
            f: evenQ,
            argc: function (count) { return count === 1; },
            args: function (args) { return isNumber(args[0]); },
        })),
        'odd?': wrap('odd?', typecheck({
            f: oddQ,
            argc: function (count) { return count === 1; },
            args: function (args) { return isNumber(args[0]); },
        })),
        'pos?': wrap('pos?', typecheck({
            f: posQ,
            argc: function (count) { return count === 1; },
            args: function (args) { return isNumber(args[0]); },
        })),
        'neg?': wrap('neg?', typecheck({
            f: negQ,
            argc: function (count) { return count === 1; },
            args: function (args) { return isNumber(args[0]); },
        })),
        ////////////////// RANDOM
        'rand': wrap('rand', typecheck({
            f: rand,
            argc: function (count) { return count <= 2; },
            args: function (args) { return args.every(isNumber); },
        })),
        'rand-int': wrap('rand-int', typecheck({
            f: randInt,
            argc: function (count) { return count <= 2; },
            args: function (args) { return args.every(isNumber); },
        })),
        'rand-nth': wrap('rand-nth', typecheck({
            f: randNth,
            argc: function (count) { return count === 1; },
            args: function (args) { return isVector(args[0]); },
        })),
        'shuffle': wrap('shuffle', typecheck({
            f: shuffle,
            argc: function (count) { return count === 1; },
            args: function (args) { return isVector(args[0]); },
        })),
        ////////////////// HASH MAPS
        'hash-map': wrap('hash-map', typecheck({
            f: hashMap,
            args: function (args) { return args
                .filter(function (_v, i) { return i % 2 === 0; })
                .every(function (v) { return isMapKey(v); }); },
        })),
        'merge': wrap('merge', typecheck({
            f: merge,
            argc: function (count) { return count >= 1; },
            args: function (args) { return args.every(isMap); },
        })),
        'merge-with': wrap('merge-with', typecheck({
            f: mergeWith,
            argc: function (count) { return count >= 2; },
            arg0: function (arg) { return isExecutable(arg); },
            args: function (args) { return args.slice(1).every(isMap); },
        })),
        'vector': wrap('vector', Vector.vector),
        'list': wrap('list', List.list),
        'optional': wrap('optional', typecheck({
            f: Optional.optional,
            argc: function (count) { return count <= 1; },
        })),
        // 'get': wrap('get', typecheck({
        //     inf: (args) => isMap(args[0])
        //         ? seq.Map.getFunc
        //         : isVector(args[0])
        //         ? seq.Vector.getFunc
        //         : isList(args[0])
        //         ? seq.List.getFunc
        //         : seq.Optional.getFunc,
        //     argc: (count) => count === 3,
        //     args: ([seqArg, idxArg]) =>
        //         (isMap(seqArg) && isMapKey(idxArg)) ||
        //         (isVector(seqArg) && isNumber(idxArg)) ||
        //         (isList(seqArg) && isNumber(idxArg)) ||
        //         (isOptional(seqArg) && isBool(idxArg))
        // })),
        'take': wrap('take', typecheck({
            inf: function (args) { return isMap(args[1])
                ? Map$1.take
                : isVector(args[1])
                    ? Vector.take
                    : List.take; },
            argc: function (count) { return count === 2; },
            args: function (_a) {
                var _b = __read(_a, 2), count = _b[0], seqArg = _b[1];
                return (isMap(seqArg) && isNumber(count)) ||
                    (isVector(seqArg) && isNumber(count)) ||
                    (isList(seqArg) && isNumber(count));
            }
        })),
        'take-while': wrap('take-while', typecheck({
            inf: function (args) { return isMap(args[1])
                ? Map$1.takeWhile
                : isVector(args[1])
                    ? Vector.takeWhile
                    : List.takeWhile; },
            argc: function (count) { return count === 2; },
            args: function (_a) {
                var _b = __read(_a, 2), func = _b[0], seqArg = _b[1];
                return (isMap(seqArg) && isArmedFunction(func)) ||
                    (isVector(seqArg) && isExecutable(func)) ||
                    (isList(seqArg) && isExecutable(func));
            }
        })),
        'drop': wrap('drop', typecheck({
            inf: function (args) { return isMap(args[1])
                ? Map$1.drop
                : isVector(args[1])
                    ? Vector.drop
                    : List.drop; },
            argc: function (count) { return count === 2; },
            args: function (_a) {
                var _b = __read(_a, 2), count = _b[0], seqArg = _b[1];
                return (isMap(seqArg) && isNumber(count)) ||
                    (isVector(seqArg) && isNumber(count)) ||
                    (isList(seqArg) && isNumber(count));
            }
        })),
        'drop-while': wrap('drop-while', typecheck({
            inf: function (args) { return isMap(args[1])
                ? Map$1.dropWhile
                : isVector(args[1])
                    ? Vector.dropWhile
                    : List.dropWhile; },
            argc: function (count) { return count === 2; },
            args: function (_a) {
                var _b = __read(_a, 2), func = _b[0], seqArg = _b[1];
                return (isMap(seqArg) && isExecutable(func)) ||
                    (isVector(seqArg) && isExecutable(func)) ||
                    (isList(seqArg) && isExecutable(func));
            }
        })),
        'count': wrap('count', typecheck({
            inf: function (args) { return isMap(args[0])
                ? Map$1.count
                : isVector(args[0])
                    ? Vector.count
                    : isList(args[0])
                        ? List.count
                        : Optional.count; },
            argc: function (count) { return count === 1; },
            args: function (_a) {
                var _b = __read(_a, 1), seqArg = _b[0];
                return isMap(seqArg) ||
                    isVector(seqArg) ||
                    isList(seqArg) ||
                    isOptional(seqArg);
            },
        })),
        'empty?': wrap('empty?', typecheck({
            inf: function (args) { return isMap(args[0])
                ? Map$1.emptyQ
                : isVector(args[0])
                    ? Vector.emptyQ
                    : isList(args[0])
                        ? List.emptyQ
                        : Optional.emptyQ; },
            argc: function (count) { return count === 1; },
            args: function (_a) {
                var _b = __read(_a, 1), seqArg = _b[0];
                return isMap(seqArg) ||
                    isVector(seqArg) ||
                    isList(seqArg) ||
                    isOptional(seqArg);
            },
        })),
        'every?': wrap('every?', typecheck({
            inf: function (args) { return isMap(args[1])
                ? Map$1.everyQ
                : isVector(args[1])
                    ? Vector.everyQ
                    : isList(args[1])
                        ? List.everyQ
                        : Optional.everyQ; },
            argc: function (count) { return count === 2; },
            args: function (_a) {
                var _b = __read(_a, 2), pred = _b[0], seqArg = _b[1];
                return (isExecutable(pred) && isMap(seqArg)) ||
                    (isExecutable(pred) && isVector(seqArg)) ||
                    (isExecutable(pred) && isList(seqArg)) ||
                    (isExecutable(pred) && isOptional(seqArg));
            },
        })),
        'any?': wrap('any?', typecheck({
            inf: function (args) { return isMap(args[1])
                ? Map$1.anyQ
                : isVector(args[1])
                    ? Vector.anyQ
                    : isList(args[1])
                        ? List.anyQ
                        : Optional.anyQ; },
            argc: function (count) { return count === 2; },
            args: function (_a) {
                var _b = __read(_a, 2), pred = _b[0], seqArg = _b[1];
                return (isExecutable(pred) && (isMap(seqArg) ||
                    isVector(seqArg) ||
                    isList(seqArg) ||
                    isOptional(seqArg)));
            },
        })),
        'map': wrap('map', typecheck({
            inf: function (args) { return isMap(args[1])
                ? Map$1.map
                : isVector(args[1])
                    ? Vector.map
                    : isList(args[1])
                        ? List.map
                        : Optional.map; },
            argc: function (count) { return count >= 2; },
            args: function (_a) {
                var _b = __read(_a), pred = _b[0], seqArgs = _b.slice(1);
                return (isExecutable(pred) && (seqArgs.every(isMap) ||
                    seqArgs.every(isVector) ||
                    seqArgs.every(isList) ||
                    seqArgs.every(isOptional)));
            }
        })),
        'filter': wrap('filter', typecheck({
            inf: function (args) { return isMap(args[1])
                ? Map$1.filter
                : isVector(args[1])
                    ? Vector.filter
                    : isList(args[1])
                        ? List.filter
                        : Optional.filter; },
            argc: function (count) { return count === 2; },
            args: function (_a) {
                var _b = __read(_a, 2), pred = _b[0], seqArg = _b[1];
                return (isExecutable(pred) && (isMap(seqArg) ||
                    isVector(seqArg) ||
                    isList(seqArg) ||
                    isOptional(seqArg)));
            }
        })),
        'reduce': wrap('reduce', typecheck({
            inf: function (args) { return isMap(args[2])
                ? Map$1.foldl
                : isVector(args[2])
                    ? Vector.foldl
                    : isList(args[2])
                        ? List.foldl
                        : Optional.foldl; },
            argc: function (count) { return count === 3; },
            args: function (_a) {
                var _b = __read(_a, 3), pred = _b[0], seqArg = _b[2];
                return (isExecutable(pred) && (isMap(seqArg) ||
                    isVector(seqArg) ||
                    isList(seqArg) ||
                    isOptional(seqArg)));
            }
        })),
        'foldl': wrap('foldl', typecheck({
            inf: function (args) { return isMap(args[2])
                ? Map$1.foldl
                : isVector(args[2])
                    ? Vector.foldl
                    : isList(args[2])
                        ? List.foldl
                        : Optional.foldl; },
            argc: function (count) { return count === 3; },
            args: function (_a) {
                var _b = __read(_a, 3), pred = _b[0], seqArg = _b[2];
                return (isExecutable(pred) && (isMap(seqArg) ||
                    isVector(seqArg) ||
                    isList(seqArg) ||
                    isOptional(seqArg)));
            }
        })),
        'foldr': wrap('foldr', typecheck({
            inf: function (args) { return isMap(args[2])
                ? Map$1.foldr
                : isVector(args[2])
                    ? Vector.foldr
                    : isList(args[2])
                        ? List.foldr
                        : Optional.foldr; },
            argc: function (count) { return count === 3; },
            args: function (_a) {
                var _b = __read(_a, 3), pred = _b[0], seqArg = _b[2];
                return (isExecutable(pred) && (isMap(seqArg) ||
                    isVector(seqArg) ||
                    isList(seqArg) ||
                    isOptional(seqArg)));
            }
        })),
        'fzip': wrap('fzip', typecheck({
            inf: function (args) { return isVector(args[0])
                ? Vector.fzip
                : Optional.fzip; },
            argc: function (count) { return count >= 1; },
            args: function (_a) {
                var _b = __read(_a), seqArg = _b.slice(0);
                return (seqArg.every(isVector) ||
                    seqArg.every(isOptional));
            }
        })),
        'flat': wrap('flat', typecheck({
            inf: function (args) { return isVector(args[0])
                ? Vector.flat
                : isList(args[0])
                    ? List.flat
                    : Optional.flat; },
            argc: function (count) { return count === 1; },
            args: function (_a) {
                var _b = __read(_a, 1), seqArg = _b[0];
                return (isVector(seqArg) ||
                    isList(seqArg) ||
                    isOptional(seqArg));
            }
        })),
        'bind': wrap('bind', typecheck({
            inf: function (args) { return isVector(args[1])
                ? Vector.bind
                : Optional.bind; },
            argc: function (count) { return count >= 2; },
            args: function (_a) {
                var _b = __read(_a), func = _b[0], seqArgs = _b.slice(1);
                return (isExecutable(func) &&
                    seqArgs.every(isVector) ||
                    // isList(seqArg) ||
                    seqArgs.every(isOptional));
            }
        })),
        'contains?': wrap('contains?', typecheck({
            f: containsQ,
            argc: function (count) { return count === 2; },
            arg0: function (arg) { return isMap(arg); },
            arg1: function (arg) { return isMapKey(arg); },
        })),
        'find': wrap('find', typecheck({
            f: find,
            argc: function (count) { return count === 2; },
            arg0: function (arg) { return isMap(arg); },
            arg1: function (arg) { return isMapKey(arg); },
        })),
        'keys': wrap('keys', typecheck({
            f: keys,
            argc: function (count) { return count === 1; },
            arg0: function (arg) { return isMap(arg); },
        })),
        'vals': wrap('vals', typecheck({
            f: vals,
            argc: function (count) { return count === 1; },
            arg0: function (arg) { return isMap(arg); },
        })),
        'assoc': wrap('assoc', typecheck({
            f: assoc,
            argc: function (count) { return count >= 1; },
            arg0: function (v) { return isMap(v); },
            args: function (args) { return args
                .filter(function (_v, i) { return i > 1 && i % 2 === 1; })
                .every(function (v) { return isMapKey(v); }); },
        })),
        'dissoc': wrap('dissoc', typecheck({
            f: dissoc,
            argc: function (count) { return count >= 1; },
            arg0: function (v) { return isMap(v); },
            args: function (args) { return args
                .filter(function (_v, i) { return i > 1; })
                .every(function (v) { return isMapKey(v); }); },
        })),
        /////////////////// ATOMS
        'atom': wrap('atom', typecheck({
            f: atom,
            argc: function (count) { return count === 1; },
        })),
        'deref': wrap('deref', typecheck({
            f: deref,
            argc: function (count) { return count === 1; },
            arg0: function (val) { return isAtom(val); },
        })),
        'swap!': wrap('swap!', typecheck({
            f: swapX,
            argc: function (count) { return count >= 2; },
            arg0: function (val) { return isAtom(val); },
            arg1: function (val) { return isExecutable(val); },
        })),
        'reset!': wrap('reset!', typecheck({
            f: resetX,
            argc: function (count) { return count === 2; },
            arg0: function (val) { return isAtom(val); },
        })),
        /////////////////// STRINGS
        'starts-with?': wrap('starts-with?', typecheck({
            inf: function (args) { return isString(args[0])
                ? String$1.startsWithQ
                : Vector$1.startsWithQ; },
            argc: function (count) { return count === 2; },
            args: function (args) { return args.every(isString) || args.every(isVector); },
        })),
        'ends-with?': wrap('ends-with?', typecheck({
            inf: function (args) { return isString(args[0])
                ? String$1.endsWithQ
                : Vector$1.endsWithQ; },
            argc: function (count) { return count === 2; },
            args: function (args) { return args.every(isString) || args.every(isVector); }
        })),
        'includes?': wrap('includes?', typecheck({
            inf: function (args) { return isString(args[0])
                ? String$1.includesQ
                : Vector$1.includesQ; },
            argc: function (count) { return count >= 2; },
            args: function (args) { return args.every(isString) || args.every(isVector); }
        })),
        'reverse': wrap('reverse', typecheck({
            inf: function (args) { return isString(args[0])
                ? String$1.reverse
                : Vector$1.reverse; },
            argc: function (count) { return count === 1; },
            args: function (args) { return isString(args[0]) || isVector(args[0]); }
        })),
        'join': wrap('join', typecheck({
            f: String$1.join,
            argc: function (count) { return count === 2; },
            args: function (args) { return isString(args[0]) || isVector(args[1]); },
        })),
        'blank?': wrap('blank?', typecheck({
            f: String$1.blankQ,
            argc: function (count) { return count === 1; },
            args: function (args) { return isString(args[0]); },
        })),
        'capitalize': wrap('capitalize', typecheck({
            f: String$1.capitalize,
            argc: function (count) { return count === 1; },
            args: function (args) { return isString(args[0]); },
        })),
        'lower-case': wrap('lower-case', typecheck({
            f: String$1.lowerCase,
            argc: function (count) { return count === 1; },
            args: function (args) { return isString(args[0]); },
        })),
        'upper-case': wrap('upper-case', typecheck({
            f: String$1.upperCase,
            argc: function (count) { return count === 1; },
            args: function (args) { return isString(args[0]); },
        })),
        'trim': wrap('trim', typecheck({
            f: String$1.trim,
            argc: function (count) { return count === 1; },
            args: function (args) { return isString(args[0]); },
        })),
        'triml': wrap('triml', typecheck({
            argc: function (count) { return count === 1; },
            args: function (args) { return isString(args[0]); },
        })),
        'trimr': wrap('trimr', typecheck({
            f: String$1.trimr,
            argc: function (count) { return count === 1; },
            args: function (args) { return isString(args[0]); },
        })),
        /////////////// OPTIC
        'optic': wrap('optic', typecheck({
            f: optic,
            argc: function (count) { return count >= 1; },
            args: function (args) { return args.every(isOpticCoercable); },
        })),
        'ix': wrap('ix', typecheck({
            f: ix,
            argc: function (count) { return count === 1; },
            args: function (args) { return isNumber(args[0]); },
        })),
        'key': wrap('key', typecheck({
            f: key,
            argc: function (count) { return count === 1; },
            args: function (args) { return isMapKey(args[0]); },
        })),
        'traversed': wrap('traversed', typecheck({
            f: traversed,
            argc: function (count) { return count === 0; },
        })),
        'get': wrap('get', typecheck({
            f: get,
            argc: function (count) { return count === 2; },
            args: function (args) { return isOptic(args[0]) && opticLE(OpticType.Lens, args[0].subkind); },
        })),
        'try-get': wrap('try-get', typecheck({
            f: tryGet,
            argc: function (count) { return count === 2; },
            args: function (args) { return isOptic(args[0]) && opticLE(OpticType.Affine, args[0].subkind); },
        })),
        'get-all': wrap('get-all', typecheck({
            f: getAll,
            argc: function (count) { return count === 2; },
            args: function (args) { return isOptic(args[0]) && opticLE(OpticType.Traversal, args[0].subkind); },
        })),
        'set': wrap('set', typecheck({
            f: set,
            argc: function (count) { return count === 3; },
            args: function (args) { return isOptic(args[0]) && opticLE(OpticType.Setter, args[0].subkind); },
        })),
        'over': wrap('over', typecheck({
            f: over,
            argc: function (count) { return count === 3; },
            args: function (args) { return isOptic(args[0]) && opticLE(OpticType.Setter, args[0].subkind); },
        })),
    };
    //# sourceMappingURL=fixed-table.js.map

    var globalTable = new Map();
    var globalDefine = function (key, value) {
        globalTable.set(key.value, value);
    };
    var globalLookup = function (key) {
        return globalTable.has(key.value)
            ? globalTable.get(key.value)
            : null;
    };
    var localLookup = function (ctx, key) {
        return ctx.has(key.value)
            ? ctx.get(key.value)
            : null;
    };
    var lookup = function (key, ctx) {
        var _a, _b;
        return fixedTable[key.value]
            ? fixedTable[key.value](ctx)
            : (_b = (_a = localLookup(ctx, key)) !== null && _a !== void 0 ? _a : globalLookup(key)) !== null && _b !== void 0 ? _b : key;
    };
    var createEnv = function (params, args) {
        var env = new Map();
        params.forEach(function (v, i) { return env.set(v.value, args[i]); });
        return env;
    };
    var createNumberedEnv = function (args) {
        var env = new Map();
        if (args.length > 0) {
            env.set("%", args[0]);
        }
        args.forEach(function (v, i) { return env.set("%" + (i + 1), v); });
        return env;
    };
    var joinEnvs = function () {
        var e_1, _a, e_2, _b;
        var envs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            envs[_i] = arguments[_i];
        }
        var resultEnv = new Map();
        try {
            for (var envs_1 = __values(envs), envs_1_1 = envs_1.next(); !envs_1_1.done; envs_1_1 = envs_1.next()) {
                var env = envs_1_1.value;
                try {
                    for (var env_1 = (e_2 = void 0, __values(env)), env_1_1 = env_1.next(); !env_1_1.done; env_1_1 = env_1.next()) {
                        var _c = __read(env_1_1.value, 2), key = _c[0], value = _c[1];
                        resultEnv.set(key, value);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (env_1_1 && !env_1_1.done && (_b = env_1.return)) _b.call(env_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (envs_1_1 && !envs_1_1.done && (_a = envs_1.return)) _a.call(envs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return resultEnv;
    };
    //# sourceMappingURL=lookup.js.map

    var execute = function (expr, ctx) {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f;
        var _g;
        switch (expr.kind) {
            case SlangType.List:
                var resolvedHead = execute(expr.head, ctx);
                return fire(resolvedHead, ctx, expr.tail);
            case SlangType.Symbol:
                return (_g = lookup(expr, ctx)) !== null && _g !== void 0 ? _g : expr;
            case SlangType.Optional:
                return mkOptional(expr.boxed
                    ? execute(expr.boxed, ctx)
                    : null);
            case SlangType.Vector:
                return mkVector(expr.members.map(function (v) { return execute(v, ctx); }));
            case SlangType.Map:
                var newMap = new Map();
                try {
                    for (var _h = __values(expr.table), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var _k = __read(_j.value, 2), key = _k[0], value = _k[1];
                        newMap.set(key, execute(value, ctx));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_a = _h.return)) _a.call(_h);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return mkMapDirect(newMap);
            case SlangType.Quoted:
                return expr.quoted;
            case SlangType.Function:
                return armFunc(expr, ctx);
            case SlangType.ShcutFunction:
                return armShcut(expr, ctx);
            case SlangType.Def:
                globalDefine(expr.identifier, execute(expr.value, ctx));
                return mkUnit();
            case SlangType.Let:
                return execute(expr.body, joinEnvs(ctx, expr.bindings));
            case SlangType.Do:
                var result = mkUnit();
                try {
                    for (var _l = __values(expr.expressions), _m = _l.next(); !_m.done; _m = _l.next()) {
                        var e = _m.value;
                        result = execute(e, ctx);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_m && !_m.done && (_b = _l.return)) _b.call(_l);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return result;
            case SlangType.If:
                var ifCond = toBool(execute(expr.condition, ctx));
                if (ifCond.value) {
                    return execute(expr.thenClause, ctx);
                }
                return execute(expr.elseClause, ctx);
            case SlangType.Cond:
                try {
                    for (var _o = __values(expr.tests), _p = _o.next(); !_p.done; _p = _o.next()) {
                        var test = _p.value;
                        if (toBool(execute(test[0], ctx)).value) {
                            return execute(test[1], ctx);
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_p && !_p.done && (_c = _o.return)) _c.call(_o);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return mkUnit();
            case SlangType.Case:
                expr.variable;
                try {
                    for (var _q = __values(expr.tests), _r = _q.next(); !_r.done; _r = _q.next()) {
                        var _s = __read(_r.value, 2), test = _s[0], then = _s[1];
                        if (equality([
                            execute(expr.variable, ctx),
                            test,
                        ]).value) {
                            return execute(then, ctx);
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_r && !_r.done && (_d = _q.return)) _d.call(_q);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                return mkUnit();
            case SlangType.For:
                return mkUnit();
            case SlangType.Doseq:
                return mkUnit();
            case SlangType.ThreadFirst:
                var tfresult = execute(expr.value, ctx);
                try {
                    for (var _t = __values(expr.pipes), _u = _t.next(); !_u.done; _u = _t.next()) {
                        var pipe = _u.value;
                        tfresult = isList(pipe)
                            ? (pipe.tail.unshift(tfresult), execute(pipe, ctx))
                            : execute(mkList(pipe, [tfresult]), ctx);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_u && !_u.done && (_e = _t.return)) _e.call(_t);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                return tfresult;
            case SlangType.ThreadLast:
                var tlresult = execute(expr.value, ctx);
                try {
                    for (var _v = __values(expr.pipes), _w = _v.next(); !_w.done; _w = _v.next()) {
                        var pipe = _w.value;
                        tlresult = isList(pipe)
                            ? (pipe.tail.push(tlresult), execute(pipe, ctx))
                            : execute(mkList(pipe, [tlresult]), ctx);
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_w && !_w.done && (_f = _v.return)) _f.call(_v);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                return tlresult;
            default:
                // case SlangType.String:
                // case SlangType.Number:
                // case SlangType.Unit:
                // case SlangType.Bool:
                // case SlangType.Keyword:
                // case SlangType.Function:
                return expr;
        }
    };
    //# sourceMappingURL=executor.js.map

    //# sourceMappingURL=index.js.map

    // img tags are parsed via HTML (!)
    var lexer$1 = moo.states({
        main: {
            tagstart: {
                match: '[[',
                push: 'key',
            },
            EOF: {
                match: /\$$/u,
            },
            text: {
                match: /[\s\S]+?(?=\[\[|\$$)/u,
                lineBreaks: true,
            },
        },
        key: {
            keyname: {
                match: /[a-zA-Z]+\d*/u,
            },
            sep: {
                match: '::',
                next: 'intag',
            },
        },
        intag: {
            tagstart: {
                match: '[[',
                push: 'key',
            },
            tagend: {
                match: ']]',
                pop: 1,
            },
            valuestext: {
                match: /[\s\S]+?(?=\[\[|\]\])/u,
                lineBreaks: true,
            },
        },
    });
    //# sourceMappingURL=tokenizer.js.map

    var keyPattern = /^([^0-9]+)([0-9]*)$/u;
    var splitValues = function (valuesRaw) {
        return valuesRaw.split('::').map(function (arg) { return arg.split('||'); });
    };
    var tagMaker = function () {
        var tagCounter = new Map();
        var getAndInc = function (key) {
            var result = tagCounter.has(key)
                ? tagCounter.get(key) + 1
                : 0;
            tagCounter.set(key, result);
            return result;
        };
        var mkTag = function (fullKey, valuesRaw) {
            var match = fullKey.match(keyPattern);
            var key = match[1];
            var idx = match[2].length === 0 ? null : Number(match[2]);
            var fullOccur = getAndInc(fullKey);
            var occur = fullKey === key
                ? fullOccur
                : getAndInc(key);
            return {
                fullKey: fullKey,
                fullOccur: fullOccur,
                key: key,
                idx: idx,
                occur: occur,
                valuesRaw: valuesRaw,
            };
        };
        return {
            mkTag: mkTag,
        };
    };
    var mkTagInfo = function (start) { return ({
        start: start,
        end: 0,
        data: null,
        innerTags: [],
    }); };
    //# sourceMappingURL=templateTypes.js.map

    var tagKeeper = function () {
        var tm, tagInfos, getTagInfo, tagStack, nextLevel, value, startIndex, endIndex, poppedLevel, foundTag;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tm = tagMaker();
                    tagInfos = [];
                    getTagInfo = function (idxs) {
                        var e_1, _a;
                        var reference = tagInfos;
                        try {
                            for (var idxs_1 = __values(idxs), idxs_1_1 = idxs_1.next(); !idxs_1_1.done; idxs_1_1 = idxs_1.next()) {
                                var id = idxs_1_1.value;
                                reference = reference[id].innerTags;
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (idxs_1_1 && !idxs_1_1.done && (_a = idxs_1.return)) _a.call(idxs_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return reference;
                    };
                    tagStack = [];
                    nextLevel = 0;
                    _a.label = 1;
                case 1:
                    return [4 /*yield*/, tagStack];
                case 2:
                    value = _a.sent();
                    if (value === 'stop') /* stop */ {
                        return [2 /*return*/, tagInfos];
                    }
                    else if (value[0] >= 0) /* start */ {
                        startIndex = value[0] - 2 /* two delimiter characters */;
                        getTagInfo(tagStack).push(mkTagInfo(startIndex));
                        tagStack.push(nextLevel);
                        nextLevel = 0;
                    }
                    else /* end */ {
                        endIndex = Math.abs(value[0]) + 2 /* two delimiter characters */;
                        poppedLevel = tagStack.pop();
                        foundTag = getTagInfo(tagStack)[poppedLevel];
                        foundTag.end = endIndex;
                        foundTag.data = tm.mkTag(value[1][0], value[1][1]);
                        nextLevel = poppedLevel + 1;
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    var initTagKeeper = function () {
        var tk = tagKeeper();
        tk.next();
        var stop = function () {
            var result = tk.next('stop');
            tk = tagKeeper();
            tk.next();
            return result;
        };
        var startToken = function (offset) {
            return tk.next([offset]);
        };
        var endToken = function (offset, tag) {
            return tk.next([-offset, tag]);
        };
        return {
            stop: stop,
            startToken: startToken,
            endToken: endToken,
        };
    };
    //# sourceMappingURL=tagKeeper.js.map

    // Generated automatically by nearley, version 2.19.2
    // http://github.com/Hardmath123/nearley
    // Bypasses TS6133. Allow declared but unused functions.
    // @ts-ignore
    function id$1(d) { return d[0]; }
    var tagKeeper$1 = initTagKeeper();
    var grammar$1 = {
        Lexer: lexer$1,
        ParserRules: [
            { "name": "start", "symbols": ["content", (lexer$1.has("EOF") ? { type: "EOF" } : EOF)], "postprocess": function () { return tagKeeper$1.stop().value; } },
            { "name": "content$ebnf$1", "symbols": [] },
            { "name": "content$ebnf$1$subexpression$1", "symbols": ["tag", "_"] },
            { "name": "content$ebnf$1", "symbols": ["content$ebnf$1", "content$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "content", "symbols": ["_", "content$ebnf$1"] },
            { "name": "tag", "symbols": ["tagstart", "inner", (lexer$1.has("tagend") ? { type: "tagend" } : tagend)], "postprocess": function (_a) {
                    var _b = __read(_a, 3), startToken = _b[0], tag = _b[1], endToken = _b[2];
                    return [[
                            id$1(startToken) /* '[[' */,
                            tag.join('::'),
                            endToken.value /* ']]' */,
                        ], tagKeeper$1.endToken(endToken.offset, tag)];
                } },
            { "name": "tagstart", "symbols": [(lexer$1.has("tagstart") ? { type: "tagstart" } : tagstart)], "postprocess": function (_a) {
                    var _b = __read(_a, 1), startToken = _b[0];
                    return [startToken.value, tagKeeper$1.startToken(startToken.offset + startToken.value.length)];
                } },
            { "name": "inner$ebnf$1", "symbols": [] },
            { "name": "inner$ebnf$1$subexpression$1", "symbols": ["tag", "_values"] },
            { "name": "inner$ebnf$1", "symbols": ["inner$ebnf$1", "inner$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "inner", "symbols": [(lexer$1.has("keyname") ? { type: "keyname" } : keyname), (lexer$1.has("sep") ? { type: "sep" } : sep), "_values", "inner$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 4), key = _b[0], first = _b[2], rest = _b[3];
                    return [
                        key.value,
                        first + rest.map(function (_a) {
                            var _b = __read(_a, 2), tag = _b[0], vtxt = _b[1];
                            return id$1(tag).join('') + vtxt;
                        }),
                    ];
                } },
            { "name": "_values$ebnf$1", "symbols": [] },
            { "name": "_values$ebnf$1", "symbols": ["_values$ebnf$1", (lexer$1.has("valuestext") ? { type: "valuestext" } : valuestext)], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "_values", "symbols": ["_values$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 1), vs = _b[0];
                    return vs.map(function (v) { return v.value; }).join('');
                } },
            { "name": "_$ebnf$1", "symbols": [] },
            { "name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer$1.has("text") ? { type: "text" } : text)], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "_", "symbols": ["_$ebnf$1"], "postprocess": function () { return null; } }
        ],
        ParserStart: "start",
    };
    //# sourceMappingURL=template.js.map

    var parseTemplate = function (text) {
        var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar$1));
        var result = parser.feed(text + '$').results;
        if (result.length > 1) {
            console.error('Ambiguous template grammar', result);
        }
        else if (result.length < 1) {
            console.error('Template grammar does not match');
        }
        return result[0];
    };
    //# sourceMappingURL=index.js.map

    var renderTemplate = function (text, filterManager) {
        var e_1, _a;
        try {
            for (var _b = __values(filterManager.iterations()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var iteration = _c.value;
                var tags = parseTemplate(text);
                text = postfixOuter(text, tags, iteration);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return text;
    };
    var spliceSlice = function (str, lend, rend, add) {
        // We cannot pass negative lend directly to the 2nd slicing operation.
        var leftend = lend < 0
            ? Math.min(0, str.length + lend)
            : lend;
        return str.slice(0, leftend) + (add || "") + str.slice(rend);
    };
    var adjustValuesString = function (tag, innerTag, adjustment) {
        return spliceSlice(tag.data.valuesRaw, innerTag.start - (tag.start + 2 /* opendelim */ + tag.data.fullKey.length + 2 /* sep */), innerTag.end - innerTag.start + 1, adjustment);
    };
    var postfixOuter = function (text, tags, filterManager) {
        var stack = [0];
        var sum = 0;
        var processedText = text;
        var postfixInner = function (tag) {
            stack.push(sum);
            var innerResults = tag.innerTags.map(postfixInner);
            stack.push(tag.innerTags.length > 0
                ? sum - stack[stack.length - 1] /* stack.peek() */
                : 0);
            tag.innerTags.forEach(function (it, idx) {
                return tag.data.valuesRaw = adjustValuesString(tag, it, innerResults[idx]);
            });
            tag.data.values = splitValues(tag.data.valuesRaw);
            var filterOutput = filterManager.processFilter(tag.data.key, tag.data);
            var innerOffset = stack.pop();
            var leftOffset = stack.pop();
            var newOffset = filterOutput.result.length - (tag.end - tag.start);
            processedText = spliceSlice(processedText, tag.start + leftOffset, tag.end + leftOffset + innerOffset, filterOutput.result);
            sum = innerOffset + leftOffset + newOffset;
            return filterOutput.result;
        };
        tags.forEach(postfixInner);
        return processedText;
    };
    //# sourceMappingURL=index.js.map

    var map = new Map();
    var defaultMemoizer = {
        hasItem: function (k) { return map.has(k); },
        getItem: function (k) { return map.get(k); },
        setItem: function (k, v) { return map.set(k, v); },
        removeItem: function (k) { return map.delete(k); },
        clear: function () { return map.clear(); },
    };
    var generateMemoizerKey = function (_a) {
        var key = _a.key, idx = _a.idx, valuesRaw = _a.valuesRaw;
        return (key + ":" + idx + ":" + valuesRaw);
    };
    //# sourceMappingURL=memoizer.js.map

    var mkStoreApi = function (store) {
        var set = function (name, value) {
            store.set(name, value);
        };
        var has = function (name) { return store.has(name); };
        var get = function (name) { return store.get(name); };
        var over = function (name, f) {
            store.set(name, f(store.get(name)));
        };
        var deleteStore = function (name) {
            store.delete(name);
        };
        var clear = function () {
            store.clear();
        };
        return {
            set: set,
            get: get,
            has: has,
            over: over,
            delete: deleteStore,
            clear: clear,
        };
    };
    //# sourceMappingURL=store.js.map

    var defaultFilter = function (_a) {
        var fullKey = _a.fullKey, valuesRaw = _a.valuesRaw;
        return ({
            result: "[[" + fullKey + "::" + valuesRaw + "]]",
            memoize: false,
        });
    };
    var standardizeFilterResult = function (input) {
        var _a, _b;
        switch (typeof input) {
            case 'string': return {
                result: input,
                memoize: false,
            };
            // also includes null
            case 'object': return {
                result: (_a = input.result) !== null && _a !== void 0 ? _a : '',
                memoize: (_b = input.memoize) !== null && _b !== void 0 ? _b : false,
            };
        }
        // return undefined otherwise
    };
    var executeFilter = function (filters, name, data, internals) {
        var _a;
        if (filters.has(name)) {
            var filter = filters.get(name);
            var result = (_a = standardizeFilterResult(filter(data, internals))) !== null && _a !== void 0 ? _a : defaultFilter(data);
            return result;
        }
        else {
            return defaultFilter(data);
        }
    };
    var mkFilterApi = function (filters) {
        var registerFilter = function (name, filter) {
            filters.set(name, filter);
        };
        var hasFilter = function (name) { return filters.has(name); };
        var unregisterFilter = function (name) {
            filters.delete(name);
        };
        var clearFilters = function () {
            filters.clear();
        };
        return {
            register: registerFilter,
            has: hasFilter,
            unregister: unregisterFilter,
            clear: clearFilters,
        };
    };
    //# sourceMappingURL=filters.js.map

    var mkDeferredApi = function (deferred) {
        var registerDeferred = function (name, filter) {
            deferred.set(name, filter);
        };
        var hasDeferred = function (name) { return deferred.has(name); };
        var unregisterDeferred = function (name) {
            deferred.delete(name);
        };
        var clearDeferred = function () {
            deferred.clear();
        };
        return {
            register: registerDeferred,
            has: hasDeferred,
            unregister: unregisterDeferred,
            clear: clearDeferred,
        };
    };
    //# sourceMappingURL=deferred.js.map

    var mkFilterManager = function (custom, memoizer) {
        if (custom === void 0) { custom = {}; }
        if (memoizer === void 0) { memoizer = defaultMemoizer; }
        var store = new Map();
        var storeApi = mkStoreApi(store);
        var filters = new Map();
        var filterApi = mkFilterApi(filters);
        var deferred = new Map();
        var deferredApi = mkDeferredApi(deferred);
        var nextIteration = true;
        var nextIterationApi = {
            activate: function (value) {
                if (value === void 0) { value = true; }
                nextIteration = value;
            },
            isActivated: function () { return nextIteration; },
        };
        var internals = {
            custom: custom,
            nextIteration: nextIterationApi,
            store: storeApi,
            filters: filterApi,
            deferred: deferredApi,
        };
        var processFilter = function (key, data) {
            var memoizerKey = generateMemoizerKey(data);
            if (memoizer.hasItem(memoizerKey)) {
                return memoizer.getItem(memoizerKey);
            }
            var result = executeFilter(filters, key, data, internals);
            if (result.memoize) {
                memoizer.setItem(memoizerKey, result);
            }
            return result;
        };
        var addRecipe = function (recipe) {
            recipe(filterApi);
        };
        var iterations = function () {
            var deferred_1, deferred_1_1, _a, name_1, def;
            var e_1, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!nextIteration) return [3 /*break*/, 2];
                        nextIteration = false;
                        return [4 /*yield*/, {
                                processFilter: processFilter,
                            }];
                    case 1:
                        _c.sent();
                        try {
                            for (deferred_1 = (e_1 = void 0, __values(deferred)), deferred_1_1 = deferred_1.next(); !deferred_1_1.done; deferred_1_1 = deferred_1.next()) {
                                _a = __read(deferred_1_1.value, 2), name_1 = _a[0], def = _a[1];
                                def(name_1);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (deferred_1_1 && !deferred_1_1.done && (_b = deferred_1.return)) _b.call(deferred_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        deferred.clear();
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        };
        return {
            filters: filterApi,
            addRecipe: addRecipe,
            iterations: iterations,
        };
    };
    //# sourceMappingURL=index.js.map

    var mixRecipe = function (keyword, separator) { return function (filterApi) {
        var shuffle = function (array) {
            var result = array.slice(0);
            var currentIndex = array.length, temporaryValue = null, randomIndex = null;
            // While there remain elements to shuffle...
            while (currentIndex !== 0) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = result[currentIndex];
                result[currentIndex] = result[randomIndex];
                result[randomIndex] = temporaryValue;
            }
            return result;
        };
        var mixPrepareFilter = function (_a, _b) {
            var fullKey = _a.fullKey, key = _a.key, idx = _a.idx, values = _a.values;
            var store = _b.store, filters = _b.filters, deferred = _b.deferred, nextIteration = _b.nextIteration;
            if (idx === null) {
                return shuffle(values[0]).join(separator);
            }
            if (store.has(fullKey)) {
                store.over(fullKey, function (v) { return v.concat(values[0]); });
            }
            else {
                store.set(fullKey, values[0]);
            }
            var replaceKey = "replaceFilter:" + key;
            if (!deferred.has(replaceKey)) {
                deferred.register(replaceKey, function () { return filters.register(key, mixApplyFilter); });
            }
            var mixKey = "mix:" + fullKey;
            if (!deferred.has(mixKey)) {
                deferred.register("mix:" + fullKey, function () { return store.over(fullKey, shuffle); });
            }
            nextIteration.activate();
        };
        var mixApplyFilter = function (_a, _b) {
            var fullKey = _a.fullKey, key = _a.key, idx = _a.idx, values = _a.values;
            var store = _b.store;
            var popped = [];
            for (var x = 0; x < values[0].length; x++) {
                popped.push(store.get(fullKey).shift());
            }
            return popped.join(separator);
        };
        filterApi.register(keyword, mixPrepareFilter);
    }; };
    //# sourceMappingURL=mix.js.map

    var recipes = {
        mix: mixRecipe,
    };
    //# sourceMappingURL=index.js.map

    globalThis.codeToString = toString;
    globalThis.parseCode = parseCode;
    globalThis.execute = execute;
    globalThis.renderTemplate = renderTemplate;
    globalThis.mkFilterManager = mkFilterManager;
    globalThis.filterRecipes = recipes;
    //# sourceMappingURL=index.js.map

}());
