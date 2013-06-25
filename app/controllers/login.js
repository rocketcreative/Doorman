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
  , authenticate = compose(fmap(compose(openOrAlert, log2("LOGGED IN"))), doLogin)

//+ slideUp :: Event -> Animation(Event)
  , slideUp = UIHelpers.slideUp({top: -140, duration: 300}, $.container)

  //+ focusPassword :: Event -> Focus(TextField)
  , focusPassword = compose(invoke('focus'), K($.password))
  ;

$.username.addEventListener('focus', slideUp);
$.password.addEventListener('focus', slideUp);
$.username.addEventListener('return', focusPassword);
$.login.addEventListener('click', authenticate);
$.password.addEventListener('return', authenticate);

