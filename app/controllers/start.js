require("support/types");
require("support/applicative");
require("support/functor");
require("support/built_ins");

var Repo = require('repo')
	, Remember = require('remember')
	, Aly = require('controller_helpers')
	, Barcode = require('barcode')
	, close = Aly.close
  , openView = Aly.openView_
	, createView = Aly.createView
	, addView = Aly.addView
	, logged_in_user_id = arguments[0].uid
  ;

//+ createResult :: UID|Null -> CreateView(UID|Null)
var createResult = function(found_user_id) {
			return createView('result', {parent: $.win, uid: found_user_id});
		}

//+ showResult :: UID|Null -> CreateView(AddedView(Ti.UI.Window, UID|Null))
	, showResult = compose(addView($.win), createResult)

//+ getIdNumber :: _ -> String
	, getIdNumber = compose(pluck('value'), K($.id_number))

//+ setIdNumber :: String -> UIValueChange(String)
	, setIdNumber = setVal('value', $.id_number)

//+ lookupUser :: _ -> Promise(CreateView(AddedView(Ti.UI.Window, UID|Null)))
	, lookupUser = compose( fmap(showResult)
												, Repo.findByDriversLicense
												, getIdNumber
												, function(){ $.id_number.blur(); }
												)

//+ openLogin :: Event -> OpenWin(CloseWin(Event))
	, openLogin = compose(close.p($.win), openView('login'))

//+ doLogout :: Event -> [CloseWin(OpenWin(Event)), WriteFile(null)]
  , doLogout = parallel(openLogin, Remember.set.p('open_erp_config', null))

//+ barcodeSuccess :: {result: String} -> UIValueChange(String)
  , barcodeSuccess = compose(	lookupUser
  													, setIdNumber
  													, drop(7)
  													, pluck('result')
  													)

//+ captureBarcode :: Event -> Action(String)
  , captureBarcode = Barcode.capture.p({success: barcodeSuccess, error: alert});
	;

$.submit.addEventListener('click', lookupUser);
$.id_number.addEventListener('return', lookupUser);
$.logout.addEventListener('click', doLogout);
$.scan.addEventListener('click', captureBarcode);


(function(){
	$.user_id.text = logged_in_user_id;
})();
