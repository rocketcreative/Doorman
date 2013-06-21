exports.create = function(win, actions) {
  win.addEventListener('click', function(e) {
    var source_id = e.source.id
      , class_name = e.source.className
      ;

    if(actions.hasOwnProperty(source_id)) {
      actions[source_id](e);
    } else if(actions.hasOwnProperty(class_name)) {
      actions[class_name](e);
    } else {
      log('not an action');
    }
  });
};

