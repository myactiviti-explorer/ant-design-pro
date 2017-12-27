function ran() {
  return console.log("asdqwe4");
}

function isArray(a) {
  return "object" == typeof a
      && "[object array]" == Object.prototype.toString.call(a)
          .toLowerCase()
}

function isObject(a) {
  return "object" == typeof a
      && "[object object]" == Object.prototype.toString.call(a)
          .toLowerCase()
}

function _randomId() {
  return "randomId_" + parseInt(1E9 * Math.random())
}

function _getJsonValue(a, c) {
  var d = _randomId(), b;
  b = "" + ("function " + d + "(root){") + ("return root." + c + ";");
  b += "}";
  b += "";
  var e = document.createElement("script");
  e.id = d;
  e.text = b;
  document.body.appendChild(e);
  d = window[d](a);
  e.parentNode.removeChild(e);
  return d
}

function _format(a, c, d, b, e) {
  d || (d = "");
  if (isObject(c)) {
    if (c.$ref) {
      var g = c.$ref;
      0 == g.indexOf("$.")
          && (b[e] = _getJsonValue(a, g.substring(2)));
      return
    }
    for ( var f in c)
      b = d, "" != b && (b += "."), g = c[f], b += f, _format(a,
          g, b, c, f)
  } else if (isArray(c))
    for (f in c)
      b = d, g = c[f], b = b + "[" + f + "]", _format(a, g, b,
          c, f);
  return a
}

function format(data) {
  if (typeof JSON.retrocycle !== 'function') {
      'use strict';
      var t_obj = typeof {}, t_arr = Object.prototype.toString
          .apply([]), t_str = typeof "";
      var walk = function (path, _xpath, array) {
          if (path.startsWith('$'))
              return path;
          else {
              var x, j = path.split('..'), k = -j.length
                  + (array ? 2 : 1), last = j.slice(-1)[0]
                  .replace('/', '.');
              x = k < 0 ? _xpath.slice(0, k) : _xpath.slice(0);
              if (last && !last.startsWith('.')
                  && !last.startsWith('['))
                  last = '.' + last;
              path = x.join('.') + last;
          }
          return path;
      };
      JSON.retrocycle = (function () {
          return function ($) {
              var xpath = ['$'];
              (function rez(value) {
                  var i, item, name, path, _x;
                  if (value && typeof value === t_obj) {
                      if (Object.prototype.toString.apply(value) === t_arr) {
                          for (i = 0; i < value.length; i += 1) {
                              item = value[i];
                              if (item && typeof item === t_obj) {
                                  xpath.push(xpath.pop() + '[' + i
                                      + ']');
                                  path = item.$ref;
                                  if (typeof path === t_str)
                                      value[i] = eval(walk(path,
                                          xpath, true));
                                  else
                                      rez(item);
                                  if (_x = xpath.pop())
                                      xpath.push(_x.slice(0, _x
                                          .indexOf('[')));
                              }
                          }
                      } else {
                          for (name in value) {
                              if (value.hasOwnProperty(name)
                                  && typeof value[name] === t_obj) {
                                  xpath.push(name);
                                  item = value[name];
                                  if (item) {
                                      path = item.$ref;
                                      if (typeof path === t_str)
                                          value[name] = eval(walk(
                                              path, xpath));
                                      else
                                          rez(item);
                                  }
                                  xpath.pop();
                              }
                          }
                      }
                  }
              })($);
              return $;
          }
      })();
  }

  var ret;
  if (typeof data === 'string') {
      ret = JSON.retrocycle(JSON.parse(data));
  } else if (typeof data === 'object') {
      ret = JSON.retrocycle(data);
  }
  return ret;

}

export default {
  format,
};
