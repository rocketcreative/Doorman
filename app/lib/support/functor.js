require('support/types');

;(function (window, undefined) { 
  var functor = {};

  Functor = function(type, defs) {
    type.prototype.fmap = defs.fmap;
  };

  fmap = function(f, obj) {
    return obj.fmap(f);
  }.autoCurry();

  Functor.generic = function(type) {
    Functor(type, {
      fmap: function(f) {
        return type(f(this.val));
      }
    });
  }

  functor.Functor = Functor;
  functor.fmap = fmap;

  functor.expose = function expose(env) {
    var fn;
    env = env || window;
    for (fn in functor) {
      if (fn !== 'expose' && functor.hasOwnProperty(fn)) {
        env[fn] = functor[fn];
      }
    }
  };

  module.exports = functor;

}(this));

