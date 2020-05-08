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

    var TAG_START = '[[';
    var TAG_END = ']]';
    var ARG_SEP = '::';
    var splitValues = function (valuesRaw) {
        return valuesRaw === null
            ? []
            : valuesRaw.split(ARG_SEP).map(function (arg) { return arg.split('||'); });
    };
    //# sourceMappingURL=utils.js.map

    // img tags are parsed via HTML (!)
    var lexer = moo.states({
        main: {
            tagstart: {
                match: TAG_START,
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
                match: ARG_SEP,
                next: 'intag',
            },
            tagend: {
                match: TAG_END,
                pop: 1,
            },
        },
        intag: {
            tagstart: {
                match: TAG_START,
                push: 'key',
            },
            tagend: {
                match: TAG_END,
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
    var tagMaker = function () {
        var tagCounter = new Map();
        var getAndInc = function (key) {
            var result = tagCounter.has(key)
                ? tagCounter.get(key) + 1
                : 0;
            tagCounter.set(key, result);
            return result;
        };
        var mkTag = function (fullKey, valuesRaw, path) {
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
                path: path,
            };
        };
        return {
            mkTag: mkTag,
        };
    };
    var mkTagInfo = function (start, end, innerTags) {
        if (end === void 0) { end = 0; }
        if (innerTags === void 0) { innerTags = []; }
        return ({
            start: start,
            end: end,
            data: null,
            innerTags: innerTags,
        });
    };
    //# sourceMappingURL=types.js.map

    var tagKeeper = function () {
        var tm, tagInfos, getTagInfo, tagStack, nextLevel, value, startIndex, endIndex, foundTag;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tm = tagMaker();
                    tagInfos = mkTagInfo(0);
                    getTagInfo = function (path) {
                        var e_1, _a;
                        var reference = tagInfos;
                        try {
                            for (var path_1 = __values(path), path_1_1 = path_1.next(); !path_1_1.done; path_1_1 = path_1.next()) {
                                var id = path_1_1.value;
                                reference = reference.innerTags[id];
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (path_1_1 && !path_1_1.done && (_a = path_1.return)) _a.call(path_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return reference;
                    };
                    tagStack = [];
                    nextLevel = 0;
                    _b.label = 1;
                case 1:
                    return [4 /*yield*/, tagStack];
                case 2:
                    value = _b.sent();
                    if (value[0] >= 0) /* start */ {
                        startIndex = value[0];
                        getTagInfo(tagStack).innerTags.push(mkTagInfo(startIndex));
                        tagStack.push(nextLevel);
                        nextLevel = 0;
                    }
                    else /* end */ {
                        endIndex = Math.abs(value[0]);
                        foundTag = getTagInfo(tagStack);
                        foundTag.end = endIndex;
                        foundTag.data = tm.mkTag(value[1], (_a = value[2]) !== null && _a !== void 0 ? _a : null, __spread(tagStack));
                        if (tagStack.length === 0) {
                            return [2 /*return*/, tagInfos];
                        }
                        else {
                            nextLevel = tagStack.pop() + 1;
                        }
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    var initTagKeeper = function () {
        var tk = tagKeeper();
        tk.next();
        var startToken = function (offset) {
            return tk.next([offset]);
        };
        var endToken = function (offset, key, valuesRaw) {
            return tk.next([-offset, key, valuesRaw]);
        };
        var restart = function () {
            tk = tagKeeper();
            tk.next();
        };
        return {
            startToken: startToken,
            endToken: endToken,
            restart: restart,
        };
    };

    // Generated automatically by nearley, version 2.19.2
    // http://github.com/Hardmath123/nearley
    // Bypasses TS6133. Allow declared but unused functions.
    // @ts-ignore
    function id(d) { return d[0]; }
    var tagKeeper$1 = initTagKeeper();
    var grammar = {
        Lexer: lexer,
        ParserRules: [
            { "name": "start", "symbols": ["content", (lexer.has("EOF") ? { type: "EOF" } : EOF)], "postprocess": function () { return tagKeeper$1; } },
            { "name": "content$ebnf$1", "symbols": [] },
            { "name": "content$ebnf$1$subexpression$1", "symbols": ["tag", "_"] },
            { "name": "content$ebnf$1", "symbols": ["content$ebnf$1", "content$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "content", "symbols": ["_", "content$ebnf$1"] },
            { "name": "tag", "symbols": ["tagstart", "inner", (lexer.has("tagend") ? { type: "tagend" } : tagend)], "postprocess": function (_a) {
                    var _b = __read(_a, 3), _c = __read(_b[1], 2), keyname = _c[0], valuesRaw = _c[1], tagend = _b[2];
                    return [[
                            TAG_START,
                            "" + keyname + ARG_SEP + valuesRaw,
                            TAG_END,
                        ], tagKeeper$1.endToken(tagend.offset + TAG_END.length, keyname, valuesRaw)];
                } },
            { "name": "tagstart", "symbols": [(lexer.has("tagstart") ? { type: "tagstart" } : tagstart)], "postprocess": function (_a) {
                    var _b = __read(_a, 1), startToken = _b[0];
                    return [startToken.value, tagKeeper$1.startToken(startToken.offset + startToken.value.length - TAG_START.length)];
                } },
            { "name": "inner$ebnf$1$subexpression$1$ebnf$1", "symbols": [] },
            { "name": "inner$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["tag", "_values"] },
            { "name": "inner$ebnf$1$subexpression$1$ebnf$1", "symbols": ["inner$ebnf$1$subexpression$1$ebnf$1", "inner$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "inner$ebnf$1$subexpression$1", "symbols": [(lexer.has("sep") ? { type: "sep" } : sep), "_values", "inner$ebnf$1$subexpression$1$ebnf$1"] },
            { "name": "inner$ebnf$1", "symbols": ["inner$ebnf$1$subexpression$1"], "postprocess": id },
            { "name": "inner$ebnf$1", "symbols": [], "postprocess": function () { return null; } },
            { "name": "inner", "symbols": [(lexer.has("keyname") ? { type: "keyname" } : keyname), "inner$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 2), key = _b[0], rest = _b[1];
                    return rest
                        ? [key.value, rest[1] + rest[2].map(function (_a) {
                                var _b = __read(_a, 2), tag = _b[0], vtxt = _b[1];
                                return id(tag).join('') + vtxt;
                            })]
                        : [key.value];
                },
            },
            { "name": "_values$ebnf$1", "symbols": [] },
            { "name": "_values$ebnf$1", "symbols": ["_values$ebnf$1", (lexer.has("valuestext") ? { type: "valuestext" } : valuestext)], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "_values", "symbols": ["_values$ebnf$1"], "postprocess": function (_a) {
                    var _b = __read(_a, 1), vs = _b[0];
                    return vs.map(function (v) { return v.value; }).join('');
                } },
            { "name": "_$ebnf$1", "symbols": [] },
            { "name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("text") ? { type: "text" } : text)], "postprocess": function (d) { return d[0].concat([d[1]]); } },
            { "name": "_", "symbols": ["_$ebnf$1"], "postprocess": function () { return null; } }
        ],
        ParserStart: "start",
    };
    //# sourceMappingURL=template.js.map

    var parseTemplate = function (text) {
        var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        var parsed = parser.feed(text + '$').results;
        if (parsed.length > 1) {
            console.error('Ambiguous template grammar');
        }
        else if (parsed.length < 1) {
            console.error('Template grammar does not match');
        }
        var result = parsed[0].endToken(text.length, 'raw', text).value;
        parsed[0].restart();
        return result;
    };

    var renderTemplate = function (text, filterManager) {
        var e_1, _a;
        var result = text;
        try {
            for (var _b = __values(filterManager.iterations()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var iteration = _c.value;
                var rootTag = parseTemplate(text);
                result = postfixOuter(text, rootTag, iteration);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    var spliceSlice = function (str, lend, rend, add) {
        // We cannot pass negative lend directly to the 2nd slicing operation.
        var leftend = lend < 0
            ? Math.min(0, str.length + lend)
            : lend;
        return str.slice(0, leftend) + (add || "") + str.slice(rend);
    };
    var mkTagApi = function (text, tags) {
        var getText = function () { return text; };
        var updateText = function (newText) {
            text = newText;
        };
        var exists = function (path) {
            var e_2, _a;
            var currentPos = tags;
            try {
                for (var path_1 = __values(path), path_1_1 = path_1.next(); !path_1_1.done; path_1_1 = path_1.next()) {
                    var p = path_1_1.value;
                    if (currentPos.innerTags[p]) {
                        currentPos = currentPos.innerTags[p];
                    }
                    else {
                        return false;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (path_1_1 && !path_1_1.done && (_a = path_1.return)) _a.call(path_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return true;
        };
        var getPath = function (path) {
            var e_3, _a;
            var currentPos = tags;
            try {
                for (var path_2 = __values(path), path_2_1 = path_2.next(); !path_2_1.done; path_2_1 = path_2.next()) {
                    var p = path_2_1.value;
                    if (currentPos.innerTags[p]) {
                        currentPos = currentPos.innerTags[p];
                    }
                    else {
                        return null;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (path_2_1 && !path_2_1.done && (_a = path_2.return)) _a.call(path_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return currentPos;
        };
        return {
            getText: getText,
            updateText: updateText,
            get: getPath,
            exists: exists,
        };
    };
    var postfixOuter = function (text, rootTag, filterManager) {
        var stack = [0];
        var sum = 0;
        var processedText = text;
        var tagApi = mkTagApi(text, rootTag);
        var postfixInner = function (tag, i) {
            stack.push(sum);
            var innerResults = tag.innerTags.map(postfixInner);
            stack.push(tag.innerTags.length > 0
                ? sum - stack[stack.length - 1] /* stack.peek() */
                : 0);
            var innerOffset = stack.pop();
            var leftOffset = stack.pop();
            // values is still null at this point
            tag.data.values = splitValues(processedText.slice(tag.start + leftOffset + TAG_START.length + tag.data.fullKey.length + ARG_SEP.length, tag.end + leftOffset + innerOffset - TAG_END.length));
            var filterOutput = filterManager.processFilter(tag.data.key, tag.data, tagApi);
            var newOffset = filterOutput.result.length - (tag.end - tag.start);
            sum = innerOffset + leftOffset + newOffset;
            processedText = spliceSlice(processedText, tag.start + leftOffset, tag.end + leftOffset + innerOffset, filterOutput.result);
            return filterOutput;
        };
        rootTag.innerTags.forEach(postfixInner);
        return processedText;
    };

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
            result: valuesRaw === null
                ? "" + TAG_START + fullKey + TAG_END
                : "" + TAG_START + fullKey + ARG_SEP + valuesRaw + TAG_END,
            memoize: false,
        });
    };
    var rawFilter = function (_a) {
        var valuesRaw = _a.valuesRaw;
        return ({
            result: valuesRaw,
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
    var executeFilter = function (filter, data, internals) {
        return standardizeFilterResult(filter(data, internals));
    };
    var mkFilterApi = function (filters) {
        var registerFilter = function (name, filter) {
            filters.set(name, filter);
        };
        var hasFilter = function (name) { return name === 'raw'
            ? true
            : filters.has(name); };
        var getFilter = function (name) { return name === 'raw'
            ? rawFilter
            : filters.has(name)
                ? filters.get(name)
                : null; };
        var getOrDefaultFilter = function (name) { var _a; return (_a = getFilter(name)) !== null && _a !== void 0 ? _a : defaultFilter; };
        var unregisterFilter = function (name) {
            filters.delete(name);
        };
        var clearFilters = function () {
            filters.clear();
        };
        return {
            get: getFilter,
            getOrDefault: getOrDefaultFilter,
            register: registerFilter,
            has: hasFilter,
            unregister: unregisterFilter,
            clear: clearFilters,
        };
    };
    //# sourceMappingURL=filters.js.map

    var mkDeferredApi = function (deferred) {
        var registerDeferred = function (name, proc) {
            deferred.set(name, proc);
        };
        var hasDeferred = function (name) { return deferred.has(name); };
        var unregisterDeferred = function (name) {
            deferred.delete(name);
        };
        var clearDeferred = function () {
            deferred.clear();
        };
        var forEachDeferred = function () {
            var e_1, _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                for (var deferred_1 = __values(deferred), deferred_1_1 = deferred_1.next(); !deferred_1_1.done; deferred_1_1 = deferred_1.next()) {
                    var _b = __read(deferred_1_1.value, 2), name_1 = _b[0], func = _b[1];
                    func.apply(void 0, __spread([name_1], args));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (deferred_1_1 && !deferred_1_1.done && (_a = deferred_1.return)) _a.call(deferred_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        return {
            register: registerDeferred,
            has: hasDeferred,
            unregister: unregisterDeferred,
            clear: clearDeferred,
            forEach: forEachDeferred,
        };
    };
    //# sourceMappingURL=deferred.js.map

    var mkFilterManager = function (custom, memoizer) {
        if (custom === void 0) { custom = {}; }
        if (memoizer === void 0) { memoizer = defaultMemoizer; }
        var store = mkStoreApi(new Map());
        var filters = mkFilterApi(new Map());
        var deferred = mkDeferredApi(new Map());
        var nextIteration = true;
        var nextIterationApi = {
            activate: function (value) {
                if (value === void 0) { value = true; }
                nextIteration = value;
            },
            isActivated: function () { return nextIteration; },
        };
        var processFilter = function (key, data, tagApi) {
            var memoizerKey = generateMemoizerKey(data);
            if (memoizer.hasItem(memoizerKey)) {
                return memoizer.getItem(memoizerKey);
            }
            var internals = {
                custom: custom,
                nextIteration: nextIterationApi,
                store: store,
                filters: filters,
                deferred: deferred,
                tag: tagApi,
            };
            var result = executeFilter(filters.getOrDefault(key), data, internals);
            if (result.memoize) {
                memoizer.setItem(memoizerKey, result);
            }
            return result;
        };
        var addRecipe = function (recipe) {
            recipe(filters);
        };
        var iterations = function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!nextIteration) return [3 /*break*/, 2];
                        nextIteration = false;
                        return [4 /*yield*/, {
                                processFilter: processFilter,
                            }];
                    case 1:
                        _a.sent();
                        deferred.forEach();
                        deferred.clear();
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        };
        return {
            filters: filters,
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

    var debugRecipe = function (filterApi) {
        var pathFilter = function (_a) {
            var path = _a.path;
            return path.join(':');
        };
        filterApi.register('tagpath', pathFilter);
        var testFilter = function (_a, _b) {
            var tag = _b.tag;
            console.log(tag.get([0]));
            return '';
        };
        filterApi.register('test', testFilter);
    };
    //# sourceMappingURL=debug.js.map

    var recipes = {
        mix: mixRecipe,
        debug: debugRecipe,
    };
    //# sourceMappingURL=index.js.map

    globalThis.renderTemplate = renderTemplate;
    globalThis.mkFilterManager = mkFilterManager;
    globalThis.filterRecipes = recipes;
    //# sourceMappingURL=index.js.map

}());
