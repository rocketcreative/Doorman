require("support/types");
require("support/applicative");
require("support/functor");
require("support/built_ins");

var Repo = require('repo')
	, Aly = require('controller_helpers')
	, createView = Aly.createView
	, addView = Aly.addView
	, uid = arguments[0]
  ;

//+ createResult :: UID|Null -> CreateView(UID|Null)
var createResult = function(uid){
		return createView('result', {parent: $.win, uid: uid});
	}

//+ showResults :: UID|Null -> AddView(Ti.UI.View)
	, showResults = compose( addView($.win)
												 , createResult
												 )

//+ getIdNumber :: _ -> String
	, getIdNumber = compose(pluck('value')
												 , getVal('id_number', $)
												 )

//+ lookupUser :: Event -> Promise(UID|Null)
	, lookupUser = compose( fmap(showResults)
												, Repo.findByDriversLicense
												, getIdNumber
												)
	;

$.submit.addEventListener('click', lookupUser);
$.id_number.addEventListener('return', lookupUser);

(function(){
	$.user_id.text = uid;
})();
