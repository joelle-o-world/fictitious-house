(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
  A class for scheduling text to speech in a queue.
*/

class TTSQueue {
  constructor(responsiveVoice) {
    this.queue = []
    this.nowPlaying = null
    this.rv = responsiveVoice
  }

  speak(text, voice, parameters) {
    if(!(/\w/).test(text))
      return "nah"

    if(this.nowPlaying)
      this.queue.push([text, voice, parameters])
    else
      this.playNow(text, voice, parameters)
  }

  playNow(text, voice, parameters) {
    parameters = Object.assign({}, parameters)
    parameters.onend = () => this.next()
    this.rv.speak(text, voice, parameters)
    this.nowPlaying = [text, voice, parameters]
  }

  next() {
    this.nowPlaying = null
    if(this.queue.length)
      this.playNow(...this.queue.shift())
    else
      this.done()
  }

  done() {
    this.nowPlaying = null
    if(this.onDone)
      this.onDone()
  }
}
module.exports = TTSQueue

},{}],2:[function(require,module,exports){
class TickyText {
  constructor(targetElement) {
    this.queue = []
    this.placeInCurrent = 0 // Index of next character to print from
    this.intervalTimer = null
    this.str = ""
    this.speed = 25 // ms

    this.targetElement = targetElement
  }

  write(...stuff) {
    // add stuff to the print queue
    for(var i in stuff) {
      if(stuff[i].constructor != String)
        throw "TickyText#write expects String arguments."
      this.queue.push(stuff[i])
    }
    if(!this.intervalTimer)
      this.startTicking()
  }

  writeln(...str) {
    for(var i in str)
      this.write(str[i])
    this.write("\n")
  }

  startTicking() {
    // begin printing characters to target/string
    this.intervalTimer = setInterval(() => {
      this.tick()
    }, this.speed)
  }
  stopTicking() {
    // pause printing
    if(this.intervalTimer)
      clearInterval(this.intervalTimer)
    this.intervalTimer = null

    if(this.onStopTicking)
      this.onStopTicking()
  }

  tick() {
    // read next character to string
    this.str += this.queue[0][this.placeInCurrent]

    // copy string to target element
    if(this.targetElement)
      this.targetElement.innerHTML = this.str

    // increment index in current string
    ++this.placeInCurrent
    // proceeed to next string at end. If no more strings stop ticking.
    if(this.placeInCurrent >= this.queue[0].length) {
      this.queue.shift()
      this.placeInCurrent = 0
      if(this.queue.length == 0)
        this.stopTicking()
    }
  }
}
module.exports = TickyText

},{}],3:[function(require,module,exports){
const Declarer = require('../src/Declarer')
const spellcheck = require('../src/util/spellcheck')


const dec = new Declarer
dec.predicates.addPredicates(
  ...Object.values(require('../src/predicates'))
)


module.exports.main = function() {
  dec.declare(
    'a person is called Mike Roberts',
    'another person is called Nye',
    'another person is called Joel',
    'a room is called B5',
    'another room is called B4',
    'Joel is in B4',
    'Nye is in B4',
    'Mike Roberts is in B5',
    'the table is in B4',
    'the computer is on the table',
    'a chair is in B4',
    'another chair is in B4',
    //*/


    /*
    "a person is called Mihai",
    "the room that Mihai is in is called The Portico",
    "Mihai holds a cigarette",
    "another person that is called Karolina is in The Portico",
    'Karolina holds another cigarette',
    'Mihai smokes the cigarette that Mihai holds',
    'Karolina smokes the cigarette that Karolina holds',
    'another person that is in The Portico holds a salmon wrap',
    'the person that holds a salmon wrap is called Grace',


    'another room is called Gordons',
    'a salmon wrap is in Gordons',
    'a person is called Grace',
    'Grace is in Gordons',
    'Grace steals the salmon wrap',
    'Grace holds the salmon wrap',
    'another room is called The Classics Room',
    'The Classics Room contains Grace',
    'Grace steals the salmon wrap',
    */
  )

  setInterval(
    writeRandomFact,
    3500
  )

  writeRandomFact()
}

let lastFact = null
function writeRandomFact() {
  lastFact = null
  let entity
  if(lastFact)
    entity = lastFact.randomEntityArg()
  else
    entity = dec.randomEntity()

  let fact = entity.randomFact()
  write(fact.str(undefined, dec.ctx, 5), '\n\n')

  lastFact = fact
}

function write(...args) {
  for(let str of args)
    module.exports.write(spellcheck(str))
}

module.exports.input = function(str) {
//  write("\"", str, "\"\n")
  let sentence = dec.parse(str)
  sentence.declare()
  lastFact = sentence
}

},{"../src/Declarer":12,"../src/predicates":39,"../src/util/spellcheck":52}],4:[function(require,module,exports){
const TickyText = require("./TickyText")
const TTSQueue = require("./TTSQueue")

const myGame = require('./game1.js')

window.onload = function() {


  //document.getElementById('help').innerHTML = myGame.helpHTML
}

window.onclick = function() {
  let ticky_text = new TickyText(document.getElementById('output'))

  const tts = window.responsiveVoice ? new TTSQueue(window.responsiveVoice) : null

  myGame.write = str => {
    ticky_text.write(str)
    if(tts)
      tts.speak(str, "UK English Male", {rate: 1, pitch:1/2})
  }

  window.userInput = function(str) {
    myGame.input(str)
  }
  window.onclick = null

  myGame.main()
}

},{"./TTSQueue":1,"./TickyText":2,"./game1.js":3}],5:[function(require,module,exports){
'use strict';
/* eslint indent: 4 */


// Private helper class
class SubRange {
    constructor(low, high) {
        this.low = low;
        this.high = high;
        this.length = 1 + high - low;
    }

    overlaps(range) {
        return !(this.high < range.low || this.low > range.high);
    }

    touches(range) {
        return !(this.high + 1 < range.low || this.low - 1 > range.high);
    }

    // Returns inclusive combination of SubRanges as a SubRange.
    add(range) {
        return new SubRange(
            Math.min(this.low, range.low),
            Math.max(this.high, range.high)
        );
    }

    // Returns subtraction of SubRanges as an array of SubRanges.
    // (There's a case where subtraction divides it in 2)
    subtract(range) {
        if (range.low <= this.low && range.high >= this.high) {
            return [];
        } else if (range.low > this.low && range.high < this.high) {
            return [
                new SubRange(this.low, range.low - 1),
                new SubRange(range.high + 1, this.high)
            ];
        } else if (range.low <= this.low) {
            return [new SubRange(range.high + 1, this.high)];
        } else {
            return [new SubRange(this.low, range.low - 1)];
        }
    }

    toString() {
        return this.low == this.high ?
            this.low.toString() : this.low + '-' + this.high;
    }
}


class DRange {
    constructor(a, b) {
        this.ranges = [];
        this.length = 0;
        if (a != null) this.add(a, b);
    }

    _update_length() {
        this.length = this.ranges.reduce((previous, range) => {
            return previous + range.length;
        }, 0);
    }

    add(a, b) {
        var _add = (subrange) => {
            var i = 0;
            while (i < this.ranges.length && !subrange.touches(this.ranges[i])) {
                i++;
            }
            var newRanges = this.ranges.slice(0, i);
            while (i < this.ranges.length && subrange.touches(this.ranges[i])) {
                subrange = subrange.add(this.ranges[i]);
                i++;
            }
            newRanges.push(subrange);
            this.ranges = newRanges.concat(this.ranges.slice(i));
            this._update_length();
        }

        if (a instanceof DRange) {
            a.ranges.forEach(_add);
        } else {
            if (b == null) b = a;
            _add(new SubRange(a, b));
        }
        return this;
    }

    subtract(a, b) {
        var _subtract = (subrange) => {
            var i = 0;
            while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
                i++;
            }
            var newRanges = this.ranges.slice(0, i);
            while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
                newRanges = newRanges.concat(this.ranges[i].subtract(subrange));
                i++;
            }
            this.ranges = newRanges.concat(this.ranges.slice(i));
            this._update_length();
        };

        if (a instanceof DRange) {
            a.ranges.forEach(_subtract);
        } else {
            if (b == null) b = a;
            _subtract(new SubRange(a, b));
        }
        return this;
    }

    intersect(a, b) {
        var newRanges = [];
        var _intersect = (subrange) => {
            var i = 0;
            while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
                i++;
            }
            while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
                var low = Math.max(this.ranges[i].low, subrange.low);
                var high = Math.min(this.ranges[i].high, subrange.high);
                newRanges.push(new SubRange(low, high));
                i++;
            }
        };

        if (a instanceof DRange) {
            a.ranges.forEach(_intersect);
        } else {
            if (b == null) b = a;
            _intersect(new SubRange(a, b));
        }
        this.ranges = newRanges;
        this._update_length();
        return this;
    }

    index(index) {
        var i = 0;
        while (i < this.ranges.length && this.ranges[i].length <= index) {
            index -= this.ranges[i].length;
            i++;
        }
        return this.ranges[i].low + index;
    }

    toString() {
        return '[ ' + this.ranges.join(', ') + ' ]';
    }

    clone() {
        return new DRange(this);
    }

    numbers() {
        return this.ranges.reduce((result, subrange) => {
            var i = subrange.low;
            while (i <= subrange.high) {
                result.push(i);
                i++;
            }
            return result;
        }, []);
    }

    subranges() {
        return this.ranges.map((subrange) => ({
            low: subrange.low,
            high: subrange.high,
            length: 1 + subrange.high - subrange.low
        }));
    }
}

module.exports = DRange;

},{}],6:[function(require,module,exports){
const ret    = require('ret');
const DRange = require('drange');
const types  = ret.types;


module.exports = class RandExp {
  /**
   * @constructor
   * @param {RegExp|String} regexp
   * @param {String} m
   */
  constructor(regexp, m) {
    this._setDefaults(regexp);
    if (regexp instanceof RegExp) {
      this.ignoreCase = regexp.ignoreCase;
      this.multiline = regexp.multiline;
      regexp = regexp.source;

    } else if (typeof regexp === 'string') {
      this.ignoreCase = m && m.indexOf('i') !== -1;
      this.multiline = m && m.indexOf('m') !== -1;
    } else {
      throw new Error('Expected a regexp or string');
    }

    this.tokens = ret(regexp);
  }


  /**
   * Checks if some custom properties have been set for this regexp.
   *
   * @param {RandExp} randexp
   * @param {RegExp} regexp
   */
  _setDefaults(regexp) {
    // When a repetitional token has its max set to Infinite,
    // randexp won't actually generate a random amount between min and Infinite
    // instead it will see Infinite as min + 100.
    this.max = regexp.max != null ? regexp.max :
      RandExp.prototype.max != null ? RandExp.prototype.max : 100;

    // This allows expanding to include additional characters
    // for instance: RandExp.defaultRange.add(0, 65535);
    this.defaultRange = regexp.defaultRange ?
      regexp.defaultRange : this.defaultRange.clone();

    if (regexp.randInt) {
      this.randInt = regexp.randInt;
    }
  }


  /**
   * Generates the random string.
   *
   * @return {String}
   */
  gen() {
    return this._gen(this.tokens, []);
  }


  /**
   * Generate random string modeled after given tokens.
   *
   * @param {Object} token
   * @param {Array.<String>} groups
   * @return {String}
   */
  _gen(token, groups) {
    var stack, str, n, i, l;

    switch (token.type) {
      case types.ROOT:
      case types.GROUP:
        // Ignore lookaheads for now.
        if (token.followedBy || token.notFollowedBy) { return ''; }

        // Insert placeholder until group string is generated.
        if (token.remember && token.groupNumber === undefined) {
          token.groupNumber = groups.push(null) - 1;
        }

        stack = token.options ?
          this._randSelect(token.options) : token.stack;

        str = '';
        for (i = 0, l = stack.length; i < l; i++) {
          str += this._gen(stack[i], groups);
        }

        if (token.remember) {
          groups[token.groupNumber] = str;
        }
        return str;

      case types.POSITION:
        // Do nothing for now.
        return '';

      case types.SET:
        var expandedSet = this._expand(token);
        if (!expandedSet.length) { return ''; }
        return String.fromCharCode(this._randSelect(expandedSet));

      case types.REPETITION:
        // Randomly generate number between min and max.
        n = this.randInt(token.min,
          token.max === Infinity ? token.min + this.max : token.max);

        str = '';
        for (i = 0; i < n; i++) {
          str += this._gen(token.value, groups);
        }

        return str;

      case types.REFERENCE:
        return groups[token.value - 1] || '';

      case types.CHAR:
        var code = this.ignoreCase && this._randBool() ?
          this._toOtherCase(token.value) : token.value;
        return String.fromCharCode(code);
    }
  }


  /**
   * If code is alphabetic, converts to other case.
   * If not alphabetic, returns back code.
   *
   * @param {Number} code
   * @return {Number}
   */
  _toOtherCase(code) {
    return code + (97 <= code && code <= 122 ? -32 :
      65 <= code && code <= 90  ?  32 : 0);
  }


  /**
   * Randomly returns a true or false value.
   *
   * @return {Boolean}
   */
  _randBool() {
    return !this.randInt(0, 1);
  }


  /**
   * Randomly selects and returns a value from the array.
   *
   * @param {Array.<Object>} arr
   * @return {Object}
   */
  _randSelect(arr) {
    if (arr instanceof DRange) {
      return arr.index(this.randInt(0, arr.length - 1));
    }
    return arr[this.randInt(0, arr.length - 1)];
  }


  /**
   * expands a token to a DiscontinuousRange of characters which has a
   * length and an index function (for random selecting)
   *
   * @param {Object} token
   * @return {DiscontinuousRange}
   */
  _expand(token) {
    if (token.type === ret.types.CHAR) {
      return new DRange(token.value);
    } else if (token.type === ret.types.RANGE) {
      return new DRange(token.from, token.to);
    } else {
      let drange = new DRange();
      for (let i = 0; i < token.set.length; i++) {
        let subrange = this._expand(token.set[i]);
        drange.add(subrange);
        if (this.ignoreCase) {
          for (let j = 0; j < subrange.length; j++) {
            let code = subrange.index(j);
            let otherCaseCode = this._toOtherCase(code);
            if (code !== otherCaseCode) {
              drange.add(otherCaseCode);
            }
          }
        }
      }
      if (token.not) {
        return this.defaultRange.clone().subtract(drange);
      } else {
        return this.defaultRange.clone().intersect(drange);
      }
    }
  }


  /**
   * Randomly generates and returns a number between a and b (inclusive).
   *
   * @param {Number} a
   * @param {Number} b
   * @return {Number}
   */
  randInt(a, b) {
    return a + Math.floor(Math.random() * (1 + b - a));
  }


  /**
   * Default range of characters to generate from.
   */
  get defaultRange() {
    return this._range = this._range || new DRange(32, 126);
  }

  set defaultRange(range) {
    this._range = range;
  }


  /**
   *
   * Enables use of randexp with a shorter call.
   *
   * @param {RegExp|String| regexp}
   * @param {String} m
   * @return {String}
   */
  static randexp(regexp, m) {
    var randexp;
    if(typeof regexp === 'string') {
      regexp = new RegExp(regexp, m);
    }

    if (regexp._randexp === undefined) {
      randexp = new RandExp(regexp, m);
      regexp._randexp = randexp;
    } else {
      randexp = regexp._randexp;
      randexp._setDefaults(regexp);
    }
    return randexp.gen();
  }


  /**
   * Enables sugary /regexp/.gen syntax.
   */
  static sugar() {
    /* eshint freeze:false */
    RegExp.prototype.gen = function() {
      return RandExp.randexp(this);
    };
  }
};

},{"drange":5,"ret":7}],7:[function(require,module,exports){
const util      = require('./util');
const types     = require('./types');
const sets      = require('./sets');
const positions = require('./positions');


module.exports = (regexpStr) => {
  var i = 0, l, c,
    start = { type: types.ROOT, stack: []},

    // Keep track of last clause/group and stack.
    lastGroup = start,
    last = start.stack,
    groupStack = [];


  var repeatErr = (i) => {
    util.error(regexpStr, `Nothing to repeat at column ${i - 1}`);
  };

  // Decode a few escaped characters.
  var str = util.strToChars(regexpStr);
  l = str.length;

  // Iterate through each character in string.
  while (i < l) {
    c = str[i++];

    switch (c) {
      // Handle escaped characters, inclues a few sets.
      case '\\':
        c = str[i++];

        switch (c) {
          case 'b':
            last.push(positions.wordBoundary());
            break;

          case 'B':
            last.push(positions.nonWordBoundary());
            break;

          case 'w':
            last.push(sets.words());
            break;

          case 'W':
            last.push(sets.notWords());
            break;

          case 'd':
            last.push(sets.ints());
            break;

          case 'D':
            last.push(sets.notInts());
            break;

          case 's':
            last.push(sets.whitespace());
            break;

          case 'S':
            last.push(sets.notWhitespace());
            break;

          default:
            // Check if c is integer.
            // In which case it's a reference.
            if (/\d/.test(c)) {
              last.push({ type: types.REFERENCE, value: parseInt(c, 10) });

            // Escaped character.
            } else {
              last.push({ type: types.CHAR, value: c.charCodeAt(0) });
            }
        }

        break;


      // Positionals.
      case '^':
        last.push(positions.begin());
        break;

      case '$':
        last.push(positions.end());
        break;


      // Handle custom sets.
      case '[':
        // Check if this class is 'anti' i.e. [^abc].
        var not;
        if (str[i] === '^') {
          not = true;
          i++;
        } else {
          not = false;
        }

        // Get all the characters in class.
        var classTokens = util.tokenizeClass(str.slice(i), regexpStr);

        // Increase index by length of class.
        i += classTokens[1];
        last.push({
          type: types.SET,
          set: classTokens[0],
          not,
        });

        break;


      // Class of any character except \n.
      case '.':
        last.push(sets.anyChar());
        break;


      // Push group onto stack.
      case '(':
        // Create group.
        var group = {
          type: types.GROUP,
          stack: [],
          remember: true,
        };

        c = str[i];

        // If if this is a special kind of group.
        if (c === '?') {
          c = str[i + 1];
          i += 2;

          // Match if followed by.
          if (c === '=') {
            group.followedBy = true;

          // Match if not followed by.
          } else if (c === '!') {
            group.notFollowedBy = true;

          } else if (c !== ':') {
            util.error(regexpStr,
              `Invalid group, character '${c}'` +
              ` after '?' at column ${i - 1}`);
          }

          group.remember = false;
        }

        // Insert subgroup into current group stack.
        last.push(group);

        // Remember the current group for when the group closes.
        groupStack.push(lastGroup);

        // Make this new group the current group.
        lastGroup = group;
        last = group.stack;
        break;


      // Pop group out of stack.
      case ')':
        if (groupStack.length === 0) {
          util.error(regexpStr, `Unmatched ) at column ${i - 1}`);
        }
        lastGroup = groupStack.pop();

        // Check if this group has a PIPE.
        // To get back the correct last stack.
        last = lastGroup.options ?
          lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
        break;


      // Use pipe character to give more choices.
      case '|':
        // Create array where options are if this is the first PIPE
        // in this clause.
        if (!lastGroup.options) {
          lastGroup.options = [lastGroup.stack];
          delete lastGroup.stack;
        }

        // Create a new stack and add to options for rest of clause.
        var stack = [];
        lastGroup.options.push(stack);
        last = stack;
        break;


      // Repetition.
      // For every repetition, remove last element from last stack
      // then insert back a RANGE object.
      // This design is chosen because there could be more than
      // one repetition symbols in a regex i.e. `a?+{2,3}`.
      case '{':
        var rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)), min, max;
        if (rs !== null) {
          if (last.length === 0) {
            repeatErr(i);
          }
          min = parseInt(rs[1], 10);
          max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min;
          i += rs[0].length;

          last.push({
            type: types.REPETITION,
            min,
            max,
            value: last.pop(),
          });
        } else {
          last.push({
            type: types.CHAR,
            value: 123,
          });
        }
        break;

      case '?':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 0,
          max: 1,
          value: last.pop(),
        });
        break;

      case '+':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 1,
          max: Infinity,
          value: last.pop(),
        });
        break;

      case '*':
        if (last.length === 0) {
          repeatErr(i);
        }
        last.push({
          type: types.REPETITION,
          min: 0,
          max: Infinity,
          value: last.pop(),
        });
        break;


      // Default is a character that is not `\[](){}?+*^$`.
      default:
        last.push({
          type: types.CHAR,
          value: c.charCodeAt(0),
        });
    }

  }

  // Check if any groups have not been closed.
  if (groupStack.length !== 0) {
    util.error(regexpStr, 'Unterminated group');
  }

  return start;
};

module.exports.types = types;

},{"./positions":8,"./sets":9,"./types":10,"./util":11}],8:[function(require,module,exports){
const types = require('./types');
exports.wordBoundary = () => ({ type: types.POSITION, value: 'b' });
exports.nonWordBoundary = () => ({ type: types.POSITION, value: 'B' });
exports.begin = () => ({ type: types.POSITION, value: '^' });
exports.end = () => ({ type: types.POSITION, value: '$' });

},{"./types":10}],9:[function(require,module,exports){
const types = require('./types');

const INTS = () => [{ type: types.RANGE , from: 48, to: 57 }];

const WORDS = () => {
  return [
    { type: types.CHAR, value: 95 },
    { type: types.RANGE, from: 97, to: 122 },
    { type: types.RANGE, from: 65, to: 90 }
  ].concat(INTS());
};

const WHITESPACE = () => {
  return [
    { type: types.CHAR, value: 9 },
    { type: types.CHAR, value: 10 },
    { type: types.CHAR, value: 11 },
    { type: types.CHAR, value: 12 },
    { type: types.CHAR, value: 13 },
    { type: types.CHAR, value: 32 },
    { type: types.CHAR, value: 160 },
    { type: types.CHAR, value: 5760 },
    { type: types.RANGE, from: 8192, to: 8202 },
    { type: types.CHAR, value: 8232 },
    { type: types.CHAR, value: 8233 },
    { type: types.CHAR, value: 8239 },
    { type: types.CHAR, value: 8287 },
    { type: types.CHAR, value: 12288 },
    { type: types.CHAR, value: 65279 }
  ];
};

const NOTANYCHAR = () => {
  return [
    { type: types.CHAR, value: 10 },
    { type: types.CHAR, value: 13 },
    { type: types.CHAR, value: 8232 },
    { type: types.CHAR, value: 8233 },
  ];
};

// Predefined class objects.
exports.words = () => ({ type: types.SET, set: WORDS(), not: false });
exports.notWords = () => ({ type: types.SET, set: WORDS(), not: true });
exports.ints = () => ({ type: types.SET, set: INTS(), not: false });
exports.notInts = () => ({ type: types.SET, set: INTS(), not: true });
exports.whitespace = () => ({ type: types.SET, set: WHITESPACE(), not: false });
exports.notWhitespace = () => ({ type: types.SET, set: WHITESPACE(), not: true });
exports.anyChar = () => ({ type: types.SET, set: NOTANYCHAR(), not: true });

},{"./types":10}],10:[function(require,module,exports){
module.exports = {
  ROOT       : 0,
  GROUP      : 1,
  POSITION   : 2,
  SET        : 3,
  RANGE      : 4,
  REPETITION : 5,
  REFERENCE  : 6,
  CHAR       : 7,
};

},{}],11:[function(require,module,exports){
const types = require('./types');
const sets  = require('./sets');


const CTRL = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?';
const SLSH = { '0': 0, 't': 9, 'n': 10, 'v': 11, 'f': 12, 'r': 13 };

/**
 * Finds character representations in str and convert all to
 * their respective characters
 *
 * @param {String} str
 * @return {String}
 */
exports.strToChars = function(str) {
  /* jshint maxlen: false */
  var chars_regex = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g;
  str = str.replace(chars_regex, function(s, b, lbs, a16, b16, c8, dctrl, eslsh) {
    if (lbs) {
      return s;
    }

    var code = b ? 8 :
      a16   ? parseInt(a16, 16) :
      b16   ? parseInt(b16, 16) :
      c8    ? parseInt(c8,   8) :
      dctrl ? CTRL.indexOf(dctrl) :
      SLSH[eslsh];

    var c = String.fromCharCode(code);

    // Escape special regex characters.
    if (/[[\]{}^$.|?*+()]/.test(c)) {
      c = '\\' + c;
    }

    return c;
  });

  return str;
};


/**
 * turns class into tokens
 * reads str until it encounters a ] not preceeded by a \
 *
 * @param {String} str
 * @param {String} regexpStr
 * @return {Array.<Array.<Object>, Number>}
 */
exports.tokenizeClass = (str, regexpStr) => {
  /* jshint maxlen: false */
  var tokens = [];
  var regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?([^])/g;
  var rs, c;


  while ((rs = regexp.exec(str)) != null) {
    if (rs[1]) {
      tokens.push(sets.words());

    } else if (rs[2]) {
      tokens.push(sets.ints());

    } else if (rs[3]) {
      tokens.push(sets.whitespace());

    } else if (rs[4]) {
      tokens.push(sets.notWords());

    } else if (rs[5]) {
      tokens.push(sets.notInts());

    } else if (rs[6]) {
      tokens.push(sets.notWhitespace());

    } else if (rs[7]) {
      tokens.push({
        type: types.RANGE,
        from: (rs[8] || rs[9]).charCodeAt(0),
        to: rs[10].charCodeAt(0),
      });

    } else if ((c = rs[12])) {
      tokens.push({
        type: types.CHAR,
        value: c.charCodeAt(0),
      });

    } else {
      return [tokens, regexp.lastIndex];
    }
  }

  exports.error(regexpStr, 'Unterminated character class');
};


/**
 * Shortcut to throw errors.
 *
 * @param {String} regexp
 * @param {String} msg
 */
exports.error = (regexp, msg) => {
  throw new SyntaxError('Invalid regular expression: /' + regexp + '/: ' + msg);
};

},{"./sets":9,"./types":10}],12:[function(require,module,exports){
const spawn = require('./spawn')
const regOps = require('./util/regOps')
const PredicateSet = require('./PredicateSet')
const Sentence = require('./Sentence')
const NounPhraseSentence = require('./NounPhraseSentence')
const {getTenseType} = require('./util/conjugate/verbPhrase')
const DescriptionContext = require("./DescriptionContext")

class Declarer {
  constructor() {
    this.entitys = [] // an iterator of Entity objects
    this.predicates = new PredicateSet // an iterator of predicates
    this.ctx = new DescriptionContext()
  }

  findOrSpawn(nounPhraseStr) {
    let entity = this.findFirst(nounPhraseStr)
    if(!entity)
      entity = spawn(nounPhraseStr)

    return entity
  }

  findFirst(matchStr) {
    for(let entity of this.entitys) {
      if(entity.matches(matchStr))
        return entity
    }
  }

  *find(matchStr, searchLimit=1000) {
    let ctxMatch = this.ctx.parse(matchStr)
    if(ctxMatch)
      return ctxMatch

    let results = []
    for(let entity of this.entitys)
      if(entity.matches(matchStr))
        yield entity
  }

  parseNounPhrase(str) {
    // first check for a simple solution
    let simple = this.findOrSpawn(str)
    if(simple)
      return simple

    // otherwise parse it as a noun phrase using the predicates
    let interpretations = this.predicates.parseNounPhrase(str)

    // filter interpretations by tense
    interpretations = interpretations.filter(I => I.tense == 'simple_present')

    // try to find sub-nounPhrases for each possibility until a solution is found
    for(let {args, predicate, paramIndex, tense} of interpretations) {
      let solutionArgs = []
      for(let i in args) {
        if(predicate.params[i].literal)
          // pass literal args straight through
          solutionArgs[i] = args[i]
        else
          solutionArgs[i] = this.parseNounPhrase(args[i])
      }

      if(!solutionArgs.includes(null)) {
        return new NounPhraseSentence(paramIndex, predicate, solutionArgs)
      }
    }


    return null
  }

  declareNounPhrase(strOrSolution) {
    // if passed a string, parse it first
    let solution
    if(strOrSolution.constructor == String)
      solution = this.parseNounPhrase(strOrSolution)
    else
      solution = strOrSolution


    // return null is failed to parse string or if passed null
    if(!solution)
      return null

    if(solution.isNounPhraseSentence) {
      let recursiveArgs = solution.recursiveEntityArgs
      for(let arg of recursiveArgs)
        this.addEntity(arg)

      solution.start()

      return solution.mainArgument
    } else {
      if(solution.isEntity)
        this.addEntity(solution)
      return solution
    }

    return null
  }

  addEntity(entity) {
    // add a Entity to the entitys
    if(!entity.isEntity)
      console.warn('adding a entity which is not a entity')

    if(entity.isEntity && !this.entitys.includes(entity)) {
      this.entitys.push(entity)
    }
  }

  parse(declarationStr, tenses, forbidSpawn=false) {
    let interpretations = this.predicates.parse(declarationStr, tenses)

    for(let {args, predicate, tense} of interpretations) {
      for(let i in args) {
        let arg = args[i]
        if(!predicate.params[i].literal) {
          if(forbidSpawn)
            args[i] = this.findFirst(arg)
          else
            args[i] = this.parseNounPhrase(arg)
        }
      }

      if(args.includes(null) || args.includes(undefined))
        continue
      else {
        let sentence = new Sentence(predicate, args)//{args, predicate, tense}
        sentence.source = 'parsed'
        sentence.parsed_tense = tense
        return sentence
      }
    }

    // if we get here, we have failed
    return null
  }

  parseImperative(declarationStr, subject, forbidSpawn=false) {
    let interpretations = this.predicates.parseImperative(declarationStr, subject)

    for(let {args, predicate, tense} of interpretations) {
      for(let i in args) {
        let arg = args[i]
        if(!predicate.params[i].literal) {
          if(forbidSpawn)
            args[i] = this.findFirst(arg)
          else
            args[i] = this.parseNounPhrase(arg)
        }
      }

      if(args.includes(null) || args.includes(undefined))
        continue
      else {
        let sentence = new Sentence(predicate, args)//{args, predicate, tense}
        sentence.source = 'parsed'
        sentence.parsed_tense = tense
        return sentence
      }
    }

    // if we get here, we have failed
    return null
  }

  declare(...declarationStrings) {
    for(let str of declarationStrings) {
      let sentence = this.parse(str)

      if(!sentence /*|| info.tense != 'simple_present'*/) {
        console.warn('DECLARATION FAILED:', str)
        return null
      }

      let tenseType = getTenseType(sentence.parsed_tense)

      if(tenseType == 'present') {
        let entitysToAdd = sentence.recursiveEntityArgs
        for(let entity of entitysToAdd)
          this.addEntity(entity)

        sentence.start()

      } else if(tenseType == 'past') {
        let entitysToAdd = sentence.recursiveEntityArgs
        for(let entity of entitysToAdd)
          this.addEntity(entity)

        sentence.start()
        sentence.stop()
      } else {
        console.warn('declaration with strange tense:', sentence.parsed_tense)
      }
    }
    return this
  }

  check(str) {
    let sentence = this.parse(str, undefined, true)

    if(!sentence) {
      //console.warn("CHECK FAILED, couldn't parse:", str)
      return false
    }

    let tenseType = getTenseType(sentence.parsed_tense)

    if(tenseType == 'present')
      return sentence.trueInPresent()
    else if(tenseType == 'past')
      return sentence.trueInPast()
    else
      return undefined

  }

  printEntityList() {
    return this.entitys.map(entity => entity.ref())
  }
  randomEntity() {
    return this.entitys[Math.floor(Math.random()*this.entitys.length)]
  }
  randomFact() {
    return this.randomEntity().randomFact()
  }
  randomSentence() {
    return this.randomEntity().randomSentence()
  }
  randomPredicate() {
    return this.predicates.random()
  }
}
module.exports = Declarer

},{"./DescriptionContext":13,"./NounPhraseSentence":16,"./PredicateSet":18,"./Sentence":20,"./spawn":42,"./util/conjugate/verbPhrase":47,"./util/regOps":50}],13:[function(require,module,exports){
// A class used to keep track of context specific terms and mention-histories

class DescriptionContext {
  constructor() {
    this.referenceHistory = [] // list of recent noun-phrase references to objects
    // Eg/ {entity: [Entity], str:'a cat'}
    this.me = null // who is the first person
    this.you = null // who is the second person
  }

  log(entity, str) {
    // log a reference to the history
    this.referenceHistory.push({entity: entity, ref:str})

    if(entity.is_a('person')) {
      if(entity.pronoun == 'her')
        this.her = (this.her && this.her != entity ? undefined : entity)
      else if (entity.pronoun == 'them')
        this.them = this.them && this.them != entity ? undefined : entity
      else if (entity.pronoun == 'him')
        this.him = (this.him && this.him != entity ? undefined : entity)
    } else
      this.it = this.it ? undefined : entity
  }

  getPronounFor(entity) {
    // get the pronoun of a given entity with respect to this context
    if(entity == this.it)
      return 'it'
    if(entity == this.me)
      return 'me'
    if(entity == this.you)
      return 'you'
    if(entity == this.her)
      return 'her'
    if(entity == this.them)
      return 'them'
    if(entity == this.him)
      return 'him'
  }

  parse(str) {
    switch(str) {
      case 'me': return this.me;
      case 'you': return this.you;
      case 'it': return this.it;
      case 'him': return this.him;
      case 'he': return this.him;
      case 'her': return this.her;
      case 'she': return this.her;
      case 'them': return this.them;
      case 'they': return this.them;
    }
  }
}
module.exports = DescriptionContext

},{}],14:[function(require,module,exports){
const Predicate = require('./Predicate')

class LocationPredicate extends Predicate {
  constructor({
    verb,
    thing='object',
    location='subject',
    locationType
  }) {
    super({
      verb: verb,
      params: [thing, location],
      begin: (A, B) => A.setLocation(B, locationType),
      check: (A, B) => A.location == B && A.locationType == locationType,
      until: (callback, A) => A.once('move', callback),
    })
  }
}
module.exports = LocationPredicate

},{"./Predicate":17}],15:[function(require,module,exports){
// Entity is the base class of all entities in EntityGame.
const regOps = require('./util/regOps.js')
const RandExp = require('randexp')
const spellcheck = require('./util/spellcheck')
const {beA, be} = require('./predicates')
const Sentence = require('./Sentence')

const entityStr = require('./entityStr')
const {toRegexs} = require('./util/specarr')

const nouns = require('./nouns')
const adjectives = require('./adjectives')

const EventEmitter = require('events')

class Entity extends EventEmitter {
  constructor() {
    super()
    this.nouns = []
    this.adjectives = []
    this.properNouns = [entity => entity.name]
    this.facts = []
    this.history = []

    this.prepositionClauses = {}
    // ^(each key is a preposition, each value a specarr)
  }

  be(adjective) {
    // load an adjective extension
    if(this.is(adjective))
      return this

    if(adjectives[adjective]) {

      adjectives[adjective](this)
      if(!this.adjectives.includes(adjective))
        this.adjectives.push(adjective)

      return this
    } else
      throw 'no such adjective: ' + adjective
  }

  is(adjective) {
    return this.adjectives.includes(adjective)
  }

  stopBeing(adj) {
    this.adjectives = this.adjectives.filter(a => a != adj)
    let sentence = Sentence.S(be, this, adj)
    for(let fact of this.facts) {
      if(Sentence.compare(sentence, fact))
        fact.stop()
    }
  }

  be_a(classname) {
    // load a noun extension

    // don't load the same extension twice
    if(this.is_a(classname))
      return this

    if(nouns[classname]) {
      // strings can be used as aliases to other classes
      while(nouns[classname].constructor == String)
        classname = nouns[classname]

      nouns[classname](this)

      if(!this.nouns.includes(classname))
        this.nouns.push(classname)

      new Sentence(beA, [this, classname]).start()

      this.emit('becomeNoun', classname)

      return this
    } else
      throw 'no such entityclass: ' + classname
  }

  is_a(classname) {
    return this.nouns.includes(classname)
  }

  reg(depth=1) {
    // compile a regex for all possible nounphrase strings for this entity
    // depth limits the recursion depth for preposition-phrases

    let adjRegex = this.adjRegex()
    if(adjRegex)
      adjRegex = regOps.kleeneJoin(adjRegex, ',? ')

    depth--;
    let nounPhraseRegex = regOps.concatSpaced(
      regOps.optionalConcatSpaced(
        /a|an|the/,
        adjRegex,
      ),
      regOps.or(...this.nouns)
    )

    if(depth > 0) {
      let clauseRegex = this.clauseRegex(depth)
      if(clauseRegex)
        nounPhraseRegex = regOps.optionalConcatSpaced(
          nounPhraseRegex, clauseRegex//regOps.kleenePoliteList(clauseRegex)
        )
    }

    return regOps.or(
      nounPhraseRegex,
      ...toRegexs(this, this.properNouns, depth),
    )
  }

  clauseRegex(depth) {
    let all = []
    for(let prep in this.prepositionClauses) {
      let clauses = this.prepositionClauses[prep]
      let regexs = toRegexs(this, clauses, depth)
      if(regexs.length)
        all.push(regOps.concatSpaced(prep, regOps.or(...regexs)))
    }

    if(all.length)
      return regOps.or(...all)
    else
      return null
  }

  adjRegex() {
    let regexs = toRegexs(this, this.adjectives)
    if(regexs.length)
      return regOps.or(...regexs)
    else
      return null
  }

  matches(str) {
    // test this entity's regex against a string
    return regOps.whole(this.reg(2)).test(str)
  }

  ref(ctx, options) {
    // come up with a random noun phrase to represent this entity
    return entityStr(this, ctx, options)
  }
  str(ctx, options) {
    return entityStr(this, ctx, options)
  }

  addClause(prep, clause) {
    // add a preposition clause to this Entity
    // the clause may be any unexpanded cell of a specarr
    if(!this.prepositionClauses[prep])
      this.prepositionClauses[prep] = [clause]
    else
      this.prepositionClauses[prep].push(clause)
  }
  removeClause(prep, clause) {
    // remove a given preposition clause from this Entity
    let list = this.prepositionClauses[prep]
    if(list)
      this.prepositionClauses[prep] = list.filter(cl => cl != clause)
  }

  randomFact() {
    return this.facts[Math.floor(Math.random() * this.facts.length)]
  }
  randomHistoricFact() {
    return this.history[Math.floor(Math.random() * this.history.length)]
  }
  randomSentence() {
    if(Math.random() * (this.facts.length + this.history.length) < this.facts.length)
      return this.randomFact()
    else
      return this.randomHistoricFact()
  }
}
Entity.prototype.isEntity = true
module.exports = Entity

},{"./Sentence":20,"./adjectives":23,"./entityStr":28,"./nouns":34,"./predicates":39,"./util/regOps.js":50,"./util/specarr":51,"./util/spellcheck":52,"events":54,"randexp":6}],16:[function(require,module,exports){
/*
  A subclass of Sentence. This class is used to represent a sentence (predicate
  + arguments) in the form of a noun. For example, "the cigarette that he was
  smoking".

  A NounPhraseSentence can be used as an argument in another sentence.
*/

const Sentence = require('./Sentence')

class NounPhraseSentence extends Sentence {
  constructor(mainArgumentIndex, predicate, args) {
    super(predicate, args)
    this.mainArgumentIndex = mainArgumentIndex
  }

  get mainArgument() {
    return this.args[this.mainArgumentIndex]
  }
}
NounPhraseSentence.prototype.isNounPhraseSentence = true
module.exports = NounPhraseSentence

},{"./Sentence":20}],17:[function(require,module,exports){
const PredicateSyntax = require('./PredicateSyntax')

class Predicate {
  constructor({
    // syntax(s) description
    verb, params, // used if initialising with only one form
    forms=[],
    // semantic functions
    begin, expand, check, until, afterwards,
  }) {
    // if verb and params are given, initialise with one form
    if(verb && params)
      forms = [{verb: verb, params:params}]

    // initialise forms as PredicateSyntax objects
    this.forms = forms.map(form => new PredicateSyntax(form))

    // check that form parameters agree
    this.params = this.forms[0].params.map(param => {
      return {
        literal: param.literal
      }
    })
    for(let syntax of this.forms) {
      if(syntax.params.length != this.params.length)
        throw 'Predicate has incompatible forms'
      for(let i in syntax.params)
        if(syntax.params[i].literal != this.params[i].literal)
          throw 'Predicate has incompatible forms'
    }

    // sort forms by specificness
    this.forms = this.forms.sort((A, B) => B.specificness - A.specificness)
    this.specificness = this.forms[this.forms.length-1].specificness

    // semantic functions:
    this._begin = begin
    this.check = check
    this.until = until
    this._afterwards = afterwards
    this._expand = expand
  }

  checkArgs(args) {
    if(this.params.length != args.length) {
      console.warn('wrong number of arguments!')
      return false // whoops, wrong number of arguments!
    }

    for(let i in args) {
      let arg = args[i]
      if(this.params[i].literal) {
        // parameter is flagged literal so argument should be a string
        if(arg.constructor == String)
          continue
        else {
          return false
        }

      } else if(arg.isEntity)
        // non-literal args must be a Entity or a NounPhraseSentence
        continue
      else if(arg.isNounPhraseSentence && arg.checkArgs())
        continue
    }

    // we got to the end, so the arguments are legal
    return true
  }

  parse(str, tenses) {
    for(let form=0; form<this.forms.length; form++) {
      let syntax = this.forms[form]
      let interpretation = syntax.parse(str, tenses)
      if(interpretation) {
        interpretation.predicate = this
        interpretation.form = form
        return interpretation
      }
    }
  }

  parseImperative(str, subject) {
    for(let form=0; form<this.forms.length; form++) {
      let syntax = this.forms[form]
      let interpretation = syntax.parseImperative(str, subject)
      if(interpretation) {
        interpretation.predicate = this
        interpretation.form = form
        return interpretation
      }
    }
    return null
  }

  parseNounPhrase(str) {
    for(let form=0; form<this.forms.length; form++) {
      let syntax = this.forms[form]
      let interpretation = syntax.parseNounPhrase(str)
      if(interpretation) {
        interpretation.predicate = this
        interpretation.form = form
        return interpretation
      }
    }
  }

  str({args, tense, form}, ctx, options) {
    return this.compose({args:args, tense:tense, form:form}).str(ctx, options)
  }
  compose({args, tense, form}, verbPhraseOptions) {
    if(form == undefined)
      form = Math.floor(Math.random()*this.forms.length)
    return this.forms[form].compose(
      {args:args, tense:tense},
      verbPhraseOptions,
    )
  }

  presentPrepositionClausesFor(argIndex, args) {
    let list = []
    for(let syntax of this.forms)
      list.push(...syntax.presentPrepositionClausesFor(argIndex, args))

    return list
  }

  pastPrepositionClausesFor(argIndex, args) {
    let list = []
    for(let syntax of this.forms)
      list.push(...syntax.pastPrepositionClausesFor(argIndex, args))

    return list
  }
}
Predicate.prototype.isPredicate = true
module.exports = Predicate

},{"./PredicateSyntax":19}],18:[function(require,module,exports){
const Predicate = require('./Predicate')

class PredicateSet {
  constructor(...predicates) {
    this.predicates = []

    this.addPredicates(...predicates)
  }

  addPredicates(...predicates) {
    for(let p of predicates) {
      if(p.isPredicate)
        this.predicates.push(p)
      else if(p.constructor == Object)
        this.predicates.push( new Predicate(p) )
    }
    this.sortPredicates()
  }

  parse(str, tenses) {
    let interpretations = []
    for(let p of this.predicates) {
      let interpretation = p.parse(str, tenses)
      if(interpretation)
        interpretations.push(interpretation)
    }

    return interpretations
  }

  parseImperative(str, subject) {
    let interpretations = []
    for(let p of this.predicates) {
      let interpretation = p.parseImperative(str, subject)
      if(interpretation)
        interpretations.push(interpretation)
    }

    return interpretations
  }

  parseNounPhrase(str) {
    let interpretations = []
    for(let p of this.predicates) {
      let interpretation = p.parseNounPhrase(str)
      if(interpretation)
      interpretations.push(interpretation)
    }

    return interpretations
  }

  random() {
    return this.predicates[Math.floor(Math.random()*this.predicates.length)]
  }

  sortPredicates() {
    this.predicates = this.predicates.sort(
      (A, B) => B.specificness-A.specificness
    )
  }
}
module.exports = PredicateSet

},{"./Predicate":17}],19:[function(require,module,exports){
/*
  A predicate is a prototype for a sentence involving zero or more Entitys.
  As a minimum, a predicate object is responsible for parsing a generating
  sentences.

  The base class is a purely syntactic class, but sub-classes may involve
  semantics.
*/

const verbPhrase = require('./util/conjugate/verbPhrase')

const usefulTenses = ['simple_present', 'simple_past']//verbPhrase.tenseList
// ^ (must be in reverse order of specificness)


class PredicateSyntax {
  constructor({
    verb, params, constants,
    presentTenses=['simple_present', 'present_continuous'],
    pastTenses=['simple_past'],
  }) {
    this.verb = verb
    this.constants = constants

    this.params = params.map((param, i) => {
      if(param.constructor == String) {
        let literal = false
        if(param[0] == '@') {
          literal = true
          param = param.slice(1)
        }

        if(param == 'subject')
          param = '_subject'
        if(param == 'object')
          param = '_object'

        return {
          name: param,
          literal: literal,
          index: i
        }
      }
    })

    this.paramsByName = {}
    for(let param of this.params)
      this.paramsByName[param.name] = param

    // generate camel case name
    this.camelCaseName = [
      this.verb,
      ...this.params.filter(
        param => param.name[0] != '_'
      ).map(
        param => param.name[0].toUpperCase() + param.name.slice(1)
    )].join('')

    // set-up regexs
    this.regexs = {}
    this.makeParamRegexs()
    // calculate specificness
    this.getSpecificness()

    // tenses
    this.presentTenses = presentTenses
    this.pastTenses = pastTenses
  }

  orderArgs(associativeArgs) {
    let orderedArgs = []
    for(let {name} of this.params)
      orderedArgs.push(associativeArgs[name])
    return orderedArgs
  }

  associateArgs(orderedArgs) {
    let associativeArgs = {}
    for(let i in this.params)
      associativeArgs[this.params[i].name] = orderedArgs[i]
    return associativeArgs
  }

  checkArgs(args) {
    if(this.params.length != args.length) {
      console.warn('wrong number of arguments!')
      return false // whoops, wrong number of arguments!
    }

    for(let i in args) {
      let arg = args[i]
      if(this.params[i].literal) {
        // parameter is flagged literal so argument should be a string
        if(arg.constructor == String)
          continue
        else {
          return false
        }

      } else if(arg.isEntity)
        // non-literal args must be a Entity or a NounPhraseSentence
        continue
      else if(arg.isNounPhraseSentence && arg.checkArgs())
        continue
    }

    // we got to the end, so the arguments are legal
    return true
  }

  makeRegex(tense, options) {
    if(!this.capturingAction){
      let action = {_verb: this.verb}
      for(let {name} of this.params) {
        action[name] = '(?<'+name+'>.+)'
      }
      for(let name in this.constants) {
        action[name] = this.constants[name]
      }
      this.capturingAction = action
    }

    let vp = verbPhrase(this.capturingAction, tense, options)

    return new RegExp('^'+vp.str()+'$')
  }

  makeParamRegexs() {
    for(let param of this.params) {
      let {name, literal} = param
      if(literal)
        continue
      param.regexs = {}
      for(let tense of usefulTenses) {
        let reg = this.makeRegex(tense, {nounPhraseFor:name})
        param.regexs[tense] = reg
      }
    }
  }

  parse(str, tenses=[...this.presentTenses, ...this.pastTenses]) {
    for(let tense of tenses) {
      if(!this.regexs[tense])
        this.regexs[tense] = this.makeRegex(tense)
      let reg = this.regexs[tense]
      let result = reg.exec(str)
      if(result)
        return {
          tense: tense,
          args: this.orderArgs(result.groups),
          predicate: this,
        }
    }

    return null
  }

  parseImperative(str, subject) {
    // Parse an imperative string for a given subject

    // call parse using imperative tense
    let parsed = this.parse(str, ['imperative'])

    // set the subject argument to the given subject
    if(parsed && this.paramsByName._subject)
      parsed.args[this.paramsByName._subject.index] = subject

    return parsed
  }

  parseNounPhrase(str) {
    for(let param of this.params) {
      for(let tense in param.regexs) {
        let reg = param.regexs[tense]
        let result = reg.exec(str)
        if(result)
          return {
            tense: tense,
            param: param.name,
            paramIndex: param.index,
            predicate: this,
            args: this.orderArgs(result.groups)
          }
      }
    }
  }

  str({args, tense}, ctx, options) {
    return this.compose({args:args, tense:tense}).str(ctx, options)
  }
  compose({args, tense='simple_present'}, options) {
    let action = this.composeAction(args)
    return verbPhrase(action, tense, options)
  }

  composeAction(orderedArgs) {
    let action = this.associateArgs(orderedArgs)
    action._verb = this.verb
    for(let name in this.constants)
      action[name] = this.constants[name]
    return action
  }
  composeSubjectNounPhrase({args, tense}) {
    return this.compose({args:args, tense:tense}, {nounPhraseFor:'_subject'})
  }
  composePrepositionPhraseFor(argIndex, {args, tense}) {
    return {
      preposition:'that',
      clause :this.compose(
        {args:args, tense:tense},
        {omit:this.params[argIndex].name}
      ),
      mainArgument: args[argIndex],
    }
  }

  presentPrepositionClausesFor(argIndex, args) {
    let list = []
    for(let tense of this.presentTenses)
      list.push(this.composePrepositionPhraseFor(
        argIndex, {args:args, tense:tense})
      )
    return list
  }

  pastPrepositionClausesFor(argIndex, args) {
    let list = []
    for(let tense of this.pastTenses)
      list.push(this.composePrepositionPhraseFor(
        argIndex, {args:args, tense:tense})
      )
    return list
  }

  getSpecificness() {
    // Calculate a specificness score. Used to order predicates in PredicateSet.
    // Low specificness should be processed last when parsing to avoid using
    // problems.
    // Eg to avoid using '_ is _' when '_ is in _' could have been used.

    if(this.specificness)
      return this.specificness

    let score = this.verb.length
    for(let param of this.params) {
      if(param.name[0] != '_')
        score += param.name.length
      if(param.literal)
        score -= 10
    }

    this.specificness = score
    return this.specificness
  }
}
PredicateSyntax.prototype.isPredicateSyntax = true
module.exports = PredicateSyntax

},{"./util/conjugate/verbPhrase":47}],20:[function(require,module,exports){
const EventEmitter = require('events')
const SentenceQueue = require('./SentenceQueue')
// ...more requires at bottom

class Sentence extends EventEmitter {
  constructor(predicate=null, args=null) {
    super()

    this.predicate = predicate // A Predicate object, defining the relationship
                          // between the arguments.

    this.args = args // an array of Entity/String arguments

    this.truthValue = 'hypothetical' // What is the state of the sentence?
    // ^('true', 'planned', 'false', 'past', 'hypothetical', 'superfluous', etc)
    // truthValue is initialised as hypothetical

    this.presentClauses = [] // a list of all currently active clause objects
    this.pastClauses = []
  }

  checkArgs() {
    // check to see if the arguments are legal.
    return this.predicate.checkArgs(this.args)
  }

  trueInPresent() {
    // If this sentence already exists in the arguments' fact lists return the
    // already existing version. Otherwise false.
    if(this.truthValue == 'true')
      return true

    if(this.truthValue == 'hypothetical') {
      for(let arg of this.entityArgs) {
        for(let fact of arg.facts)
          if(Sentence.compare(fact, this)) {
            this.truthValue = 'superfluous'
            return fact
          }
      }
      return false
    }


    // the present truth value predicates without entity arguments is undefined
    return undefined
  }

  trueInPast() {
    if(this.truthValue == 'past')
      return true

    if(this.truthValue == 'hypothetical')
      for(let arg of this.args)
        if(arg.isEntity)
          return arg.history.some(fact => Sentence.compare(fact, this))
  }

  get recursiveEntityArgs() {
    let all = []
    for(let arg of this.args)
      if(arg.isNounPhraseSentence)
        all.push(...arg.recursiveEntityArgs)
      else if(arg.isEntity)
        all.push(arg)

    return all
  }

  addFactsAndClauses() {
    if(!this.predicate.dontObserve)
      for(let i=0; i<this.args.length; i++) {
        let arg = this.args[i]
        if(arg.isEntity) {
          // emit on('fact') event
          arg.emit('fact', this)

          // add sentence to argument's fact set
          arg.facts.push(this)

          for(let clause of this.predicate.presentPrepositionClausesFor(i, this.args)) {
            arg.addClause(clause.preposition, clause.clause)

            // rmb the clause so it can be removed later (when `stop` is called)
            this.presentClauses.push(clause)
          }
        }
      }
  }

  start() {
    // exit early if this.checkArgs() fails
    if(!this.checkArgs())
      throw 'sentence has illegal args'

    // skip declare if is already true according to this.predicate.check()
    if(!(this.predicate.check && this.predicate.check(...this.args))) {

      // exit early if there are problems according to this.predicate.problem()
      if(this.predicate.problem) {
        let problems = this.predicate.problem(...this.args)
        if(problems) {
          this.truthValue = 'failed'
          this.failureReason = problems

          this.emit('problem', this.failureReason)
          return this
        }
      }

      // DECLARE:
      // execute nested NounPhraseSentences in arguments
      let n = 0
      for(let i in this.args) {
        if(this.args[i].isNounPhraseSentence) {
          this.args[i].start() // .start() in new implementation
          this.args[i] = this.args[i].mainArgument
          n++
        }
      }
      // check arguments again
      if(n && !this.checkArgs())
        throw 'sentence has illegal args after executing nested sentences'

      // execute the predicate on the args
      if(this.predicate._begin)
        this.predicate._begin(...this.args)
    }

    // skip observe if is already true according to this.trueInPresent()
    let alreadyExistingVersion = this.trueInPresent()
    if(alreadyExistingVersion) {
      alreadyExistingVersion.once('stop', () => this.stop())
      return alreadyExistingVersion
    } else {
      // OBSERVE:

      // set truth value to true
      this.truthValue = 'true'

      // add facts and clauses
      this.addFactsAndClauses()

      if(this.predicate._expand) {
        let expansion = this.predicate._expand(...this.args)
        if(expansion) {
          let queue = new SentenceQueue(...expansion)
          queue.once('stop', () => this.stop())
          queue.start()
        }
      }

      // call the predicate's `until` function if it exists
      if(this.predicate.until)
        this.predicate.until(
          () => this.stop(),
          ...this.args,
        )

      // return self
      this.emit('start')
      return this
    }
  }

  stop() {
    // make the sentence no longer true

    if(this.truthValue == 'superfluous') {
      this.emit('stop')
      return this
    }

    if(this.truthValue != 'true')
      return this

    this.truthValue = 'past'
    if(this.predicate._afterwards)
      this.predicate._afterwards(...this.args)

    // remove preposition clauses
    for(let {mainArgument, preposition, clause} of this.presentClauses)
      mainArgument.removeClause(preposition, clause)

    // remove facts from arguments
    for(let arg of this.entityArgs) {
      //let arg = this.args[i]
      arg.emit('factOff', this)
      arg.facts.splice(arg.facts.indexOf(this), 1)
    }

    this.observePast()

    this.emit('stop')
  }

  observePast() {
    // observe that this sentence is now in the past

    for(let i in this.args) {
      let arg = this.args[i]

      // add fact to arguments history
      if(arg.history
      && !arg.history.some(fact => Sentence.compare(fact, this))) {

        arg.history.push(this)

        for(let clause of this.predicate.pastPrepositionClausesFor(i, this.args)) {
          // attach clause to arg
          arg.addClause(clause.preposition, clause.clause)

          // remember the clause so it can be removed later
          this.pastClauses.push(clause)
        }
      }
    }
  }

  str(tense='simple_present', ctx, entityStrOptions) {
    return this.predicate.str(
      {args: this.args, tense:tense},
      ctx, entityStrOptions
    )
  }

  static compare(P, Q) {
    // Compare two sentences, P and Q.
    // Return true if both the predicates and the arguments match.

    if(P == Q) // if P and Q are the same object, they are equal
      return true

    // P and Q are inequal if they have diferent prediactes
    if(P.predicate != Q.predicate) {
      return false
    }

    // P and Q are inequal if any of the arguments don't agree
    for(let i in P.args)
      if(P.args[i] != Q.args[i]) {
        return false
      }

    // if we reach this point without returning false, P and Q are equal!
    return true
  }

  static S(predicate, ...args) {
    if(predicate.constructor == String)
      predicate = predicates[predicate]
    return new Sentence(predicate, args)
  }

  get entityArgs() {
    return this.args.filter(arg => arg.isEntity)
  }
  randomEntityArg() {
    let entityArgs = this.args.filter(arg => arg.isEntity)
    return entityArgs[Math.floor(Math.random()*entityArgs.length)]
  }
}
module.exports = Sentence

const predicates = require('./predicates')

},{"./SentenceQueue":21,"./predicates":39,"events":54}],21:[function(require,module,exports){
// a list of sentence to be executed consequetively

const EventEmitter = require('events')

class SentenceQueue extends EventEmitter {
  constructor(...sentences) {
    super()
    this.sentences = []
    this.i = 0

    for(let sentence of sentences)
      this.appendSentence(sentence)
  }

  appendSentence(sentence) {
    if(sentence && sentence.truthValue == 'hypothetical') {
      this.sentences.push(sentence)
      sentence.truthValue = 'planned'
    } else
    throw "Can only append hypothetical sentence to queue."
  }

  start() {
    this.emit('start')
    this.startNextSentence()
  }

  startNextSentence() {
    let sentence = this.sentences[this.i++]

    if(sentence) {
      sentence.once('stop', () => this.startNextSentence())
      sentence.on('problem', reasons => this.emit('problem', reasons))
      sentence.start()
    } else {
      this.emit('stop')
    }
  }
}
module.exports = SentenceQueue

},{"events":54}],22:[function(require,module,exports){
const Predicate = require('./Predicate')
const delay = require('./delay')

class TimedPredicate extends Predicate {
  constructor({
    verb, params, // (syntax)
    forms,
    declare, afterwards, // (semantic functions)
    duration, // approx number of seconds the predicate lasts for
    // ^ may be multiplied by the arguments reciprocal speed values
    presentTenses, pastTenses // (tenses)
  }) {
    super({
      verb: verb,
      params: params,
      forms: forms,
      declare: declare,
      afterwards: afterwards,
      until: callback => delay(duration, callback),
      presentTenses: presentTenses,
      pastTenses: pastTenses,
    })
  }
}
module.exports = TimedPredicate

},{"./Predicate":17,"./delay":24}],23:[function(require,module,exports){
module.exports = {
  happy: entity => entity,
  sad: entity => entity,
  open: entity => {
    entity.open = true
    entity.stopBeing('closed')
  },
  closed: entity => {
    entity.open = false
    entity.stopBeing('open')
  },
}

},{}],24:[function(require,module,exports){
// delay with callback. in the future this function will allow for more nuanced
// game time, different from real-world time

function delay(seconds, callback) {
  setTimeout(callback, seconds*1000)
}
module.exports = delay

},{}],25:[function(require,module,exports){
const {S} = require('../Sentence')
const {leadTo} = require('../predicates')

function connectLocations(entity1, entity2) {
  // this doesn't use location type for simplicity.
  if(!entity1.adjacentLocations.includes(entity2))
    entity1.adjacentLocations.push(entity2)
  if(!entity2.adjacentLocations.includes(entity1))
    entity2.adjacentLocations.push(entity1)

  S(leadTo, entity1, entity2).start()
  S(leadTo, entity2, entity1).start()
}

module.exports = connectLocations

},{"../Sentence":20,"../predicates":39}],26:[function(require,module,exports){
function* getAccessibleLocations(
  from, // entity.is_a('thing')
  accessible=['IN', 'ON'],
  skippable=['consist', 'wear', 'hold'],
  forbidden=[] // a set of forbidden entitys, (to stop things going inside themself)
) {
  // find which locations are accessible from a given location in one step

  // yield adjacentLocations
  for(let entity of from.adjacentLocations)
    for(let type of accessible)
      if(entity.possibleLocatingTypes.includes(type))
        yield {location:entity, locationType: type}

  // search down the tree
  let down = searchDown(from, accessible, skippable)
  if(down)
    yield down

  // search up the tree
  for(let entity of from.locating) {
    if(forbidden.includes(entity))
      continue
    //if(skippable.includes(entity.locationType))
    for(let result of searchUp(entity, accessible, skippable))
        yield result
  }
}
module.exports = getAccessibleLocations

function searchDown(from, accessible, skippable) {
  // search down the tree
  let loc = from
  while(loc && skippable.includes(loc.locationType))
    loc = loc.location
  if(loc && accessible.includes(loc.locationType) && loc.open)
    return {location: loc.location, locationType:loc.locationType}
  else
    return null
}

function* searchUp(from, accessible, skippable) {
  if(!from.locating)
    return

  for(let type of accessible)
    if(from.possibleLocatingTypes.includes(type))
      yield {location:from, locationType:type}
  for(let entity of from.locating) {
    if(skippable.includes(entity.locationType))
      for(let result of searchUp(entity, accessible, skippable))
        yield result
  }
}

function permittedMoves(entity) {
  if(entity.location)
    return getAccessibleLocations(entity.location, undefined, undefined, [entity])
  else return []
}
module.exports.permittedMoves = permittedMoves

},{}],27:[function(require,module,exports){
const getAccessibleLocations = require('./getAccessibleLocations')
const {S} = require('../Sentence')

function getRoute(A, B) { // A and B are location,loctionType pairs
  let visited = [B] // an improvement could be to index the visited var by locationType
  let breadcrumbs = new Map()

  for(var i=0; i<visited.length; i++) {
    let locations = getAccessibleLocations(visited[i].location)

    for(let couple of locations) {
      // skip if has been visited
      if(visited.some(
        vis =>
          couple.location == vis.location &&
          couple.locationType == vis.locationType)
      ) continue

      visited.push(couple)
      breadcrumbs.set(couple, visited[i])

      if(couple.location == A.location
        && couple.locationType == A.locationType) {
        // found a route!

        // retrace breadcrumbs generate the route
        let trace = couple
        let route = [trace]
        while(trace=breadcrumbs.get(trace))
          route.push(trace)
        return route
      }
    }
  }

  return null
}
module.exports = getRoute

function getRouteSentences(A, B, subject) {
  let route = getRoute(A, B)
  if(!route)
    return null

  let instructions = []
  for(let i=1; i<route.length; i++) {

    let {location, locationType} = route[i]

    if(locationType == 'IN') {
      instructions.push(S('goInto', subject, location))

    } else if(locationType == 'ON') {
      instructions.push(S('getOnto', subject, location))
    }
  }
  return instructions
}
module.exports.sentences = getRouteSentences

},{"../Sentence":20,"./getAccessibleLocations":26}],28:[function(require,module,exports){
/*
  entityStr()
  Convert a entity into a string using a flexible set of parameters
*/

const {sub} = require('./util/Substitution')
const specarr = require('./util/specarr')

function entityStr(entity, ctx, options={}) {
  // Convert a entity into a noun phrase string.

  if(!ctx)
    null//console.warn( "call to entityStr without a description context" )
  else {
    let pronoun = ctx.getPronounFor(entity)
    if(pronoun) {
      ctx.log(entity, pronoun)
      return pronoun
    }
  }

  if(typeof options == 'number')
    options = {maxDetails: options}

  // max details default logic, yuck
  if(options.maxDetails == undefined)
    options.maxDetails = 0
  if(options.maxAdjectives == undefined) {
    if(options.maxPrepositionClauses == undefined) {
      // both undefined, distribute at random
      options.maxPrepositionClauses = Math.floor(Math.random() * (options.maxDetails+1))
      options.maxAdjectives = options.maxDetails - options.maxPrepositionClauses
    } else
      // only maxAdjectives is undefined
      options.maxAdjectives = options.maxDetails-options.maxPrepositionClauses
  } else if(options.maxPrepositionClauses == undefined)
    // only maxPrepositionClauses is undefined
    options.maxPrepositionClauses = options.maxDetails-options.maxAdjectives

  delete options.maxDetails

  // destructure options and apply default values
  let {
    article='the',          // article to use
    //maxDetails = undefined, // max number of details to give (including nested)
    maxAdjectives = undefined,  // max number of adjectives to use (inc. nested)
    maxPrepositionClauses=undefined,  // max number of preposition clauses to use (inc. nested)
    nounSpecificness=1,     // scale 0-1, how specific should the noun be
    //dontMention,          // list of entitys not to mention
    //recursionDepth=3,       // limit the number of recursive entityStr calls
  } = options
  delete options.article

  // compose the string
  let out = entity.nouns[Math.floor(nounSpecificness*(entity.nouns.length-0.5))]

  // choose and apply preposition clauses
  if(maxPrepositionClauses) {
    let nClauses = Math.floor(Math.random() * (maxPrepositionClauses+1))
    if(nClauses) {
      // prepare list of all possible clauses
      let allClauses = []
      for(let prep in entity.prepositionClauses)
        allClauses.push(...specarr.expand(entity, entity.prepositionClauses[prep]).map(
          clause => sub('_ _', prep, clause)
        ))

      // chooses clauses to use
      let clauses = []
      for(let i=0; i<nClauses && allClauses.length; i++) {
        clauses.push(
          allClauses.splice(Math.floor(Math.random() * allClauses.length), 1)
        )

        // decrement maxPrepositionClauses in options (effects recursive calls/callers)
        options.maxPrepositionClauses--
      }

      // append chosen clauses to output
      if(clauses.length)
        out = sub('_ _', out, clauses.sort(() => Math.random()*2-1))
    }
  }

  // choose and apply adjectives
  if(maxAdjectives) {
    let nAdjs = Math.floor(Math.random() * (maxAdjectives+1))
    if(nAdjs) {
      let allAdjs = specarr.expand(entity, entity.adjectives)

      // choose adjectives
      let adjs = []
      for(let i=0; allAdjs.length && i<nAdjs; i++) {
        adjs.push(allAdjs.splice(Math.floor(Math.random() * allAdjs.length), 1))
        options.maxAdjectives--
      }

      // prepend chosen adjectives to output
      if(adjs.length)
        out = sub('_ _', adjs.sort(() => Math.random()*2-1), out)
    }
  }

  let str = sub('_ _', article, out).str(ctx, options)
  if(ctx)
    ctx.log(entity, str)
  return str
}
module.exports = entityStr

},{"./util/Substitution":43,"./util/specarr":51}],29:[function(require,module,exports){
module.exports = {
  animal: entity => entity.be_a('thing').allowLocationType('IN'),

  octopus: entity => entity.be_a('animal'),
  dolphin: entity => entity.be_a('dolphin'),
}

},{}],30:[function(require,module,exports){
module.exports = {
  "body part": entity => {
    entity.be_a('thing')
      .allowLocatingType('consist')
      .allowLocationType('consist')
  },
}

let body_parts = [
  'arm', 'elbow', 'forearm', 'bicep', 'hand',
  'palm', 'knuckle', 'finger',
  'sole', 'toe', 'nail', 'fingerprint',
  'leg', 'thigh', 'knee', 'ankle', 'shin', 'foot',
  'head', 'eye', 'nose', 'ear', 'hair',
  'torso',
  'neck',
  'eyelash', 'eyebrow', 'pupil'
]

for(let part of body_parts)
  module.exports[part] = entity => entity.be_a('body part')

},{}],31:[function(require,module,exports){
module.exports = {
  food: food => food.be_a('thing'),

  sausage: entity => entity.be_a('food'),
}

},{}],32:[function(require,module,exports){
module.exports = {
  garment: entity => entity.be_a('thing').allowLocationType('wear', 'IN', 'ON'),
  shirt: entity => entity.be_a('garment'),
  "pair of trousers": entity => entity.be_a('garment'),
  skirt: entity => entity.be_a('garment'),
  "t-shirt": entity => entity.be_a('garment'),
  hat: entity => entity.be_a('garment'),
  pants: entity => entity.be_a('garment'),
  shoe: entity => entity.be_a('garment'),
  sock: entity => entity.be_a('garment'),
}

},{}],33:[function(require,module,exports){
const predicates = require('../predicates/location')
const {S} = require('../Sentence')

function getLocationFacts(entity, location, locationType) {
  if(!location || !entity)
    throw "getLocationFacts expects an object, location and locationType"

  switch(locationType) {
    case 'consist':
      return [
        S(predicates.consistOf, entity, location)
      ]

    case 'IN':
      return [
        S(predicates.beIn, entity, location)
      ]

    case 'hold':
      return [S(predicates.hold, entity, location)]

    case 'ON':
      return [S(predicates.beOn, entity, location)]

     case 'wear':
      return [S(predicates.wear, entity, location)]

    default:
      console.warn("Unknown locationType:", locationType)
      return []
  }
}
module.exports = getLocationFacts

},{"../Sentence":20,"../predicates/location":40}],34:[function(require,module,exports){
// The index for all nouns.

module.exports = {
  'thing': require('./thing'),

  person: person => {
    person
      .be_a('thing')
      .allowLocationType('IN')
      .allowLocatingType('hold')
      .allowLocatingType('wear')
      .allowLocatingType('consist')
    //person.pronoun = 'them'
  },
  human: 'person',
  woman: entity => {
    entity.be_a('person')
    entity.pronoun = 'her'
  },
  man: entity => {
    entity.be_a('person')
    entity.pronoun = 'him'
  }
}

Object.assign(module.exports, require('./rooms'))
Object.assign(module.exports, require('./items'))
Object.assign(module.exports, require('./plants'))
Object.assign(module.exports, require('./bodyparts'))
Object.assign(module.exports, require('./garments'))
Object.assign(module.exports, require('./food'))
Object.assign(module.exports, require('./animals'))

},{"./animals":29,"./bodyparts":30,"./food":31,"./garments":32,"./items":35,"./plants":36,"./rooms":37,"./thing":38}],35:[function(require,module,exports){
module.exports = {
  item: item => {
    item.be_a('thing')
      .allowLocationType('IN', 'hold', 'ON')
  },

  chair: item => item.be_a('item').allowLocatingType('seat'),
  armchair: item => item.be_a('chair'),
  sofa: item => item.be_a('chair'),

  table: item => item.be_a('item').allowLocatingType('ON'),
  desk: item =>item.be_a('table'),
  nightstand: item => item.be_a('table'),

  bed: item => item.be_a('item').allowLocatingType('ON'),

  cupboard: item => item.be_a('item').allowLocatingType('IN'),
  wardrobe: item => item.be_a('cupboard'),

  box: item => item.be_a('item').allowLocatingType('IN'),

  cigarette: item => item.be_a('item'),
  computer: item => item.be_a('item'),
  "salmon wrap": item => item.be_a('item'),
}

},{}],36:[function(require,module,exports){
module.exports = {
  plant: plant => plant.be_a('thing'),

  tree: tree => tree.be_a('plant'),
  london_plane: tree => tree.be_a('tree'),
}

},{}],37:[function(require,module,exports){
module.exports = {
  room: room => {
    room
      .be_a('thing')
      .allowLocatingType('IN')
  },
  space: space => {
    space.be_a('thing')
    .allowLocatingType('IN')
  },
  kitchen: room => room.be_a('room'),
  bathroom: room => room.be_a('room'),
  living_room: room => room.be_a('room'),
  bedroom: room => room.be_a('room'),
  corridor: room => room.be_a('room'),
  garden: room => room.be_a('space'),
  hallway: room => room.be_a('room'),


}

},{}],38:[function(require,module,exports){
const getLocationFacts = require('./getLocationFacts.js')
const connectLocations = require('../logistics/connectLocations')

function object(o) {
    // where is this object
    o.location = null
    o.locationType = null
    o.possibleLocationTypes = []
    o.open = true
    o.adjacentLocations = []

    // what objects are here
    o.locating = []
    o.possibleLocatingTypes = []

    // functions
    o.setLocation = setLocation
    o.canBeIn = canBeIn
    o.allowLocatingType = allowLocatingType
    o.allowLocationType = allowLocationType
    o.connectTo = to => connectLocations(o, to)
}
module.exports = object

function setLocation(location, locationType) {
  if(!locationType) {
    locationType = this.possibleLocationTypes.filter(
      lt => location.possibleLocatingTypes.includes(lt)
    )[0]
  }

  // check for problems
  if(!locationType || !this.canBeIn(location, locationType)) {
    console.warn(this, location)
    throw "incompatible locationType: "+locationType
  }

  // make a note of the old location for emitting an event
  let oldLocation = this.location
  let oldLocationType = this.locationType

  // remove self from old location
  if(this.location) {
    this.location.emit('exited', this, oldLocationType)
    this.location.locating.splice(this.location.locating.indexOf(this), 1)
  }

  // set new location
  this.location = location
  this.locationType = locationType

  // add self to new location
  if(this.location) {
    this.location.emit('entered', this, locationType)
    this.location.locating.push(this)
  }

  this.emit('move',
    oldLocation,
    this.location,
    oldLocationType,
    this.locationType
  )

  // get a list of location facts
  let newFacts = getLocationFacts(this, location, locationType)
  for(let fact of newFacts)
    fact.start()

  return this
}

function canBeIn(location, locationType) {
  return location.possibleLocatingTypes.includes(locationType) &&
    this.possibleLocationTypes.includes(locationType)
}

function allowLocationType(...locationTypes) {
  for(let locationType of locationTypes)
    if(!this.possibleLocationTypes.includes(locationType))
      this.possibleLocationTypes.push(locationType)
  return this
}
function allowLocatingType(...locationTypes) {
  for(let locationType of locationTypes)
    if(!this.possibleLocatingTypes.includes(locationType))
      this.possibleLocatingTypes.push(locationType)
  return this
}

},{"../logistics/connectLocations":25,"./getLocationFacts.js":33}],39:[function(require,module,exports){
const Predicate = require('../Predicate')
const TimedPredicate = require('../TimedPredicate')

module.exports = {
  // LOCATION

  // OTHER
  beCalled: new Predicate({
    verb:'be',
    params:['subject', '@called'],
    begin: (A, name) => A.name = name,
    check: (A, name) => A.name == name,
  }),

  be: new Predicate({
    verb: 'be',
    params: ['subject', '@object'],
    begin: (entity, adjective) => entity.be(adjective),
  }),

  beA: new Predicate({
    verb: 'be',
    params: ['subject', '@a'],
    begin: (entity, classname) => entity.be_a(classname),
    check: (entity, className) => entity.is_a(className),
  }),

  smoke: new Predicate({
    verb: 'smoke',
    params: ['subject', 'object'],
  }),

  love: new Predicate({
    verb: 'love',
    params: ['subject', 'object'],
  }),

  jump: new TimedPredicate({
    verb: 'jump', params:['subject'],
    duration:5,
  }),

  steal: new Predicate({
    verb:'steal',
    params: ['subject', 'object'],
    until: callback => callback(),
  }),

  thereIs: new Predicate({
    forms: [
      {verb:'be', params:['object'], constants:{_subject:'there'}},
      {verb:'exist', params:['subject']},
    ]

  })
}

Object.assign(module.exports, require('./location'))
Object.assign(module.exports, require('./movement'))

},{"../Predicate":17,"../TimedPredicate":22,"./location":40,"./movement":41}],40:[function(require,module,exports){
const Predicate = require('../Predicate')
const LocationPredicate = require('../LocationPredicate.js')

module.exports = {
  beIn: new LocationPredicate({
    verb: 'be', thing: 'subject', location:'in', locationType:'IN'
  }),

  beOn: new LocationPredicate({
    verb: 'be',
    thing: 'subject', location: 'on',
    locationType: 'ON'
  }),

  hold: new LocationPredicate({
    verb: 'hold',
    locationType: 'hold'
  }),

  consistOf: new LocationPredicate({
    verb: 'consist',
    location: 'subject', thing: 'of',
    locationType: 'consist'
  }),

  wear: new LocationPredicate({
    verb: 'wear',
    locationType: 'wear',
  }),

  // location related predicates
  leadTo: new Predicate({
    verb: 'lead',
    params: ['subject', 'to'],

    begin: (A, B) => A.connectTo(B),
    check: (A, B) => A.adjacentLocations.includes(B),
  }),
}

},{"../LocationPredicate.js":14,"../Predicate":17}],41:[function(require,module,exports){
const Predicate = require('../Predicate')
const getRoute = require('../logistics/getRoute')

module.exports = {
  // enter an IN location
  goInto: new Predicate({
    verb: 'go',
    params: ['subject', 'into'],

    until: callback => callback(),
    afterwards: (entity, container) => entity.setLocation(container, 'IN'),
  }),

  // enter an ON location
  getOnto: new Predicate({
    verb: 'get',
    params: ['subject', 'onto'],

    until: callback => callback(),
    afterwards: (entity, surface) => entity.setLocation(surface, 'ON'),
  }),

  goTo: new Predicate({
    verb:'go', params:['subject', 'to'],

    expand: (subject, to) => {
      let from = {location: subject.location, locationType:subject.locationType}
      return getRoute.sentences(from, to, subject)
    }
  })
}

},{"../Predicate":17,"../logistics/getRoute":27}],42:[function(require,module,exports){
const articleReg = /the|a|an|another/
const regOps = require('./util/regOps.js')

const nouns = require('./nouns')
const nounKeys = Object.keys(nouns)
const Entity = require('./Entity')

function spawn(str) {
  // spawn a new entity from a noun phrase string
  for(let i in nouns) {
    let noun = i.replace(/_/g, ' ')
    //let reg = new RegExp('^(?:'+articleReg.source + ' ' + noun+')$')
    let reg = regOps.whole(regOps.concatSpaced(articleReg, noun))
    if(reg.test(str))
      return new Entity().be_a(i)
  }
}
module.exports = spawn

function randomSpawn() {
  let noun = nounKeys[Math.floor(Math.random()*nounKeys.length)]
  return new Entity().be_a(noun)
}
module.exports.random = randomSpawn

},{"./Entity":15,"./nouns":34,"./util/regOps.js":50}],43:[function(require,module,exports){
/*
  Substitution is a class for formatting sentence involving zero or more
  args. It can be used to avoid generating the noun phrases until the program
  is sure that they will be needed. A quick function Substitution.substitution
  can be used to format a one off string.
*/

const {randexp} = require("randexp")
const placeholderRegex = /(?:S|O)?_/g // o = object, s = subject
const {autoBracket, kleenePoliteList} = require("./regOps")
const politeList = require('./politeList')
const toSubject = require('./toSubject')


class Substitution { // sometimes abbreviated Sub
  constructor(templateStr, ...args) {
    this.template = templateStr
    this.args = args

    let placeholderMatches = this.template.match(placeholderRegex)
    if(placeholderMatches)
      this.placeholders = placeholderMatches.map(str => ({
        str: str,
        subject: str[0] == 'S',
        object: str[0] == 'O'
      }))
    else
      this.placeholders = []
  }

  getString(ctx, options) {
    let toSubIn = this.args.map(o => {
      if(o == null || o == undefined)
        return null
      else if(o.isEntity)
        return o.str(ctx, options)
      else if(o.constructor == String)
        return o
      else if(o.construtor == RegExp)
        return randexp(o)
      else if(o.constructor == Number)
        return o.toString()
      else if(o.isSubstitution)
        return o.getString(ctx, options)
      //else if(o.isAction) // not used in entity-game, only imaginary-city
      //  return o.str()
      else if(o.constructor == Array)
        return o.length ? Substitution.politeList(o).str(ctx, options) : 'nothing'
      else {
        console.warn("Couldn't interpret substitution value:", o, this)
        return "???"
      }
    })

    if(toSubIn.includes(null))
      return null

    return this.subIn(...toSubIn)
  }
  str(ctx, options) {
    // alias for getString
    return this.getString(ctx, options)
  }
  regex(depth) {
    // substitute regular expressions into the template for each arguments
    let toSubIn = this.args.map(o => formatRegex(o, depth))

    if(toSubIn.includes(null))
      return null

    toSubIn = toSubIn.map(autoBracket)
    return new RegExp(this.subIn(...toSubIn))
  }
  getRegex(depth) {
    // alias for backwards compatibility
    return this.regex(depth)
  }

  subIn(...subs) {
    // substitute strings into the template
    for(let i in subs) {
      let placeholder = this.placeholders[i]
      if(placeholder.subject) {
        subs[i] = toSubject(subs[i])
      }
    }

    let bits = this.template.split(placeholderRegex)
    let out = bits[0]
    for(var i=1; i<bits.length; i++)
      out += subs[i-1] + bits[i]
    return out
  }

  static substitute(templateStr, ...args) {
    let ctx
    if(!args[args.length-1].isEntityenon)
      ctx = args.pop()
    else
      ctx = {}

    return new Substitution(templateStr, ...args).getString(ctx)
  }

  static politeList(items) {
    let placeholders = items.map(item => '_')
    let template = politeList(placeholders)
    return new Substitution(template, ...items)
  }

  static concat(...toConcat) {
    // concatenate many substitutions and strings into a new substitution
    let strs = []
    let args = []

    for(let bit of toConcat) {
      if(bit.constructor == String)
        strs.push(bit)
      if(bit.constructor == Substitution) {
        strs.push(bit.template)
        args = args.concat(bit.args)
      }
    }

    let template = strs.join('')
    console.log(template, args)
    return new Substitution(template, ...args)
  }

  static sub(...args) {
    return new Substitution(...args)
  }
}

Substitution.prototype.isSubstitution = true
Substitution.placeholderRegex = placeholderRegex
module.exports = Substitution

const formatRegex = (o, depth) => {
  if(o == null || o == undefined)
    return o
  else if(o.isEntity)
    return o.reg(depth).source
  else if(o.constructor == String)
    return o
  else if(o.constructor == RegExp)
    return autoBracket(o.source)
  else if(o.constructor == Number)
    return o.toString()
  else if(o.constructor == Array) {
    //throw "cannot (yet) generate regex from substitution containing an array"
    return kleenePoliteList(...o.map(formatRegex)).source
  } else if(o.isSubstitution) {
    let regex = o.getRegex()
    if(regex && regex.constructor == RegExp)
      return autoBracket(regex.source)
    else return null
  } else {
    console.warn("Couldn't interpret substitution value:", o)
    return "???"
  }
}

},{"./politeList":49,"./regOps":50,"./toSubject":53,"randexp":6}],44:[function(require,module,exports){
/*
  Given the infinitive form of a verb and a person/verbform number (0-8) return
  the conjugated verb form.
*/

/*
VERB FORMS DENOTED AS NUMBERS:
  0.  infinitive
  1.  first person singular
  2.  second person singular
  3.  third person singular
  4.  first person plural
  5.  second person plural
  6.  third person plural
  (7.  gerund/present-participle)
  (8.  past-participle)
  (9. past tense form)
*/

const regOp = require("../regOps")
const irregular = require("./irregularConjugations")

const endsWithShortConsonant = /[aeiou][tpdn]$/
const endsWithE = /e$/
const endsWithOOrX = /[ox]$/

const FIRST_PERSON_SINGULAR = 1   // I
const SECOND_PERSON_SINGULAR = 2  // you
const THIRD_PERSON_SINGULAR = 3   // he/she/it
const FIRST_PERSON_PLURAL = 4     // we
const SECOND_PERSON_PLURAL = 5    // you
const THIRD_PERSON_PLURAL = 6     // they
const GERUND = 7
const PAST_PARTICIPLE = 8
const PAST_TENSE = 9
const ALL_PERSON_REGEX = 10

function conjugate(infinitive, form) {
  let words = infinitive.split(' ')
  infinitive = words[0]

  let conjugated
  if(form == ALL_PERSON_REGEX)
    conjugated = anyPersonRegex(infinitive)
  if(irregular[infinitive] && irregular[infinitive][form])
    conjugated = irregular[infinitive][form]
  else
    conjugated = conjugateRegular(infinitive, form)

  words[0] = conjugated
  return words.join(' ')
}

function conjugateRegular(infinitive, form) {
  switch(form) {
    // third person singular
    case THIRD_PERSON_SINGULAR:
      if(endsWithOOrX.test(infinitive))
        return infinitive+'es'
      else
        return infinitive+'s'

    // gerund
    case GERUND:
      if(endsWithE.test(infinitive))
        return infinitive.slice(0, infinitive.length-1)+'ing'
      if(endsWithShortConsonant.test(infinitive))
        return infinitive + infinitive[infinitive.length-1]+'ing'
      return infinitive+'ing'

    // past participle
    case PAST_TENSE:
    case PAST_PARTICIPLE:
      if(endsWithShortConsonant.test(infinitive))
        return infinitive + infinitive[infinitive.length-1]+'ed'
      if(endsWithE.test(infinitive))
        return infinitive+'d'
      else
        return infinitive+'ed';

    default:
      return infinitive
  }
}

function anyPersonRegex(infinitive) {
  let forms = []
  for(let person=1; person<=6; ++person) {
    let form = conjugate(infinitive, person)
    if(!forms.includes(form))
      forms.push(form)
  }
  return regOp.or(...forms)
}


module.exports = conjugate
conjugate.anyPersonRegex

},{"../regOps":50,"./irregularConjugations":46}],45:[function(require,module,exports){
// Determine the numeric person of a given noun phrase

/*
VERB FORMS DENOTED AS NUMBERS:
  0.  infinitive
  1.  first person singular
  2.  second person singular
  3.  third person singular
  4.  first person plural
  5.  second person plural
  6.  third person plural
  (7. gerund/present-participle)
  (8. past-participle)
  (9. past tense form)
*/

const {placeholderRegex} = require("../Substitution")
const placeholderTest = new RegExp('^'+placeholderRegex.source+'$', '')

function getPerson(subject) {
  // if subject is not a string, assume third person for now
  if(subject && subject.constructor != String)
    return 3

  let lowerCaseSubject = subject.toLowerCase()

  if(lowerCaseSubject == 'i')
    return 1 // first person singular

  else if(lowerCaseSubject == 'you')
    return 2 // or 5 but never mind

  else if((/^(he|she|it)$/i).test(subject))
    return 3 // third person singular

  else if(lowerCaseSubject == 'we')
    return 4 // first person plural

  else if(lowerCaseSubject == 'they')
    return 6 // third person plural

  else if(subject.constructor == RegExp || placeholderTest.test(subject))
    return 10 // placeholder, get regex

  else // otherwise assume third person
    return 3

  // TODO, what about third person plural non pronouns!
}
module.exports = getPerson

},{"../Substitution":43}],46:[function(require,module,exports){
// list of irregular verbs with their conjugations.
// (indexed by infinitive)

/*
VERB FORMS DENOTED AS NUMBERS:
  0.  infinitive
  1.  first person singular
  2.  second person singular
  3.  third person singular
  4.  first person plural
  5.  second person plural
  6.  third person plural
  (7.  gerund/present-participle)
  (8.  past-participle)
  (9. past tense form)
*/

const FIRST_PERSON_SINGULAR = 1   // I
const SECOND_PERSON_SINGULAR = 2  // you
const THIRD_PERSON_SINGULAR = 3   // he/she/it
const FIRST_PERSON_PLURAL = 4     // we
const SECOND_PERSON_PLURAL = 5    // you
const THIRD_PERSON_PLURAL = 6     // they
const GERUND = 7
const PAST_PARTICIPLE = 8
const PAST_TENSE = 9
const ALL_PERSON_REGEX = 10

module.exports = {
  // be IS THIS EVEN A VERB?
  be: {
    1: 'am', 2:'are', 3:'is', 4:'are', 5:'are', 6:'are', 7:'being', 8:'been',
    9:'was',
  },

  say: {8:'said', 9:'said'},

  make: {8: 'made', 9: 'made'},
  go:   {8: 'gone', 9: 'went'},
  take: {8: 'taken',9: 'took'},
  come: {8: 'come', 9: 'came'},
  see: {7: 'seeing', 8:'seen', 9:'saw'},
  know: {8: 'known', 9:'knew'},
  get: {8:'got', 9:'got'},
  run: {8:'run', 9:'ran'},
  were: {1:'was', 3:'was'}, // this is a cludge and i know it
  have: {3:'has', 8:'had', 9:"had"},
  eat: {7:'eating', 8:'eaten', 9:'ate'},
  contain: {7:'containing', 8:'contained', 9:'contained'},
  hold: {8:'held', 9:'held'},
  put: {8:'put', 9:'put'},
  poop: {7:'pooping', 8:'pooped', 9:'pooped'},
  steal: {7:'stealing', 8:'stolen', 9:'stole'},
  lead: {7:'leading', 8:'lead', 9:'lead'},
  // give
  // find
  // think
  // tell
  // become
  // show
  // leave
  // feel
  // bring
  // begin
  // keep
  // write
  // stand
  // hear
  // let
  // mean
  // set
  // meet
  // pay
  // sit
  // speak
  // lie
  // lead
  // read
  // grow
  // lose
  // fall
  // send
  // build
  // understood
  // draw
  // break
  // spend
  // cut
  // rise
  // drive
  // buy
  // wear
  // choose

  // to shit

}

},{}],47:[function(require,module,exports){
/*
Tenses: [source ef.co.uk]
  - Simple Present ("They walk home.")
  - Present Continuous ("They are walking home.")
  - Simple Past ("Peter lived in China in 1965")
  - Past Continuous ("I was reading when she arrived.")
  - Present Perfect ("I have lived here since 1987.")
  - Present Perfect Continuous ("I have been living here for years.")
  - Past Perfect ("We had been to see her several times before she visited us")
  - Past Perfect continuous ("He had been watching her for some time when she
    turned and smiled.")
  - Future Perfect ("We will have arrived in the states by the time you get this
    letter.")
  - Future Perfect Continuous ("By the end of your course, you will have been
    studying for five years")
  - Simple Future ("They will go to Italy next week.")
  - Future Continuous ("I will be travelling by train.")


  (Maybe also include:
  - Zero conditional ("If ice gets hot it melts.")
  - Type 1 Conditional ("If he is late I will be angry.")
  - Type 2 Conditional ("If he was in Australia he would be getting up now.")
  - Type 3 Conditional ("She would have visited me if she had had time")
  - Mixed Conditional ("I would be playing tennis if I hadn't broken my arm.")
  - Gerund
  - Present participle)
*/

const conjugate = require("./conjugate")
const getPerson = require("./getPerson")
const {sub} = require('../Substitution')
//const Substitution = require("../Substitution")
const regOps = require("../regOps")

const GERUND = 7
const PAST_PARTICIPLE = 8
const PAST_TENSE = 9

const actionReservedWords = ['_verb', '_object', '_subject']

function verbPhrase(
  action,
  tense='simple_present',
  {
    omit=[],
    nounPhraseFor=null,
    prepositionClauseFor=null
  } = {}
) {
  if(prepositionClauseFor)
    return sub('that _', verbPhrase(
      action, tense, {omit: [prepositionClauseFor]}
    ))

  if(nounPhraseFor) {
    return sub(
      '_ that _',
      action[nounPhraseFor],
      verbPhrase(action, tense, {omit: nounPhraseFor}))
  }



  let vp = tenses[tense](action)

  if(action._object && omit != '_object')
    vp = sub("_ O_", vp, action._object)

  for(var prep in action) {
    if(!actionReservedWords.includes(prep))
      if(omit == prep)
        vp = sub('_ _', vp, prep)
      else
        vp = sub('_ _ _', vp, prep, action[prep])
  }

  if(omit != '_subject' && tense != 'imperative')
    vp = sub('S_ _', action._subject, vp)

  return vp
}

function contractBySubject(actions, tense) {
  // format a set of actions as a contracted phrases sharing the same subject

  // first check that the subjects match
  let subject = actions[0]._subject
  for(let action of actions)
    if(action._subject != subject)
      throw "cannot perform contraction because the subjects do not match"

  return sub(
    '_ _', subject,
    actions.map(action => verbPhrase(action, tense, {omit:['_subject']}))
  )
}

function anyTenseRegex(verb) {
  let action = {_verb:verb, _subject:'_subject'}
  let forms = []
  for(var i in tenses) {
    let form = tenses[i](action)
    if(form.isSubstitution)
      form = form.getRegex()
    forms.push(form)
  }

  return regOps.or(...forms)
}

const tenses = {
  simple_present(action) {
    let person = getPerson(action._subject)
    return sub(
      "_",
      conjugate(action._verb, person)
    )
  },

  present_continuous(action) {
    let person = getPerson(action._subject)
    return sub(
      "_ _",
      conjugate('be', person),
      conjugate(action._verb, GERUND)
    )
  },

  simple_past(action) {
    let person = getPerson(action._subject)
    return sub(
      '_',
      conjugate(action._verb, PAST_TENSE)
    )
  },

  past_continuous(action) {
    let person = getPerson(action._subject)
    return sub(
      '_ _',
      conjugate('were', person),
      conjugate(action._verb, GERUND)
    )
  },

  present_perfect(action) {
    let person = getPerson(action._subject)
    return sub(
      '_ _',
      conjugate('have', person),
      conjugate(action._verb, PAST_PARTICIPLE)
    )
  },

  present_perfect_continuous(action) {
    let person = getPerson(action._subject)
    return sub(
      '_ been _',
      conjugate('have', person),
      conjugate(action._verb, GERUND)
    )
  },

  past_perfect(action) {
    let person = getPerson(action._subject)
    return sub(
      '_ _',
      conjugate('have', person),
      conjugate(action._verb, PAST_PARTICIPLE)
    )
  },

  past_perfect_continuous(action) {
    return sub(
      'had been _',
      conjugate(action._verb, GERUND)
    )
  },

  future_perfect(action) { // we will have verbed
    return sub(
      'will have _',
      conjugate(action._verb, PAST_PARTICIPLE)
    )
  },

  // Future Perfect Continuous ("you will have been studying for five years")
  future_perfect_continuous(action) {
    return sub(
      'will have been _',
      conjugate(action._verb, GERUND)
    )
  },

  // Simple Future ("They will go to Italy next week.")
  simple_future(action) {
    return sub(
      'will _',
      action._verb,
    )
  },

  // Future Continuous ("I will be travelling by train.")
  future_continuous({_subject, _verb}) {
    return sub(
      'will be _',
      conjugate(_verb, GERUND)
    )
  },

  imperative({_verb}) {
    return sub(_verb)
  },

  negative_possible_present({_subject, _verb}) {
    return sub('cannot _', _verb)
  },
  negative_possible_past({_subject, _verb}) {
    return sub('could not _', _verb)
  },
}

function tenseType(tense) {
  if(tense.includes('past'))
    return 'past'
  else if(tense.includes('present'))
    return 'present'
  else if(tense.includes('future'))
    return 'future'
  else
    return undefined
}

module.exports = verbPhrase
verbPhrase.contractBySubject = contractBySubject
verbPhrase.tenses = tenses
verbPhrase.tenseList = Object.keys(tenses).reverse() // in descending order of complexity
verbPhrase.anyTenseRegex = anyTenseRegex
verbPhrase.getTenseType = tenseType

},{"../Substitution":43,"../regOps":50,"./conjugate":44,"./getPerson":45}],48:[function(require,module,exports){
/*
  Borrowed from NULP, https://github.com/joelyjoel/Nulp/
  Seperate words, punctuation and capitalisation. Form an array which is easier
  to process.
*/


const wordCharRegex = /[\w']/;
const punctuationCharRegex = /[.,"()!?-]/;

module.exports = parseText = function(str) {
    // seperates a string into a list of words and punctuation

    str = removeFancyShit(str);

    var parts = new Array();

    var c, lastC;

    var partType = undefined;
    parts[0] = "";
    for(var i=0; i<str.length; i++) {
        //lastC = c;
        c = str.charAt(i);

        if(c == "_") {
            if(partType == undefined)
                partType = "q";
            else if(partType == "punctuation") {
                partType = "q";
                parts.push("");
            }
        }
        if(partType == "q") {
            if(c == " " || c == "\n" || c == "\t") {
                parts.push("");
                partType = undefined;
                continue;
            } else {
                parts[parts.length-1] += c;
                continue;
            }
        }

        if(c == "\n") {
            if(partType == "punctuation")
                parts[parts.length-1] += c;
            else
                parts.push(c);

            parts.push("");
            partType = undefined;
            continue;
        }

        if(c == " " && parts[parts.length-1] != "") {
            parts.push("");
            partType = undefined
            continue;
        }

        // special punctuation (hyphens and apostrophes)
        if(c == "'") {
            if(partType == "word" && (str.charAt(i+1).match(wordCharRegex) || str.charAt(i-1) == "s")) {
                parts[parts.length-1] += c;
                continue;
            }
        }

        if(c == "-") {
            if(str.charAt(i-1) == " " || str.charAt(i+1) == " ") {
                parts[parts.length-1] += "~";
                continue;
            }
        }

        // word
        if(c.match(wordCharRegex)) {
            if(partType == undefined) {
                partType = "word";
            }
            if(partType != "word") {
                parts.push("");
                partType = "word";
            }
            parts[parts.length-1] += c;
            continue;
        }

        //if(c.match(punctuationCharRegex)) {
        else {
            /*if(partType == undefined) {
                partType = "punctuation";
            }
            if(partType != "punctuation") {
                parts.push("");
                partType = "punctuation";
            }
            parts[parts.length-1] += c;*/
            parts.push(c);
            partType = "punctuation";
            continue;
        }

        console.log("Unrecognised character", c);
    }
    //console.log(parts);
    for(var i=0; i<parts.length; i++) {
        if(parts[i] == "")
            continue;
        if(parts[i][0].match(/[A-Z]/) && parts[i].slice(1).match(/[a-z]/)) {
            parts[i] = parts[i].toLowerCase();
            parts.splice(i, 0, "^");
            i++;
        }
    }

    return parts;
}

function isWord(str) {
  var c
  for(var i in str) {
    c = str[i]
    if(!c.match(wordCharRegex))
      return false
  }
  return true
}
module.exports.isWord = isWord

function removeFancyShit(str) {
    while(str.indexOf("’") != -1) {
        str = str.replace("’", "\'")
    }

    return str;
}

function recombine(bits) {
    var printedWords = []
    var upper = false
    for(var i in bits) {
        let w = bits[i]
        if(isWord(w)) {
            if(upper) {
                w = w[0].toUpperCase() + w.slice(1)
                upper = false;
            }
            printedWords.push(w)
        } else {
            if(w == "^") {
                upper = true;
                continue;
            }
            printedWords[printedWords.length-1] += w;
        }
    }
    return printedWords.join(" ")
}
module.exports.recombine = recombine

},{}],49:[function(require,module,exports){
function politeList(list) {
  if(list.length == 1)
    return list[0]
  else {
    return list.slice(0, list.length-1).join(", ") + " and " + list[list.length-1]
  }
}
module.exports = politeList

},{}],50:[function(require,module,exports){
function sourcify(list) {
  return list
    .filter(item => item)
    .map(item => item.constructor == RegExp ? item.source : item)
}

function bracket(str) {
  return "(?:" + str + ")"
}
function autoBracket(str) {
  if(/^[\w, ]*$/.test(str))
    return str
  else
    return bracket(str)
}

function concat(...operands) {
  return new RegExp(
    sourcify(operands)
      .map(autoBracket)
      .join("")
  )
}
function concatSpaced(...operands) {
  return new RegExp(
    sourcify(operands)
      .map(autoBracket)
      .join(" ")
  )
}
function or(...operands) {
  return new RegExp(
    sourcify(operands)
      .map(autoBracket)
      .join("|")
  )
}
function optional(operand) {
  operand = new RegExp(operand).source
  operand = bracket(operand)
  return operand + "?"
}
function kleene(operand) {
  operand = new RegExp(operand).source
  operand = bracket(operand)
  return operand + "*"
}

function kleeneSpaced(operand) {
  return kleeneJoin(operand, ' ')
}

function kleeneJoin(operand, seperator) {
  operand = new RegExp(operand).source
  seperator = new RegExp(seperator).source
  return concat(operand, kleene(concat(seperator, operand)))
}

function kleenePoliteList(...operands) {
  operand = or(...operands)
  return concat(
    optional(concat(kleeneJoin(operand,', '), ',? and ')),
    operand
  )
}

function optionalConcatSpaced(stem, ...optionalAppendages) {
  stem = autoBracket(new RegExp(stem).source)
  optionalAppendages = sourcify(optionalAppendages)
    .map(a => autoBracket(a))
    .map(a => optional(" " + a))
  return concat(stem, ...optionalAppendages)
}

function kleeneConcatSpaced(stem, ...optionalAppendages) {
  stem = autoBracket(new RegExp(stem).source)
  optionalAppendages = sourcify(optionalAppendages)

  let toConcat = kleene(concat(' ', or(...optionalAppendages).source))
  return concat(stem, toConcat)
}

function whole(operand) {
  operand = autoBracket(new RegExp(operand).source)
  return new RegExp('^'+operand+'$')
}

module.exports = {
  concat: concat,
  concatSpaced: concatSpaced,
  or: or,
  optional: optional,
  kleene: kleene,
  kleeneJoin: kleeneJoin,
  kleeneSpaced: kleeneSpaced,
  kleenePoliteList: kleenePoliteList,
  kleeneConcatSpaced: kleeneConcatSpaced,
  optionalConcatSpaced: optionalConcatSpaced,
  autoBracket: autoBracket,
  whole: whole,
}

},{}],51:[function(require,module,exports){
/*
  A set of tools for using the so-called 'special array', or 'specarr'.

  Special Arrays consist of:
  [
    - null values to ignore
    - strings
    - Regexs
    - Entityena
    - substitutions
    - functions returning:
      - null values to ignore
      - strings
      - regexs
      - entityena
      - substitutions
      - special arrays for recursion
  ]

  Fully expanded special arrays consist of:
  [
    - strings,
    - regexs,
    - entityena,
    - substitutions
    - NO FUNCTIONS AND NO NULL VALUES
  ]

  Note: I in the function names in this file I am using an underscore to mean
        'to'. Eg/ specarr_regexs means "Special array to regular expressions"
*/

const {randexp} = require("randexp")

function specarr_regexs(target, specialArr, depth) { // special array to regexps
  // convert a 'special array' into an array of strings and regular expressions
  if(!target || (!target.isEntityenon && !target.isEntity))
    throw "expects target to be a Entityenon. "+target
  if(!specialArr || specialArr.constructor != Array)
    throw "expects specialArr to be an array."

  var out = [] // the output array
  for(var i in specialArr) {
    let item = specialArr[i]

    if(!item) // skip null values
      continue

    else if(item.constructor == String) // accept strings as regexs
      out.push(new RegExp(item))

    else if(item.constructor == RegExp) // accept regular expressions
      out.push(item)

    else if(item.isEntityenon)
      out.push(item.refRegex())
    else if(item.isEntity)
      out.push(item.reg(depth))

    // if substitution, interpret the substitution as a regex and add
    else if(item.isSubstitution) {
      //console.warn("Very odd, a substitution that is not returned by a function")
      let subbed = item.getRegex(depth)
      if(subbed)
        out.push(subbed)
    }

    else if(item.constructor == Function) {
      // call function on the target
      let result = item(target)

      // if result is null, skip.
      if(!result)
        continue;
      // accept result if RegExp
      else if(result.constructor == RegExp)
        out.push(result)
      // if string cast as RegExp and accept
      else if(result.constructor == String)
        out.push(new RegExp(result))
      // if substitution, interpret the substitution as a regex and add
      else if(result.isSubstitution) {
        let subbed = result.getRegex(depth)
        if(subbed)
          out.push(subbed)
      }
      // if entityenon, return its regex
      else if(result.isEntityenon)
        out.push(result.refRegex())
      else if(result.isEntity)
        out.push(result.reg(depth))
      // if array, recursively interpret and concatenate the result
      else if(result.constructor == Array)
        out = out.concat(specarr_regexs(target, result))
      else
        console.warn("Uninterpretted value from function:", result)
    } else
      console.warn("Uninterpretted value from list:", item)
  }

  // perhaps remove duplicates?
  for(var i in out) {
    if(out[i].constructor != RegExp)
      console.warn("specarr_regexs returned item which is not a regex:", out[i])
  }

  return out
}

function expand(target, specialArr) {
  /* Return the list of strings, regexs, objects and substitutions implied by
      the special array. */
  if(!target || !(target.isEntityenon || target.isEntity))
    throw "expects target to be a Entityenon."
  if(!specialArr || specialArr.constructor != Array)
    throw "expects specialArr to be an array."

  let out = []
  for(var i in specialArr) {
    let item = specialArr[i]
    if(!item) // skip null values
      continue

    else if(item.constructor == String) // accept strings
      out.push(item)

    else if(item.constructor == RegExp) // accept regular expressions
      out.push(item)

    else if(item.isSubstitution) // accept substitutions
      out.push(item)

    else if(item.isEntityenon || item.isEntity) // accept entityenon
      out.push(item)

    else if(item.isAction) // accept actions
      out.push(item)

    else if(typeof item == 'object' && item._verb) // accept rough actions
      out.push(item)

    // execute functions
    else if(item.constructor == Function) {
      let result = item(target)

      if(!result) // skip null function returns
        continue

      else if(result.constructor == RegExp) // accept regex function returns
        out.push(result)

      else if(result.constructor == String) // accept strings
        out.push(result)

      else if(result.isSubstitution) // accept substitutions
        out.push(result)

      else if(result.isEntityenon || item.isEntity) // accept entityena
        out.push(result)

      else if(result.isAction) // accept actions
        out.push(result)

      else if(typeof result == 'object' && result._verb) // accept rough actions
        out.push(result)

      else if(result.constructor == Array)
        out = out.concat(expand(target, result))
      else
        console.warn("Uninterpretted value from function:", result)
    } else
      console.warn("Uninterpretted value from list:", item)
  }

  return out
}

function cellToString(cell, descriptionCtx) { // "special array cell to string"
  // get a finalised string for an expanded special arr cell

  // if null or function, throw an error
  if(!cell || cell.constructor == Function)
    throw "illegal special cell."

  // if string, return as is
  if(cell.constructor == String)
    return cell
  // if regex, return using randexp
  if(cell.constructor == RegExp)
    return randexp(cell)
  // if entityenon, get its ref
  if(cell.isEntityenon)
    return cell.ref(descriptionCtx)
  if(cell.isEntity)
    return cell.ref()
  // if substitution, get its string
  if(cell.isSubstitution)
    return cell.getString(descriptionCtx)
}

// TODO: cellToRegex

function randomString(target, arr, ctx) {
  let expanded = expand(target, arr).sort(() => Math.random()*2-1)
  for(var i=0; i<expanded.length; i++) {
    let str = cellToString(expanded[i], ctx)
    if(str)
      return str
  }
  return null
}

function randomStrings(target, arr, ctx, n=1) {
  let expanded = expand(target, arr).sort(() => Math.random()*2-1)
  let list = []
  for(var i=0; i<expanded.length && list.length < n; i++) {
    let str = cellToString(expanded[i], ctx)
    if(str)
      list.push(str)
  }
  return list
}

function random(target, arr) {
  let expanded = expand(target, arr)
  return expanded[Math.floor(Math.random()*expanded.length)]
}


module.exports = {
  toRegexs: specarr_regexs,
  expand: expand,
  cellToString: cellToString,
  randomString: randomString,
  randomStrings: randomStrings,
  random: random,
}

},{"randexp":6}],52:[function(require,module,exports){
const parseText = require("./parseText")

function spellcheck(str) {
  let split = parseText(str)

  // correct the spelling of indefinite articles
  for(var i=1; i<split.length; i++)
    if((/^(a|an)$/).test(split[i-1])) {
      if((/^[aeiouh].*/).test(split[i]))
        split[i-1] = 'an'
      else
        split[i-1] = 'a'
    }

  let recombined = parseText.recombine(split)
  return recombined+' '
}
module.exports = spellcheck

},{"./parseText":48}],53:[function(require,module,exports){
// get the subject-form of a pronoun

const subjectForms = {
  'him': 'he',
  'her': 'she',
  'them': 'they',
  'me': 'I',
}

function toSubject(str) {
  if(subjectForms[str])
    return subjectForms[str]
  else
    return str
}
module.exports = toSubject

},{}],54:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[4]);
