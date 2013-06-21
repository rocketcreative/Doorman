require("support/types");
require("support/applicative");
require("support/functor");
require("support/built_ins");

var Repo = require('repo')
  , Remember = require('remember')
  , Aly = require('controller_helpers')
  ;

//+ closeWin :: OpenWin(UID) -> CloseWin(OpenWin(UID))
var closeWin = Aly.close.p($.win)

//+ openApp :: UID -> CloseWin(OpenWin(UID))
  , openApp = compose(closeWin, Aly.openView_('start'))

//+ rememberUser :: UID -> IO(Maybe(UID))
  , rememberUser = Remember.set('current_uid')

//+ openOrAlert : Either(String, UID) -> CloseWin(OpenWin(UID))
  , openOrAlert = either(alert, parallel(openApp, rememberUser))

//+ doLogin :: Event -> Promise(Either(String, UID))
  , doLogin = liftA( Repo.login
                   , compose(pluck('value'), getVal('username', $))
                   , compose(pluck('value'), getVal('password', $))
                   )

//+ authenticate :: Event -> Promise(Either(String, CloseWin(OpenWin(UID))))
  , authenticate = compose(fmap(openOrAlert), doLogin)

//+ isLoggedIn :: IO(Maybe(UID))
  , isLoggedIn = Remember.get('current_uid')

//+ slideUp :: Event -> Animation(Event)
  , slideUp = function(e) {
      if($.container.top >= 0) {
        $.container.animate({top: -140, duration: 300}, function(){
          $.container.top = -140;
        });
      }
    }

  //+ focusPassword :: Event -> Focus(TextField)
  , focusPassword = compose(invoke('focus'), getVal('password', $))
  ;

$.username.addEventListener('focus', slideUp);
$.password.addEventListener('focus', slideUp);
$.username.addEventListener('return', focusPassword);
$.login.addEventListener('click', authenticate);
$.password.addEventListener('return', authenticate);

