module.exports = (function() {
  require("support/PreludeJS/prelude").expose();

  //+ get :: String -> (JSON -> b)
  var get = function(x) {
        return function(y) {
          var a =  Ti.App.Properties.getString(x);
          var result = a ? JSON.parse(a) : null;
          return ReadFile(Maybe(result));
        }
      }
  
  //+ set :: String -> JSON
    , set = function(name, x) {
        Ti.App.Properties.setString(name, JSON.stringify(x));
        return WriteFile(x);
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
