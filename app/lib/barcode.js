var Barcode = (function(){	
	var module = require('ti.barcode');
	
	module.allowRotation = true;
  // module.displayedMessage = ' ';
  // module.useLED = false;
  
	var iOSBarcode = function() {

    var overlay = Ti.UI.createView({});
    
    overlay.add(Ti.UI.createView({
      height: 7,
      backgroundColor: 'red',
      opacity: 0.5
    }));
    
    var cancelButton = Ti.UI.createButton({
        title: 'Cancel', 
        textAlign: 'center',
        color: '#000', backgroundColor: '#fff', 
        style: 0,
        font: { fontWeight: 'bold', fontSize: 16 },
        borderColor: '#000', 
        borderRadius: 10, 
        borderWidth: 1,
        opacity: 0.5,
        width: 220, 
        height: 30,
        top: 20
    });
    cancelButton.addEventListener('click', function() {
        module.cancel();
    });
    overlay.add(cancelButton);
    

		var capture = function(callbacks){
			var oldSuccess = callbacks.success;
			callbacks.success = function(e) {
				e.isText = true;
				oldSuccess(e);
			};

			capture.i_was_called = false; // guard for iOS
		
      if(!iOSBarcode.success_added) {
        module.addEventListener('success', function(e){
          if(!capture.i_was_called) { 
            callbacks.success(e); 
            capture.i_was_called = true;
          }
          module.cancel();
        });
        iOSBarcode.success_added = true;
      }

      if(!iOSBarcode.error_added) {
			  module.addEventListener('error', (callbacks.error || I));
        iOSBarcode.error_added = true;
      }

      if(!iOSBarcode.cancel_added) {
			  module.addEventListener('cancel', (callbacks.cancel || I));
        iOSBarcode.cancel_added = true;
      }
      
      module.capture({
        animate: true,
        overlay: overlay,
        showCancel: false,
        showRectangle: false,
        keepOpen: true
      });
		}
				
		return {capture: capture};
	}

	return iOSBarcode();
})();

module.exports = Barcode;
