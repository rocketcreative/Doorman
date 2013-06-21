module.exports = (function() {
  var Alloy = require('alloy')

  //+ createController_ :: String -> a -> Alloy.Controller
    , createController_ = function(name, args) {
        return Alloy.createController(name, args);
      }.autoCurry()

  //+ createView :: String -> a -> Alloy.Window | Alloy.View
    , createView = function(name, args) {
        return Alloy.createController(name, args).getView();
      }.autoCurry()

  //+ createView :: String -> a -> Alloy.Window | Alloy.View
    , createView_ = function(name) {
        return Alloy.createController(name).getView();
      }

  //+ getView :: Alloy.Controller -> Ti.UI.View
    , getView = function(controller) {
        return controller.getView();
      }

  //+ openView :: String -> Action(UI)
    //TODO why doesn't invoke('open') work here?
    //, openView = compose(invoke('open'), getView, Alloy.createController)
    , openView = compose('.open()', log2("3"), getView, log2("2"), Alloy.createController, log2("1"))

  //+ openView_ :: String -> a -> Action(UI)
    , openView_ = function(name, args) {
        getView(Alloy.createController(name, args)).open();
      }.autoCurry()

  //+ closeView :: String -> Alloy.Controller -> Action(UI)
    , closeView = function(name, c) {
        c[name].close();
      }.autoCurry()

  //+ openInTab :: String -> String -> Action(UI)
    , openInTab = function(tab, view) {
        var tg = Alloy.Globals.tab_group;
        if(!tg) {
          tg = Alloy.createController('tab_group');
          Alloy.Globals.tab_group = tg;
        }
        tg[tab].open(getView(Alloy.createController(view)));
      }.autoCurry()

  //+ openInTab_ :: String -> String -> Action(UI)
    , openInTab_ = function(tab, view, args) {
        var tg = Alloy.Globals.tab_group;
        if(!tg) {
          tg = Alloy.createController('tab_group');
          Alloy.Globals.tab_group = tg;
        }
        tg[tab].open(getView(Alloy.createController(view, args)));
      }.autoCurry()

  //+ openEmailDialog :: EmailParams -> Action(UI)
    , openEmailDialog = function(params) {
        var emailDialog = Ti.UI.createEmailDialog({
          barColor: '#000'
        , html: !!params.body
        });

        if(!emailDialog.isSupported()) {
          return alert('Sorry, email is not available.', 'Oops');
        }
        emailDialog.setToRecipients([params.email]);
        emailDialog.setSubject(params.subject);
        (params.body && emailDialog.setMessageBody(params.body));

        emailDialog.addEventListener('complete', function(e) {
          if(!OS_ANDROID && (e.result == emailDialog.SENT)) {
            alert("Message was sent.  Thank you!");
          }
        });
        
        emailDialog.open();
      }

    , setRows = function(table, rows) {
        table.setData(rows);
      }.autoCurry()

    , getRows = function(table) {
        return table.data[0].rows;
      }.autoCurry()

    , close = function(x, args) {
        return x.close(args);
      }
    ;

  return { createController_: createController_
         , getView: getView
         , openView: openView
         , openView_: openView_
         , createView: createView
         , createView_: createView_
         , closeView: closeView
         , openInTab: openInTab
         , openInTab_: openInTab_
         , openEmailDialog: openEmailDialog
         , setRows: setRows
         , getRows: getRows
         , close: close
         };
})();
