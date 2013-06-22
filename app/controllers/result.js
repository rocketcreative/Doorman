require("support/types");
require("support/applicative");
require("support/functor");
require("support/built_ins");

var Aly = require('controller_helpers')
	, removeView = Aly.removeView
	, args = arguments[0]
	, parent = args.parent
	, uid = args.uid
  ;

$.result_view.addEventListener('click', removeView.p(parent, $.result_view));

(function(){
	if(uid) {
		$.image.image = "/images/welcome_check.png";
		$.label.text = "WELCOME";
		$.reason.text = "";
	} else {
		$.image.image = "/images/no_access_x.png";
		$.label.text = "NO ACCESS";
		$.reason.text = "USER NOT FOUND OR NOT ACTIVE";
	}
})();
