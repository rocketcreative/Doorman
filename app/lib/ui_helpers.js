var slideUp = function(props, element, event) {
	log2("CALLING SLIDUP", props)
	log2("el", element)
	log2("evt", event)
  if(element.top >= 0) {
    element.animate(props, function(){
      element.top = props.top;
    });
  }
}.autoCurry();

module.exports = {slideUp: slideUp}