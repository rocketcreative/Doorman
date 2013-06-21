require("support/built_ins");

var Remember = require('remember')
  , Aly = require('controller_helpers')
  , open = Aly.openView
  ;

//+ openAppOrLogin :: Maybe(UID) -> OpenWin(UID|Null)
var openAppOrLogin = maybe(open.p('login'), open.p('start'))

//+ startApplication :: IO(OpenWin(UID|Null))
  , startApplication = compose(fmap(openAppOrLogin), Remember.get('current_uid'))
  ;

startApplication();
