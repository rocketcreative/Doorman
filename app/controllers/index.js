require("support/built_ins");

var Remember = require('remember')
	, OpenErp = require('open_erp_client')
  , Aly = require('controller_helpers')
  , open = Aly.openView_
  ;

//+ startOrLogin :: Maybe(OpenErpConfig) -> OpenWin(Null|OpenErpConfig)
var startOrLogin = compose(maybe(open('login'), open('start')), log2("startOr"))

//+ setupAndOpenApp :: ReadFile(Maybe(OpenErp)) -> [OpenWin(Null|OpenErpConfig), StateChange(ReadFile(Maybe(OpenErp)))]
	, setupAndOpenApp = parallel(fmap(startOrLogin), fmap(fmap(OpenErp.setUp)))

//+ startApplication :: [OpenWin(Null|OpenErpConfig), StateChange(ReadFile(Maybe(OpenErp)))]
  , startApplication = compose( setupAndOpenApp
  														, Remember.get('open_erp_config')
  														)
  ;

startApplication();
