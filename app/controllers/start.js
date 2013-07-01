require("support/types");
require("support/applicative");
require("support/functor");
require("support/built_ins");

var Repo = require('repo')
	, Remember = require('remember')
	, Aly = require('controller_helpers')
	, Barcode = require('barcode')
	, UIHelpers = require('ui_helpers')
	, close = Aly.close
  , openView = Aly.openView_
	, createView = Aly.createView
	, addView = Aly.addView
	, fireEvent = Aly.fireEvent
	, logged_in_user_id = arguments[0].uid
  ;

//+ createResult :: Date|Null -> CreateView(Date|Null)
var createResult = function(expiry_date) {
			return createView('result', {parent: $.win, expiry_date: expiry_date});
		}

//+ showResult :: Date|Null -> CreateView(AddedView(Ti.UI.Window, Date|Null))
	, showResult = compose(addView($.win), createResult)

//+ getIdNumber :: _ -> String
	, getIdNumber = compose(pluck('value'), K($.id_number))

//+ setIdNumber :: String -> UIValueChange(String)
	, setIdNumber = setVal('value', $.id_number)

//+ lookupUser :: _ -> Promise(CreateView(AddedView(Ti.UI.Window, Date|Null)))
	, lookupUser = compose( fmap(showResult)
												, Repo.findByDriversLicense
												, getIdNumber
												)

//+ openLogin :: Event -> OpenWin(CloseWin(Event))
	, openLogin = compose(close.p($.win), openView('login'))

//+ doLogout :: Event -> [CloseWin(OpenWin(Event)), WriteFile(null)]
  , doLogout = parallel(openLogin, Remember.set.p('open_erp_config', null))

//+ barcodeSuccess :: {result: String} -> UIValueChange(String)
  , barcodeSuccess = compose(	lookupUser
  													, setIdNumber
  													, drop(9)
  													, pluck('result')
  													)

//+ captureBarcode :: Event -> Action(String)
  , captureBarcode = Barcode.capture.p({success: barcodeSuccess, error: alert})

//+ slideUp :: Event -> Animation(Event)
  , slideUp = UIHelpers.slideUp({top: -87, duration: 300}, $.container)

//+ blurFields :: Event -> Blur(TextField)
  , blurFields = compose(invoke('blur'), K($.id_number))

//+ hideKeyboard :: Event -> [Event, Blur(TextField)]
  , hideKeyboard = parallel(fireEvent('touchend', $.container), blurFields)
	;

$.submit.addEventListener('click', parallel(lookupUser, hideKeyboard));
$.id_number.addEventListener('return', parallel(lookupUser, hideKeyboard));
$.logout.addEventListener('click', doLogout);
$.scan.addEventListener('click', captureBarcode);
$.id_number.addEventListener('focus', slideUp);
$.container.addEventListener('slideDown', blurFields);

(function(){
	$.user_id.text = logged_in_user_id;
})();
