(function() {
  var StringScanner, exports,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $.applyScopedCss = function() {
    var change, observerKlass, parse, space;
    if (__indexOf.call(document.createElement('style'), 'scoped') >= 0) return;
    space = /\s*(\/\*.*?\*\/\s*)*/;
    parse = function(css) {
      var hash, selector, style;
      css = new $.applyScopedCss.StringScanner(css);
      hash = {};
      while (!css.hasTerminated()) {
        css.skip(space);
        selector = $.trim(css.scanUntil(/\{/));
        selector = selector.slice(0, selector.length - 1);
        style = css.scanUntil(/\}/);
        style = style.slice(0, style.length - 1);
        hash[selector] = style;
      }
      return hash;
    };
    change = function(parent, e) {
      var c, selector, style, _ref, _results;
      _ref = e.data('scoped');
      _results = [];
      for (selector in _ref) {
        style = _ref[selector];
        _results.push((function() {
          var _i, _len, _ref2, _results2;
          _ref2 = parent.find(selector).add(parent.filter(selector));
          _results2 = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            c = _ref2[_i];
            c = $(c);
            if (c.attr('style')) style += ';' + c.attr('style');
            _results2.push(c.attr('style', style));
          }
          return _results2;
        })());
      }
      return _results;
    };
    observerKlass = window.MutationObserver || window.WebKitMutationObserver;
    return $('style[scoped]').each(function(i, elem) {
      var e, observer, parent;
      e = $(elem);
      if (!e.data('scoped')) {
        e.data('scoped', parse(e.text()));
        parent = e.parent();
        change(parent, e);
        e.text('');
        if (observerKlass) {
          observer = new observerKlass(function(mutation, observer) {
            change(parent, e);
            return;
          });
          observer.observe(parent[0], {
            subtree: true,
            childList: false,
            attributes: false,
            characterData: true
          });
        }
        return;
      }
    });
  };

  exports = $.applyScopedCss;

  (exports != null ? exports : this).StringScanner = StringScanner = (function() {

    function StringScanner(source) {
      this.source = source.toString();
      this.reset();
    }

    StringScanner.prototype.scan = function(regexp) {
      var matches;
      if ((matches = regexp.exec(this.getRemainder())) && matches.index === 0) {
        return this.setState(matches, {
          head: this.head + matches[0].length,
          last: this.head
        });
      } else {
        return this.setState([]);
      }
    };

    StringScanner.prototype.scanUntil = function(regexp) {
      var matches;
      if (matches = regexp.exec(this.getRemainder())) {
        this.setState(matches, {
          head: this.head + matches.index + matches[0].length,
          last: this.head
        });
        return this.source.slice(this.last, this.head);
      } else {
        return this.setState([]);
      }
    };

    StringScanner.prototype.scanChar = function() {
      return this.scan(/[\s\S]/);
    };

    StringScanner.prototype.skip = function(regexp) {
      if (this.scan(regexp)) return this.match.length;
    };

    StringScanner.prototype.skipUntil = function(regexp) {
      if (this.scanUntil(regexp)) return this.head - this.last;
    };

    StringScanner.prototype.check = function(regexp) {
      var matches;
      if ((matches = regexp.exec(this.getRemainder())) && matches.index === 0) {
        return this.setState(matches);
      } else {
        return this.setState([]);
      }
    };

    StringScanner.prototype.checkUntil = function(regexp) {
      var matches;
      if (matches = regexp.exec(this.getRemainder())) {
        this.setState(matches);
        return this.source.slice(this.head, this.head + matches.index + matches[0].length);
      } else {
        return this.setState([]);
      }
    };

    StringScanner.prototype.peek = function(length) {
      return this.source.substr(this.head, length != null ? length : 1);
    };

    StringScanner.prototype.getSource = function() {
      return this.source;
    };

    StringScanner.prototype.getRemainder = function() {
      return this.source.slice(this.head);
    };

    StringScanner.prototype.getPosition = function() {
      return this.head;
    };

    StringScanner.prototype.hasTerminated = function() {
      return this.head === this.source.length;
    };

    StringScanner.prototype.getPreMatch = function() {
      if (this.match) return this.source.slice(0, this.head - this.match.length);
    };

    StringScanner.prototype.getMatch = function() {
      return this.match;
    };

    StringScanner.prototype.getPostMatch = function() {
      if (this.match) return this.source.slice(this.head);
    };

    StringScanner.prototype.getCapture = function(index) {
      return this.captures[index];
    };

    StringScanner.prototype.reset = function() {
      return this.setState([], {
        head: 0,
        last: 0
      });
    };

    StringScanner.prototype.terminate = function() {
      return this.setState([], {
        head: this.source.length,
        last: this.head
      });
    };

    StringScanner.prototype.concat = function(string) {
      return this.source += string;
    };

    StringScanner.prototype.unscan = function() {
      if (this.match) {
        return this.setState([], {
          head: this.last,
          last: 0
        });
      } else {
        throw "nothing to unscan";
      }
    };

    StringScanner.prototype.setState = function(matches, values) {
      var _ref, _ref2;
      this.head = (_ref = values != null ? values.head : void 0) != null ? _ref : this.head;
      this.last = (_ref2 = values != null ? values.last : void 0) != null ? _ref2 : this.last;
      this.captures = matches.slice(1);
      return this.match = matches[0];
    };

    return StringScanner;

  })();

}).call(this);
