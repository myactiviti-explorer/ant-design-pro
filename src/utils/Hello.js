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

function format(a) {
  if (null == a)
    return null;
  "string" == typeof a && (a = eval("(" + a + ")"));
  return _format(a, a, null, null, null)
}

export default {
  format,
};
