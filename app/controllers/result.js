require("support/types");
require("support/applicative");
require("support/functor");
require("support/built_ins");

var Aly = require('controller_helpers')
	, removeView = Aly.removeView
	, args = arguments[0]
	, parent = args.parent
	, expiry_date = args.expiry_date
  ;

$.result_view.addEventListener('click', removeView.p(parent, $.result_view));

(function(){
	if(expiry_date >= (new Date())) {
		$.image.image = "/images/welcome_check.png";
		$.message.image = "/images/welcome_text.png";
	} else {
		$.image.image = "/images/no_access_x.png";
		$.message.image = "/images/no_access_text.png";
	}
})();
