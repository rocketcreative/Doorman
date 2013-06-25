var Magtek = require('com.looprecur.cardswiper')
	, connected = false;


// Magtek.addEventListener('connected', function(e) {
// 	 alert('CONNECTED!')
//    Ti.API.info('Connected: '+JSON.stringify(e));
// });
// Magtek.addEventListener('disconnected', function(e) {
// 	 alert('DISCONNECTED!')
//    Ti.API.info('Disconnected: '+JSON.stringify(e));
// });


// // Set the protocol for your device. For example, 'com.yourcompany.magtek'
// Magtek.registerDevice({
// 	protocol: 'com.magtek.idynamo',
// 	deviceType: Magtek.DEVICE_TYPE_IDYNAMO
// });

// var errorListener = function(fn) {
// 	Magtek.addEventListener('swipeError',function(e){
// 		alert('ERROR!')
// 		alert(e)
// 		Ti.API.info('Swipe Error: Please re-swipe the card');
// 		Ti.API.info(JSON.stringify(e));
// 		fn(e);
// 	});
// }

// Magtek.addEventListener('swipeError',function(e){
// 	alert('ERROR!')
// 	alert(e)
// 	Ti.API.info('Swipe Error: Please re-swipe the card');
// 	Ti.API.info(JSON.stringify(e));
// 	// fn(e);
// });

// Magtek.addEventListener('swipe', function(e) {
// 	alert('SUCCESS!')
// 	alert(e)

// 	Ti.API.info('Swipe: '+JSON.stringify(e));
// 	// fn(e);
// });

// var successListener = function(fn) {
// 	Magtek.addEventListener('swipe', function(e) {
// 		alert('SUCCESS!')
// 		alert(e)

// 		Ti.API.info('Swipe: '+JSON.stringify(e));
// 		fn(e);
// 	});
// }

var enable = function() {
	Ti.API.info('=======Try to enable=========');
	Magtek.enabled = true;
}

var tryConnect = function(acc, n) {
	if(!acc.connected) Magtek.enabled = true;
	return acc;
}

var addEventListener = function(name, fn) {
	// if(name == "error") return errorListener(fn);
	// if(name == "swipe") return successListener(fn);

	Magtek.enabled = true;
	Ti.API.info('=======ADDING LISTENERS=========');
	Magtek.attachListeners({
		success: function(e){
			alert(e);
			fn(e)
		},
		status: function(e) {
			Ti.API.info('=======STATUS CHANGE=========');
			Ti.API.info(JSON.stringify(e));
			alert(e);
			reduce(tryConnect, e, [1,2,3]);
		}
	});

}

module.exports = {addEventListener: addEventListener, enable: enable}
