require("support/types");
require("support/applicative");
require("support/functor");
require("support/built_ins");

var Repo = require('repo')
  , Remember = require('remember')
  , UIHelpers = require('ui_helpers')
  , Aly = require('controller_helpers')
  , close = Aly.close
  , openView = Aly.openView_
  ;

//+ openStart :: OpenErpConfig -> CloseWin(OpenWin(OpenErpConfig))
var openStart = compose(close.p($.win), openView('start'))

//+ setConfig :: OpenErpConfig -> WriteFile(OpenErpConfig)
  , setConfig = Remember.set('open_erp_config')

//+ openOrAlert : Either(String, OpenErpConfig) -> [CloseWin(OpenWin(OpenErpConfig)), WriteFile(OpenErpConfig)]
  , openOrAlert = either(alert, parallel(openStart, setConfig))

//+ doLogin :: Event -> Promise(Either(String, UID))
  , doLogin = liftA( Repo.login
                   , getVal('value', $.username)
                   , getVal('value', $.password)
                   )

//+ authenticate :: Event -> Promise(Either(String, CloseWin(OpenWin(UID))))
  , authenticate = compose(fmap(openOrAlert), doLogin)

//+ slideUp :: Event -> Animation(Event)
  , slideUp = UIHelpers.slideUp({top: -230, duration: 300}, $.container)

  //+ focusPassword :: Event -> Focus(TextField)
  , focusPassword = compose(invoke('focus'), K($.password))

//+ blurFields :: Event -> Blur([TextField])
  , blurFields = compose(map(invoke('blur')), K([$.username, $.password]))
  ;

$.username.addEventListener('focus', slideUp);
$.password.addEventListener('focus', slideUp);
$.username.addEventListener('return', focusPassword);
$.login.addEventListener('click', authenticate);
$.password.addEventListener('return', authenticate);
$.container.addEventListener('slideDown', blurFields);
