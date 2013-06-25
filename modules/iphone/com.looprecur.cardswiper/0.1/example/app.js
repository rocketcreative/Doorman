// This is a test harness for your module
// You should do something interesting in this harness
// to test out the module and to provide instructions
// to users on how to use it by example.


// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white',
	layout: 'vertical'
});
var label = Ti.UI.createLabel();
var status = Ti.UI.createLabel();
var button = Ti.UI.createButton({title: "click for toggle", top: 18});
win.add(label);
win.add(status);
win.add(button);
win.open();

// TODO: write your module tests here
var cardswiper = require('com.looprecur.cardswiper');
Ti.API.info("module is => " + cardswiper);

status.text = "status"
label.text = "responses"


button.addEventListener('click', function() {
	Ti.API.info("=========setting it");
	cardswiper.enabled = true;
	if(state) {
		cardswiper.attachListeners({
			success: function(e){
				Ti.API.info("=========SUCCESS");
				Ti.API.info(JSON.stringify(e));
				label.text = JSON.stringify(e);
			},
			status: function(e) {
				status.text = JSON.stringify(e);
			}
		});
	}
	Ti.API.info("=========done");
});
