var App = {

	windowStack : [],

	currentTab : null,

	tabGroup : null,

	init : function(params){
		var params = params || {};
		tabGroup = params.tabGroup;

		tabGroup.open();
	},

	open : function(win){
		currentTab = tabGroup.activeTab;

		if(OS_ANDROID) {
      // Have the back button perform the back method.
      // We override so that the close event is handled properly.
      win.addEventListener('android:back', function (e) {
          App.close(win);
      });
	  }

		App.windowStack.push(win);
		currentTab.open(win);
	},

	close : function(win){
		currentTab = tabGroup.activeTab;
		App.windowStack.pop();

		if(OS_IOS){
			currentTab.close(win, { animated : true });	
		}else{
			currentTab.close(win);
		}
	},

  closeTabs : function() {
    tabGroup.close();
  },

	home : function(){
		if (App.windowStack.length > 1) {
	        var stack = App.windowStack.slice(0);
	        for (var i = stack.length - 1; i > 0; i--) {
				App.close({ win : stack[i]});
	        }
	    }
	},

  map : function (fn, sequence) {
    var length = sequence.length,
        result = new Array(length),
        i;
    for (i = 0; i < length; i++) {
      result[i] = fn.apply(null, [sequence[i], i]);
    }
    return result;
  }

};

module.exports = App;
