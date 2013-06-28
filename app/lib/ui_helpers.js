var slideUp = function(props, element, event) {
	var original_top = element.top;
	log2("CALLING SLIDUP", props)
	log2("el", element)
	log2("evt", event)
  if(element.top >= 0) {
    element.animate(props, function(){
      element.top = props.top;
      element.fireEvent('slideUp', {});
    });

    element.addEventListener('touchend', function(e){
    		var new_props = {top: original_top, duration: props.duration}
    	  element.animate(new_props, function(){
      		element.top = new_props.top;
      		element.fireEvent('slideDown', {});
    		});
    });
  }
}.autoCurry();

module.exports = {slideUp: slideUp}