require("support/built_ins");

var Remember = require('remember')
	, OpenErp = require('open_erp_client')
  , Aly = require('controller_helpers')
  , open = Aly.openView_
  ;

//+ startOrLogin :: Maybe(OpenErpConfig) -> OpenWin([login, Null]|[start, OpenErpConfig])
var startOrLogin = compose(maybe(open('login'), open('start')), log2("startOr"))

  //+ startApplication :: StateChange(OpenWin([login, Null]|[start, OpenErpConfig]))
  , startApplication = compose( fmap(startOrLogin)
  														, OpenErp.setUp
  														, Remember.get('open_erp_config')
  														)
  ;

startApplication();
