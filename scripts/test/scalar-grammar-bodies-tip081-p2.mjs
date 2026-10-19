// Offline constant source templates only. No parser is imported or invoked here.
// The generated private adapter must transform/review these bodies too: helper
// result records, calls and loops are NOT exempt from before-growth accounting.
export const SCALAR_GRAMMAR_HELPERS = `
function __scalarLine(c) {
  return c === 10 || c === 13 || c === 8232 || c === 8233;
}
function __scalarSpace(c) {
  return c === 9 || c === 11 || c === 12 || c === 32 || c === 160 ||
    c === 5760 || c >= 8192 && c <= 8202 || c === 8239 || c === 8287 ||
    c === 12288 || c === 65279;
}
function __scalarStart(c) {
  return c === 36 || c === 95 || c >= 65 && c <= 90 || c >= 97 && c <= 122;
}
function __scalarContinue(c) {
  return __scalarStart(c) || c >= 48 && c <= 57;
}
function __scalarHex(c) {
  return c >= 48 && c <= 57 ? c - 48 : c >= 65 && c <= 70 ? c - 55 :
    c >= 97 && c <= 102 ? c - 87 : -1;
}
function __scalarGapLine(text, start, end) {
  for (var i = start; i < end; i++) {
    __tick();
    if (__scalarLine(__char(text, i))) return true;
  }
  return false;
}
// Packed scalar: end*2 + lineBreak. It avoids an allocation on each trivia peek.
function __scalarTrivia(text, start, inModule, lastTokenEnd, hashBang) {
  var i = start, sawLine = false;
  while (i < text.length) {
    __tick();
    var c = __char(text, i), width = 0, block = false;
    if (__scalarSpace(c)) { i++; continue; }
    if (__scalarLine(c)) {
      sawLine = true; i++;
      if (c === 13 && __char(text, i) === 10) i++;
      continue;
    }
    if (i === 0 && hashBang && c === 35 && __char(text, i + 1) === 33) width = 2;
    else if (c === 47 && __char(text, i + 1) === 47) width = 2;
    else if (c === 47 && __char(text, i + 1) === 42) { width = 2; block = true; }
    else if (!inModule && c === 60 && __char(text, i + 1) === 33 &&
      __char(text, i + 2) === 45 && __char(text, i + 3) === 45) width = 4;
    else if (!inModule && c === 45 && __char(text, i + 1) === 45 &&
      __char(text, i + 2) === 62 && (lastTokenEnd === 0 ||
      __scalarGapLine(text, lastTokenEnd, i))) width = 3;
    if (width === 0) break;
    i += width;
    if (!block) {
      while (i < text.length && !__scalarLine(__char(text, i))) { __tick(); i++; }
      continue;
    }
    var closed = false;
    while (i < text.length) {
      __tick();
      var b = __char(text, i++);
      if (__scalarLine(b)) sawLine = true;
      if (b === 42 && __char(text, i) === 47) { i++; closed = true; break; }
    }
    if (!closed) __refuse("SYNTAX_REFUSED");
  }
  return i * 2 + (sawLine ? 1 : 0);
}
function __scalarPeekWord(text, start) {
  var i = start, first = true, value = "", chunk = start, escaped = false;
  while (i < text.length) {
    __tick();
    var c = __char(text, i);
    if (__scalarSpace(c) || __scalarLine(c)) break;
    if (c >= 128) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
    if (c === 92) {
      value = __concat(value, __slice(text, chunk, i)); escaped = true;
      if (__char(text, ++i) !== 117) __refuse("SYNTAX_REFUSED");
      i++;
      var point = 0, digits = 0, braced = __char(text, i) === 123;
      if (braced) i++;
      while (braced ? i < text.length && __char(text, i) !== 125 : digits < 4) {
        __tick();
        var d = __scalarHex(__char(text, i));
        if (d < 0) __refuse("SYNTAX_REFUSED");
        point = point * 16 + d; digits++; i++;
        if (point > 1114111) __refuse("SYNTAX_REFUSED");
      }
      if (braced) {
        if (digits === 0 || __char(text, i) !== 125) __refuse("SYNTAX_REFUSED");
        i++;
      }
      if (point > 127) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
      if (!(first ? __scalarStart(point) : __scalarContinue(point))) __refuse("SYNTAX_REFUSED");
      value = __concat(value, __codePoint(point)); chunk = i;
    } else {
      if (!(first ? __scalarStart(c) : __scalarContinue(c))) break;
      i++;
    }
    first = false;
  }
  return {value: __concat(value, __slice(text, chunk, i)), end: i, escaped: escaped};
}
function __scalarNumericSpelling(text, start, end) {
  if (end - start > 1024) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  var separator = false;
  for (var i = start; i < end; i++) {
    __tick();
    if (__char(text, i) === 95) separator = true;
  }
  if (!separator) return __slice(text, start, end);
  var spelling = "", chunk = start;
  for (var p = start; p < end; p++) {
    __tick();
    if (__char(text, p) === 95) {
      spelling = __concat(spelling, __slice(text, chunk, p)); chunk = p + 1;
    }
  }
  return __concat(spelling, __slice(text, chunk, end));
}
`;

export const SCALAR_GRAMMAR_BODIES = Object.freeze({
  strictDirective: `
var i = start, previousEnd = start, text = this.input;
for (;;) {
  __tick();
  var trivia = __scalarTrivia(text, i, this.inModule, previousEnd, this.options.allowHashBang);
  i = (trivia - trivia % 2) / 2;
  var quote = __char(text, i);
  if (quote !== 34 && quote !== 39) return false;
  var p = i + 1, raw = true, length = 0, closed = false;
  while (p < text.length) {
    __tick();
    var c = __char(text, p++);
    if (c === quote) { closed = true; break; }
    if (c === 10 || c === 13) __refuse("SYNTAX_REFUSED");
    if (c === 92) {
      raw = false;
      var escaped = __char(text, p++);
      if (escaped !== escaped) __refuse("SYNTAX_REFUSED");
      if (escaped === 13 && __char(text, p) === 10) p++;
      // A malformed non-strict quoted prefix will be rejected by readString;
      // this peek does not decode its escapes into a directive spelling.
    } else if (length >= 10 || c !== __char("use strict", length)) raw = false;
    length++;
  }
  if (!closed) __refuse("SYNTAX_REFUSED");
  var gap = __scalarTrivia(text, p, this.inModule, p, this.options.allowHashBang);
  var end = (gap - gap % 2) / 2, hasLine = gap % 2 === 1, next = __char(text, end);
  var continued = next === 40 || next === 91 || next === 46 || next === 96 ||
    next === 42 || next === 47 || next === 37 || next === 60 || next === 62 ||
    next === 61 || next === 38 || next === 124 || next === 94 || next === 63 || next === 44;
  if (next === 43 || next === 45) {
    continued = !(hasLine && __char(text, end + 1) === next);
  }
  if (next === 33 && __char(text, end + 1) === 61) continued = true;
  if (__scalarStart(next) || next === 92 || next >= 128) {
    var word = __scalarPeekWord(text, end);
    if (word.value === "in" || word.value === "instanceof") continued = true;
  }
  if (continued) return false;
  if (!(next === 59 || next === 125 || end === text.length || hasLine)) return false;
  // Deliberate EOF/word-operator repairs over the stock lookahead heuristic.
  if (raw && length === 10) return true;
  if (next === 59) { i = end + 1; previousEnd = i; }
  else if (next === 125 || end === text.length) return false;
  else { i = end; previousEnd = p; }
}
`,
  canInsertSemicolon: `
return this.type === m.eof || this.type === m.braceR ||
  __scalarGapLine(this.input, this.lastTokEnd, this.start);
`,
  isLet: `
if (!this.isContextual("let")) return false;
var packed = __scalarTrivia(this.input, this.pos, this.inModule, this.lastTokEnd, this.options.allowHashBang);
var i = (packed - packed % 2) / 2, c = __char(this.input, i);
if (c === 91 || c === 92) return true;
if (context) return false;
if (c === 123) return true;
if (c >= 128) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
if (__scalarStart(c)) {
  var word = __scalarPeekWord(this.input, i);
  return word.escaped || word.value !== "in" && word.value !== "instanceof";
}
return false;
`,
  isAsyncFunction: `
if (!this.isContextual("async")) return false;
var packed = __scalarTrivia(this.input, this.pos, this.inModule, this.lastTokEnd, this.options.allowHashBang);
if (packed % 2 === 1) return false;
var i = (packed - packed % 2) / 2;
if (!__scalarStart(__char(this.input, i))) {
  if (__char(this.input, i) >= 128) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  // An escaped next identifier is not the unescaped function keyword.
  return false;
}
var word = __scalarPeekWord(this.input, i);
return !word.escaped && word.value === "function";
`,
  skipSpace: `
var packed = __scalarTrivia(this.input, this.pos, this.inModule, this.lastTokEnd, this.options.allowHashBang);
this.pos = (packed - packed % 2) / 2;
`,
  readCodePoint: `
var start = this.pos, value = 0, digits = 0;
if (__char(this.input, this.pos) === 123) {
  this.pos++; start = this.pos;
  while (this.pos < this.input.length && __char(this.input, this.pos) !== 125) {
    __tick();
    var digit = __scalarHex(__char(this.input, this.pos));
    if (digit < 0) this.invalidStringToken(start, "Bad character escape sequence");
    value = value * 16 + digit; digits++; this.pos++;
  }
  if (digits === 0 || __char(this.input, this.pos) !== 125) {
    this.invalidStringToken(start, "Bad character escape sequence");
  }
  this.pos++;
  if (value > 1114111) this.invalidStringToken(start, "Code point out of bounds");
  return value;
}
for (var i = 0; i < 4; i++) {
  __tick();
  var digit = __scalarHex(__char(this.input, this.pos));
  if (digit < 0) this.invalidStringToken(start, "Bad character escape sequence");
  value = value * 16 + digit; this.pos++;
}
return value;
`,
  readEscapedChar: `
var c = __char(this.input, ++this.pos); this.pos++;
switch (c) {
  case 110: return "\\n";
  case 114: return "\\r";
  case 116: return "\\t";
  case 98: return "\\b";
  case 118: return "\\v";
  case 102: return "\\f";
  case 120: return __codePoint(this.readHexChar(2));
  case 117: return __codePoint(this.readCodePoint());
  case 13:
    if (__char(this.input, this.pos) === 10) this.pos++;
    return "";
  case 10: case 8232: case 8233: return "";
  case 56: case 57:
    if (this.strict || inTemplate) {
      this.invalidStringToken(this.pos - 1, "Invalid escape sequence");
    }
    return __codePoint(c);
}
if (c !== c) this.invalidStringToken(this.pos - 1, "Bad character escape sequence");
if (c >= 48 && c <= 55) {
  var value = c - 48, digits = 1;
  while (digits < 3) {
    __tick();
    var next = __char(this.input, this.pos);
    if (next < 48 || next > 55 || next !== next) break;
    var candidate = value * 8 + next - 48;
    if (candidate > 255) break;
    value = candidate; digits++; this.pos++;
  }
  var following = __char(this.input, this.pos);
  if ((digits !== 1 || c !== 48 || following === 56 || following === 57) &&
      (this.strict || inTemplate)) {
    this.invalidStringToken(this.pos - 1 - digits, "Octal escape sequence");
  }
  return __codePoint(value);
}
return __codePoint(c);
`,
  readWord1: `
this.containsEsc = false;
var word = "", first = true, chunk = this.pos;
while (this.pos < this.input.length) {
  __tick();
  var c = __char(this.input, this.pos);
  if (__scalarSpace(c) || __scalarLine(c)) break;
  if (c >= 128) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
  if (c === 92) {
    this.containsEsc = true;
    word = __concat(word, __slice(this.input, chunk, this.pos));
    var escapeStart = this.pos;
    if (__char(this.input, ++this.pos) !== 117) {
      this.invalidStringToken(this.pos, "Expecting Unicode escape sequence");
    }
    this.pos++;
    var point = this.readCodePoint();
    if (point > 127) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
    if (!(first ? __scalarStart(point) : __scalarContinue(point))) {
      this.invalidStringToken(escapeStart, "Invalid Unicode escape");
    }
    word = __concat(word, __codePoint(point)); chunk = this.pos;
  } else {
    if (!(first ? __scalarStart(c) : __scalarContinue(c))) break;
    this.pos++;
  }
  first = false;
}
return __concat(word, __slice(this.input, chunk, this.pos));
`,
  readRadixNumber: `
var start = this.pos; this.pos += 2;
var digitsStart = this.pos, value = this.readInt(radix);
if (value === null) this.raise(this.start + 2, "Invalid radix number");
var next = __char(this.input, this.pos);
if (next === 110) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
if (next >= 128 && !__scalarSpace(next) && !__scalarLine(next)) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
if (__scalarStart(next) || next === 92) this.raise(this.pos, "Identifier directly after number");
if (this.pos - digitsStart > 1024) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
// Preserve readInt's iterative rounding; reconversion can change long radices.
return this.finishToken(m.num, value);
`,
  readNumber: `
var start = this.pos;
if (!startsWithDot && this.readInt(10, undefined, true) === null) {
  this.raise(start, "Invalid number");
}
var legacyOctal = this.pos - start >= 2 && __char(this.input, start) === 48;
if (legacyOctal && this.strict) this.raise(start, "Invalid number");
var next = __char(this.input, this.pos);
if (!legacyOctal && !startsWithDot && next === 110) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
if (legacyOctal) {
  for (var i = start; i < this.pos; i++) {
    __tick();
    var digit = __char(this.input, i);
    if (digit === 56 || digit === 57) legacyOctal = false;
  }
}
if (next === 46 && !legacyOctal) {
  this.pos++; this.readInt(10); next = __char(this.input, this.pos);
}
if ((next === 69 || next === 101) && !legacyOctal) {
  next = __char(this.input, ++this.pos);
  if (next === 43 || next === 45) this.pos++;
  if (this.readInt(10) === null) this.raise(start, "Invalid number");
}
var trailing = __char(this.input, this.pos);
if (trailing >= 128 && !__scalarSpace(trailing) && !__scalarLine(trailing)) __refuse("UNSUPPORTED_BOUNDED_SYNTAX");
if (__scalarStart(trailing) || trailing === 92) this.raise(this.pos, "Identifier directly after number");
var spelling = __scalarNumericSpelling(this.input, start, this.pos);
return this.finishToken(m.num, __number(spelling, legacyOctal ? 8 : 10));
`,
});

export const SCALAR_GRAMMAR_PARAMETER_NAMES = Object.freeze({
  strictDirective: "start", canInsertSemicolon: "", isLet: "context",
  isAsyncFunction: "", skipSpace: "",
  readCodePoint: "", readEscapedChar: "inTemplate", readWord1: "",
  readRadixNumber: "radix", readNumber: "startsWithDot",
});

export const SCALAR_GRAMMAR_ORIGINAL_ANCHORS = Object.freeze({
  strictDirective: 16344, canInsertSemicolon: 17203, isLet: 19615,
  isAsyncFunction: 20120, skipSpace: 107152,
  readCodePoint: 115894, readEscapedChar: 118510, readWord1: 119824,
  readRadixNumber: 114492, readNumber: 114907,
});
