"use strict";
var $__Token_46_js__,
    $__TokenType_46_js__;
var Token = ($__Token_46_js__ = require("./Token.js"), $__Token_46_js__ && $__Token_46_js__.__esModule && $__Token_46_js__ || {default: $__Token_46_js__}).Token;
var $__11 = ($__TokenType_46_js__ = require("./TokenType.js"), $__TokenType_46_js__ && $__TokenType_46_js__.__esModule && $__TokenType_46_js__ || {default: $__TokenType_46_js__}),
    NULL = $__11.NULL,
    NUMBER = $__11.NUMBER,
    STRING = $__11.STRING;
var StringParser = function() {
  var $__2;
  function StringParser(value) {
    this.value = value;
    this.index = 0;
  }
  return ($traceurRuntime.createClass)(StringParser, ($__2 = {}, Object.defineProperty($__2, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "next", {
    value: function() {
      if (++this.index >= this.value.length - 1)
        return {
          value: undefined,
          done: true
        };
      return {
        value: this.value[this.index],
        done: false
      };
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "parse", {
    value: function() {
      if (this.value.indexOf('\\') === -1)
        return this.value.slice(1, -1);
      var result = '';
      var $__6 = true;
      var $__7 = false;
      var $__8 = undefined;
      try {
        for (var $__4 = void 0,
            $__3 = (this)[Symbol.iterator](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
          var ch = $__4.value;
          {
            result += ch === '\\' ? this.parseEscapeSequence() : ch;
          }
        }
      } catch ($__9) {
        $__7 = true;
        $__8 = $__9;
      } finally {
        try {
          if (!$__6 && $__3.return != null) {
            $__3.return();
          }
        } finally {
          if ($__7) {
            throw $__8;
          }
        }
      }
      return result;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, "parseEscapeSequence", {
    value: function() {
      var ch = this.next().value;
      switch (ch) {
        case '\n':
        case '\r':
        case '\u2028':
        case '\u2029':
          return '';
        case '0':
          return '\0';
        case 'b':
          return '\b';
        case 'f':
          return '\f';
        case 'n':
          return '\n';
        case 'r':
          return '\r';
        case 't':
          return '\t';
        case 'v':
          return '\v';
        case 'x':
          return String.fromCharCode(parseInt(this.next().value + this.next().value, 16));
        case 'u':
          {
            var nextValue = this.next().value;
            if (nextValue === '{') {
              var hexDigits = '';
              while ((nextValue = this.next().value) !== '}') {
                hexDigits += nextValue;
              }
              var codePoint = parseInt(hexDigits, 16);
              if (codePoint <= 0xFFFF) {
                return String.fromCharCode(codePoint);
              }
              var high = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
              var low = (codePoint - 0x10000) % 0x400 + 0xDC00;
              return String.fromCharCode(high, low);
            }
            return String.fromCharCode(parseInt(nextValue + this.next().value + this.next().value + this.next().value, 16));
          }
        default:
          if (Number(ch) < 8)
            throw new Error('Octal literals are not supported');
          return ch;
      }
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__2), {});
}();
var LiteralToken = function($__super) {
  function LiteralToken(type, value, location) {
    $traceurRuntime.superConstructor(LiteralToken).call(this, type, location);
    this.value = value;
  }
  return ($traceurRuntime.createClass)(LiteralToken, {
    toString: function() {
      return this.value;
    },
    get processedValue() {
      switch (this.type) {
        case NULL:
          return null;
        case NUMBER:
          {
            var value = this.value;
            if (value.charCodeAt(0) === 48) {
              switch (value.charCodeAt(1)) {
                case 66:
                case 98:
                  return parseInt(this.value.slice(2), 2);
                case 79:
                case 111:
                  return parseInt(this.value.slice(2), 8);
              }
            }
            return Number(this.value);
          }
        case STRING:
          {
            var parser = new StringParser(this.value);
            return parser.parse();
          }
        default:
          throw new Error('Not implemented');
      }
    }
  }, {}, $__super);
}(Token);
Object.defineProperties(module.exports, {
  LiteralToken: {get: function() {
      return LiteralToken;
    }},
  __esModule: {value: true}
});
