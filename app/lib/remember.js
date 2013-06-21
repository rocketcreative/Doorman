module.exports = (function() {
  require("support/PreludeJS/prelude").expose();

  //+ get :: String -> (_ -> JSON || 'undefined')
  var get = function(x) {
        return function() {
          var a =  Ti.App.Properties.getString(x);
          var result = a ? Maybe(JSON.parse(a)) : Maybe(null);
          return IO(result);
        }
      }
  
  //+ set :: String -> JSON
    , set = function(name, x) {
        Ti.App.Properties.setString(name, JSON.stringify(x));
        return x;
      }.autoCurry()
  
  //+ forget :: String -> IO
    , forget = function(name) {
        Ti.App.Properties.setString(name, "");
      }
    ;
  
  return { get: get
         , set: set
         , forget: forget
         };
})();
